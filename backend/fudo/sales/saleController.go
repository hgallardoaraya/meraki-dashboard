package sales

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type SaleController struct{}

func (e *SaleController) GetSales(c *gin.Context) {
	page := c.Query("page")

	if page == "" {
		page = "1"
	}

	saleRepository := SaleRepository{}

	sales, err := saleRepository.FetchAllSales(page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get sales",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"sales": sales,
	})
}

func (e *SaleController) GetSalesByMonth(c *gin.Context) {
	date := c.Param("date")

	saleRepository := SaleRepository{}

	sales, err := saleRepository.FetchSalesByMonth(date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get sales",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"sales": sales,
	})

}

func (e *SaleController) GetSalesByDay(c *gin.Context) {
	date := c.Param("date")

	saleRepository := SaleRepository{}

	sales, err := saleRepository.FetchSalesByDay(date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get sales",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"sales": sales,
	})

}
