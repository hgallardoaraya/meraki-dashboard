package models

// BillDocument struct
type BillDocument struct {
	ID     int    `json:"id"`
	BillID int    `json:"bill_id"`
	Name   string `json:"name"`
	Format string `json:"format"`
}
