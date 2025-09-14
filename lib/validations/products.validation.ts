export interface CreateProductData {
  code: string
  name: string
  description?: string
  laboratory?: string
}

export interface UpdateProductData extends Partial<CreateProductData> {
  status?: "active" | "inactive"
}

export class ProductValidation {
  static validateCreate(data: CreateProductData): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validar campos requeridos
    if (!data.code) errors.push("Código del producto es requerido")
    if (!data.name) errors.push("Nombre del producto es requerido")

    // Validar formato del código
    if (data.code && data.code.length < 3) {
      errors.push("El código debe tener al menos 3 caracteres")
    }

    // Validar longitud del nombre
    if (data.name && data.name.length < 2) {
      errors.push("El nombre debe tener al menos 2 caracteres")
    }

    return { isValid: errors.length === 0, errors }
  }

  static validateUpdate(data: UpdateProductData): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validar formato del código si se proporciona
    if (data.code && data.code.length < 3) {
      errors.push("El código debe tener al menos 3 caracteres")
    }

    // Validar longitud del nombre si se proporciona
    if (data.name && data.name.length < 2) {
      errors.push("El nombre debe tener al menos 2 caracteres")
    }

    return { isValid: errors.length === 0, errors }
  }
}
