package database

import (
	"database/sql"
	"fmt"
	"os"
)

var db *sql.DB

func Conn() {
	TursoDatabaseDns := os.Getenv("TURSO_DATABASE_DNS")
	TursoAuthToken := os.Getenv("TURSO_AUTH_TOKEN")
	url := fmt.Sprintf("libsql://%s.turso.io?authToken=%s", TursoDatabaseDns, TursoAuthToken)

	var err error

	db, err = sql.Open("libsql", url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to open db %s: %s", url, err)
		os.Exit(1)
	} else {
		fmt.Println("Database connection successful")
	}
}

func GetDB() *sql.DB {
	return db
}
