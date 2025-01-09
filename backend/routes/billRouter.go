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
		billRoutes.GET("/total", billController.GetTotalBill)
		billRoutes.GET("/total/category/:category_id", billController.GetTotalBillByCategory)
		billRoutes.GET("/total/provider/:provider_id", billController.GetTotalBillByProvider)
	}
}
