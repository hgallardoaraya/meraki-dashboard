package main

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
	_ "github.com/tursodatabase/libsql-client-go/libsql"

	auth "dashboard/auth"
	"dashboard/database"
	middleware "dashboard/middlewares"
	routes "dashboard/routes"
)

func main() {
	// Create a new router
	r := gin.Default()

	database.Conn()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Cambia los dominios según tu necesidad
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: true,
	}))

	api := r.Group("/api")
	{
		auth.AuthRouter(api)

		api.Use(middleware.AuthMiddleware())

		routes.UserRouter(api)
		routes.RoleRouter(api)
		routes.BillDocumentRouter(api)
		routes.BillRouter(api)
		routes.BillCategoryRouter(api)
		routes.BillTypeRouter(api)
		routes.DteRouter(api)
		routes.LocaleRouter(api)
		routes.ProviderRouter(api)
	}

	// Start the server
	if err := r.Run(":8081"); err != nil {
		fmt.Println("Failed to start server")
	}
}
