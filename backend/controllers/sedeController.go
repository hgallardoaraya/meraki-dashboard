package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"dashboard/database"
	m "dashboard/models"
)

type SedeController struct{}

func (e *SedeController) GetSede(c *gin.Context) {}