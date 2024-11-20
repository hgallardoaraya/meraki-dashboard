package repositories

import (
	"dashboard/database"
	m "dashboard/models"
)

type LocaleRepository struct{}

var tableLocale string = "locale"

func (e *LocaleRepository) GetLocales() ([]m.Locale, error) {
	db := database.GetDB()
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
	db := database.GetDB()
	var locale m.Locale

	err := db.QueryRow("SELECT * FROM "+tableLocale+" WHERE id = ?;", id).Scan(&locale.ID, &locale.Name, &locale.Address)
	if err != nil {
		return m.Locale{}, err
	}

	return locale, nil
}

func (e *LocaleRepository) CreateLocale(locale m.Locale) error {

	db := database.GetDB()

	_, err := db.Exec("INSERT INTO "+tableLocale+" (name, address) VALUES (?, ?);", locale.Name, locale.Address)
	if err != nil {
		return err
	}

	return nil
}
