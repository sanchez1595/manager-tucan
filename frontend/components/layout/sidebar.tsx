"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Users, 
  FolderOpen, 
  Settings, 
  BarChart3, 
  Home,
  Search,
  LogOut,
  GalleryVerticalEnd,
  ChevronsUpDown,
  BadgeCheck,
  Bell,
  CreditCard,
  Sparkles
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home
  },
  {
    name: "Clientes",
    href: "/clients",
    icon: Users
  },
  {
    name: "Proyectos",
    href: "/projects",
    icon: FolderOpen
  },
  {
    name: "Reportes",
    href: "/reports",
    icon: BarChart3
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: Settings
  }
]

const userData = {
  name: "Admin Manager",
  email: "admin@tucanmanager.com",
  avatar: "/avatars/admin.jpg",
}

export const Sidebar = () => {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <GalleryVerticalEnd className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-sidebar-foreground">Tucan Manager</div>
                <div className="text-xs text-sidebar-foreground/70">Enterprise</div>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-sidebar-foreground/50" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start" side="right" sideOffset={4}>
            <DropdownMenuLabel className="text-muted-foreground text-xs">Teams</DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md border">
                <GalleryVerticalEnd className="h-3.5 w-3.5" />
              </div>
              Tucan Manager
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md border bg-transparent">
                <span className="text-xs">+</span>
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
          <input
            placeholder="Search..."
            className="w-full bg-sidebar-accent text-sidebar-accent-foreground placeholder:text-sidebar-foreground/50 pl-10 pr-4 py-2 rounded-lg border-0 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/")
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-sidebar-accent rounded-lg p-2 transition-colors">
              <Avatar className="h-8 w-8 bg-[#19C37D]">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="bg-[#19C37D] text-black font-medium text-sm">
                  {userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-sidebar-foreground text-sm flex-1">
                <div className="font-medium">{userData.name}</div>
                <div className="text-sidebar-foreground/70 text-xs">{userData.email}</div>
              </div>
              <ChevronsUpDown className="ml-auto h-4 w-4 text-sidebar-foreground/50" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-lg"
            side="right"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 bg-[#19C37D]">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="bg-[#19C37D] text-black font-medium text-sm">
                    {userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userData.name}</span>
                  <span className="truncate text-xs">{userData.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles className="h-4 w-4" />
                Actualizar a Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className="h-4 w-4" />
                Cuenta
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="h-4 w-4" />
                Facturación
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="h-4 w-4" />
                Notificaciones
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}