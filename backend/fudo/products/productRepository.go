package products

import (
	h "dashboard/helpers"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
)

type ProductRequest struct {
	Authorization string `json:"Authorization"`
	CreatedAt     string `json:"createdAt"` //Pattern: ^gte.\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z)? gte.2020-05-11T23:15:00Z
	SaleType      string `json:"saleType"`  //Allowed: eq.EAT-IN┃eq.TAKEAWAY
	SaleState     string `json:"saleState"` //Pattern: ^in\.\(((PENDING|CANCELED|CLOSED|IN-COURSE|PAYMENT-PROCESS)(,(?!$))?)+\)$
	All           string `json:"@all"`      //Pattern: fts\..{2,255} fts.abcdefghijklmnopqrstuvwxyz
	Number        string `json:"number"`    //Pattern: ^\d+$ (any number)
	Size          string `json:"size"`      //Pattern: ^\d+$ (any number)
	Sort          string `json:"sort"`      //Pattern: ^((-?id|-?createdAt|-?closedAt)(,(?!$))?)+$
	Include       string `json:"include"`   //Pattern: ^((commercialDocuments|customer|discounts|items.product|items.product.productCategory
	//|items|items.subitems.product|items.subitems.product.productCategory|items.subitems|payments.paymentMethod|payments|tips|shippingCosts|table.room|table|waiter|saleIdentifier|)(,(?!$))?)+$
}

type ProductRepository struct{}

func (s *ProductRepository) FetchAllProducts() ([]Product, error) {
	var apiResponse APIResponseList
	apiURL := os.Getenv("FUDO_API_URL")
	token, err := h.GetFudoToken()
	if err != nil {
		return nil, fmt.Errorf("failed to get token: %w", err)
	}

	req, err := http.NewRequest("GET", apiURL+ "/products", nil)
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

	products := []Product{}

	

	for index, data := range apiResponse.Data {
		id, _ := strconv.Atoi(apiResponse.Data[index].ID)

		product := Product{
			ID:    id,
			Name:  data.Attributes.Name,
			Price: int(data.Attributes.Price),
		}

		products = append(products, product)
	}

	return products, nil

}

func (s *ProductRepository) FetchProductByID(id int) (Product, error) {
	var apiResponse APIResponse
	apiURL := os.Getenv("FUDO_API_URL")
	token, err := h.GetFudoToken()
	if err != nil {
		return Product{}, fmt.Errorf("failed to get token: %w", err)
	}

	req, err := http.NewRequest("GET", apiURL +"/products/"+ strconv.Itoa(id), nil)
	if err != nil {
		return Product{}, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("The request could not be made: %v", err)
		return Product{}, fmt.Errorf("failed to make request: %w", err)
	}

	defer resp.Body.Close()

	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return Product{}, fmt.Errorf("failed to decode product: %w", err)
	}

	id, _= strconv.Atoi(apiResponse.Data.ID)

	product := Product{
		ID:    id,
		Name:  apiResponse.Data.Attributes.Name,
		Price: int(apiResponse.Data.Attributes.Price),
	}

	return product, nil
}
