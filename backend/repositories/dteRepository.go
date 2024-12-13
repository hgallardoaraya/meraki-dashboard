package repositories

import (
	"dashboard/database"
	m "dashboard/models"
)

type DteRepository struct{}

var tableDte string = "Dte"

func (e *DteRepository) GetDtes() ([]m.Dte, error) {
	db := database.GetDB()
	var dtes []m.Dte

	rows, err := db.Query("SELECT * FROM " + tableDte + ";")
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var dte m.Dte
		err := rows.Scan(&dte.ID, &dte.Name)
		if err != nil {
			return nil, err
		}
		dtes = append(dtes, dte)
	}

	return dtes, nil
}

func (e *DteRepository) GetDteByID(id int) (m.Dte, error) {
	db := database.GetDB()
	var dte m.Dte

	err := db.QueryRow("SELECT * FROM "+tableDte+" WHERE id = ?;", id).Scan(&dte.ID, &dte.Name)
	if err != nil {
		return m.Dte{}, err
	}

	return dte, nil
}

func (e *DteRepository) CreateDte(dte m.Dte) error {

	db := database.GetDB()

	_, err := db.Exec("INSERT INTO "+tableDte+" (name, address) VALUES (?, ?);", dte.Name)
	if err != nil {
		return err
	}

	return nil
}

func (e *DteRepository) UpdateDte(dte m.Dte) error {
	
	db := database.GetDB()

	_, err := db.Exec("UPDATE "+tableDte+" SET name = ? WHERE id = ?;", dte.Name, dte.ID)
	if err != nil {
		return err
	}

	return nil
}

func (e *DteRepository) DeleteDte(id int) error {
	db := database.GetDB()

	_, err := db.Exec("DELETE FROM "+tableDte+" WHERE id = ?;", id)
	if err != nil {
		return err
	}

	return nil
}