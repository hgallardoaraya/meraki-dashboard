package repositories

import (
	"dashboard/database"
	m "dashboard/models"
)

type RoleRepository struct{}

var tableRole string = "rol"

func (e *RoleRepository) GetRole() ([]m.Role, error) {
	db := database.Conn()
	defer db.Close()
	var roles []m.Role

	rows, err := db.Query("SELECT * FROM " + tableRole + ";")
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var role m.Role
		err := rows.Scan(&role.ID, &role.Name)
		if err != nil {
			return nil, err
		}
		roles = append(roles, role)
	}

	return roles, nil
}

func (e *RoleRepository) GetRoleByID(id int) (m.Role, error) {
	db := database.Conn()
	defer db.Close()
	var role m.Role

	err := db.QueryRow("SELECT * FROM "+tableRole+" WHERE id = $1;", id).Scan(&role.ID, &role.Name)
	if err != nil {
		return m.Role{}, err
	}

	return role, nil
}

func (e *RoleRepository) CreateRole(role m.Role) error {

	db := database.Conn()
	defer db.Close()

	_, err := db.Exec("INSERT INTO "+tableRole+" (name) VALUES ($1);", role.Name)
	if err != nil {
		return err
	}

	return nil
}
