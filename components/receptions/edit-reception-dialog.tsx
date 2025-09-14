"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { ProductReception, Product, Supplier } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface EditReceptionDialogProps {
  reception: ProductReception
  products: Product[]
  suppliers: Supplier[]
  children: React.ReactNode
}

export function EditReceptionDialog({ reception, products, suppliers, children }: EditReceptionDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    reception_date: new Date(reception.reception_date).toISOString().slice(0, 16),
    product_id: reception.product_id,
    supplier_id: reception.supplier_id,
    invoice_number: reception.invoice_number,
    quantity: reception.quantity.toString(),
    batch_number: reception.batch_number || "",
    invima_registration: reception.invima_registration || "",
    expiration_date: reception.expiration_date ? reception.expiration_date.split("T")[0] : "",
    presentation_state: reception.presentation_state,
    notes: reception.notes || "",
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("product_receptions")
        .update({
          ...formData,
          quantity: Number.parseInt(formData.quantity),
          expiration_date: formData.expiration_date || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", reception.id)

      if (error) throw error

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating reception:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Recepción</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reception_date">Fecha y Hora de Recepción *</Label>
              <Input
                id="reception_date"
                type="datetime-local"
                value={formData.reception_date}
                onChange={(e) => setFormData({ ...formData, reception_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="presentation_state">Estado de Presentación *</Label>
              <Select
                value={formData.presentation_state}
                onValueChange={(value) => setFormData({ ...formData, presentation_state: value as any })}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bueno">Bueno</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="malo">Malo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product_id">Producto *</Label>
              <Select
                value={formData.product_id}
                onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier_id">Proveedor *</Label>
              <Select
                value={formData.supplier_id}
                onValueChange={(value) => setFormData({ ...formData, supplier_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoice_number">Número de Factura *</Label>
              <Input
                id="invoice_number"
                value={formData.invoice_number}
                onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batch_number">Número de Lote</Label>
              <Input
                id="batch_number"
                value={formData.batch_number}
                onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invima_registration">Registro INVIMA</Label>
              <Input
                id="invima_registration"
                value={formData.invima_registration}
                onChange={(e) => setFormData({ ...formData, invima_registration: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiration_date">Fecha de Vencimiento</Label>
            <Input
              id="expiration_date"
              type="date"
              value={formData.expiration_date}
              onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-purple-600 hover:bg-purple-700">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Actualizar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
