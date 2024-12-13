package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	m "dashboard/models"
	r "dashboard/repositories"
)

type BillTypeController struct{}

var billTypeRepository r.BillTypeRepository = r.BillTypeRepository{}

func (e *BillTypeController) GetBillTypes(c *gin.Context) {
	billTypes, err := billTypeRepository.GetBillTypes()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bill types",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"billTypes": billTypes,
	})
}

func (e *BillTypeController) GetBillTypeByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid bill type ID",
			"error":   err.Error(),
		})
		return
	}
	billType, err := billTypeRepository.GetBillTypeByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bill type",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"billType": billType,
	})
}

func (e *BillTypeController) CreateBillType(c *gin.Context) {
	var billType m.BillType
	err := c.BindJSON(&billType)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to create bill type",
			"error":   err.Error(),
		})
		return
	}

	err = billTypeRepository.CreateBillType(billType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create bill type",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Bill type created",
	})
}

func (e *BillTypeController) UpdateBillType(c *gin.Context) {
	var billType m.BillType
	err := c.BindJSON(&billType)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to update bill type",
			"error":   err.Error(),
		})
		return
	}

	err = billTypeRepository.UpdateBillType(billType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update bill type",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Bill type updated",
	})
}

func (e *BillTypeController) DeleteBillType(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid bill type ID",
			"error":   err.Error(),
		})
		return
	}

	err = billTypeRepository.DeleteBillType(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to delete bill type",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Bill type deleted",
	})
}