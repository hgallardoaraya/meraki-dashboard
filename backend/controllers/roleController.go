package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"dashboard/database"
	m "dashboard/models"
)

type RoleController struct{}

func (e *RoleController) GetRole(c *gin.Context) {
	db := database.Conn()
	defer db.Close()

	rows, err := db.Query("SELECT * FROM roles;")

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get role",
		})
		return
	}

	var roles []m.Role
	for rows.Next() {
		var role m.Role
		err := rows.Scan(&role.ID, &role.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to get role",
				"error":   err,
			})
			return
		}
		roles = append(roles, role)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": roles,
	})
}

func (e *RoleController) GetRoleByID(c *gin.Context) {
	db := database.Conn()
	defer db.Close()

	roleId := c.Param("id")

	fmt.Println(roleId)

	row := db.QueryRow("SELECT * FROM roles WHERE id = ?;", roleId)

	var role m.Role

	err := row.Scan(&role.ID, &role.Name)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get role",
			"error":   err,
		})
		return
	}

	if role.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "role was not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": role,
	})
}

func (e *RoleController) CreateRole(c *gin.Context) {
	var role m.Role

	err := c.BindJSON(&role)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to bind JSON",
			"error":   err,
		})
		return
	}

	db := database.Conn()
	defer db.Close()

	result, err := db.Exec("INSERT INTO roles (name) VALUES (?)", role.Name)

	fmt.Println(result, err)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create role",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Role created",
	})
}
