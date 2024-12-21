package products

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
	Active           bool   `json:"active"`
	Code             string `json:"code"`
	Description      string `json:"description"`
	EnableOnlineMenu bool   `json:"enableOnlineMenu"`
	EnableQrMenu     bool   `json:"enableQrMenu"`
	Favourite        bool   `json:"favourite"`
	ImageUrl         string `json:"imageUrl"`
	Name             string `json:"name"`
	Position         int    `json:"position"`
	PreparationTime  int    `json:"preparationTime"`
	Price            int    `json:"price"`
	SellAlone        bool   `json:"sellAlone"`
	Stock            int    `json:"stock"`
	StockControl    bool   `json:"stockControl"`
}

type Relationships struct {
	Kitchen               Entity   `json:"kitchen"`
	ProductCategory       Entity   `json:"productCategory"`
	ProductModifierGroups []Entity `json:"productModifierGroups"`
}

type Entity struct {
	ID   int `json:"id"`
	Type string `json:"type"`
}
