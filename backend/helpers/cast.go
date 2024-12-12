package helpers

import (
	"dashboard/models"
	"fmt"
	"mime/multipart"
	"strconv"
)

func GetBillFromMultipartForm(form *multipart.Form) (models.Bill, error) {
	var bill models.Bill
	var err error

	// Asignar los valores del formulario al struct Bill
	if idStr, ok := form.Value["id"]; ok {
		bill.ID, err = strconv.Atoi(idStr[0])
		if err != nil {
			return bill, fmt.Errorf("error parsing ID: %v", err)
		}
	}

	if providerIDStr, ok := form.Value["provider_id"]; ok {
		bill.ProviderID, err = strconv.Atoi(providerIDStr[0])
		if err != nil {
			return bill, fmt.Errorf("error parsing ProviderID: %v", err)
		}
	}

	if localeIDStr, ok := form.Value["locale_id"]; ok {
		bill.LocaleID, err = strconv.Atoi(localeIDStr[0])
		if err != nil {
			return bill, fmt.Errorf("error parsing LocaleID: %v", err)
		}
	}

	if dteIDStr, ok := form.Value["dte_id"]; ok {
		bill.DteID, err = strconv.Atoi(dteIDStr[0])
		if err != nil {
			return bill, fmt.Errorf("error parsing DteID: %v", err)
		}
	}

	if userIDStr, ok := form.Value["user_id"]; ok {
		bill.UserID, err = strconv.Atoi(userIDStr[0])
		if err != nil {
			return bill, fmt.Errorf("error parsing UserID: %v", err)
		}
	}

	if categoryIDStr, ok := form.Value["category_id"]; ok {
		bill.CategoryID, err = strconv.Atoi(categoryIDStr[0])
		if err != nil {
			return bill, fmt.Errorf("error parsing CategoryID: %v", err)
		}
	}

	if typeIDStr, ok := form.Value["type_id"]; ok {
		bill.TypeID, err = strconv.Atoi(typeIDStr[0])
		if err != nil {
			return bill, fmt.Errorf("error parsing TypeID: %v", err)
		}
	}

	if totalIvaStr, ok := form.Value["total_iva"]; ok {
		bill.TotalIva, err = strconv.Atoi(totalIvaStr[0])
		if err != nil {
			return bill, fmt.Errorf("error parsing TotalIva: %v", err)
		}
	}

	if totalAmountStr, ok := form.Value["total_amount"]; ok {
		bill.TotalAmount, err = strconv.Atoi(totalAmountStr[0])
		if err != nil {
			return bill, fmt.Errorf("error parsing TotalAmount: %v", err)
		}
	}

	if totalNetoStr, ok := form.Value["total_neto"]; ok {
		bill.TotalNeto, err = strconv.Atoi(totalNetoStr[0])
		if err != nil {
			return bill, fmt.Errorf("error parsing TotalNeto: %v", err)
		}
	}

	if notes, ok := form.Value["notes"]; ok {
		bill.Notes = notes[0]
	}

	if image, ok := form.Value["image"]; ok {
		bill.Image = image[0]
	}

	if creationDateStr, ok := form.Value["creation_date"]; ok {
		bill.CreationDate = creationDateStr[0]
	}

	if contableDateStr, ok := form.Value["contable_date"]; ok {
		bill.ContableDate = contableDateStr[0]
	}

	return bill, nil
}
