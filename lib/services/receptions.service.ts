import { createClient } from "@/lib/supabase/client"
import { createClient as createServerClient } from "@/lib/supabase/server"
import type { ProductReception } from "@/lib/types"

export class ReceptionsService {
  private supabase = createClient()

  async getAll(): Promise<ProductReception[]> {
    const { data, error } = await this.supabase
      .from("product_receptions")
      .select(`
        *,
        product:products(*),
        supplier:suppliers(*)
      `)
      .order("reception_date", { ascending: false })

    if (error) throw error
    return data || []
  }

  async create(receptionData: Omit<ProductReception, "id" | "created_at" | "updated_at">): Promise<ProductReception> {
    const { data, error } = await this.supabase
      .from("product_receptions")
      .insert([receptionData])
      .select(`
        *,
        product:products(*),
        supplier:suppliers(*)
      `)
      .single()

    if (error) throw error
    return data
  }

  async update(id: string, receptionData: Partial<ProductReception>): Promise<ProductReception> {
    const { data, error } = await this.supabase
      .from("product_receptions")
      .update({ ...receptionData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select(`
        *,
        product:products(*),
        supplier:suppliers(*)
      `)
      .single()

    if (error) throw error
    return data
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from("product_receptions").delete().eq("id", id)

    if (error) throw error
  }
}

export class ReceptionsServerService {
  private async getSupabase() {
    return await createServerClient()
  }

  async getAll(): Promise<ProductReception[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from("product_receptions")
      .select(`
        *,
        product:products(*),
        supplier:suppliers(*)
      `)
      .order("reception_date", { ascending: false })

    if (error) throw error
    return data || []
  }
}

export const receptionsService = new ReceptionsService()
export const receptionsServerService = new ReceptionsServerService()
