"use client"

import { useState } from "react"
import type { ProductReception, Product, Supplier } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditReceptionDialog } from "./edit-reception-dialog"
import { DeleteReceptionDialog } from "./delete-reception-dialog"
import { Search, Edit, Trash2, Package2, Building2, Calendar, Hash, AlertCircle } from "lucide-react"

interface ReceptionsListProps {
  receptions: ProductReception[]
  products: Product[]
  suppliers: Supplier[]
}

export function ReceptionsList({ receptions, products, suppliers }: ReceptionsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [stateFilter, setStateFilter] = useState<string>("all")

  const filteredReceptions = receptions.filter((reception) => {
    const matchesSearch =
      reception.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reception.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reception.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reception.batch_number?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesState = stateFilter === "all" || reception.presentation_state === stateFilter

    return matchesSearch && matchesState
  })

  const getStateColor = (state: string) => {
    switch (state) {
      case "bueno":
        return "bg-green-100 text-green-800 border-green-200"
      case "regular":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "malo":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStateIcon = (state: string) => {
    switch (state) {
      case "malo":
        return <AlertCircle className="w-3 h-3" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por producto, proveedor, factura o lote..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="bueno">Bueno</SelectItem>
            <SelectItem value="regular">Regular</SelectItem>
            <SelectItem value="malo">Malo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Receptions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReceptions.map((reception) => (
          <Card key={reception.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Package2 className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-lg text-balance">{reception.product?.name}</CardTitle>
                </div>
                <Badge className={`${getStateColor(reception.presentation_state)} flex items-center gap-1`}>
                  {getStateIcon(reception.presentation_state)}
                  {reception.presentation_state.charAt(0).toUpperCase() + reception.presentation_state.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">{reception.supplier?.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Factura: {reception.invoice_number}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium">Cantidad:</span>
                    <span className="text-muted-foreground ml-1">{reception.quantity}</span>
                  </div>
                  {reception.batch_number && (
                    <div>
                      <span className="font-medium">Lote:</span>
                      <span className="text-muted-foreground ml-1 font-mono">{reception.batch_number}</span>
                    </div>
                  )}
                </div>

                {reception.invima_registration && (
                  <div className="text-xs">
                    <span className="font-medium">INVIMA:</span>
                    <span className="text-muted-foreground ml-1 font-mono">{reception.invima_registration}</span>
                  </div>
                )}

                {reception.expiration_date && (
                  <div className="text-xs">
                    <span className="font-medium">Vencimiento:</span>
                    <span className="text-muted-foreground ml-1">
                      {new Date(reception.expiration_date).toLocaleDateString("es-CO")}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Recibido:{" "}
                    {new Date(reception.reception_date).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <EditReceptionDialog reception={reception} products={products} suppliers={suppliers}>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                </EditReceptionDialog>
                <DeleteReceptionDialog reception={reception}>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </DeleteReceptionDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReceptions.length === 0 && (
        <div className="text-center py-12">
          <Package2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No se encontraron recepciones</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || stateFilter !== "all"
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza registrando tu primera recepción"}
          </p>
        </div>
      )}
    </div>
  )
}
