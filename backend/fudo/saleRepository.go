package fudo

import (
	"encoding/json"
	"fmt"
)

// import (
// 	"encoding/json"
// 	"fmt"
// 	"net/http"
// )

type SaleRepository struct{}

func (s *SaleRepository) FetchAllSales() ([]Sale, error) {
	// TODO: esperar a tener las credenciales de fudo para implementar
	// resp, err := http.Get("https://fudo-api.com/sales")
	// if err != nil {
	// 	return nil, fmt.Errorf("failed to fetch sales: %w", err)
	// }
	// defer resp.Body.Close()

	// if resp.StatusCode != http.StatusOK {
	// 	return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	// }

	// var sales []Sale
	// if err := json.NewDecoder(resp.Body).Decode(&sales); err != nil {
	// 	return nil, fmt.Errorf("failed to decode sales: %w", err)
	// }

	// return sales, nil

	jsonInput := `{
  "data": [
    {
      "id": "0",
      "type": "User",
      "attributes": {
        "closedAt": "2020-05-11T23:15:00.000Z",
        "comment": "This is a comment",
        "createdAt": "2020-05-11T23:15:00.000Z",
        "people": 2,
        "customerName": "Paula",
        "total": 1350.5,
        "saleType": "EAT-IN",
        "saleState": "IN-COURSE"
      },
      "relationships": {
        "customer": {
          "data": {
            "id": "1",
            "type": "Customer"
          }
        },
        "discounts": [
          {
            "data": {
              "id": "1",
              "type": "Discount"
            }
          }
        ],
        "items": [
          {
            "data": {
              "id": "1",
              "type": "Item"
            }
          }
        ],
        "payments": [
          {
            "data": {
              "id": "1",
              "type": "Payment"
            }
          }
        ],
        "tips": [
          {
            "data": {
              "id": "1",
              "type": "Tip"
            }
          }
        ],
        "shippingCosts": [
          {
            "data": {
              "id": "1",
              "type": "ShippingCost"
            }
          }
        ],
        "table": {
          "data": {
            "id": "1",
            "type": "Table"
          }
        },
        "waiter": {
          "data": {
            "id": "1",
            "type": "User"
          }
        },
        "saleIdentifier": {
          "data": {
            "id": "1",
            "type": "SaleIdentifier"
          }
        }
      }
    }
  ]
}`

	var apiResponse APIResponse

	// Deserializa el JSON
	err := json.Unmarshal([]byte(jsonInput), &apiResponse)
	if err != nil {
		fmt.Println("Error unmarshaling JSON:", err)
		return nil, err
	}

	// Mapea los valores relevantes a la estructura Sales
	id := 0
	fmt.Sscanf(apiResponse.Data[0].ID, "%d", &id) // Convierte el ID a entero

	sales := []Sale{}

	for _, data := range apiResponse.Data {
		sale := Sale{
			ID:           id,
			Total:        int(data.Attributes.Total),
			CloseAt:      data.Attributes.ClosedAt,
		}

		sales = append(sales, sale)
	}

	return sales, nil

}
