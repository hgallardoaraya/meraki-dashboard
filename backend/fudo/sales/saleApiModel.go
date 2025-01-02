package sales

type APIResponseList struct {
	Data []Data `json:"data"`
}

type APIResponse struct {
	Data Data `json:"data"`
}

type Data struct {
	ID            string        `json:"id"`
	Type          string        `json:"type"`
	Attributes    Attributes    `json:"attributes"`
	Relationships Relationships `json:"relationships"`
}

type Attributes struct {
	ClosedAt     *string  `json:"closedAt"`
	Comment      *string `json:"comment"`
	CreatedAt    string  `json:"createdAt"`
	People       int     `json:"people"`
	CustomerName *string `json:"customerName"`
	Total        float64 `json:"total"`
	SaleType     string  `json:"saleType"`
	SaleState    string  `json:"saleState"`
}

type Relationships struct {
	Customer       Entity     `json:"customer"`
	Discounts      EntityList `json:"discounts"`
	Items          EntityList  `json:"items"`
	Payments       EntityList  `json:"payments"`
	Tips           EntityList `json:"tips"`
	ShippingCosts  EntityList `json:"shippingCosts"`
	Table          Entity      `json:"table"`
	Waiter         Entity     `json:"waiter"`
	SaleIdentifier Entity     `json:"saleIdentifier"`
}

type EntityList struct {
	Data []EntityData `json:"data"`
}

type Entity struct {
	Data *EntityData `json:"data"`
}

type EntityData struct {
	ID   string `json:"id"`
	Type string `json:"type"`
}
