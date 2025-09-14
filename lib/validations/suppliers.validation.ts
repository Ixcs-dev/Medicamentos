export interface CreateSupplierData {
  id_type: "CC" | "NIT" | "CE" | "PP"
  id_number: string
  name: string
  address?: string
  phone?: string
  email?: string
  contact_person?: string
  economic_activity?: string[]
}

export interface UpdateSupplierData extends Partial<CreateSupplierData> {
  status?: "active" | "inactive"
}

export class SupplierValidation {
  static validateCreate(data: CreateSupplierData): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validar campos requeridos
    if (!data.id_type) errors.push("Tipo de documento es requerido")
    if (!data.id_number) errors.push("Número de documento es requerido")
    if (!data.name) errors.push("Nombre del proveedor es requerido")

    // Validar formato de email si se proporciona
    if (data.email && !this.isValidEmail(data.email)) {
      errors.push("Formato de email inválido")
    }

    // Validar códigos de actividad económica
    if (data.economic_activity) {
      for (const code of data.economic_activity) {
        if (!/^\d{4}$/.test(code)) {
          errors.push(`Código de actividad económica inválido: ${code}`)
        }
      }
    }

    // Validar número de documento según tipo
    if (data.id_type === "NIT" && !this.isValidNIT(data.id_number)) {
      errors.push("Formato de NIT inválido")
    }

    return { isValid: errors.length === 0, errors }
  }

  static validateUpdate(data: UpdateSupplierData): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validar email si se proporciona
    if (data.email && !this.isValidEmail(data.email)) {
      errors.push("Formato de email inválido")
    }

    // Validar códigos de actividad económica
    if (data.economic_activity) {
      for (const code of data.economic_activity) {
        if (!/^\d{4}$/.test(code)) {
          errors.push(`Código de actividad económica inválido: ${code}`)
        }
      }
    }

    return { isValid: errors.length === 0, errors }
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private static isValidNIT(nit: string): boolean {
    // Validación básica de NIT colombiano
    const nitRegex = /^\d{9}-\d{1}$/
    return nitRegex.test(nit)
  }
}
