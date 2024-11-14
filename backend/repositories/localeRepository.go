package repositories

import (
	"dashboard/database"
	m "dashboard/models"
)

type LocaleRepository struct{}

var tableLocale string = "locale"

func (e *LocaleRepository) GetLocale() ([]m.Locale, error) {
	db := database.Conn()
	defer db.Close()
	var locales []m.Locale

	rows, err := db.Query("SELECT * FROM " + tableLocale + ";")
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var locale m.Locale
		err := rows.Scan(&locale.ID, &locale.Name, &locale.Address)
		if err != nil {
			return nil, err
		}
		locales = append(locales, locale)
	}

	return locales, nil
}

func (e *LocaleRepository) GetLocaleByID(id int) (m.Locale, error) {
	db := database.Conn()
	defer db.Close()
	var locale m.Locale

	err := db.QueryRow("SELECT * FROM "+tableLocale+" WHERE id = $1;", id).Scan(&locale.ID, &locale.Name, &locale.Address)
	if err != nil {
		return m.Locale{}, err
	}

	return locale, nil
}

func (e *ProviderRepository) CreateLocale(locale m.Locale) error {

	db := database.Conn()
	defer db.Close()

	_, err := db.Exec("INSERT INTO "+tableLocale+" (name, description) VALUES ($1, $2);", locale.Name, locale.Address)
	if err != nil {
		return err
	}

	return nil
}
