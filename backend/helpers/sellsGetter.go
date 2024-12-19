package helpers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

type SellsRequest struct {
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

type FudoResponse struct {
	Data string `json:"data"`
}

func handleFudoResponse(resp *http.Response) (map[string]interface{}, error) {
	defer resp.Body.Close()

	// Verificar el estado HTTP
	if resp.StatusCode != http.StatusOK {
		// Leer el cuerpo de la respuesta para diagnóstico
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("unexpected status code %d: %s", resp.StatusCode, string(body))
	}

	// Decodificar la respuesta JSON
	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("error decoding the response: %v", err)
	}

	return result, nil
}

var FUDO_API_URL = os.Getenv("FUDO_API_URL")

func GetSells() (string, error) {
	token, err := GetFudoToken()
	if err != nil {
		log.Printf("Token could not been get: %v", err)
		return "Token could not been get", err
	}

	//example
	requestBody := SellsRequest{
		Authorization: "Bearer " + token,
		CreatedAt:     "gte.2020-05-11T10:15:00Z",
		SaleType:      "eq.TAKEAWAY",
		SaleState:     "in.(PENDING)",
		All:           "fts.  ",
		Number:        "2",
		Size:          "250",
		Sort:          "id",
		Include:       "items",
	}

	apiURL := FUDO_API_URL + "/sales?filter[createdAt]=" + requestBody.CreatedAt + "&filter[saleType]=" + requestBody.SaleType + "&filter[saleState]=" + requestBody.SaleState + "&filter[@all]=" + requestBody.All + "&page[size]=" + requestBody.Size + "&page[number]=" + requestBody.Number + "&sort=" + requestBody.Sort + "&include=" + requestBody.Include

	fmt.Println(apiURL + "\n")
	fmt.Println(requestBody.Authorization)

	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		log.Printf("The request could not be made: %v", err)
		return "The request could not be made", err
	}

	req.Header.Set("Authorization", requestBody.Authorization)

	log.Printf("Headers: %v", req.Header)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error sending the request: %v", err)
		return "Error sending the request", err
	}

	defer resp.Body.Close()

	result, err := handleFudoResponse(resp)
	if err != nil {
		log.Fatalf("Error handling response: %v", err)
	}

	// Imprimir el JSON genérico
	fmt.Printf("Response JSON: %+v\n", result)

	return "done", nil
}
