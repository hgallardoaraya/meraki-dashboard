package items

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

type ItemController struct {}

func (e *ItemController) GetItems(c *gin.Context) {
	itemRepository := ItemRepository{}

	sales , err := itemRepository.FetchAllItems()
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