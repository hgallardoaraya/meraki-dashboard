package repositories

import (
	"dashboard/database"
	m "dashboard/models"
)

type BillCategoryRepository struct{}

var tableBillCategory string = "categoria"

func (e *BillCategoryRepository) GetBillCategory() ([]m.BillCategory, error) {
	db := database.Conn()
	defer db.Close()
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
	db := database.Conn()
	defer db.Close()
	var billCategory m.BillCategory

	err := db.QueryRow("SELECT * FROM "+tableBillCategory+" WHERE id = $1;", id).Scan(&billCategory.ID, &billCategory.Name)
	if err != nil {
		return m.BillCategory{}, err
	}

	return billCategory, nil
}

func (e *BillCategoryRepository) CreateBillCategory(billCategory m.BillCategory) error {

	db := database.Conn()
	defer db.Close()

	_, err := db.Exec("INSERT INTO "+tableBillCategory+" (name) VALUES ($1);", billCategory.Name)
	if err != nil {
		return err
	}

	return nil
}
