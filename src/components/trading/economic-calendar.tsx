"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  Filter,
  Search,
  Bell,
  Star,
  Globe,
  DollarSign,
  Building,
  AlertTriangle,
  Info,
  Download,
  Settings,
  Maximize2,
  Minimize2
} from "lucide-react"

interface EconomicEvent {
  id: string
  title: string
  country: string
  currency: string
  date: Date
  time: string
  impact: 'low' | 'medium' | 'high'
  actual?: number
  forecast?: number
  previous?: number
  unit: string
  category: string
  description?: string
  isWatched: boolean
  source: string
}

interface EconomicCalendarData {
  events: EconomicEvent[]
  totalEvents: number
  highImpactEvents: number
  mediumImpactEvents: number
  lowImpactEvents: number
  watchedEvents: number
  lastUpdate: Date
}

interface EconomicCalendarProps {
  height?: number
  showControls?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
  onFullscreen?: () => void
}

// Generate realistic economic calendar data
const generateEconomicCalendarData = (): EconomicCalendarData => {
  const events: EconomicEvent[] = []
  const countries = ['US', 'EU', 'UK', 'JP', 'CN', 'CA', 'AU', 'CH']
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'CHF']
  const categories = ['Employment', 'Inflation', 'GDP', 'Interest Rates', 'Manufacturing', 'Retail Sales', 'Trade Balance', 'Consumer Confidence']
  const sources = ['Bloomberg', 'Reuters', 'Fed', 'ECB', 'BOE', 'BOJ', 'PBOC']
  
  const now = new Date()
  let watchedCount = 0
  
  // Generate events for the next 7 days
  for (let day = 0; day < 7; day++) {
    const date = new Date(now)
    date.setDate(date.getDate() + day)
    
    // Generate 3-8 events per day
    const eventsPerDay = Math.floor(Math.random() * 6) + 3
    
    for (let i = 0; i < eventsPerDay; i++) {
      const countryIndex = Math.floor(Math.random() * countries.length)
      const country = countries[countryIndex]
      const currency = currencies[countryIndex]
      const category = categories[Math.floor(Math.random() * categories.length)]
      const impact = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
      
      // Generate time (business hours)
      const hour = 8 + Math.floor(Math.random() * 10) // 8 AM to 6 PM
      const minute = Math.floor(Math.random() * 60)
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      
      // Generate values
      const baseValue = Math.random() * 100 + 1
      const forecast = baseValue + (Math.random() - 0.5) * 10
      const actual = forecast + (Math.random() - 0.5) * 5
      const previous = baseValue + (Math.random() - 0.5) * 8
      
      const isWatched = Math.random() > 0.8 && watchedCount < 5 // 20% chance, max 5 watched
      if (isWatched) watchedCount++
      
      events.push({
        id: `event_${day}_${i}_${Date.now()}`,
        title: `${country} ${category} ${['Index', 'Rate', 'Data', 'Report'][Math.floor(Math.random() * 4)]}`,
        country,
        currency,
        date,
        time,
        impact,
        actual: day === 0 ? Number(actual.toFixed(2)) : undefined, // Only show actual for today/past events
        forecast: Number(forecast.toFixed(2)),
        previous: Number(previous.toFixed(2)),
        unit: category.includes('Rate') ? '%' : 'K',
        category,
        description: `Monthly ${category.toLowerCase()} data for ${country}. This indicator measures ${category.toLowerCase()} activity and is closely watched by market participants.`,
        isWatched,
        source: sources[Math.floor(Math.random() * sources.length)]
      })
    }
  }
  
  return {
    events: events.sort((a, b) => a.date.getTime() - b.date.getTime() || a.time.localeCompare(b.time)),
    totalEvents: events.length,
    highImpactEvents: events.filter(e => e.impact === 'high').length,
    mediumImpactEvents: events.filter(e => e.impact === 'medium').length,
    lowImpactEvents: events.filter(e => e.impact === 'low').length,
    watchedEvents: watchedCount,
    lastUpdate: new Date()
  }
}

