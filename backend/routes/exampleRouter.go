package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
)

func ExampleRouter(r *gin.RouterGroup) {
	exampleController := new(controllers.ExampleController)

	exRoutes := r.Group("/examples")
	{
		exRoutes.GET("/", exampleController.GetExample)
		exRoutes.GET("/:id", exampleController.GetExampleByID)
		exRoutes.POST("/", exampleController.CreateExample)
	}
}