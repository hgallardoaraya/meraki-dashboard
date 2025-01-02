package products

import (
	"github.com/gin-gonic/gin"
)

func ProductRouter(r *gin.RouterGroup) {
	productController := new(ProductController)

	productRoutes := r.Group("/products")
	{
		productRoutes.GET("/", productController.GetProducts)
		// saleRoutes.GET("/:id", saleController.GetRoleByID)
	}
}