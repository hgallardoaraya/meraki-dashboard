package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
)

func BillRouter(r *gin.RouterGroup) {
	billController := new(controllers.BillController)

	billRoutes := r.Group("/bills")
	{
		billRoutes.GET("/", billController.GetBills)
		billRoutes.GET("/:id", billController.GetBillByID)
		billRoutes.POST("/", billController.CreateBill)
		billRoutes.PUT("/:id", billController.UpdateBill)
		billRoutes.DELETE("/:id", billController.DeleteBill)
		billRoutes.GET("/summary", billController.GetSummary)
		billRoutes.GET("/summary/month", billController.GetSummaryByMonthAndYear)
		billRoutes.GET("/summary/monthRange", billController.GetSummaryByMonthAndYearRange)
		billRoutes.GET("/summary/providers/month", billController.GetProviderSummaryByPeriod)
		billRoutes.GET("/summary/providers/monthRange", billController.GetProviderSummaryByPeriodRange)
		billRoutes.GET("/summary/categories/month", billController.GetCategorySummaryByPeriod)
		billRoutes.GET("/summary/categories/monthRange", billController.GetCategorySummaryByPeriodRange)
	}
}
