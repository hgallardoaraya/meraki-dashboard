package models

// User struct
type User struct {
	ID             int    `json:"id"`
	Username       string `json:"username"`
	Password       string `json:"password"`
	Name           string `json:"name"`
	LastName       string `json:"last_name"`
	SecondLastName string `json:"second_last_name"`
	Rut            int    `json:"rut"`
	DV             string `json:"dv"`
	RoleID         int    `json:"role_id"`
	LocaleID       int    `json:"locale_id"`
}
