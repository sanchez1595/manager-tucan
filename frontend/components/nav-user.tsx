"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const NavUser = ({
  user,
}: {
  user?: {
    name: string
    email: string
    avatar: string
  }
}) => {
  const { user: authUser, logout } = useAuth()
  
  const currentUser = user || {
    name: authUser?.username || 'Usuario',
    email: authUser?.email || 'email@example.com',
    avatar: ''
  }

  const truncateEmail = (email: string): string => {
    return email.length > 15 ? `${email.substring(0, 15)}...` : email
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-blue-700/20 rounded-lg p-1 transition-colors">
          <Avatar className="h-6 w-6 bg-[#19C37D]">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-[#19C37D] text-black font-medium text-xs">
              {currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-white text-xs">
            <div className="font-medium">{currentUser.name}</div>
            <div className="text-blue-100 text-xs">{truncateEmail(currentUser.email)}</div>
          </div>
          <ChevronsUpDown className="ml-auto h-3 w-3 text-blue-200" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 bg-[#19C37D]">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="bg-[#19C37D] text-black font-medium text-sm">
                {currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{currentUser.name}</span>
              <span className="truncate text-xs">{currentUser.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Mi Perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notificaciones
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
          <LogOut />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}