"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

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
  user: {
    name: string
    email: string
    avatar: string
  }
}) => {
  const truncateEmail = (email: string): string => {
    return email.length > 15 ? `${email.substring(0, 15)}...` : email
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-blue-700/20 rounded-lg p-1 transition-colors">
          <Avatar className="h-6 w-6 bg-[#19C37D]">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-[#19C37D] text-black font-medium text-xs">
              {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-white text-xs">
            <div className="font-medium">{user.name}</div>
            <div className="text-blue-100 text-xs">{truncateEmail(user.email)}</div>
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
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-[#19C37D] text-black font-medium text-sm">
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}