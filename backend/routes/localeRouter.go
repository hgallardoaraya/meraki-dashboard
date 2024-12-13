package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
)

func LocaleRouter(r *gin.RouterGroup) {
	localeController := new(controllers.LocaleController)

	localeRoutes := r.Group("/locales")
	{
		localeRoutes.GET("/", localeController.GetLocales)
		localeRoutes.GET("/:id", localeController.GetLocaleByID)
		localeRoutes.POST("/", localeController.CreateLocale)
		localeRoutes.PUT("/:id", localeController.UpdateLocale)
		localeRoutes.DELETE("/:id", localeController.DeleteLocale)
	}
}
