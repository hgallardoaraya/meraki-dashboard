package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
)

func BillCategoryRouter(r *gin.RouterGroup) {
	billCategoryController := new(controllers.BillCategoryController)

	billCategoriesRoutes := r.Group("/bill_categories")
	{
		billCategoriesRoutes.GET("/", billCategoryController.GetBillCategories)
		billCategoriesRoutes.GET("/:id", billCategoryController.GetBillCategoryByID)
		billCategoriesRoutes.POST("/", billCategoryController.CreateBillCategory)
	}
}
