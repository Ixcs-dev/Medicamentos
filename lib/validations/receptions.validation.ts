export interface CreateReceptionData {
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
}

export interface UpdateReceptionData extends Partial<CreateReceptionData> {}

export class ReceptionValidation {
  static validateCreate(data: CreateReceptionData): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validar campos requeridos
    if (!data.reception_date) errors.push("Fecha de recepción es requerida")
    if (!data.product_id) errors.push("Producto es requerido")
    if (!data.supplier_id) errors.push("Proveedor es requerido")
    if (!data.invoice_number) errors.push("Número de factura es requerido")
    if (!data.quantity || data.quantity <= 0) errors.push("Cantidad debe ser mayor a 0")
    if (!data.presentation_state) errors.push("Estado de presentación es requerido")

    // Validar fecha de recepción no sea futura
    if (data.reception_date && new Date(data.reception_date) > new Date()) {
      errors.push("La fecha de recepción no puede ser futura")
    }

    // Validar fecha de vencimiento si se proporciona
    if (data.expiration_date && new Date(data.expiration_date) <= new Date()) {
      errors.push("La fecha de vencimiento debe ser futura")
    }

    return { isValid: errors.length === 0, errors }
  }

  static validateUpdate(data: UpdateReceptionData): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validar cantidad si se proporciona
    if (data.quantity !== undefined && data.quantity <= 0) {
      errors.push("Cantidad debe ser mayor a 0")
    }

    // Validar fecha de vencimiento si se proporciona
    if (data.expiration_date && new Date(data.expiration_date) <= new Date()) {
      errors.push("La fecha de vencimiento debe ser futura")
    }

    return { isValid: errors.length === 0, errors }
  }
}
