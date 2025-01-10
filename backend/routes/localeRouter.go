package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
	"dashboard/middlewares"
)

func LocaleRouter(r *gin.RouterGroup) {
	localeController := new(controllers.LocaleController)

	localeRoutes := r.Group("/locales")
	{
		localeRoutes.GET("/", localeController.GetLocales)
		localeRoutes.GET("/:id", localeController.GetLocaleByID)
		localeRoutes.POST("/", middlewares.CheckAdminRole(), localeController.CreateLocale)
		localeRoutes.PUT("/:id", middlewares.CheckAdminRole(), localeController.UpdateLocale)
		localeRoutes.DELETE("/:id", middlewares.CheckAdminRole(), localeController.DeleteLocale)
	}
}
