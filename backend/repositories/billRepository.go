package repositories

import (
	"dashboard/database"
	m "dashboard/models"
	r "dashboard/responses"
	"fmt"
)

type BillRepository struct{}

var tableBill string = "bill"

func (e *BillRepository) GetBills() ([]r.Bill, error) {
	db := database.GetDB()
	query := fmt.Sprintf(`SELECT b.id, p.name, 
	    u.name, u.last_name, 
	    l.name, 
	    bc.name, 
	    bt.name, 
	    creation_date, contable_date, total_neto, total_iva, total_amount, notes, image 
		FROM %s b
		INNER JOIN %s p ON p.id = b.provider_id
		INNER JOIN %s u ON u.id = b.user_id
		INNER JOIN %s l ON l.id = b.locale_id
		INNER JOIN %s bc ON bc.id = b.category_id
		INNER JOIN %s bt ON bt.id = b.bill_type_id		
		;`,
		tableBill, tableProvider, tableUser, tableLocale, tableBillCategory, tableBillType)
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}

	var bills []r.Bill
	for rows.Next() {
		var bill r.Bill
		err := rows.Scan(&bill.ID, &bill.ProviderName, &bill.UserName, &bill.UserLastName, &bill.LocaleName, &bill.CategoryName,
			&bill.TypeName, &bill.CreationDate, &bill.ContableDate, &bill.TotalNeto, &bill.TotalIva, &bill.TotalAmount,
			&bill.Notes, &bill.Image)
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

	err := db.QueryRow("SELECT * FROM "+tableBill+" WHERE id = ?;", id).Scan(&bill.ID, &bill.UserID, &bill.TypeID, &bill.CategoryID, &bill.ContableDate, &bill.DteID,
		&bill.Image, &bill.Notes, &bill.ProviderID, &bill.LocaleID, &bill.TotalAmount, &bill.TotalIva, &bill.TotalNeto,
		&bill.CreationDate)
	if err != nil {
		return m.Bill{}, err
	}

	return bill, nil
}

func (e *BillRepository) CreateBill(bill m.Bill) error {
	db := database.GetDB()

	_, err := db.Exec("INSERT INTO "+tableBill+" (user_id, bill_type_id, category_id, contable_date, dte_id, image, notes, provider_id, locale_id, total_amount, total_iva, total_neto, creation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
		bill.UserID, bill.TypeID, bill.CategoryID, bill.ContableDate, bill.DteID,
		bill.Image, bill.Notes, bill.ProviderID, bill.LocaleID, bill.TotalAmount, bill.TotalIva, bill.TotalNeto,
		bill.CreationDate)
	if err != nil {
		return err
	}

	return nil
}

func (e *BillRepository) UpdateBill(bill m.Bill) error {
	db := database.GetDB()

	_, err := db.Exec("UPDATE "+tableBill+" SET user_id = ?, bill_type_id = ?, category_id = ?, contable_date = ?, dte_id = ?, image = ?, notes = ?, provider_id = ?, locale_id = ?, total_amount = ?, total_iva = ?, total_neto = ?, creation_date = ? WHERE id = ?;",
		bill.UserID, bill.TypeID, bill.CategoryID, bill.ContableDate, bill.DteID,
		bill.Image, bill.Notes, bill.ProviderID, bill.LocaleID, bill.TotalAmount, bill.TotalIva, bill.TotalNeto,
		bill.CreationDate, bill.ID)
	if err != nil {
		return err
	}

	return nil
}

func (e *BillRepository) DeleteBill(id int) error {
	db := database.GetDB()

	_, err := db.Exec("DELETE FROM "+tableBill+" WHERE id = ?;", id)
	if err != nil {
		return err
	}

	return nil
}
