package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
)

func BillDocumentRouter(r *gin.RouterGroup) {
	billDocumentController := new(controllers.BillDocumentController)

	billDocumentRoutes := r.Group("/bill_documents")
	{
		billDocumentRoutes.GET("/", billDocumentController.GetBillDocuments)
		billDocumentRoutes.GET("/:id", billDocumentController.GetBillDocumentByID)
		billDocumentRoutes.POST("/", billDocumentController.CreateBillDocument)
		billDocumentRoutes.PUT("/:id", billDocumentController.UpdateBillDocument)
		billDocumentRoutes.DELETE("/:id", billDocumentController.DeleteBillDocument)
	}
}
