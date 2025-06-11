"use client"

import { Search, Bell, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NavUser } from "@/components/nav-user"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-14 bg-[#4267b2] px-3 sm:px-5 flex items-center justify-between">
      {/* Mobile menu button + Logo */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost" 
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden p-2 h-8 w-8 text-white hover:bg-white/10"
          aria-label="Abrir menú"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
            <span className="text-[#4267b2] font-bold text-xs">T</span>
          </div>
          <span className="text-white font-medium text-sm hidden sm:block">Tucan Manager</span>
        </div>
      </div>

      {/* Search - Hidden on mobile, visible on tablet+ */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Search"
            className="bg-[#345995] border-0 text-white placeholder-white pl-8 rounded-lg h-8 text-sm focus:bg-[#2d4e7a] focus:text-white w-full"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:flex p-2 h-8 w-8 text-white hover:bg-white/10"
          aria-label="Notificaciones"
        >
          <Bell className="h-4 w-4" />
        </Button>
        
        <NavUser user={{
          name: "Admin Manager",
          email: "admin@tucanmanager.com",
          avatar: "/avatars/admin.jpg"
        }} />
      </div>
    </header>
  )
}