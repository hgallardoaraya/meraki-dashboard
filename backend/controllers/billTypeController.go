package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"dashboard/database"
	m "dashboard/models"
)

type BillTypeController struct{}

func (e *BillTypeController) GetBillType(c *gin.Context) {}