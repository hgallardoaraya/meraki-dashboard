package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"dashboard/database"
	m "dashboard/models"
)

type SedeController struct{}

func (e *SedeController) GetSede(c *gin.Context) {
	db := database.Conn()
	defer db.Close()
	var sedes []m.Locale

	rows, err := db.Query("SELECT * FROM sede;")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get sede",
		})
		return
	}

	for rows.Next() {
		var sede m.Locale
		err := rows.Scan(&sede.ID, &sede.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to get sede",
				"error":   err,
			})
			return
		}
		sedes = append(sedes, sede)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": sedes,
	})
}
