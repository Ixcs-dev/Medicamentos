"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Loader2, AlertTriangle } from "lucide-react"

interface DeleteProductDialogProps {
  product: Product
  children: React.ReactNode
}

export function DeleteProductDialog({ product, children }: DeleteProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("products").delete().eq("id", product.id)

      if (error) throw error

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error deleting product:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Eliminar Producto
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar el producto <strong>{product.name}</strong>? Esta acción no se puede
            deshacer y eliminará todos los registros de recepción relacionados.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading} className="flex-1">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
