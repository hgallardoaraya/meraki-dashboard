package repositories

import (
	"dashboard/database"
	m "dashboard/models"
	r "dashboard/responses"
	"database/sql"
	"fmt"
	"strings"
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

func (e *BillRepository) CreateBill(bill m.Bill, documents []m.BillDocument) error {
	db := database.GetDB()
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	var res sql.Result
	res, err = tx.Exec("INSERT INTO "+tableBill+" (user_id, bill_type_id, category_id, contable_date, dte_id, image, notes, provider_id, locale_id, total_amount, total_iva, total_neto, creation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
		bill.UserID, bill.TypeID, bill.CategoryID, bill.ContableDate, bill.DteID,
		bill.Image, bill.Notes, bill.ProviderID, bill.LocaleID, bill.TotalAmount, bill.TotalIva, bill.TotalNeto,
		bill.CreationDate)
	if err != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			return rbErr
		}
		return err
	}

	var lastInsertedRowId int64
	lastInsertedRowId, err = res.LastInsertId()
	var plh []string
	var parameters []interface{}
	for _, doc := range documents {
		plh = append(plh, fmt.Sprintf("(?, ?, ?)"))
		parameters = append(parameters, lastInsertedRowId, doc.Name, doc.Format)
	}
	_, err = tx.Exec(fmt.Sprintf(`
		INSERT INTO %s (bill_id, name, format) 
		VALUES %s;`, tableBillDocument, strings.Join(plh, ",")),
		parameters...,
	)
	if err != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			return rbErr
		}
		return err
	}
	err = tx.Commit()
	if err != nil {
		return err
	}
	return nil
}
