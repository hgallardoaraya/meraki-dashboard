package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"dashboard/database"
	m "dashboard/models"
)

type UserController struct{}

func (e *UserController) GetUser(c *gin.Context) {}