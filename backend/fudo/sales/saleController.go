package sales

import (
	"net/http"

	i "dashboard/fudo/items"
	p "dashboard/fudo/products"

	"github.com/gin-gonic/gin"
)

type SaleController struct {}

func (e *SaleController) GetSales(c *gin.Context) {
	saleRepository := SaleRepository{}
	productRepository := p.ProductRepository{}
	itemRepository := i.ItemRepository{}

	sales , err := saleRepository.FetchAllSales()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get sales",
			"error":   err.Error(),
		})
		return
	}

	items, err := itemRepository.FetchAllItems()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get items",
			"error":   err.Error(),
		})
		return
	}

	products, err := productRepository.FetchAllProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get products",
			"error":   err.Error(),
		})
		return
	}

	salesResponse := mixer(sales, items, products)

	c.JSON(http.StatusOK, gin.H{
		"sales": salesResponse,
	})
}