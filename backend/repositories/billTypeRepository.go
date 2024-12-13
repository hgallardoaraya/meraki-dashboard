package repositories

import (
	"dashboard/database"
	m "dashboard/models"
)
type BillTypeRepository struct{}

var tableBillType string = "bill_type"

func (e *BillTypeRepository) GetBillTypes() ([]m.BillType, error) {
	db := database.GetDB()
	var billTypes []m.BillType

	rows, err := db.Query("SELECT * FROM " + tableBillType + ";")
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var billType m.BillType
		err := rows.Scan(&billType.ID, &billType.Name)
		if err != nil {
			return nil, err
		}
		billTypes = append(billTypes, billType)
	}

	return billTypes, nil
}

func (e *BillTypeRepository) GetBillTypeByID(id int) (m.BillType, error) {
	db := database.GetDB()
	var billType m.BillType

	err := db.QueryRow("SELECT * FROM "+tableBillType+" WHERE id = ?;", id).Scan(&billType.ID, &billType.Name)
	if err != nil {
		return m.BillType{}, err
	}

	return billType, nil
}

func (e *BillTypeRepository) CreateBillType(billType m.BillType) error {

	db := database.GetDB()

	_, err := db.Exec("INSERT INTO "+tableBillType+" (name) VALUES (?);", billType.Name)
	if err != nil {
		return err
	}

	return nil
}

func (e *BillTypeRepository) UpdateBillType(billType m.BillType) error {
	
	db := database.GetDB()

	_, err := db.Exec("UPDATE "+tableBillType+" SET name = ? WHERE id = ?;", billType.Name, billType.ID)
	if err != nil {
		return err
	}

	return nil
}

func (e *BillTypeRepository) DeleteBillType(id int) error {
	db := database.GetDB()

	_, err := db.Exec("DELETE FROM "+tableBillType+" WHERE id = ?;", id)
	if err != nil {
		return err
	}

	return nil
}