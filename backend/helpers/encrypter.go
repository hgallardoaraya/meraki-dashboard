package helpers

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"io"
	"os"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func VerifyPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// Encriptar una contraseña
func EncryptPassword(password string) (string, error) {
	secretKey := []byte(os.Getenv("SECRET_KEY"))
	block, err := aes.NewCipher(secretKey)
	if err != nil {
		return "", err
	}

	// Crear un vector de inicialización (IV)
	ciphertext := make([]byte, aes.BlockSize+len(password))
	iv := ciphertext[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", err
	}

	// Encriptar la contraseña
	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(ciphertext[aes.BlockSize:], []byte(password))

	// Retornar el resultado como un string en hexadecimal
	return hex.EncodeToString(ciphertext), nil
}

// Desencriptar una contraseña
func DecryptPassword(encryptedPassword string) (string, error) {
	secretKey := []byte(os.Getenv("SECRET_KEY"))
	block, err := aes.NewCipher(secretKey)
	if err != nil {
		return "", err
	}

	// Convertir el string en hexadecimal a bytes
	ciphertext, err := hex.DecodeString(encryptedPassword)
	if err != nil {
		return "", err
	}

	// Separar el IV del texto encriptado
	if len(ciphertext) < aes.BlockSize {
		return "", fmt.Errorf("texto cifrado demasiado corto")
	}
	iv := ciphertext[:aes.BlockSize]
	ciphertext = ciphertext[aes.BlockSize:]

	// Desencriptar la contraseña
	stream := cipher.NewCFBDecrypter(block, iv)
	stream.XORKeyStream(ciphertext, ciphertext)

	return string(ciphertext), nil
}
