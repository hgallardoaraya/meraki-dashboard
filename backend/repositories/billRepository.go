package repositories

import (
	"dashboard/database"
	m "dashboard/models"
)

type BillRepository struct{}

var tableBill string = "bill"

func (e *BillRepository) GetBills() ([]m.Bill, error) {
	db := database.GetDB()
	var bills []m.Bill

	rows, err := db.Query("SELECT * FROM " + tableBill + ";")
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var bill m.Bill
		err := rows.Scan(&bill.ID, &bill.UserID, &bill.BillType, &bill.CategoryID, &bill.ContableDate, &bill.DteID,
			&bill.Image, &bill.Notes, &bill.ProviderID, &bill.LocaleID, &bill.TotalAmount, &bill.TotalIva, &bill.TotalNeto,
			&bill.CreationDate)
		if err != nil {
			return nil, err
		}
		bills = append(bills, bill)
	}

	return bills, nil
}

func (e *BillRepository) GetBillByID(id int) (m.Bill, error) {
	db := database.GetDB()
	var bill m.Bill

	err := db.QueryRow("SELECT * FROM "+tableBill+" WHERE id = ?;", id).Scan(&bill.ID, &bill.UserID, &bill.BillType, &bill.CategoryID, &bill.ContableDate, &bill.DteID,
		&bill.Image, &bill.Notes, &bill.ProviderID, &bill.LocaleID, &bill.TotalAmount, &bill.TotalIva, &bill.TotalNeto,
		&bill.CreationDate)
	if err != nil {
		return m.Bill{}, err
	}

	return bill, nil
}

func (e *BillRepository) CreateBill(bill m.Bill) error {

	db := database.GetDB()

	_, err := db.Exec("INSERT INTO "+tableBill+" (user_id, bill_type, category_id, contable_date, dte_id, image, notes, provider_id, sede_id, total_amount, total_iva, total_neto, creation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
		&bill.UserID, &bill.BillType, &bill.CategoryID, &bill.ContableDate, &bill.DteID,
		&bill.Image, &bill.Notes, &bill.ProviderID, &bill.LocaleID, &bill.TotalAmount, &bill.TotalIva, &bill.TotalNeto,
		&bill.CreationDate)
	if err != nil {
		return err
	}

	return nil
}
