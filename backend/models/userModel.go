package models

// User struct
type User struct {
	ID             int    `json:"id"`
	Name           string `json:"name"`
	LastName       string `json:"last_name"`
	SecondLastName string `json:"second_last_name"`
	Rut            string `json:"rut"`
	RoleID         int    `json:"role_id"`
	SedeID         int    `json:"sede_id"`
}
