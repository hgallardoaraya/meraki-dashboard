package responses

type SalesSummary struct {
	TotalSales  int `json:"total_sales"`
	TotalAmount int `json:"total_amount"`
}

type Sale struct {
	ID          int    `json:"id"`
	LocaleId    int    `json:"locale_id"`
	LocaleName  string `json:"locale_name"`
	TotalAmount int    `json:"total_amount"`
	Date        string `json:"date"`
	SalesCount  int    `json:"sales_count"`
}
