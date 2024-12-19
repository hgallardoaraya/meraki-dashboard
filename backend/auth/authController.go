package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthController struct{}

func (e *AuthController) Login(c *gin.Context) {
	var loginRequest LoginRequest
	err := c.BindJSON(&loginRequest)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to login",
			"error":   err.Error(),
		})
		return
	}

	token, err := LoginService(loginRequest)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to login",
			"error":   "Invalid credentials",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}

func (e *AuthController) Register(c *gin.Context) {
	var registerRequest RegisterRequest
	err := c.BindJSON(&registerRequest)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to register",
			"error":   err.Error(),
		})
		return
	}

	token, err := RegisterService(registerRequest)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to register",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}
