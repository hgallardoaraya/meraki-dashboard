package models

// User struct
type User struct {
	ID             int    `json:"id"`
	Name           string `json:"name"`
	LastName       string `json:"last_name"`
	SecondLastName string `json:"second_last_name"`
	Rut            string `json:"rut"`
	DV             string `json:"dv"`
	RoleID         int    `json:"role_id"`
	LocaleID       int    `json:"locale_id"`
}
