package products

import (
	"github.com/gin-gonic/gin"
)

func ProductRouter(r *gin.RouterGroup) {
	productController := new(ProductController)

	productRoutes := r.Group("fudo/products")
	{
		productRoutes.GET("/", productController.GetSales)
		// saleRoutes.GET("/:id", saleController.GetRoleByID)
	}
}