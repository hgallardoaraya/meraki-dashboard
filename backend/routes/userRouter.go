package routes

import (
	"github.com/gin-gonic/gin"

	"dashboard/controllers"
)

func UserRouter(r *gin.RouterGroup) {
	userController := new(controllers.UserController)

	roleRoutes := r.Group("/users")
	{
		roleRoutes.GET("/", userController.GetUsers)
		roleRoutes.GET("/:id", userController.GetUserByID)
		roleRoutes.POST("/", userController.CreateUser)
	}
}
