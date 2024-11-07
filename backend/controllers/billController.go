package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"dashboard/database"
	m "dashboard/models"
)

type BillController struct{}

func (e *BillController) GetBill(c *gin.Context) {}