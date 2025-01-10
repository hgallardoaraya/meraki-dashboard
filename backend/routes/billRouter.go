package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
	"dashboard/middlewares"
)

func BillRouter(r *gin.RouterGroup) {
	billController := new(controllers.BillController)

	billRoutes := r.Group("/bills")
	{
		billRoutes.GET("/", billController.GetBills)
		billRoutes.GET("/:id", billController.GetBillByID)
		billRoutes.POST("/", billController.CreateBill)
		billRoutes.PUT("/:id", middlewares.CheckAdminRole(), billController.UpdateBill)
		billRoutes.DELETE("/:id", middlewares.CheckAdminRole(), billController.DeleteBill)
		billRoutes.GET("/total", middlewares.CheckAdminRole(), billController.GetTotalBill)
		billRoutes.GET("/total/category/:category_id", middlewares.CheckAdminRole(), billController.GetTotalBillByCategory)
		billRoutes.GET("/total/provider/:provider_id", middlewares.CheckAdminRole(), billController.GetTotalBillByProvider)
	}
}
