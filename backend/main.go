package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
	_ "github.com/tursodatabase/libsql-client-go/libsql"

	routes "dashboard/routes"
)

func main() {
	// Create a new router
	r := gin.Default()

	// Create a new group for the API
	api := r.Group("/api")
	{
		routes.UserRouter(api)
		routes.RoleRouter(api)
	}

	// Start the server
	if err := r.Run(":8081"); err != nil {
		fmt.Println("Failed to start server")
	}
}
