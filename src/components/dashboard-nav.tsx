"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  Settings, 
  LogOut,
  User,
  Home,
  Menu,
  X
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

interface DashboardNavProps {
  user: {
    name: string
    email: string
    role: string
    plan: string
  }
  dashboardType: 'trader' | 'investor' | 'admin'
}

export function DashboardNav({ user, dashboardType }: DashboardNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getDashboardTitle = () => {
    switch (dashboardType) {
      case 'trader':
        return 'Trader Dashboard'
      case 'investor':
        return 'Investor Dashboard'
      case 'admin':
        return 'Admin Dashboard'
      default:
        return 'Dashboard'
    }
  }

  const getDashboardIcon = () => {
    switch (dashboardType) {
      case 'trader':
        return '📊'
      case 'investor':
        return '💼'
      case 'admin':
        return '🛡️'
      default:
        return '📈'
    }
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Botfolio</span>
          </Link>
          <Badge variant="outline" className="gap-1 hidden sm:flex">
            <span className="text-sm">{getDashboardIcon()}</span>
            {getDashboardTitle()}
          </Badge>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Badge variant="secondary">{user.plan} Plan</Badge>
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
              {user.name.charAt(0)}
            </div>
            <span className="text-sm font-medium">{user.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container px-4 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="gap-1">
                <span className="text-sm">{getDashboardIcon()}</span>
                {getDashboardTitle()}
              </Badge>
              <Badge variant="secondary">{user.plan} Plan</Badge>
            </div>
            
            <div className="flex items-center gap-2 py-2 border-t">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-sm">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <span className="text-sm">Theme</span>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}