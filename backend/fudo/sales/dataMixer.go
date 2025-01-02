package sales

import (
	i "dashboard/fudo/items"
	p "dashboard/fudo/products"
)

func mixer(sales []Sale, items []i.Item, products []p.Product) []SaleDTO {
	var salesDTO []SaleDTO

	for _, sale := range sales {
		saleDTO := SaleDTO{
			ID:      sale.ID,
			Total:   sale.Total,
			CloseAt: sale.CloseAt,
		}

		for _, itemID := range sale.Items {

			idP := items[itemID].Product
			product := products[idP]
			product.Price = items[itemID].Price

			saleDTO.Products = append(saleDTO.Products, product)
		}

		salesDTO = append(salesDTO, saleDTO)

	}
	return salesDTO
}