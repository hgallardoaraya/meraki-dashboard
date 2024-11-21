package models

// Bill struct
type Bill struct {
	ID           int    `json:"id"`
	ProviderID   int    `json:"provider_id"`
	LocaleID     int    `json:"locale_id"`
	DteID        int    `json:"dte_id"`
	UserID       int    `json:"user_id"`
	CategoryID   int    `json:"category_id"`
	TypeID       int    `json:"type_id"`
	TotalIva     int    `json:"total_iva"`
	TotalAmount  int    `json:"total_amount"`
	TotalNeto    int    `json:"total_neto"`
	Notes        string `json:"notes"`
	Image        string `json:"image"`
	CreationDate string `json:"creation_date"`
	ContableDate string `json:"contable_date"`
}
