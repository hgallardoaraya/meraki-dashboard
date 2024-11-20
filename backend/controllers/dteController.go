package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	m "dashboard/models"
	r "dashboard/repositories"
)

type DteController struct{}

var dteRepository r.DteRepository = r.DteRepository{}

func (e *DteController) GetDtes(c *gin.Context) {
	dtes, err := dteRepository.GetDtes()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get Dtes",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"dtes": dtes,
	})
}

func (e *DteController) GetDteByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid Dte ID",
			"error":   err.Error(),
		})
		return
	}
	dte, err := dteRepository.GetDteByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get Dte",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"dte": dte,
	})
}

func (e *DteController) CreateDte(c *gin.Context) {
	var dte m.Dte
	err := c.BindJSON(&dte)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to create Dte",
			"error":   err.Error(),
		})
		return
	}

	err = dteRepository.CreateDte(dte)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create Dte",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Dte created",
	})
}