package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	m "dashboard/models"
	r "dashboard/repositories"
)

type LocaleController struct{}

var localeRepository r.LocaleRepository = r.LocaleRepository{}

func (e *LocaleController) GetLocales(c *gin.Context) {
	locales, err := localeRepository.GetLocales()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get locals",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"locales": locales,
	})
}

func (e *LocaleController) GetLocaleByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid locale ID",
			"error":   err.Error(),
		})
		return
	}

	locale, err := localeRepository.GetLocaleByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get locale",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"locale": locale,
	})
}

func (e *LocaleController) CreateLocale(c *gin.Context) {
	var locale m.Locale
	err := c.BindJSON(&locale)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to create locale",
			"error":   err.Error(),
		})
		return
	}

	err = localeRepository.CreateLocale(locale)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create locale",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Locale %s created successfully", locale.Name),
	})
}

func (e *LocaleController) UpdateLocale(c *gin.Context) {
	var locale m.Locale
	err := c.BindJSON(&locale)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to update locale",
			"error":   err.Error(),
		})
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid locale ID",
			"error":   err.Error(),
		})
		return
	}

	locale.ID = id

	localeRegistered, err := localeRepository.GetLocaleByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get locale",
			"error":   err.Error(),
		})
		return
	}

	if locale.Name == "" {
		locale.Name = localeRegistered.Name
	}

	if locale.Address == "" {
		locale.Address = localeRegistered.Address
	}

	err = localeRepository.UpdateLocale(locale)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update locale",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Locale %s updated successfully", locale.Name),
	})
}

func (e *LocaleController) DeleteLocale(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid locale ID",
			"error":   err.Error(),
		})
		return
	}

	err = localeRepository.DeleteLocale(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to delete locale",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Locale deleted successfully",
	})
}
