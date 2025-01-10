package controllers

import (
	"dashboard/helpers"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"

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
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get form",
			"error":   err.Error(),
		})
		return
	}
	bill, err := helpers.GetBillFromMultipartForm(form)
	files := form.File["files"]
	var documents []m.BillDocument
	for _, f := range files {
		name, ext := helpers.ExtractFileNameAndExtension(f)
		doc := m.BillDocument{
			Name:   name,
			Format: ext,
		}
		documents = append(documents, doc)
	}
	var lastInsertedRow int64
	lastInsertedRow, err = billRepository.CreateBill(bill, documents)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to save files",
			"error":   err.Error(),
		})
		return
	}

	err = helpers.SaveFiles(files, c.SaveUploadedFile, lastInsertedRow)
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

func (e *BillController) UpdateBill(c *gin.Context) {
	var bill m.Bill
	err := c.BindJSON(&bill)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to update bill",
			"error":   err.Error(),
		})
		return
	}

	err = billRepository.UpdateBill(bill)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update bill",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Bill updated",
	})
}

func (e *BillController) DeleteBill(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid bill ID",
			"error":   err.Error(),
		})
		return
	}

	err = billRepository.DeleteBill(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to delete bill",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Bill deleted",
	})
}

func (e *BillController) GetSummary(c *gin.Context) {
	t1 := c.Query("t1")
	fmt.Println(t1)
	t2 := c.Query("t2")
	fmt.Println(t1)
	localeIdStr := c.Query("localeId")

	localeId := -1
	var err error
	if len(localeIdStr) > 0 {
		localeId, err = strconv.Atoi(localeIdStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Locale"})
			return
		}
	}

	summary, err := billRepository.GetSummary(t1, t2, localeId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bills summary",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"summary": summary,
	})
}

func (e *BillController) GetSummaryByMonthAndYear(c *gin.Context) {
	monthStr := c.Query("month")
	yearStr := c.Query("year")

	month, err := strconv.Atoi(monthStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month"})
		return
	}

	year, err := strconv.Atoi(yearStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
		return
	}

	summary, err := billRepository.GetDaySummariesByMonthAndYear(month, year)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bills summary",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"summary": summary,
	})
}

func (e *BillController) GetSummaryByMonthAndYearRange(c *gin.Context) {
	startMonthStr := c.Query("startMonth")
	startYearStr := c.Query("startYear")
	endMonthStr := c.Query("endMonth")
	endYearStr := c.Query("endYear")

	startMonth, err := strconv.Atoi(startMonthStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month"})
		return
	}

	startYear, err := strconv.Atoi(startYearStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
		return
	}

	endMonth, err := strconv.Atoi(endMonthStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month"})
		return
	}

	endYear, err := strconv.Atoi(endYearStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
		return
	}

	summary, err := billRepository.GetDaySummariesByMonthAndYearRange(startMonth, startYear, endMonth, endYear)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bills summary",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"summary": summary,
	})
}

func (e *BillController) GetProviderSummaryByPeriod(c *gin.Context) {
	monthStr := c.Query("month")
	yearStr := c.Query("year")

	month, err := strconv.Atoi(monthStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month"})
		return
	}

	year, err := strconv.Atoi(yearStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
		return
	}

	summary, err := billRepository.GetProviderSummariesByMonthAndYear(month, year)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bills summary",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"summary": summary,
	})
}

func (e *BillController) GetProviderSummaryByPeriodRange(c *gin.Context) {
	startMonthStr := c.Query("startMonth")
	startYearStr := c.Query("startYear")
	endMonthStr := c.Query("endMonth")
	endYearStr := c.Query("endYear")

	startMonth, err := strconv.Atoi(startMonthStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month"})
		return
	}

	startYear, err := strconv.Atoi(startYearStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
		return
	}

	endMonth, err := strconv.Atoi(endMonthStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month"})
		return
	}

	endYear, err := strconv.Atoi(endYearStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
		return
	}

	summary, err := billRepository.GetProviderSummariesByMonthAndYearRange(startMonth, startYear, endMonth, endYear)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bills summary",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"summary": summary,
	})
}

func (e *BillController) GetCategorySummaryByPeriod(c *gin.Context) {
	monthStr := c.Query("month")
	yearStr := c.Query("year")

	month, err := strconv.Atoi(monthStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month"})
		return
	}

	year, err := strconv.Atoi(yearStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
		return
	}

	summary, err := billRepository.GetCategorySummariesByMonthAndYear(month, year)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bills summary",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"summary": summary,
	})
}

func (e *BillController) GetCategorySummaryByPeriodRange(c *gin.Context) {
	startMonthStr := c.Query("startMonth")
	startYearStr := c.Query("startYear")
	endMonthStr := c.Query("endMonth")
	endYearStr := c.Query("endYear")

	startMonth, err := strconv.Atoi(startMonthStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month"})
		return
	}

	startYear, err := strconv.Atoi(startYearStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
		return
	}

	endMonth, err := strconv.Atoi(endMonthStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month"})
		return
	}

	endYear, err := strconv.Atoi(endYearStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
		return
	}

	summary, err := billRepository.GetCategorySummariesByMonthAndYearRange(startMonth, startYear, endMonth, endYear)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get bills summary",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"summary": summary,
	})
}
