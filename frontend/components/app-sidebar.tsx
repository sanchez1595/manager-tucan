"use client"

import * as React from "react"
import {
  Users,
  Settings2,
  BarChart3,
  DollarSign,
  Command,
  GalleryVerticalEnd,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Admin Manager",
    email: "admin@tucanmanager.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Tucan Manager",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Clientes",
      url: "/clients",
      icon: Users,
    },
    {
      title: "Reportes", 
      url: "/reports",
      icon: BarChart3,
    },
    {
      title: "Facturación",
      url: "/billing",
      icon: DollarSign,
    },
  ],
  navSettings: [
    {
      title: "Configuración",
      url: "/settings",
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavMain items={data.navSettings} />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
