package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	m "dashboard/models"
	r "dashboard/repositories"
)

type BillController struct{}

var billRepository r.BillRepository = r.BillRepository{}

func (e *BillController) GetBills(c *gin.Context) {
	bills, err := billRepository.GetBills()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bills",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"bills": bills,
	})
}

func (e *BillController) GetBillByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid bill ID",
			"error":   err.Error(),
		})
		return
	}
	bill, err := billRepository.GetBillByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bill",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"bill": bill,
	})
}

func (e *BillController) CreateBill(c *gin.Context) {
	var bill m.Bill
	err := c.BindJSON(&bill)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to create bill",
			"error":   err.Error(),
		})
		return
	}

	err = billRepository.CreateBill(bill)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create bill",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Bill created",
	})
}