"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EconomicCalendar } from "@/components/trading/economic-calendar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle,
  RefreshCw,
  Settings,
  Bell,
  Star,
  Globe,
  DollarSign,
  Building
} from "lucide-react"

export default function EconomicCalendarPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
  }, [status, router])

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Economic Calendar</h1>
          <p className="text-muted-foreground">
            Track economic events and indicators that impact financial markets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push('/trading')}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Trading Terminal
          </Button>
          <Button variant="outline" onClick={() => router.push('/alerts')}>
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </Button>
          <Button variant="outline" onClick={() => router.push('/settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6">
        {/* Economic Calendar */}
        <EconomicCalendar
          height={700}
          showControls={true}
          autoRefresh={true}
        />
      </div>
    </div>
  )
}