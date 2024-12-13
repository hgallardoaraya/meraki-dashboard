package fudo

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

type SaleController struct {}

func (e *SaleController) GetSales(c *gin.Context) {
	saleRepository := SaleRepository{}

	sales , err := saleRepository.FetchAllSales()
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