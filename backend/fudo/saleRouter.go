package fudo

import (
	"github.com/gin-gonic/gin"
)

func SaleRouter(r *gin.RouterGroup) {
	saleController := new(SaleController)

	saleRoutes := r.Group("fudo/sales")
	{
		saleRoutes.GET("/", saleController.GetSales)
		// saleRoutes.GET("/:id", saleController.GetRoleByID)
	}
}