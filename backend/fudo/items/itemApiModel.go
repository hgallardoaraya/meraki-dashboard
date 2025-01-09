package items

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
	Canceled            *bool   `json:"canceled"`
	CancellationComment *string `json:"cancellationComment"`
	Comment             *string `json:"comment"`
	CreatedAt           string  `json:"createdAt"`
	Price               float64 `json:"price"`
	Quantity            float64 `json:"quantity"`
	Status              *string `json:"status"`
}

type Relationships struct {
	PriceList Entity     `json:"priceList"`
	Product   Entity     `json:"product"`
	SubItems  EntityList `json:"subItems"`
	Sale      Entity     `json:"sale"`
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
