package items

import (
	"github.com/gin-gonic/gin"
)

func ItemRouter(r *gin.RouterGroup) {
	itemController := new(ItemController)

	itemRoutes := r.Group("fudo/items")
	{
		itemRoutes.GET("/", itemController.GetSales)
		// saleRoutes.GET("/:id", saleController.GetRoleByID)
	}
}