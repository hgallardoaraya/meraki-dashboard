package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"dashboard/database"
	m "dashboard/models"
)

type BillDocumentController struct{}

func (e *BillDocumentController) GetDocumentCategory(c *gin.Context) {
	db := database.Conn()
	defer db.Close()
	var billDocuments []m.BillDocument

	rows, err := db.Query("SELECT * FROM document_category;")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get document category",
		})
		return
	}

	for rows.Next() {
		var billDocument m.BillDocument
		err := rows.Scan(&billDocument.ID, &billDocument.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to get document category",
				"error":   err,
			})
			return
		}
		billDocuments = append(billDocuments, billDocument)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": billDocuments,
	})
}
