export interface Supplier {
  id: string
  id_type: "CC" | "NIT" | "CE" | "PP"
  id_number: string
  name: string
  address?: string
  phone?: string
  email?: string
  contact_person?: string
  economic_activity?: string[]
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  code: string
  name: string
  description?: string
  laboratory?: string
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export interface ProductReception {
  id: string
  reception_date: string
  product_id: string
  supplier_id: string
  invoice_number: string
  quantity: number
  batch_number?: string
  invima_registration?: string
  expiration_date?: string
  presentation_state: "bueno" | "regular" | "malo"
  notes?: string
  created_at: string
  updated_at: string
  // Relations
  product?: Product
  supplier?: Supplier
}
