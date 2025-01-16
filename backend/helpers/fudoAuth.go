package helpers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)

type RequestBody struct {
	ApiKey    string `json:"apiKey"`
	ApiSecret string `json:"apiSecret"`
}

type FudoAuthResponse struct {
	Token string `json:"token"`
	Exp   int    `json:"exp"`
}

var FUDO_API_KEY = os.Getenv("FUDO_API_KEY")
var FUDO_API_SECRET = os.Getenv("FUDO_API_SECRET")
var FUDO_AUTH_URL = os.Getenv("FUDO_AUTH_URL")

func GetFudoToken() (string, error) {
	token := os.Getenv("FUDO_TOKEN")

	if token != "" {
		return token, nil
	}

	apiURL := FUDO_AUTH_URL

	requestBody := RequestBody{
		ApiKey:    FUDO_API_KEY,
		ApiSecret: FUDO_API_SECRET,
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		log.Printf("Error with the JSON parse: %v", err)
		return "Error with the JSON parse", err
	}

	resp, err := http.Post(apiURL, "application/json", bytes.NewBuffer(jsonBody))
	if err != nil {
		log.Printf("The request could not be made: %v", err)
		return "The request could not be made", err
	}
	defer resp.Body.Close()

	var fudoAuthResponse FudoAuthResponse
	if err := json.NewDecoder(resp.Body).Decode(&fudoAuthResponse); err != nil {
		fmt.Printf("error decoding the response: %v", err)
	}

	os.Setenv("FUDO_TOKEN", fudoAuthResponse.Token)

	return fudoAuthResponse.Token, nil
}
