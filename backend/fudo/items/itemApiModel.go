package items

type APIResponse struct {
	Data []Data `json:"data"`
}

type Data struct {
	ID            int           `json:"id"`
	Type          string        `json:"type"`
	Attributes    Attributes    `json:"attributes"`
	Relationships Relationships `json:"relationships"`
}

type Attributes struct {
	Canceled            bool   `json:"canceled"`
	CancellationComment string `json:"cancellationComment"`
	Comment             string `json:"comment"`
	CreatedAt           string `json:"createdAt"`
	Price               int    `json:"price"`
	Quantity            int    `json:"quantity"`
	Status              string `json:"status"`
}

type Relationships struct {
	PriceList Entity   `json:"priceList"`
	Product   Entity   `json:"product"`
	SubItems  []Entity `json:"subItems"`
	Sale      Entity   `json:"sale"`
}

type Entity struct {
	ID   int `json:"id"`
	Type string `json:"type"`
}
