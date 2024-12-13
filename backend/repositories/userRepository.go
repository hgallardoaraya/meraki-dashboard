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
		err := rows.Scan(&user.ID, &user.RoleID, &user.LocaleID, &user.Username, &user.Name, &user.LastName, &user.SecondLastName, &user.Rut, &user.DV, &user.Password)
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

	err := db.QueryRow("SELECT * FROM "+tableUser+" WHERE id = ?;", id).Scan(&user.ID, &user.RoleID, &user.LocaleID, &user.Username, &user.Name, &user.LastName, &user.SecondLastName, &user.Rut, &user.DV, &user.Password)
	if err != nil {
		return m.User{}, err
	}

	return user, nil
}

func (e *UserRepository) GetUserByUsername(username string) (m.User, error) {
	db := database.GetDB()
	var user m.User

	err := db.QueryRow("SELECT * FROM "+tableUser+" WHERE username = ?;", username).Scan(&user.ID, &user.RoleID, &user.LocaleID, &user.Username, &user.Name, &user.LastName, &user.SecondLastName, &user.Rut, &user.DV, &user.Password)
	if err != nil {
		return m.User{}, err
	}

	return user, nil
}

func (e *UserRepository) CreateUser(user m.User) error {

	db := database.GetDB()

	_, err := db.Exec("INSERT INTO "+tableUser+" (role_id, locale_id, name, username, last_name, second_last_name, rut, dv, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);", user.RoleID, user.LocaleID, user.Name, &user.Username, user.LastName, user.SecondLastName, user.Rut, user.DV, user.Password)
	if err != nil {
		return err
	}

	return nil
}

func (e *UserRepository) UpdateUser(user m.User) error {
	db := database.GetDB()

	_, err := db.Exec("UPDATE "+tableUser+" SET role_id = ?, locale_id = ?, name = ?, username = ?, last_name = ?, second_last_name = ?, rut = ?, dv = ?, password = ? WHERE id = ?;", 
		user.RoleID, user.LocaleID, user.Name, user.Username, user.LastName, user.SecondLastName, user.Rut, user.DV, user.Password, user.ID)
	if err != nil {
		return err
	}

	return nil
}

func (e *UserRepository) DeleteUser(id int) error {
	db := database.GetDB()

	_, err := db.Exec("DELETE FROM "+tableUser+" WHERE id = ?;", id)
	if err != nil {
		return err
	}

	return nil
}
