package fudo

import (
	"dashboard/fudo/sales"

	"github.com/gin-gonic/gin"
)

// FudoRouter is the main router for the Fudo API
func FudoRouter(r *gin.RouterGroup) {
	fudoRouter := r.Group("/fudo")
	{
		sales.SaleRouter(fudoRouter)
	}
}
