import { ProductsList } from "@/components/products/products-list"
import { AddProductDialog } from "@/components/products/add-product-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { productsServerService } from "@/lib/services/products.service"

export default async function ProductsPage() {
  const products = await productsServerService.getAll()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Productos</h1>
            <p className="text-muted-foreground mt-2">Administra el catálogo de productos farmacéuticos</p>
          </div>
          <AddProductDialog>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          </AddProductDialog>
        </div>

        <ProductsList products={products || []} />
      </div>
    </div>
  )
}
