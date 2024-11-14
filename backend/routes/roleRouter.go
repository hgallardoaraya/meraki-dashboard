package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
)

func RoleRouter(r *gin.RouterGroup) {
	roleController := new(controllers.RoleController)

	roleRoutes := r.Group("/roles")
	{
		roleRoutes.GET("/", roleController.GetRole)
		roleRoutes.GET("/:id", roleController.GetRoleByID)
		roleRoutes.POST("/", roleController.CreateRole)
	}
}
