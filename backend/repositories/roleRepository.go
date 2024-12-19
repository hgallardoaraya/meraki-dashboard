package repositories

import (
	"dashboard/database"
	m "dashboard/models"
)

type RoleRepository struct{}

var tableRole string = "role"

func (e *RoleRepository) GetRoles() ([]m.Role, error) {
	db := database.GetDB()
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
	db := database.GetDB()
	var role m.Role

	err := db.QueryRow("SELECT * FROM "+tableRole+" WHERE id = ?;", id).Scan(&role.ID, &role.Name)
	if err != nil {
		return m.Role{}, err
	}

	return role, nil
}

func (e *RoleRepository) CreateRole(role m.Role) error {

	db := database.GetDB()

	_, err := db.Exec("INSERT INTO "+tableRole+" (name) VALUES (?);", role.Name)
	if err != nil {
		return err
	}

	return nil
}

func (e *RoleRepository) UpdateRole(role m.Role) error {
	
	db := database.GetDB()

	_, err := db.Exec("UPDATE "+tableRole+" SET name = ? WHERE id = ?;", role.Name, role.ID)
	if err != nil {
		return err
	}

	return nil
}

func (e *RoleRepository) DeleteRole(id int) error {
	
	db := database.GetDB()

	_, err := db.Exec("DELETE FROM "+tableRole+" WHERE id = ?;", id)
	if err != nil {
		return err
	}

	return nil
}
