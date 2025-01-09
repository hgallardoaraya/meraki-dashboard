package items

type Item struct {
	ID        int     `json:"id"`
	CreatedAt string  `json:"createdAt"`
	Quantity  int     `json:"quantity"`
	Product   int     `json:"product"`
	Price     int `json:"price"`
}
