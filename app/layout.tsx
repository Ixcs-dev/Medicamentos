import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { MainNav } from "@/components/navigation/main-nav"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "MediInventory - Sistema de Gestión Farmacéutica",
  description: "Sistema integral para la gestión de inventario farmacéutico",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <MainNav />
        </Suspense>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
