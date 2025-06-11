"use client"

import * as React from "react"
import { Users, Activity, X } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Clientes", 
    url: "/clients",
    icon: Users,
  },
  {
    title: "Reportes",
    url: "/reports", 
    icon: Activity,
  },
]

interface AppSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function AppSidebar({ isOpen = true, onClose }: AppSidebarProps) {
  const pathname = usePathname()
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-44 bg-[#f7f7f7] border-r border-gray-200 flex flex-col h-full transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Mobile header with close button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#4267b2] rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="text-gray-900 font-medium text-sm">Tucan Manager</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 h-8 w-8 text-gray-600 hover:bg-gray-100"
            aria-label="Cerrar menú"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-3 lg:py-3">
          {navigationItems.map((item) => {
            const isActive = pathname === item.url
            return (
              <Link 
                key={item.title}
                href={item.url} 
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 lg:px-4 py-3 lg:py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation",
                  isActive && "bg-gray-200"
                )}
              >
                <item.icon className="h-5 w-5 lg:h-4 lg:w-4 text-gray-600" />
                <span className="font-normal">{item.title}</span>
              </Link>
            )
          })}
        </nav>

        {/* Configuración en la parte inferior */}
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-100 rounded px-2 py-3 lg:py-2 cursor-pointer transition-colors touch-manipulation">
            <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">N</span>
            </div>
            <span className="font-normal">Configuración</span>
          </div>
        </div>
      </aside>
    </>
  )
}