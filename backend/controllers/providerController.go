package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"dashboard/database"
	m "dashboard/models"
)

type ProviderController struct{}

func (e *ProviderController) GetProvider(c *gin.Context) {
	db := database.Conn()
	defer db.Close()

	rows, err := db.Query("SELECT * FROM proveedor;")

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get provider",
		})
		return
	}

	var providers []m.Provider
	for rows.Next() {
		var provider m.Provider
		err := rows.Scan(&provider.ID, &provider.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to get provider",
				"error":   err,
			})
			return
		}
		providers = append(providers, provider)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": providers,
	})
}