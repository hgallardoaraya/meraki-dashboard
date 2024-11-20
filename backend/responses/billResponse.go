package responses

type Bill struct {
	ID           int    `json:"id"`
	ProviderName string `json:"provider_name"`
	UserName     string `json:"user_name"`
	UserLastName string `json:"user_last_name"`
	LocaleName   string `json:"locale_name"`
	CategoryName string `json:"category_name"`
	TypeName     string `json:"type_name"`
	CreationDate string `json:"creation_date"`
	ContableDate string `json:"contable_date"`
	TotalNeto    int    `json:"total_neto"`
	TotalIva     int    `json:"total_iva"`
	TotalAmount  int    `json:"total_amount"`
	Notes        string `json:"notes"`
	Image        string `json:"image"`
}
