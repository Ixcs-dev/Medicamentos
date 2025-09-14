import { SuppliersList } from "@/components/suppliers/suppliers-list"
import { AddSupplierDialog } from "@/components/suppliers/add-supplier-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { suppliersServerService } from "@/lib/services/suppliers.service"

export default async function SuppliersPage() {
  const suppliers = await suppliersServerService.getAll()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Proveedores</h1>
            <p className="text-muted-foreground mt-2">Administra la información de tus proveedores farmacéuticos</p>
          </div>
          <AddSupplierDialog>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Proveedor
            </Button>
          </AddSupplierDialog>
        </div>

        <SuppliersList suppliers={suppliers || []} />
      </div>
    </div>
  )
}
