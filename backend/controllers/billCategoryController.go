package controllers

import (
	"fmt"
	"net/http"
	
	"github.com/gin-gonic/gin"

	"dashboard/database"
	m "dashboard/models"
)

type BillCategoryController struct{}

func (e *BillCategoryController) GetBillCategory(c *gin.Context) {
	db := database.Conn()
	defer db.Close()

	rows, err := db.Query("SELECT * FROM bill_categories;")

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bill category",
		})
		return
	}

	var billCategories []m.BillCategory
	for rows.Next() {
		var billCategory m.BillCategory
		err := rows.Scan(&billCategory.ID, &billCategory.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to get bill category",
				"error":   err,
			})
			return
		}
		billCategories = append(billCategories, billCategory)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": billCategories,
	})
}
