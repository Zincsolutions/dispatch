"use client"

import { signout } from "@/lib/actions/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MobileNav } from "./mobile-nav"
import { ChevronDown, LogOut, User } from "lucide-react"
import Link from "next/link"

interface TopbarProps {
  orgName: string
  userName: string
  userEmail: string
  avatarUrl?: string | null
}

export function Topbar({ orgName, userName, userEmail, avatarUrl }: TopbarProps) {
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : userEmail[0].toUpperCase()

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4">
      <MobileNav orgName={orgName} />
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <Link
          href="/settings"
          aria-label="Settings"
          className="relative h-8 w-8 rounded-full cursor-pointer"
        >
          <Avatar className="h-8 w-8">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={userName || "Profile photo"} />}
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Account menu"
            className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground"
          >
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{userName || "User"}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/settings" className="flex items-center cursor-pointer w-full">
                <User className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signout()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
