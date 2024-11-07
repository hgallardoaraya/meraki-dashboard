package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"dashboard/database"
	m "dashboard/models"
)

type BillDocumentController struct{}

func (e *BillDocumentController) GetDocumentCategory(c *gin.Context) {}