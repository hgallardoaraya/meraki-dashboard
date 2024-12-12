package helpers

import (
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
)

func SaveFiles(files []*multipart.FileHeader, saveFunc func(*multipart.FileHeader, string) error) error {
	for _, file := range files {
		DocumentsPath := os.Getenv("DOCUMENTS_PATH")
		if len(DocumentsPath) == 0 {
			return fmt.Errorf("error: documents path not found in environment variables")
		}
		_ = os.MkdirAll(DocumentsPath, os.ModePerm)
		dst := fmt.Sprintf("%s/%s", DocumentsPath, file.Filename)
		if err := saveFunc(file, dst); err != nil {
			return err
		}
	}
	return nil
}

func ExtractFileNameAndExtension(file *multipart.FileHeader) (string, string) {
	// Obtener el nombre del archivo sin la ruta
	fileName := filepath.Base(file.Filename)
	// Obtener la extensión del archivo
	ext := filepath.Ext(file.Filename)

	// Eliminar la extensión del nombre del archivo
	name := fileName[:len(fileName)-len(ext)]

	return name, ext
}
