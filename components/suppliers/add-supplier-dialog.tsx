"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Loader2, Plus, X } from "lucide-react"

interface AddSupplierDialogProps {
  children: React.ReactNode
}

export function AddSupplierDialog({ children }: AddSupplierDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    id_type: "",
    id_number: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    contact_person: "",
    economic_activity: [] as string[],
  })
  const [newActivityCode, setNewActivityCode] = useState("")
  const router = useRouter()

  const addEconomicActivity = () => {
    if (newActivityCode.length === 4 && /^\d{4}$/.test(newActivityCode)) {
      if (!formData.economic_activity.includes(newActivityCode)) {
        setFormData({
          ...formData,
          economic_activity: [...formData.economic_activity, newActivityCode],
        })
      }
      setNewActivityCode("")
    }
  }

  const removeEconomicActivity = (codeToRemove: string) => {
    setFormData({
      ...formData,
      economic_activity: formData.economic_activity.filter((code) => code !== codeToRemove),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const dataToInsert = {
        ...formData,
        economic_activity: formData.economic_activity,
      }

      const { error } = await supabase.from("suppliers").insert([dataToInsert])

      if (error) throw error

      setOpen(false)
      setFormData({
        id_type: "",
        id_number: "",
        name: "",
        address: "",
        phone: "",
        email: "",
        contact_person: "",
        economic_activity: [],
      })
      setNewActivityCode("")
      router.refresh()
    } catch (error) {
      console.error("Error creating supplier:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id_type">Tipo de Documento *</Label>
              <Select
                value={formData.id_type}
                onValueChange={(value) => setFormData({ ...formData, id_type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                  <SelectItem value="NIT">NIT</SelectItem>
                  <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                  <SelectItem value="PP">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_number">Número de Documento *</Label>
              <Input
                id="id_number"
                value={formData.id_number}
                onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                placeholder="Ej: 900123456-1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Proveedor *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Laboratorios Farmacéuticos ABC S.A.S."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Ej: Calle 123 #45-67, Bogotá"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Ej: +57 1 234-5678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ej: contacto@proveedor.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_person">Persona de Contacto</Label>
            <Input
              id="contact_person"
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              placeholder="Ej: María González"
            />
          </div>

          <div className="space-y-2">
            <Label>Actividad Económica (Códigos de 4 dígitos)</Label>
            <div className="flex gap-2">
              <Input
                value={newActivityCode}
                onChange={(e) => setNewActivityCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="Ej: 2100"
                maxLength={4}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addEconomicActivity}
                disabled={newActivityCode.length !== 4 || !/^\d{4}$/.test(newActivityCode)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Display added economic activity codes */}
            {formData.economic_activity.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.economic_activity.map((code) => (
                  <div
                    key={code}
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                  >
                    <span>{code}</span>
                    <button
                      type="button"
                      onClick={() => removeEconomicActivity(code)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500">
              Ingrese códigos de actividad económica de 4 dígitos (Ej: 2100 para fabricación de productos farmacéuticos)
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Crear Proveedor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
