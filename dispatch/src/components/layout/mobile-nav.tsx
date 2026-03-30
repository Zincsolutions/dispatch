"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import {
  LayoutDashboard,
  MessageSquareText,
  FileText,
  Bot,
  Workflow,
  Settings,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Prompts", href: "/prompts", icon: MessageSquareText },
  { label: "Context", href: "/context", icon: FileText },
  { label: "Agents", href: "/agents", icon: Bot },
  { label: "Workflows", href: "/workflows", icon: Workflow },
  { label: "Settings", href: "/settings", icon: Settings },
]

interface MobileNavProps {
  orgName: string
}

export function MobileNav({ orgName }: MobileNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-accent"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-14 items-center border-b px-4">
          <img src="/dispatch-logo.svg" alt="Dispatch" className="h-7 w-auto" />
        </div>
        <div className="px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {orgName}
          </p>
        </div>
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
