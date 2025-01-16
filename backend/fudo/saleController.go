package fudo

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"net/http"
	"strconv"
)

type SaleController struct{}

func (e *SaleController) GetSales(c *gin.Context) {
	saleRepository := SaleRepository{}
	fmt.Println("entra!")
	limitStr := c.Query("limit")
	offsetStr := c.Query("offset")
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid limit"})
		return
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid offset"})
		return
	}

	fmt.Println(limit, offset)

	sales, err := saleRepository.FetchAllSales(limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bill categories",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"sales": sales,
	})
}

func (e *SaleController) CreateSales(c *gin.Context) {
	saleRepository := SaleRepository{}

	var sp SalesParam
	if err := c.ShouldBindJSON(&sp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get sales to save",
			"error":   err.Error(),
		})
		return
	}

	fmt.Println("sales ", sp.Sales)
	err := saleRepository.SaveSales(sp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to save sales",
			"error":   err.Error(),
		})
		return
	}

	c.Status(http.StatusOK)
}

func (e *SaleController) GetSummary(c *gin.Context) {
	saleRepository := SaleRepository{}
	t1 := c.Query("t1")
	fmt.Println(t1)
	t2 := c.Query("t2")
	fmt.Println(t1)
	localeIdStr := c.Query("localeId")

	localeId := -1
	var err error
	if len(localeIdStr) > 0 {
		localeId, err = strconv.Atoi(localeIdStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Locale"})
			return
		}
	}

	summary, err := saleRepository.GetSummary(t1, t2, localeId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bills summary",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"summary": summary,
	})
}

func (e *SaleController) GetSummaryByMonthAndYear(c *gin.Context) {
	saleRepository := SaleRepository{}

	monthStr := c.Query("month")
	yearStr := c.Query("year")

	month, err := strconv.Atoi(monthStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month"})
		return
	}

	year, err := strconv.Atoi(yearStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
		return
	}

	summary, err := saleRepository.GetDaySummariesByMonthAndYear(month, year)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bills summary",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"summary": summary,
	})
}

func (e *SaleController) GetSummaryByMonthAndYearRange(c *gin.Context) {
	saleRepository := SaleRepository{}

	startMonthStr := c.Query("startMonth")
	startYearStr := c.Query("startYear")
	endMonthStr := c.Query("endMonth")
	endYearStr := c.Query("endYear")

	startMonth, err := strconv.Atoi(startMonthStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month"})
		return
	}

	startYear, err := strconv.Atoi(startYearStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
		return
	}

	endMonth, err := strconv.Atoi(endMonthStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month"})
		return
	}

	endYear, err := strconv.Atoi(endYearStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
		return
	}

	summary, err := saleRepository.GetDaySummariesByMonthAndYearRange(startMonth, startYear, endMonth, endYear)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bills summary",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"summary": summary,
	})
}

type LinkCredentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type AuthRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

func (e *SaleController) LinkFudoAccount(c *gin.Context) {
	saleRepository := SaleRepository{}

	var reqData LinkCredentials
	if err := c.ShouldBindJSON(&reqData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error al procesar el cuerpo de la solicitud"})
		return
	}

	err := saleRepository.SaveFudoAccount(reqData.Username, reqData.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}

func (e *SaleController) FudoAuthenticate(c *gin.Context) {
	var err error
	saleRepository := SaleRepository{}

	var credentials LinkCredentials
	credentials, err = saleRepository.GetFudoCredentials()
	fmt.Println("credentials ", credentials)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error al obtener credenciales vinculadas de Fudo, verifique que estén vinculadas correctamente"})
		return
	}

	reqData := AuthRequest{
		Login:    credentials.Username,
		Password: credentials.Password,
	}
	response, statusCode, err := Authenticate(reqData)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": err.Error()})
		return
	}

	// Enviar la respuesta al cliente
	c.Data(statusCode, "application/json", response)
}

func Authenticate(reqData AuthRequest) ([]byte, int, error) {
	proxyUrl := "https://auth.fu.do/authenticate"

	proxyReqBody, err := json.Marshal(reqData)
	if err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("Error al procesar el cuerpo de la solicitud: %v", err)
	}

	req, err := http.NewRequest(http.MethodPost, proxyUrl, bytes.NewBuffer(proxyReqBody))
	if err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("Error al crear la solicitud HTTP: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("Error al hacer la solicitud al servidor: %v", err)
	}
	defer resp.Body.Close()

	// Leer la respuesta del servidor real
	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("Error al leer la respuesta del servidor: %v", err)
	}

	// Retornar la respuesta y el código de estado
	return respBody, resp.StatusCode, nil
}
