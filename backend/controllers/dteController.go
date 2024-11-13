package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"dashboard/database"
	m "dashboard/models"
)

type DteController struct{}

func (e *DteController) GetDte(c *gin.Context) {
	db := database.Conn()
	defer db.Close()
	var dtes []m.Dte

	rows, err := db.Query("SELECT * FROM dte;")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get dte",
		})
		return
	}

	for rows.Next() {
		var dte m.Dte
		err := rows.Scan(&dte.ID, &dte.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to get dte",
				"error":   err,
			})
			return
		}
		dtes = append(dtes, dte)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": dtes,
	})
}
