package items

import (
	"github.com/gin-gonic/gin"
)

func ItemRouter(r *gin.RouterGroup) {
	itemController := new(ItemController)

	itemRoutes := r.Group("/items")
	{
		itemRoutes.GET("/", itemController.GetItems)
		// saleRoutes.GET("/:id", saleController.GetRoleByID)
	}
}