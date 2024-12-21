package items

type Item struct {
	ID        int    `json:"id"`
	CreatedAt string `json:"createdAt"`
	Quantity  int    `json:"quantity"`
	Status    string `json:"status"`
	Product   int  `json:"product"`
}
