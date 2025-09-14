"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AddProductDialogProps {
  children: React.ReactNode
}

export function AddProductDialog({ children }: AddProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    laboratory: "",
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("products").insert([formData])

      if (error) throw error

      setOpen(false)
      setFormData({
        code: "",
        name: "",
        description: "",
        laboratory: "",
      })
      router.refresh()
    } catch (error) {
      console.error("Error creating product:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Producto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código del Producto *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ej: MED001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="laboratory">Laboratorio</Label>
              <Input
                id="laboratory"
                value={formData.laboratory}
                onChange={(e) => setFormData({ ...formData, laboratory: e.target.value })}
                placeholder="Ej: Laboratorios ABC"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Producto *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Acetaminofén 500mg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ej: Analgésico y antipirético en tabletas"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Crear Producto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
