package helpers

import (
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var JWT_SECRET_KEY = os.Getenv("JWT_SECRET_KEY")

func GetToken(username, role string, exp int) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": username,
		"role":     role,
		"exp":      time.Now().Add(time.Minute * time.Duration(exp)).Unix(), // Token expiration time
	})

	tokenString, err := token.SignedString([]byte(JWT_SECRET_KEY))
	if err != nil {
		return err.Error(), err
	}

	return tokenString, nil
}
