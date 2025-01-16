package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
	"dashboard/middlewares"
)

func RoleRouter(r *gin.RouterGroup) {
	roleController := new(controllers.RoleController)

	roleRoutes := r.Group("/roles")
	{
		roleRoutes.GET("/", roleController.GetRoles)
		roleRoutes.GET("/:id", roleController.GetRoleByID)
		roleRoutes.POST("/", middlewares.CheckAdminRole(), roleController.CreateRole)
		roleRoutes.PUT("/:id", middlewares.CheckAdminRole(), roleController.UpdateRole)
		roleRoutes.DELETE("/:id", middlewares.CheckAdminRole(), roleController.DeleteRole)
	}
}
