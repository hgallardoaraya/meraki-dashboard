package main

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
	"net/http"
	"os"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		return
	}
	TursoDatabaseDns := os.Getenv("TURSO_DATABASE_DNS")
	TursoAuthToken := os.Getenv("TURSO_AUTH_TOKEN")

	fmt.Println("envs ", TursoDatabaseDns, TursoAuthToken)
	url := fmt.Sprintf("libsql://%s.turso.io?authToken=%s", TursoDatabaseDns, TursoAuthToken)

	db, err := sql.Open("libsql", url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to open db %s: %s", url, err)
		os.Exit(1)
	} else {
		fmt.Println("conexion exitosa a la base de datos")
	}
	defer db.Close()
	queryUsers(db)

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

type User struct {
	ID   int
	Name string
}

func queryUsers(db *sql.DB) {
	rows, err := db.Query("SELECT * FROM User;")
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to execute query: %v\n", err)
		os.Exit(1)
	}
	defer rows.Close()

	var users []User

	for rows.Next() {
		var user User

		if err := rows.Scan(&user.ID, &user.Name); err != nil {
			fmt.Println("Error scanning row:", err)
			return
		}

		users = append(users, user)
		fmt.Println(user.ID, user.Name)
	}

	if err := rows.Err(); err != nil {
		fmt.Println("Error during rows iteration:", err)
	}
}
