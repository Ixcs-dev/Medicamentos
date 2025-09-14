import { createClient } from "@/lib/supabase/client"
import { createClient as createServerClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types"

// Client-side service
export class ProductsService {
  private supabase = createClient()

  async getAll(): Promise<Product[]> {
    const { data, error } = await this.supabase.from("products").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async getActive(): Promise<Product[]> {
    const { data, error } = await this.supabase.from("products").select("*").eq("status", "active").order("name")

    if (error) throw error
    return data || []
  }

  async create(productData: Omit<Product, "id" | "created_at" | "updated_at" | "status">): Promise<Product> {
    const { data, error } = await this.supabase
      .from("products")
      .insert([{ ...productData, status: "active" }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    const { data, error } = await this.supabase
      .from("products")
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from("products").delete().eq("id", id)

    if (error) throw error
  }
}

// Server-side service
export class ProductsServerService {
  private async getSupabase() {
    return await createServerClient()
  }

  async getAll(): Promise<Product[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async getActive(): Promise<Product[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase.from("products").select("*").eq("status", "active").order("name")

    if (error) throw error
    return data || []
  }
}

export const productsService = new ProductsService()
export const productsServerService = new ProductsServerService()
