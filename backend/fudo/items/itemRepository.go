package items

import (
	h "dashboard/helpers"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)

type ItemRepository struct{}

func (s *ItemRepository) FetchAllProducts() ([]Item, error) {
	var apiResponse APIResponse
	apiURL := os.Getenv("FUDO_API_URL")
	token, err := h.GetFudoToken()
	if err != nil {
		return nil, fmt.Errorf("failed to get token: %w", err)
	}

	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("The request could not be made: %v", err)
		return nil, fmt.Errorf("failed to make request: %w", err)
	}

	defer resp.Body.Close()

	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return nil, fmt.Errorf("failed to decode sales: %w", err)
	}

	items := []Item{}

	for index, data := range apiResponse.Data {

		item := Item{
			ID:        apiResponse.Data[index].ID,
			CreatedAt: data.Attributes.CreatedAt,
			Quantity:  data.Attributes.Quantity,
			Status:    data.Attributes.Status,
			Product:   data.Relationships.Product.ID,
		}

		items = append(items, item)
	}

	return items, nil

}
