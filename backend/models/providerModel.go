package models

// Provider struct
type Provider struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}