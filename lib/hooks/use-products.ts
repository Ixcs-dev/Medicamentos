"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { productsService } from "@/lib/services/products.service"
import {
  ProductValidation,
  type CreateProductData,
  type UpdateProductData,
} from "@/lib/validations/products.validation"
import type { Product } from "@/lib/types"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await productsService.getAll()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando productos")
    } finally {
      setLoading(false)
    }
  }

  const createProduct = async (productData: CreateProductData) => {
    const validation = ProductValidation.validateCreate(productData)
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "))
    }

    setLoading(true)
    setError(null)
    try {
      const newProduct = await productsService.create(productData)
      setProducts((prev) => [newProduct, ...prev])
      router.refresh()
      return newProduct
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error creando producto"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (id: string, productData: UpdateProductData) => {
    const validation = ProductValidation.validateUpdate(productData)
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "))
    }

    setLoading(true)
    setError(null)
    try {
      const updatedProduct = await productsService.update(id, productData)
      setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)))
      router.refresh()
      return updatedProduct
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error actualizando producto"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await productsService.delete(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error eliminando producto"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: loadProducts,
  }
}
