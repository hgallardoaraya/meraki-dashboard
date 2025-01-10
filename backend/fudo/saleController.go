package fudo

import (
	"fmt"
	"github.com/gin-gonic/gin"
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
