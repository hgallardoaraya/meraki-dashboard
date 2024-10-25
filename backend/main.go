package main

import (
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
)

func main() {

	// Create a new router
	r := gin.Default()

	// Create a simple endpoint
	r.GET("/hello", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello, World!",
		})
	})

	// Start the server
	if err := r.Run(":8080"); err != nil {
		fmt.Println("Failed to start server")
	}
}