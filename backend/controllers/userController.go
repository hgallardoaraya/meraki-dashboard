package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"dashboard/database"
	m "dashboard/models"
)

type UserController struct{}

func (e *UserController) GetUser(c *gin.Context) {
	db := database.Conn()
	defer db.Close()
	var users []m.User

	rows, err := db.Query("SELECT * FROM usuario;")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get user",
			"error":   err.Error(),
		})
		return
	}

	for rows.Next() {
		var user m.User
		err := rows.Scan(&user.ID, &user.RoleID, &user.SedeID, &user.Name, &user.LastName, &user.SecondLastName, &user.Rut, &user.DV)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to get user",
				"error":   err,
			})
			return
		}
		users = append(users, user)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": users,
	})
}

func (e *UserController) GetUserByID(c *gin.Context) {}

func (e *UserController) CreateUser(c *gin.Context) {
	db := database.Conn()
	defer db.Close()
	var user m.User

	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to bind JSON",
			"error":   err.Error(),
		})
		return
	}

	_, err := db.Exec("INSERT INTO usuario (role_id, sede_id, name, last_name, second_last_name, rut, dv) VALUES (?, ?, ?, ?, ?, ?, ?);",
		user.RoleID, user.SedeID, user.Name, user.LastName, user.SecondLastName, user.Rut, user.DV)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create user",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User created",
	})
}
