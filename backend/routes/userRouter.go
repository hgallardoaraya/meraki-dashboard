package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
	"dashboard/middlewares"
)

func UserRouter(r *gin.RouterGroup) {
	userController := new(controllers.UserController)

	userRoutes := r.Group("/users")
	{
		userRoutes.GET("/", userController.GetUsers)
		userRoutes.GET("/:id", userController.GetUserByID)
		userRoutes.PUT("/:id", middlewares.CheckAdminRole(), userController.UpdateUser)
		userRoutes.DELETE("/:id", middlewares.CheckAdminRole(), userController.DeleteUser)
	}
}
