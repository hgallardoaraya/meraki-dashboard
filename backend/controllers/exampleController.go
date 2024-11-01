package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	m "dashboard/models"
	"dashboard/database"
)

type ExampleController struct {}

func (e *ExampleController) GetExample(c *gin.Context) {
	db := database.Conn()
	defer db.Close()

	rows, err := db.Query("SELECT * FROM example;")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get example",
		})
		return
	}

	var examples []m.Example
	for rows.Next() {
		var example m.Example
		err := rows.Scan(&example.ID, &example.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to get example",
				"error": err,
			})
			return
		}
		examples = append(examples, example)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": examples,
	})
}

func (e *ExampleController) GetExampleByID(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Hi!",
	})
}

func (e *ExampleController) CreateExample(c *gin.Context) {
	var example m.Example

	err := c.BindJSON(&example)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to bind JSON",
			"error": err,
		})
		return
	}
	db := database.Conn()
	defer db.Close()
	result, err := db.Exec("INSERT INTO example (name) VALUES (?)", example.Name)
	fmt.Println(result, err)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create example",
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Example created",
	})
}