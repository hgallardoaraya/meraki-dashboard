package sales

import (
	"github.com/gin-gonic/gin"
)

func SaleRouter(r *gin.RouterGroup) {
	saleController := new(SaleController)

	saleRoutes := r.Group("/sales")
	{
		saleRoutes.GET("/", saleController.GetSales)
		saleRoutes.GET("/m/:date", saleController.GetSalesByMonth)
		saleRoutes.GET("/d/:date", saleController.GetSalesByDay)
	}
}