export function EconomicCalendar({ 
  height = 600,
  showControls = true,
  autoRefresh = true,
  refreshInterval = 300000, // 5 minutes
  onFullscreen
}: EconomicCalendarProps) {
  const [calendarData, setCalendarData] = useState<EconomicCalendarData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filterCountry, setFilterCountry] = useState<string>('all')
  const [filterImpact, setFilterImpact] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week')
  const [searchTerm, setSearchTerm] = useState('')
  const [showWatchedOnly, setShowWatchedOnly] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true)
      const data = generateEconomicCalendarData()
      setCalendarData(data)
      setIsLoading(false)
    }

    loadData()
    
    if (autoRefresh) {
      const interval = setInterval(loadData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  const handleRefresh = () => {
    setIsLoading(true)
    const data = generateEconomicCalendarData()
    setCalendarData(data)
    setIsLoading(false)
  }

  const toggleWatchEvent = (eventId: string) => {
    if (!calendarData) return
    
    setCalendarData(prev => {
      if (!prev) return prev
      
      const targetEvent = prev.events.find(event => event.id === eventId)
      if (!targetEvent) return prev
      
      const newIsWatched = !targetEvent.isWatched
      
      return {
        ...prev,
        events: prev.events.map(event => 
          event.id === eventId 
            ? { ...event, isWatched: newIsWatched }
            : event
        ),
        watchedEvents: newIsWatched 
          ? prev.watchedEvents - 1 
          : prev.watchedEvents + 1
      }
    })
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    onFullscreen?.()
  }

  const getFilteredEvents = () => {
    if (!calendarData) return []
    
    let filtered = calendarData.events
    
    // Time range filter
    const now = new Date()
    if (timeRange === 'today') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate.toDateString() === now.toDateString()
      })
    } else if (timeRange === 'week') {
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate >= now && eventDate <= weekFromNow
      })
    } else if (timeRange === 'month') {
      const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate >= now && eventDate <= monthFromNow
      })
    }
    
    // Country filter
    if (filterCountry !== 'all') {
      filtered = filtered.filter(event => event.country === filterCountry)
    }
    
    // Impact filter
    if (filterImpact !== 'all') {
      filtered = filtered.filter(event => event.impact === filterImpact)
    }
    
    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(event => event.category === filterCategory)
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Watched only filter
    if (showWatchedOnly) {
      filtered = filtered.filter(event => event.isWatched)
    }
    
    return filtered
  }

  const exportToCSV = () => {
    if (!calendarData) return
    
    const events = getFilteredEvents()
    const headers = ['Date', 'Time', 'Country', 'Currency', 'Event', 'Impact', 'Forecast', 'Actual', 'Previous', 'Category']
    const csvContent = [
      headers.join(','),
      ...events.map(event => [
        event.date.toLocaleDateString(),
        event.time,
        event.country,
        event.currency,
        `"${event.title}"`,
        event.impact,
        event.forecast || '',
        event.actual || '',
        event.previous || '',
        event.category
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `economic_calendar_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <AlertTriangle className="h-3 w-3" />
      case 'medium': return <Info className="h-3 w-3" />
      case 'low': return <Info className="h-3 w-3" />
      default: return <Info className="h-3 w-3" />
    }
  }

  const formatValue = (value: number, unit: string) => {
    return `${value.toFixed(2)}${unit}`
  }

  const getValueChange = (actual: number, forecast: number) => {
    const change = actual - forecast
    const percentChange = (change / forecast) * 100
    return {
      change,
      percentChange,
      isPositive: change >= 0
    }
  }

  if (isLoading || !calendarData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Economic Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[600px]">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const filteredEvents = getFilteredEvents()
  const uniqueCountries = [...new Set(calendarData.events.map(e => e.country))]
  const uniqueCategories = [...new Set(calendarData.events.map(e => e.category))]

  return (
    <Card className={isFullscreen ? "fixed inset-0 z-50 m-0" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <CardTitle>Economic Calendar</CardTitle>
          </div>
          
          {showControls && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Total Events:</span>
            <Badge variant="secondary">{calendarData.totalEvents}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>High Impact:</span>
            <Badge variant="destructive">{calendarData.highImpactEvents}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Medium Impact:</span>
            <Badge variant="outline" className="text-yellow-600">{calendarData.mediumImpactEvents}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Low Impact:</span>
            <Badge variant="outline" className="text-green-600">{calendarData.lowImpactEvents}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Watched:</span>
            <Badge variant="outline">{calendarData.watchedEvents}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 mb-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <Select value={timeRange} onValueChange={(value) => setTimeRange(value as 'today' | 'week' | 'month')}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueCountries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <Select value={filterImpact} onValueChange={setFilterImpact}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant={showWatchedOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowWatchedOnly(!showWatchedOnly)}
            >
              <Star className={`h-4 w-4 mr-1 ${showWatchedOnly ? 'fill-current' : ''}`} />
              Watched
            </Button>
          </div>
        </div>

        <ScrollArea className={`${height}px`}>
          <div className="space-y-3">
            {filteredEvents.map((event) => {
              const isToday = event.date.toDateString() === new Date().toDateString()
              const valueChange = event.actual && event.forecast 
                ? getValueChange(event.actual, event.forecast) 
                : null
              
              return (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border ${
                    isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                  } ${event.isWatched ? 'ring-2 ring-yellow-400' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-sm text-muted-foreground min-w-[80px]">
                          {event.date.toLocaleDateString()}
                        </div>
                        <div className="text-sm font-medium min-w-[50px]">
                          {event.time}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {event.country}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {event.currency}
                        </Badge>
                        <Badge className={`text-xs ${getImpactColor(event.impact)}`}>
                          {getImpactIcon(event.impact)}
                          <span className="ml-1">{event.impact.toUpperCase()}</span>
                        </Badge>
                      </div>
                      
                      <div className="mb-2">
                        <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                        <p className="text-xs text-muted-foreground">{event.category}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        {event.forecast && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Forecast:</span>
                            <span>{formatValue(event.forecast, event.unit)}</span>
                          </div>
                        )}
                        
                        {event.actual && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Actual:</span>
                            <span className={`font-medium ${
                              valueChange?.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatValue(event.actual, event.unit)}
                            </span>
                            {valueChange && (
                              <span className={`text-xs ${
                                valueChange.isPositive ? 'text-green-600' : 'text-red-600'
                              }`}>
                                ({valueChange.isPositive ? '+' : ''}{valueChange.percentChange.toFixed(1)}%)
                              </span>
                            )}
                          </div>
                        )}
                        
                        {event.previous && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Previous:</span>
                            <span>{formatValue(event.previous, event.unit)}</span>
                          </div>
                        )}
                      </div>
                      
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-2">{event.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleWatchEvent(event.id)}
                      >
                        <Star className={`h-4 w-4 ${event.isWatched ? 'fill-current text-yellow-500' : ''}`} />
                      </Button>
                      <Badge variant="outline" className="text-xs">
                        {event.source}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>

        <div className="mt-4 text-xs text-muted-foreground">
          Showing {filteredEvents.length} of {calendarData.totalEvents} events • 
          Last updated: {calendarData.lastUpdate.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}