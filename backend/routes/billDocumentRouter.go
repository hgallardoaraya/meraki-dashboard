package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
	"dashboard/middlewares"
)

func BillDocumentRouter(r *gin.RouterGroup) {
	billDocumentController := new(controllers.BillDocumentController)

	billDocumentRoutes := r.Group("/bill_documents")
	{
		billDocumentRoutes.GET("/", billDocumentController.GetBillDocuments)
		billDocumentRoutes.GET("/:id", billDocumentController.GetBillDocumentByID)
		billDocumentRoutes.POST("/", billDocumentController.CreateBillDocument)
		billDocumentRoutes.PUT("/:id", middlewares.CheckAdminRole(), billDocumentController.UpdateBillDocument)
		billDocumentRoutes.DELETE("/:id", middlewares.CheckAdminRole(), billDocumentController.DeleteBillDocument)
	}
}
