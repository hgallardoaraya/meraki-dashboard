package products

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

type ProductController struct {}

func (e *ProductController) GetProducts(c *gin.Context) {
	productRepository := ProductRepository{}

	sales , err := productRepository.FetchAllProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get products",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"sales": sales,
	})
}