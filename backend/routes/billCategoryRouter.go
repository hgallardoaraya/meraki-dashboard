package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
	"dashboard/middlewares"
)

func BillCategoryRouter(r *gin.RouterGroup) {
	billCategoryController := new(controllers.BillCategoryController)

	billCategoriesRoutes := r.Group("/bill_categories")
	{
		billCategoriesRoutes.GET("/", billCategoryController.GetBillCategories)
		billCategoriesRoutes.GET("/:id", billCategoryController.GetBillCategoryByID)
		billCategoriesRoutes.POST("/", middlewares.CheckAdminRole(), billCategoryController.CreateBillCategory)
		billCategoriesRoutes.PUT("/:id", middlewares.CheckAdminRole(), billCategoryController.UpdateBillCategory)
		billCategoriesRoutes.DELETE("/:id", middlewares.CheckAdminRole(), billCategoryController.DeleteBillCategory)
	}
}
