package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
)

func BillTypeRouter(r *gin.RouterGroup) {
	billTypeController := new(controllers.BillTypeController)

	billTypeRoutes := r.Group("/bill_types")
	{
		billTypeRoutes.GET("/", billTypeController.GetBillTypes)
		billTypeRoutes.GET("/:id", billTypeController.GetBillTypeByID)
		billTypeRoutes.POST("/", billTypeController.CreateBillType)
		billTypeRoutes.PUT("/:id", billTypeController.UpdateBillType)
		billTypeRoutes.DELETE("/:id", billTypeController.DeleteBillType)
	}
}