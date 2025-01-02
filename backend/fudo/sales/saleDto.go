package sales

import (
	p "dashboard/fudo/products"
)

type SaleDTO struct {
	ID       int         `json:"id"`
	Total    int         `json:"total"`
	CloseAt  string      `json:"close_at"`
	Products []p.Product `json:"products"`
}
