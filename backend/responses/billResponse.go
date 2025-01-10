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

type BillsSummary struct {
	TotalBills  int `json:"total_bills"`
	TotalAmount int `json:"total_amount"`
}

type DaySummary struct {
	Day         int `json:"day"`
	TotalAmount int `json:"total_amount"`
}

type PeriodSummary struct {
	Month       int `json:"month"`
	Year        int `json:"year"`
	TotalAmount int `json:"total_amount"`
}

type BillProviderResponse struct {
	ProviderId   int    `json:"provider_id"`
	ProviderName string `json:"provider_name"`
	TotalAmount  int    `json:"total_amount"`
}

type BillCategoryResponse struct {
	CategoryId   int    `json:"category_id"`
	CategoryName string `json:"category_name"`
	TotalAmount  int    `json:"total_amount"`
}

type BillsProvidersDaySummary struct {
	Day       int                    `json:"day"`
	Providers []BillProviderResponse `json:"providers"`
}

type BillsCategoriesDaySummary struct {
	Day        int                    `json:"day"`
	Categories []BillCategoryResponse `json:"categories"`
}

type BillsProvidersMonthSummary struct {
	Year      int                    `json:"year"`
	Month     int                    `json:"month"`
	Providers []BillProviderResponse `json:"providers"`
}

type BillsCategoriesMonthSummary struct {
	Year       int                    `json:"year"`
	Month      int                    `json:"month"`
	Categories []BillCategoryResponse `json:"categories"`
}

type Period struct {
	Year  int
	Month int
}
