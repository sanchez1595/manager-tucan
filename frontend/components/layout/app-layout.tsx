"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Header } from "@/components/layout/header"
import { AuthGuard } from "@/components/auth-guard"

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  
  const isLoginPage = pathname === '/login'

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  // For login page, render without sidebar and header
  if (isLoginPage) {
    return (
      <AuthGuard>
        {children}
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header fijo arriba */}
        <Header onMenuClick={handleMenuClick} />
        
        {/* Contenido principal con sidebar */}
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
          <main className="flex-1 bg-gray-50 overflow-auto">
            <div className="p-3 sm:p-4 lg:p-8 max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}