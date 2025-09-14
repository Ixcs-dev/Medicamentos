import { createClient } from "@/lib/supabase/client"
import { createClient as createServerClient } from "@/lib/supabase/server"
import type { Supplier } from "@/lib/types"

// Client-side service
export class SuppliersService {
  private supabase = createClient()

  async getAll(): Promise<Supplier[]> {
    const { data, error } = await this.supabase.from("suppliers").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async create(supplierData: Omit<Supplier, "id" | "created_at" | "updated_at" | "status">): Promise<Supplier> {
    const { data, error } = await this.supabase
      .from("suppliers")
      .insert([{ ...supplierData, status: "active" }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async update(id: string, supplierData: Partial<Supplier>): Promise<Supplier> {
    const { data, error } = await this.supabase
      .from("suppliers")
      .update({ ...supplierData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from("suppliers").delete().eq("id", id)

    if (error) throw error
  }
}

// Server-side service
export class SuppliersServerService {
  private async getSupabase() {
    return await createServerClient()
  }

  async getAll(): Promise<Supplier[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase.from("suppliers").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }
}

export const suppliersService = new SuppliersService()
export const suppliersServerService = new SuppliersServerService()
