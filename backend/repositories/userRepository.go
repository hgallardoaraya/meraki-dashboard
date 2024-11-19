package repositories

import (
	"dashboard/database"
	m "dashboard/models"
)

type UserRepository struct{}

var tableUser string = "user"

func (e *UserRepository) GetUsers() ([]m.User, error) {
	db := database.GetDB()
	var users []m.User

	rows, err := db.Query("SELECT * FROM " + tableUser + ";")
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var user m.User
		err := rows.Scan(&user.ID, &user.RoleID, &user.LocaleID, &user.Name, &user.LastName, &user.SecondLastName, &user.Rut, &user.DV)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

func (e *UserRepository) GetUserByID(id int) (m.User, error) {
	db := database.GetDB()
	var user m.User

	err := db.QueryRow("SELECT * FROM "+tableUser+" WHERE id = ?;", id).Scan(&user.ID, &user.RoleID, &user.LocaleID, &user.Name, &user.LastName, &user.SecondLastName, &user.Rut, &user.DV)
	if err != nil {
		return m.User{}, err
	}

	return user, nil
}

func (e *UserRepository) CreateUser(user m.User) error {

	db := database.GetDB()

	_, err := db.Exec("INSERT INTO "+tableUser+" (role_id, sede_id, name, last_name, second_last_name, rut, dv) VALUES (?, ?, ?, ?, ?, ?, ?);", user.RoleID, user.LocaleID, user.Name, user.LastName, user.SecondLastName, user.Rut, user.DV)
	if err != nil {
		return err
	}

	return nil
}
