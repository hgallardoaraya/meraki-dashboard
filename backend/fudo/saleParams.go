package fudo

type SaleParam struct {
	LocaleId    int    `json:"locale_id"`
	TotalAmount int    `json:"total_amount"`
	Date        string `json:"date"`
	SalesCount  int    `json:"sales_count"`
}

type SalesParam struct {
	Sales []SaleParam `json:"sales"` // Corregido: Usar Sales en lugar de sales
}
