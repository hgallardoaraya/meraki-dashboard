package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	m "dashboard/models"
	r "dashboard/repositories"
)

type RoleController struct{}

var roleRepository r.RoleRepository = r.RoleRepository{}

func (e *RoleController) GetRoles(c *gin.Context) {
	roles, err := roleRepository.GetRoles()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get roles",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"roles": roles,
	})
}

func (e *RoleController) GetRoleByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid role ID",
			"error":   err.Error(),
		})
		return
	}

	role, err := roleRepository.GetRoleByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get role",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"role": role,
	})
}

func (e *RoleController) CreateRole(c *gin.Context) {
	var role m.Role
	err := c.BindJSON(&role)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to create role",
			"error":   err.Error(),
		})
		return
	}

	err = roleRepository.CreateRole(role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create role",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Role %s created successfully", role.Name),
	})
}

func (e *RoleController) UpdateRole(c *gin.Context) {
	var role m.Role
	err := c.BindJSON(&role)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to update role",
			"error":   err.Error(),
		})
		return
	}

	err = roleRepository.UpdateRole(role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update role",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Role %s updated successfully", role.Name),
	})
}

func (e *RoleController) DeleteRole(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid role ID",
			"error":   err.Error(),
		})
		return
	}

	err = roleRepository.DeleteRole(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to delete role",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Role deleted successfully",
	})
}
