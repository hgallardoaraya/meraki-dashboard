package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"dashboard/database"
	m "dashboard/models"
)

type BillController struct{}

func (e *BillController) GetBill(c *gin.Context) {
	db := database.Conn()
	defer db.Close()
	var bills []m.Bill

	rows, err := db.Query("SELECT * FROM bill;")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bill",
		})
		return
	}

	for rows.Next() {
		var bill m.Bill
		err := rows.Scan(&bill.ID, &bill.TotalAmount)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to get bill",
				"error":   err,
			})
			return
		}
		bills = append(bills, bill)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": bills,
	})
}
