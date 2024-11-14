package models

// Bill struct
type Bill struct {
	ID           int    `json:"id"`
	ProviderID   int    `json:"provider_id"`
	SedeID       int    `json:"sede_id"`
	DteID        int    `json:"dte_id"`
	UserID       int    `json:"user_id"`
	CategoryID   int    `json:"category_id"`
	BillType     string `json:"bill_type"`
	TotalIva     int    `json:"total_iva"`
	TotalAmount  int    `json:"total_amount"`
	TotalNeto    int    `json:"total_neto"`
	Notes        string `json:"notes"`
	Image        string `json:"image"`
	CreationDate string `json:"creation_date"`
	ContableDate string `json:"contable_date"`
}
