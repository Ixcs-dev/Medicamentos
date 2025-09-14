"use client"

import { useState } from "react"
import type { Product } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditProductDialog } from "./edit-product-dialog"
import { DeleteProductDialog } from "./delete-product-dialog"
import { Search, Edit, Trash2, Package, Building, Calendar } from "lucide-react"

interface ProductsListProps {
  products: Product[]
}

export function ProductsList({ products }: ProductsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.laboratory?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || product.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por nombre, código o laboratorio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="inactive">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-lg text-balance">{product.name}</CardTitle>
                </div>
                <Badge variant={product.status === "active" ? "default" : "secondary"}>
                  {product.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Código:</span>
                  <span className="text-muted-foreground font-mono">{product.code}</span>
                </div>

                {product.laboratory && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{product.laboratory}</span>
                  </div>
                )}

                {product.description && (
                  <div className="text-muted-foreground text-xs">
                    <p className="line-clamp-2">{product.description}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Registrado: {new Date(product.created_at).toLocaleDateString("es-CO")}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <EditProductDialog product={product}>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                </EditProductDialog>
                <DeleteProductDialog product={product}>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </DeleteProductDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No se encontraron productos</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || statusFilter !== "all"
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza agregando tu primer producto"}
          </p>
        </div>
      )}
    </div>
  )
}
