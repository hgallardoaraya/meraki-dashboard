package auth

import (
	middleware "dashboard/middlewares"

	"github.com/gin-gonic/gin"
)

func AuthRouter(r *gin.RouterGroup) {
	authController := new(AuthController)

	authRoutes := r.Group("/auth")
	{
		authRoutes.POST("/login", authController.Login)
		authRoutes.POST("/register", middleware.AuthMiddleware(), authController.Register)
	}
}
