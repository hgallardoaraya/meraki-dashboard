package fudo

import (
	"github.com/gin-gonic/gin"
)

func SaleRouter(r *gin.RouterGroup) {
	saleController := new(SaleController)

	saleRoutes := r.Group("sales")
	{
		saleRoutes.GET("/rep", saleController.GetSales)
		saleRoutes.POST("/", saleController.CreateSales)
		saleRoutes.GET("/summary", saleController.GetSummary)
		saleRoutes.GET("/summary/month", saleController.GetSummaryByMonthAndYear)
		saleRoutes.GET("/summary/monthRange", saleController.GetSummaryByMonthAndYearRange)
		// saleRoutes.GET("/:id", saleController.GetRoleByID)
	}
}
