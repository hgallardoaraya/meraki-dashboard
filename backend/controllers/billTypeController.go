package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"dashboard/database"
	m "dashboard/models"
)

type BillTypeController struct{}

func (e *BillTypeController) GetBillType(c *gin.Context) {
	db := database.GetDB()
	var billTypes []m.BillType

	rows, err := db.Query("SELECT * FROM bill_type;")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bill type",
		})
		return
	}

	for rows.Next() {
		var billType m.BillType
		err := rows.Scan(&billType.ID, &billType.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to get bill type",
				"error":   err,
			})
			return
		}
		billTypes = append(billTypes, billType)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": billTypes,
	})
}
