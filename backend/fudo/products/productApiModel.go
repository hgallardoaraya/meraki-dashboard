package products

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
	Active           bool    `json:"active"`
	Code             string  `json:"code"`
	Description      string  `json:"description"`
	EnableOnlineMenu bool    `json:"enableOnlineMenu"`
	EnableQrMenu     bool    `json:"enableQrMenu"`
	Favourite        bool    `json:"favourite"`
	ImageUrl         string  `json:"imageUrl"`
	Name             string  `json:"name"`
	Position         int     `json:"position"`
	PreparationTime  int     `json:"preparationTime"`
	Price            float64 `json:"price"`
	SellAlone        bool    `json:"sellAlone"`
	Stock            float64 `json:"stock"`
	StockControl     bool    `json:"stockControl"`
}

type Relationships struct {
	Kitchen               Entity     `json:"kitchen"`
	ProductCategory       Entity     `json:"productCategory"`
	ProductModifierGroups EntityList `json:"productModifierGroups"`
}

type EntityList struct {
	Data []EntityData `json:"data"`
}

type Entity struct {
	Data EntityData `json:"data"`
}

type EntityData struct {
	ID   string `json:"id"`
	Type string `json:"type"`
}
