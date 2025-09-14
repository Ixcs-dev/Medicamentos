"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { suppliersService } from "@/lib/services/suppliers.service"
import {
  SupplierValidation,
  type CreateSupplierData,
  type UpdateSupplierData,
} from "@/lib/validations/suppliers.validation"
import type { Supplier } from "@/lib/types"

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const loadSuppliers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await suppliersService.getAll()
      setSuppliers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando proveedores")
    } finally {
      setLoading(false)
    }
  }

  const createSupplier = async (supplierData: CreateSupplierData) => {
    const validation = SupplierValidation.validateCreate(supplierData)
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "))
    }

    setLoading(true)
    setError(null)
    try {
      const newSupplier = await suppliersService.create(supplierData)
      setSuppliers((prev) => [newSupplier, ...prev])
      router.refresh()
      return newSupplier
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error creando proveedor"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateSupplier = async (id: string, supplierData: UpdateSupplierData) => {
    const validation = SupplierValidation.validateUpdate(supplierData)
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "))
    }

    setLoading(true)
    setError(null)
    try {
      const updatedSupplier = await suppliersService.update(id, supplierData)
      setSuppliers((prev) => prev.map((s) => (s.id === id ? updatedSupplier : s)))
      router.refresh()
      return updatedSupplier
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error actualizando proveedor"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const deleteSupplier = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await suppliersService.delete(id)
      setSuppliers((prev) => prev.filter((s) => s.id !== id))
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error eliminando proveedor"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSuppliers()
  }, [])

  return {
    suppliers,
    loading,
    error,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refetch: loadSuppliers,
  }
}
