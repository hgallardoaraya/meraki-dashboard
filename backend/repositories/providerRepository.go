package repositories

import (
	"dashboard/database"
	m "dashboard/models"
)

type ProviderRepository struct{}

var tableProvider string = "provider"

func (e *ProviderRepository) GetProvider() ([]m.Provider, error) {
	db := database.Conn()
	defer db.Close()
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
	db := database.Conn()
	defer db.Close()
	var provider m.Provider

	err := db.QueryRow("SELECT * FROM "+tableProvider+" WHERE id = $1;", id).Scan(&provider.ID, &provider.Name, &provider.Description)
	if err != nil {
		return m.Provider{}, err
	}

	return provider, nil
}

func (e *ProviderRepository) CreateProvider(provider m.Provider) error {

	db := database.Conn()
	defer db.Close()

	_, err := db.Exec("INSERT INTO "+tableProvider+" (name, description) VALUES ($1, $2);", provider.Name, provider.Description)
	if err != nil {
		return err
	}

	return nil
}
