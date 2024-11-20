package repositories

import (
	"dashboard/database"
	m "dashboard/models"
)

type BillDocumentRepository struct{}

var tableBillDocument string = "bill_document"

func (e *BillDocumentRepository) GetBillDocuments() ([]m.BillDocument, error) {
	db := database.GetDB()
	var billDocuments []m.BillDocument

	rows, err := db.Query("SELECT * FROM " + tableBillDocument + ";")
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var billDocument m.BillDocument
		err := rows.Scan(&billDocument.ID, &billDocument.Name,
			&billDocument.Format, &billDocument.BillID)
		if err != nil {
			return nil, err
		}
		billDocuments = append(billDocuments, billDocument)
	}

	return billDocuments, nil
}

func (e *BillDocumentRepository) GetBillDocumentByID(id int) (m.BillDocument, error) {
	db := database.GetDB()
	var billDocument m.BillDocument

	err := db.QueryRow("SELECT * FROM "+tableBillDocument+" WHERE id = ?;", id).Scan(
		&billDocument.ID, &billDocument.Name,
		&billDocument.Format, &billDocument.BillID)
	if err != nil {
		return m.BillDocument{}, err
	}

	return billDocument, nil
}

func (e *BillDocumentRepository) CreateBillDocument(billDocument m.BillDocument) error {

	db := database.GetDB()

	_, err := db.Exec("INSERT INTO "+tableBillDocument+" (name, format, bill_id) VALUES (?, ?, ?, ?);", billDocument.Name, billDocument.Format, billDocument.BillID)
	if err != nil {
		return err
	}

	return nil
}
