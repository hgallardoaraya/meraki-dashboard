package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
)

func DteRouter(r *gin.RouterGroup) {
	dteController := new(controllers.DteController)

	dteRoutes := r.Group("/dtes")
	{
		dteRoutes.GET("/", dteController.GetDtes)
		dteRoutes.GET("/:id", dteController.GetDteByID)
		dteRoutes.POST("/", dteController.CreateDte)
	}
}
