package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
	"dashboard/middlewares"
)

func ProviderRouter(r *gin.RouterGroup) {
	providerController := new(controllers.ProviderController)

	providerRoutes := r.Group("/providers")
	{
		providerRoutes.GET("/", providerController.GetProviders)
		providerRoutes.GET("/:id", providerController.GetProviderByID)
		providerRoutes.POST("/", middlewares.CheckAdminRole(), providerController.CreateProvider)
		providerRoutes.PUT("/:id", middlewares.CheckAdminRole(), providerController.UpdateProvider)
		providerRoutes.DELETE("/:id", middlewares.CheckAdminRole(), providerController.DeleteProvider)
	}
}
