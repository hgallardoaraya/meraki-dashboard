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
	}
}
