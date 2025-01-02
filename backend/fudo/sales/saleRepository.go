package sales

import (
	h "dashboard/helpers"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
)

// TODO: Por implementar la estructura para query
type SellRequest struct {
	CreatedAt string `json:"createdAt"` //Pattern: ^gte.\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z)? gte.2020-05-11T23:15:00Z
	SaleType  string `json:"saleType"`  //Allowed: eq.EAT-IN┃eq.TAKEAWAY
	SaleState string `json:"saleState"` //Pattern: ^in\.\(((PENDING|CANCELED|CLOSED|IN-COURSE|PAYMENT-PROCESS)(,(?!$))?)+\)$
	All       string `json:"@all"`      //Pattern: fts\..{2,255} fts.abcdefghijklmnopqrstuvwxyz
	Number    string `json:"number"`    //Pattern: ^\d+$ (any number)
	Size      string `json:"size"`      //Pattern: ^\d+$ (any number)
	Sort      string `json:"sort"`      //Pattern: ^((-?id|-?createdAt|-?closedAt)(,(?!$))?)+$
	Include   string `json:"include"`   //Pattern: ^((commercialDocuments|customer|discounts|items.product|items.product.productCategory
	//|items|items.subitems.product|items.subitems.product.productCategory|items.subitems|payments.paymentMethod|payments|tips|shippingCosts|table.room|table|waiter|saleIdentifier|)(,(?!$))?)+$
}

type SaleRepository struct{}

func (s *SaleRepository) FetchAllSales() ([]Sale, error) {
	var apiResponse APIResponseList
	apiURL := os.Getenv("FUDO_API_URL") + "/sales"
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
		return nil, fmt.Errorf("failed to decode product: %w", err)
	}

	sales := []Sale{}

	for index, data := range apiResponse.Data {
		id, _ := strconv.Atoi(apiResponse.Data[index].ID)
		items := []int{}

		for _, item := range data.Relationships.Items.Data {
			idI, _ := strconv.Atoi(item.ID)
			items = append(items, idI)
		}

		sale := Sale{
			ID:      id,
			Total:   int(data.Attributes.Total),
			CloseAt: *data.Attributes.ClosedAt,
			Items:   items,
		}

		sales = append(sales, sale)
	}

	return sales, nil

}
