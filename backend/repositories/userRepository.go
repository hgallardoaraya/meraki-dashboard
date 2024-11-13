package repositories

import (
	"dashboard/database"
	m "dashboard/models"
)

type UserRepository struct{}

func (e *UserRepository) GetUser() ([]m.User, error) {
	db := database.Conn()
	defer db.Close()
	var users []m.User

	rows, err := db.Query("SELECT * FROM usuario;")
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var user m.User
		err := rows.Scan(&user.ID, &user.RoleID, &user.SedeID, &user.Name, &user.LastName, &user.SecondLastName, &user.Rut, &user.DV)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

func (e *UserRepository) GetUserByID(id int) (m.User, error) {
	db := database.Conn()
	defer db.Close()
	var user m.User

	err := db.QueryRow("SELECT * FROM usuario WHERE id = $1;", id).Scan(&user.ID, &user.RoleID, &user.SedeID, &user.Name, &user.LastName, &user.SecondLastName, &user.Rut, &user.DV)
	if err != nil {
		return m.User{}, err
	}

	return user, nil
}

func (e *UserRepository) CreateUser(user m.User) error {
	
	db := database.Conn()
	defer db.Close()

	_, err := db.Exec("INSERT INTO usuario (role_id, sede_id, name, last_name, second_last_name, rut, dv) VALUES ($1, $2, $3, $4, $5, $6, $7);", user.RoleID, user.SedeID, user.Name, user.LastName, user.SecondLastName, user.Rut, user.DV)
	if err != nil {
		return err
	}

	return nil
}