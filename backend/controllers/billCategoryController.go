package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	m "dashboard/models"
	r "dashboard/repositories"
	"strconv"
)
type BillCategoryController struct{}

var billCategoryRepository r.BillCategoryRepository = r.BillCategoryRepository{}

func (e *BillCategoryController) GetBillCategories(c *gin.Context) {
	billCategories, err := billCategoryRepository.GetBillCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bill categories",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"billCategories": billCategories,
	})
}

func (e *BillCategoryController) GetBillCategoryByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid bill category ID",
			"error":   err.Error(),
		})
		return
	}
	billCategory, err := billCategoryRepository.GetBillCategoryByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bill category",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"billCategory": billCategory,
	})
}

func (e *BillCategoryController) CreateBillCategory(c *gin.Context) {
	var billCategory m.BillCategory
	err := c.BindJSON(&billCategory)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to create bill category",
			"error":   err.Error(),
		})
		return
	}

	err = billCategoryRepository.CreateBillCategory(billCategory)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create bill category",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Bill category created",
	})
}
