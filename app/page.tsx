import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Package, Package2, BarChart3, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">
            Gestión Integral de Inventario Farmacéutico
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
            Administra proveedores, productos y recepciones de manera eficiente y segura, cumpliendo con los estándares
            de la industria farmacéutica.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Gestión de Proveedores</CardTitle>
              <CardDescription>
                Administra la información completa de tus proveedores farmacéuticos, incluyendo datos de contacto y
                actividad económica.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/suppliers">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Gestionar Proveedores
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Catálogo de Productos</CardTitle>
              <CardDescription>
                Mantén un registro detallado de todos los productos farmacéuticos, incluyendo códigos, descripciones y
                laboratorios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/products">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Gestionar Productos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package2 className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Recepción de Productos</CardTitle>
              <CardDescription>
                Registra y controla las recepciones de productos, incluyendo lotes, fechas de vencimiento y registros
                INVIMA.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/receptions">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Gestionar Recepciones
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

    </div>
  )
}
