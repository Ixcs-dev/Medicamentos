import { ReceptionsList } from "@/components/receptions/receptions-list"
import { AddReceptionDialog } from "@/components/receptions/add-reception-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { receptionsServerService } from "@/lib/services/receptions.service"
import { productsServerService } from "@/lib/services/products.service"
import { suppliersServerService } from "@/lib/services/suppliers.service"

export default async function ReceptionsPage() {
  const receptions = await receptionsServerService.getAll()
  const products = await productsServerService.getActive()
  const suppliers = await suppliersServerService.getAll()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Recepción de Productos</h1>
            <p className="text-muted-foreground mt-2">Registra y gestiona las recepciones de productos farmacéuticos</p>
          </div>
          <AddReceptionDialog products={products || []} suppliers={suppliers || []}>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Recepción
            </Button>
          </AddReceptionDialog>
        </div>

        <ReceptionsList receptions={receptions || []} products={products || []} suppliers={suppliers || []} />
      </div>
    </div>
  )
}
