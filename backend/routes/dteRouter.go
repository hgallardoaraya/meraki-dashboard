package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
	"dashboard/middlewares"
)

func DteRouter(r *gin.RouterGroup) {
	dteController := new(controllers.DteController)

	dteRoutes := r.Group("/dtes")
	{
		dteRoutes.GET("/", dteController.GetDtes)
		dteRoutes.GET("/:id", dteController.GetDteByID)
		dteRoutes.POST("/", middlewares.CheckAdminRole(), dteController.CreateDte)
		dteRoutes.PUT("/:id", middlewares.CheckAdminRole(), dteController.UpdateDte)
		dteRoutes.DELETE("/:id", middlewares.CheckAdminRole(), dteController.DeleteDte)
	}
}
