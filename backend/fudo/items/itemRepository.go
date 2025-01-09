package items

import (
	h "dashboard/helpers"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
)

type ItemRepository struct{}

func (s *ItemRepository) FetchAllItems() ([]Item, error) {
	var apiResponse APIResponseList
	apiURL := os.Getenv("FUDO_API_URL")
	token, err := h.GetFudoToken()
	if err != nil {
		return nil, fmt.Errorf("failed to get token: %w", err)
	}

	req, err := http.NewRequest("GET", apiURL + "/items", nil)
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

		id, _ := strconv.Atoi(apiResponse.Data[index].ID)

		idP, _ := strconv.Atoi(data.Relationships.Product.Data.ID)

		item := Item{
			ID:        id,
			CreatedAt: data.Attributes.CreatedAt,
			Quantity:  int(data.Attributes.Quantity),
			Product:   idP,
			Price:     int(data.Attributes.Price),
		}

		items = append(items, item)
	}

	return items, nil

}

func (s *ItemRepository) FetchItemsByID(ids []int) ([]Item, error) {
	var apiResponse APIResponse
	var items []Item

	apiURL := os.Getenv("FUDO_API_URL")
	token, err := h.GetFudoToken()
	if err != nil {
		return nil, fmt.Errorf("failed to get token: %w", err)
	}

	for _, id := range ids {
		req, err := http.NewRequest("GET", apiURL+"/items/"+strconv.Itoa(id), nil)
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

		id, _ := strconv.Atoi(apiResponse.Data.ID)
		idP, _ := strconv.Atoi(apiResponse.Data.Relationships.Product.Data.ID)

		item := Item{
			ID:        id,
			CreatedAt: apiResponse.Data.Attributes.CreatedAt,
			Quantity:  int(apiResponse.Data.Attributes.Quantity),
			Product:   idP,
			Price:     int(apiResponse.Data.Attributes.Price),
		}

		items = append(items, item)
	}

	return items, nil
}
