"use client"

import { useState } from "react"
import type { Supplier } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditSupplierDialog } from "./edit-supplier-dialog"
import { DeleteSupplierDialog } from "./delete-supplier-dialog"
import { Search, Edit, Trash2, Building2, Phone, Mail, User, Briefcase } from "lucide-react"

interface SuppliersListProps {
  suppliers: Supplier[]
}

export function SuppliersList({ suppliers }: SuppliersListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.id_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por nombre, documento o email..."
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

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg text-balance">{supplier.name}</CardTitle>
                </div>
                <Badge variant={supplier.status === "active" ? "default" : "secondary"}>
                  {supplier.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{supplier.id_type}:</span>
                  <span className="text-muted-foreground">{supplier.id_number}</span>
                </div>

                {supplier.contact_person && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{supplier.contact_person}</span>
                  </div>
                )}

                {supplier.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{supplier.phone}</span>
                  </div>
                )}

                {supplier.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">{supplier.email}</span>
                  </div>
                )}

                {supplier.economic_activity &&
                  (() => {
                    let activities: string[] = []

                    if (typeof supplier.economic_activity === "string") {
                      try {
                        activities = JSON.parse(supplier.economic_activity)
                      } catch {
                        activities = supplier.economic_activity ? [supplier.economic_activity] : []
                      }
                    } else if (Array.isArray(supplier.economic_activity)) {
                      activities = supplier.economic_activity
                    }

                    return activities.length > 0 ? (
                      <div className="flex items-start gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div className="flex flex-wrap gap-1">
                          {activities.map((code) => (
                            <Badge key={code} variant="outline" className="text-xs">
                              {code}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : null
                  })()}
              </div>

              <div className="flex gap-2 pt-2">
                <EditSupplierDialog supplier={supplier}>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                </EditSupplierDialog>
                <DeleteSupplierDialog supplier={supplier}>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </DeleteSupplierDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No se encontraron proveedores</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || statusFilter !== "all"
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza agregando tu primer proveedor"}
          </p>
        </div>
      )}
    </div>
  )
}
