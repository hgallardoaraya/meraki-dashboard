package fudo

import (
	"github.com/gin-gonic/gin"

	"dashboard/fudo/sales"
)

// FudoRouter is the main router for the Fudo API
func FudoRouter(r *gin.RouterGroup) {
	fudoRouter := r.Group("/fudo")
	{
		sales.SaleRouter(fudoRouter)
	}
}