package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/tursodatabase/libsql-client-go/libsql"

	routes "dashboard/routes"
)

func main() {
	err := godotenv.Load()

	if err != nil {
		return
	}

	// Create a new router
	r := gin.Default()

	// Create a new group for the API
	api := r.Group("/api")
	{
		routes.RoleRouter(api)
	}

	// Start the server
	if err := r.Run(":8081"); err != nil {
		fmt.Println("Failed to start server")
	}
}
