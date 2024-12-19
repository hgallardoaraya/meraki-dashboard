package fudo

type Sale struct {
	ID           int    `json:"id"`
	Total        int    `json:"total"`
	CloseAt      string `json:"close_at"`
}
