package repositories

import (
	"dashboard/database"
	m "dashboard/models"
)

type BillRepository struct{}

var tableBill string = "bill"

func (e *BillRepository) GetBill() ([]m.Bill, error) {
	db := database.Conn()
	defer db.Close()
	var bills []m.Bill

	rows, err := db.Query("SELECT * FROM " + tableBill + ";")
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var bill m.Bill
		err := rows.Scan(&bill.ID, &bill.UserID, &bill.BillType, &bill.CategoryID, &bill.ContableDate, &bill.DteID,
			&bill.Image, &bill.Notes, &bill.ProviderID, &bill.SedeID, &bill.TotalAmount, &bill.TotalIva, &bill.TotalNeto,
			&bill.CreationDate)
		if err != nil {
			return nil, err
		}
		bills = append(bills, bill)
	}

	return bills, nil
}

func (e *BillRepository) GetBillByID(id int) (m.Bill, error) {
	db := database.Conn()
	defer db.Close()
	var bill m.Bill

	err := db.QueryRow("SELECT * FROM "+tableBill+" WHERE id = $1;", id).Scan(&bill.ID, &bill.UserID, &bill.BillType, &bill.CategoryID, &bill.ContableDate, &bill.DteID,
		&bill.Image, &bill.Notes, &bill.ProviderID, &bill.SedeID, &bill.TotalAmount, &bill.TotalIva, &bill.TotalNeto,
		&bill.CreationDate)
	if err != nil {
		return m.Bill{}, err
	}

	return bill, nil
}

func (e *UserRepository) CreateBill(user m.Bill) error {

	db := database.Conn()
	defer db.Close()

	_, err := db.Exec("INSERT INTO "+tableBill+" (user_id, bill_type, category_id, contable_date, dte_id, image, notes, provider_id, sede_id, total_amount, total_iva, total_neto, creation_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);", 
		&user.UserID, &user.BillType, &user.CategoryID, &user.ContableDate, &user.DteID,
		&user.Image, &user.Notes, &user.ProviderID, &user.SedeID, &user.TotalAmount, &user.TotalIva, &user.TotalNeto,
		&user.CreationDate)
	if err != nil {
		return err
	}

	return nil
}
