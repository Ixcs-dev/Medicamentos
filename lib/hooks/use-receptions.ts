"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { receptionsService } from "@/lib/services/receptions.service"
import {
  ReceptionValidation,
  type CreateReceptionData,
  type UpdateReceptionData,
} from "@/lib/validations/receptions.validation"
import type { ProductReception } from "@/lib/types"

export function useReceptions() {
  const [receptions, setReceptions] = useState<ProductReception[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const loadReceptions = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await receptionsService.getAll()
      setReceptions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando recepciones")
    } finally {
      setLoading(false)
    }
  }

  const createReception = async (receptionData: CreateReceptionData) => {
    const validation = ReceptionValidation.validateCreate(receptionData)
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "))
    }

    setLoading(true)
    setError(null)
    try {
      const newReception = await receptionsService.create(receptionData)
      setReceptions((prev) => [newReception, ...prev])
      router.refresh()
      return newReception
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error creando recepción"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateReception = async (id: string, receptionData: UpdateReceptionData) => {
    const validation = ReceptionValidation.validateUpdate(receptionData)
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "))
    }

    setLoading(true)
    setError(null)
    try {
      const updatedReception = await receptionsService.update(id, receptionData)
      setReceptions((prev) => prev.map((r) => (r.id === id ? updatedReception : r)))
      router.refresh()
      return updatedReception
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error actualizando recepción"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const deleteReception = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await receptionsService.delete(id)
      setReceptions((prev) => prev.filter((r) => r.id !== id))
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error eliminando recepción"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReceptions()
  }, [])

  return {
    receptions,
    loading,
    error,
    createReception,
    updateReception,
    deleteReception,
    refetch: loadReceptions,
  }
}
