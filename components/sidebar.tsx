"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Calendar, DollarSign, CreditCard, Settings, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from 'lucide-react'

const navigationItems = [
  {
    name: "Overview",
    href: "/",
    icon: TrendingUp,
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: Calendar,
  },
  {
    name: "Financial",
    href: "/financial",
    icon: DollarSign,
  },
  {
    name: "Support Payments",
    href: "/support",
    icon: CreditCard,
  },
  {
    name: "Categories",
    href: "/categories",
    icon: Settings,
  },
]

function NavigationItems({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link key={item.name} href={item.href} onClick={onItemClick}>
            <Button
              variant="ghost"
              className={`w-full justify-start transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl" 
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 border-r border-white/20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-screen shadow-2xl">
        <div className="p-4 lg:p-6 border-b border-slate-700/50">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-white">Startup Hub</h2>
              <p className="text-xs lg:text-sm text-slate-400">Management Dashboard</p>
            </div>
          </Link>
        </div>
        
        <div className="px-4 py-6">
          <NavigationItems />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden fixed top-4 left-4 z-50 hover:bg-slate-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700">
          <div className="p-6 border-b border-slate-700/50">
            <Link href="/" className="flex items-center space-x-3" onClick={() => setSidebarOpen(false)}>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Startup Hub</h2>
                <p className="text-sm text-slate-400">Management Dashboard</p>
              </div>
            </Link>
          </div>
          <div className="px-4 py-6">
            <NavigationItems onItemClick={() => setSidebarOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
