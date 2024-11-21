package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	m "dashboard/models"
	r "dashboard/repositories"
)

type ProviderController struct{}

var providerRepository r.ProviderRepository = r.ProviderRepository{}

func (e *ProviderController) GetProviders(c *gin.Context) {
	providers, err := providerRepository.GetProviders()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get providers",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"providers": providers,
	})
}

func (e *ProviderController) GetProviderByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get the id",
			"error":   err.Error(),
		})
		return
	}

	provider, err := providerRepository.GetProviderByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get the provider",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"provider": provider,
	})
}

func (e *ProviderController) CreateProvider(c *gin.Context) {
	var provider m.Provider
	err := c.BindJSON(&provider)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create provider",
			"error":   err.Error(),
		})
		return
	}

	err = providerRepository.CreateProvider(provider)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create provider",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Provider %s created successfully", provider.Name),
	})
}

func (e *ProviderController) UpdateProvider(c *gin.Context) {
	var provider m.Provider
	err := c.BindJSON(&provider)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update provider",
			"error":   err.Error(),
		})
		return
	}

	err = providerRepository.UpdateProvider(provider)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update provider",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Provider %s updated successfully", provider.Name),
	})
}

func (e *ProviderController) DeleteProvider(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get the id",
			"error":   err.Error(),
		})
		return
	}

	err = providerRepository.DeleteProvider(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to delete provider",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Provider deleted successfully",
	})
}