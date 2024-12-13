package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
)

func UserRouter(r *gin.RouterGroup) {
	userController := new(controllers.UserController)

	userRoutes := r.Group("/users")
	{
		userRoutes.GET("/", userController.GetUsers)
		userRoutes.GET("/:id", userController.GetUserByID)
		userRoutes.POST("/", userController.CreateUser)
		userRoutes.PUT("/:id", userController.UpdateUser)
		userRoutes.DELETE("/:id", userController.DeleteUser)
	}
}
