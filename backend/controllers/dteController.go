package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"dashboard/database"
	m "dashboard/models"
)

type dteController struct{}

func (e *dteController) GetDte(c *gin.Context) {}