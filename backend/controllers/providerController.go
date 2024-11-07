package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"dashboard/database"
	m "dashboard/models"
)

type DteController struct{}

func (e *DteController) GetDte(c *gin.Context) {}