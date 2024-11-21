package repositories

import (
	"dashboard/database"
	m "dashboard/models"
)
type ProviderRepository struct{}

var tableProvider string = "provider"

func (e *ProviderRepository) GetProviders() ([]m.Provider, error) {
	db := database.GetDB()
	var providers []m.Provider

	rows, err := db.Query("SELECT * FROM " + tableProvider + ";")
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var provider m.Provider
		err := rows.Scan(&provider.ID, &provider.Name, &provider.Description)
		if err != nil {
			return nil, err
		}
		providers = append(providers, provider)
	}

	return providers, nil
}

func (e *ProviderRepository) GetProviderByID(id int) (m.Provider, error) {
	db := database.GetDB()
	var provider m.Provider

	err := db.QueryRow("SELECT * FROM "+tableProvider+" WHERE id = ?;", id).Scan(&provider.ID, &provider.Name, &provider.Description)

	if err != nil {
		return m.Provider{}, err
	}

	return provider, nil
}

func (e *ProviderRepository) CreateProvider(provider m.Provider) error {

	db := database.GetDB()

	_, err := db.Exec("INSERT INTO "+tableProvider+" (name, description) VALUES (?, ?);", provider.Name, provider.Description)
	if err != nil {
		return err
	}

	return nil
}

func (e *ProviderRepository) UpdateProvider(provider m.Provider) error {
	
	db := database.GetDB()

	_, err := db.Exec("UPDATE "+tableProvider+" SET name = ?, description = ? WHERE id = ?;", provider.Name, provider.Description, provider.ID)
	if err != nil {
		return err
	}

	return nil
}

func (e *ProviderRepository) DeleteProvider(id int) error {
	db := database.GetDB()

	_, err := db.Exec("DELETE FROM "+tableProvider+" WHERE id = ?;", id)
	if err != nil {
		return err
	}

	return nil
}
