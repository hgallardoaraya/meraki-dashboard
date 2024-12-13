package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
)

func RoleRouter(r *gin.RouterGroup) {
	roleController := new(controllers.RoleController)

	roleRoutes := r.Group("/roles")
	{
		roleRoutes.GET("/", roleController.GetRoles)
		roleRoutes.GET("/:id", roleController.GetRoleByID)
		roleRoutes.POST("/", roleController.CreateRole)
		roleRoutes.PUT("/:id", roleController.UpdateRole)
		roleRoutes.DELETE("/:id", roleController.DeleteRole)
	}
}
