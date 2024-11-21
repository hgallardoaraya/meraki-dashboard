package repositories

import (
	"dashboard/database"
	m "dashboard/models"
)

type BillCategoryRepository struct{}

var tableBillCategory string = "bill_category"

func (e *BillCategoryRepository) GetBillCategories() ([]m.BillCategory, error) {
	db := database.GetDB()
	var billCategories []m.BillCategory

	rows, err := db.Query("SELECT * FROM " + tableBillCategory + ";")
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var billCategory m.BillCategory
		err := rows.Scan(&billCategory.ID, &billCategory.Name)
		if err != nil {
			return nil, err
		}
		billCategories = append(billCategories, billCategory)
	}

	return billCategories, nil
}

func (e *BillCategoryRepository) GetBillCategoryByID(id int) (m.BillCategory, error) {
	db := database.GetDB()
	var billCategory m.BillCategory

	err := db.QueryRow("SELECT * FROM "+tableBillCategory+" WHERE id = ?;", id).Scan(&billCategory.ID, &billCategory.Name)
	if err != nil {
		return m.BillCategory{}, err
	}

	return billCategory, nil
}

func (e *BillCategoryRepository) CreateBillCategory(billCategory m.BillCategory) error {

	db := database.GetDB()

	_, err := db.Exec("INSERT INTO "+tableBillCategory+" (name) VALUES (?);", billCategory.Name)
	if err != nil {
		return err
	}

	return nil
}
