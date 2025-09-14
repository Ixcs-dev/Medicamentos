"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Building2, Package, Package2, Home } from "lucide-react"

const navigation = [
  {
    name: "Inicio",
    href: "/",
    icon: Home,
  },
  {
    name: "Proveedores",
    href: "/suppliers",
    icon: Building2,
  },
  {
    name: "Productos",
    href: "/products",
    icon: Package,
  },
  {
    name: "Recepciones",
    href: "/receptions",
    icon: Package2,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MediInventory</span>
          </Link>

          <div className="flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
