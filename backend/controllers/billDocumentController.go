package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	m "dashboard/models"
	r "dashboard/repositories"
)

type BillDocumentController struct{}

var billDocumentRepository r.BillDocumentRepository = r.BillDocumentRepository{}

func (e *BillDocumentController) GetBillDocuments(c *gin.Context) {
	billDocuments, err := billDocumentRepository.GetBillDocuments()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bill documents",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"bill documents": billDocuments,
	})
}

func (e *BillDocumentController) GetBillDocumentByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid bill document ID",
			"error":   err.Error(),
		})
		return
	}
	billDocument, err := billDocumentRepository.GetBillDocumentByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bill document",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"bill document": billDocument,
	})
}

func (e *BillDocumentController) CreateBillDocument(c *gin.Context) {
	var billDocument m.BillDocument
	err := c.BindJSON(&billDocument)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to create bill document",
			"error":   err.Error(),
		})
		return
	}

	err = billDocumentRepository.CreateBillDocument(billDocument)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create bill document",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Bill document created",
	})
}