package main

import (
	middleware "dashboard/middlewares"
	"fmt"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
	_ "github.com/tursodatabase/libsql-client-go/libsql"

	auth "dashboard/auth"
	"dashboard/database"
	fudo "dashboard/fudo"
	routes "dashboard/routes"
)

func main() {
	// Create a new router
	r := gin.Default()

	database.Conn()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: true,
	}))

	api := r.Group("/api")
	{
		auth.AuthRouter(api)

		env := os.Getenv("ENV")
		if env == "prod" {
			api.Use(middleware.AuthMiddleware())
		}

		routes.UserRouter(api)
		routes.RoleRouter(api)
		routes.BillDocumentRouter(api)
		routes.BillRouter(api)
		routes.BillCategoryRouter(api)
		routes.BillTypeRouter(api)
		routes.DteRouter(api)
		routes.LocaleRouter(api)
		routes.ProviderRouter(api)

		fudo.SaleRouter(api)

	}

	ServerPort := os.Getenv("SERVER_PORT")

	if len(ServerPort) == 0 {
		ServerPort = "8081"
	}

	// Start the server

	if err := r.Run(fmt.Sprintf(":%s", ServerPort)); err != nil {
		fmt.Println("Failed to start server")
	}
}
