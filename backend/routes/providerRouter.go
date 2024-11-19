package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
)

func ProviderRouter(r *gin.RouterGroup) {
	providerController := new(controllers.ProviderController)

	providerRoutes := r.Group("/providers")
	{
		providerRoutes.GET("/", providerController.GetProviders)
		providerRoutes.GET("/:id", providerController.GetProviderByID)
		providerRoutes.POST("/", providerController.CreateProvider)
	}
}
