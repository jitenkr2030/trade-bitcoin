'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Volume2,
  BarChart3,
  Target,
  Zap,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react'

interface PriceAlert {
  id: string
  symbol: string
  condition: 'above' | 'below' | 'crosses' | 'changes_by_percent'
  targetPrice: number
  currentPrice: number
  isActive: boolean
  isTriggered: boolean
  createdAt: Date
  triggeredAt?: Date
  notificationMethods: ('email' | 'sms' | 'push' | 'webhook')[]
  message?: string
  repeat: boolean
  expiration?: Date
}

interface VolumeAlert {
  id: string
  symbol: string
  condition: 'above' | 'below' | 'spike'
  targetVolume: number
  timeFrame: '1m' | '5m' | '15m' | '1h' | '4h' | '1d'
  isActive: boolean
  isTriggered: boolean
  createdAt: Date
  triggeredAt?: Date
  notificationMethods: ('email' | 'sms' | 'push' | 'webhook')[]
  message?: string
  repeat: boolean
}

interface TechnicalAlert {
  id: string
  symbol: string
  indicator: string
  condition: string
  parameters: Record<string, any>
  isActive: boolean
  isTriggered: boolean
  createdAt: Date
  triggeredAt?: Date
  notificationMethods: ('email' | 'sms' | 'push' | 'webhook')[]
  message?: string
  repeat: boolean
}

interface AlertNotification {
  id: string
  alertId: string
  type: 'price' | 'volume' | 'technical'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  method: 'email' | 'sms' | 'push' | 'webhook'
  status: 'sent' | 'delivered' | 'failed'
}

interface AlertSystemProps {
  exchangeAccountId: string
  symbols: string[]
}

export function AlertSystem({ exchangeAccountId, symbols }: AlertSystemProps) {
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([])
  const [volumeAlerts, setVolumeAlerts] = useState<VolumeAlert[]>([])
  const [technicalAlerts, setTechnicalAlerts] = useState<TechnicalAlert[]>([])
  const [notifications, setNotifications] = useState<AlertNotification[]>([])
  const [isCreatingAlert, setIsCreatingAlert] = useState(false)
  const [activeTab, setActiveTab] = useState('price')
  const [unreadCount, setUnreadCount] = useState(0)

  const popularSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT']
  const timeFrames = ['1m', '5m', '15m', '30m', '1h', '4h', '1d']
  const technicalIndicators = [
    'RSI',
    'MACD',
    'Moving Average',
    'Bollinger Bands',
    'Stochastic',
    'CCI',
    'Williams %R',
    'ADX'
  ]

  useEffect(() => {
    loadAlerts()
    loadNotifications()
  }, [exchangeAccountId])

  const loadAlerts = async () => {
    // Simulate API call
    const mockPriceAlerts: PriceAlert[] = [
      {
        id: '1',
        symbol: 'BTCUSDT',
        condition: 'above',
        targetPrice: 45000,
        currentPrice: 43250,
        isActive: true,
        isTriggered: false,
        createdAt: new Date('2024-01-15'),
        notificationMethods: ['email', 'push'],
        message: 'BTC price target reached',
        repeat: false
      },
      {
        id: '2',
        symbol: 'ETHUSDT',
        condition: 'below',
        targetPrice: 2400,
        currentPrice: 2450,
        isActive: true,
        isTriggered: false,
        createdAt: new Date('2024-01-16'),
        notificationMethods: ['email'],
        message: 'ETH price drop alert',
        repeat: true
      }
    ]

    const mockVolumeAlerts: VolumeAlert[] = [
      {
        id: '3',
        symbol: 'BTCUSDT',
        condition: 'spike',
        targetVolume: 1000000000,
        timeFrame: '1h',
        isActive: true,
        isTriggered: false,
        createdAt: new Date('2024-01-17'),
        notificationMethods: ['push'],
        message: 'BTC volume spike detected',
        repeat: false
      }
    ]

    const mockTechnicalAlerts: TechnicalAlert[] = [
      {
        id: '4',
        symbol: 'BTCUSDT',
        indicator: 'RSI',
        condition: 'oversold',
        parameters: { period: 14, threshold: 30 },
        isActive: true,
        isTriggered: false,
        createdAt: new Date('2024-01-18'),
        notificationMethods: ['email', 'push'],
        message: 'BTC RSI oversold condition',
        repeat: true
      }
    ]

    setPriceAlerts(mockPriceAlerts)
    setVolumeAlerts(mockVolumeAlerts)
    setTechnicalAlerts(mockTechnicalAlerts)
  }

  const loadNotifications = async () => {
    // Simulate API call
    const mockNotifications: AlertNotification[] = [
      {
        id: '1',
        alertId: '1',
        type: 'price',
        title: 'Price Alert: BTCUSDT',
        message: 'BTC price is approaching your target of $45,000',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        isRead: false,
        method: 'push',
        status: 'delivered'
      },
      {
        id: '2',
        alertId: '4',
        type: 'technical',
        title: 'Technical Alert: BTCUSDT RSI',
        message: 'BTC RSI indicates oversold conditions (28.5)',
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        isRead: true,
        method: 'email',
        status: 'sent'
      }
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length)
  }

  const createPriceAlert = (alertData: Partial<PriceAlert>) => {
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      symbol: alertData.symbol || 'BTCUSDT',
      condition: alertData.condition || 'above',
      targetPrice: alertData.targetPrice || 0,
      currentPrice: 43250,
      isActive: true,
      isTriggered: false,
      createdAt: new Date(),
      notificationMethods: alertData.notificationMethods || ['email'],
      message: alertData.message,
      repeat: alertData.repeat || false,
      expiration: alertData.expiration
    }

    setPriceAlerts(prev => [...prev, newAlert])
    setIsCreatingAlert(false)
  }

  const createVolumeAlert = (alertData: Partial<VolumeAlert>) => {
    const newAlert: VolumeAlert = {
      id: Date.now().toString(),
      symbol: alertData.symbol || 'BTCUSDT',
      condition: alertData.condition || 'above',
      targetVolume: alertData.targetVolume || 0,
      timeFrame: alertData.timeFrame || '1h',
      isActive: true,
      isTriggered: false,
      createdAt: new Date(),
      notificationMethods: alertData.notificationMethods || ['email'],
      message: alertData.message,
      repeat: alertData.repeat || false
    }

    setVolumeAlerts(prev => [...prev, newAlert])
    setIsCreatingAlert(false)
  }

  const createTechnicalAlert = (alertData: Partial<TechnicalAlert>) => {
    const newAlert: TechnicalAlert = {
      id: Date.now().toString(),
      symbol: alertData.symbol || 'BTCUSDT',
      indicator: alertData.indicator || 'RSI',
      condition: alertData.condition || '',
      parameters: alertData.parameters || {},
      isActive: true,
      isTriggered: false,
      createdAt: new Date(),
      notificationMethods: alertData.notificationMethods || ['email'],
      message: alertData.message,
      repeat: alertData.repeat || false
    }

    setTechnicalAlerts(prev => [...prev, newAlert])
    setIsCreatingAlert(false)
  }

  const toggleAlert = (type: 'price' | 'volume' | 'technical', id: string) => {
    switch (type) {
      case 'price':
        setPriceAlerts(prev => 
          prev.map(alert => 
            alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
          )
        )
        break
      case 'volume':
        setVolumeAlerts(prev => 
          prev.map(alert => 
            alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
          )
        )
        break
      case 'technical':
        setTechnicalAlerts(prev => 
          prev.map(alert => 
            alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
          )
        )
        break
    }
  }

  const deleteAlert = (type: 'price' | 'volume' | 'technical', id: string) => {
    switch (type) {
      case 'price':
        setPriceAlerts(prev => prev.filter(alert => alert.id !== id))
        break
      case 'volume':
        setVolumeAlerts(prev => prev.filter(alert => alert.id !== id))
        break
      case 'technical':
        setTechnicalAlerts(prev => prev.filter(alert => alert.id !== id))
        break
    }
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const getConditionColor = (condition: string, current: number, target: number) => {
    switch (condition) {
      case 'above':
        return current >= target ? 'text-green-600' : 'text-red-600'
      case 'below':
        return current <= target ? 'text-green-600' : 'text-red-600'
      case 'crosses':
        return Math.abs(current - target) < 100 ? 'text-yellow-600' : 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price':
        return <Target className="h-4 w-4" />
      case 'volume':
        return <Volume2 className="h-4 w-4" />
      case 'technical':
        return <BarChart3 className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Alert System</h2>
          <p className="text-muted-foreground">
            Manage price, volume, and technical alerts with real-time notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreatingAlert(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold">{priceAlerts.length + volumeAlerts.length + technicalAlerts.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-green-600">
                  {priceAlerts.filter(a => a.isActive).length + 
                   volumeAlerts.filter(a => a.isActive).length + 
                   technicalAlerts.filter(a => a.isActive).length}
                </p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Triggered</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {priceAlerts.filter(a => a.isTriggered).length + 
                   volumeAlerts.filter(a => a.isTriggered).length + 
                   technicalAlerts.filter(a => a.isTriggered).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
              </div>
              <Mail className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="price">Price Alerts</TabsTrigger>
          <TabsTrigger value="volume">Volume Alerts</TabsTrigger>
          <TabsTrigger value="technical">Technical Alerts</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="price" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Alerts</CardTitle>
              <CardDescription>
                Get notified when prices reach your target levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {priceAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No price alerts created</p>
                  <Button className="mt-4" onClick={() => setIsCreatingAlert(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Price Alert
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {priceAlerts.map(alert => (
                    <div key={alert.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{alert.symbol}</h3>
                          <Badge variant={alert.isActive ? 'default' : 'secondary'}>
                            {alert.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {alert.isTriggered && (
                            <Badge variant="destructive">
                              Triggered
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleAlert('price', alert.id)}
                          >
                            {alert.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAlert('price', alert.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Condition</p>
                          <p className="font-medium capitalize">{alert.condition}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Target Price</p>
                          <p className="font-medium">{formatCurrency(alert.targetPrice)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Current Price</p>
                          <p className={`font-medium ${getConditionColor(alert.condition, alert.currentPrice, alert.targetPrice)}`}>
                            {formatCurrency(alert.currentPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Created</p>
                          <p className="font-medium">{alert.createdAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-gray-600">Notifications:</span>
                        {alert.notificationMethods.map(method => (
                          <Badge key={method} variant="outline" className="text-xs">
                            {method}
                          </Badge>
                        ))}
                      </div>
                      
                      {alert.message && (
                        <div className="mt-2 p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-700">{alert.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volume" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Volume Alerts</CardTitle>
              <CardDescription>
                Monitor trading volume spikes and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {volumeAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <Volume2 className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No volume alerts created</p>
                  <Button className="mt-4" onClick={() => setIsCreatingAlert(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Volume Alert
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {volumeAlerts.map(alert => (
                    <div key={alert.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{alert.symbol}</h3>
                          <Badge variant={alert.isActive ? 'default' : 'secondary'}>
                            {alert.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {alert.isTriggered && (
                            <Badge variant="destructive">
                              Triggered
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleAlert('volume', alert.id)}
                          >
                            {alert.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAlert('volume', alert.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Condition</p>
                          <p className="font-medium capitalize">{alert.condition}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Target Volume</p>
                          <p className="font-medium">{formatNumber(alert.targetVolume, 0)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Time Frame</p>
                          <p className="font-medium">{alert.timeFrame}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Created</p>
                          <p className="font-medium">{alert.createdAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Alerts</CardTitle>
              <CardDescription>
                Get alerts based on technical indicator conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {technicalAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No technical alerts created</p>
                  <Button className="mt-4" onClick={() => setIsCreatingAlert(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Technical Alert
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {technicalAlerts.map(alert => (
                    <div key={alert.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{alert.symbol}</h3>
                          <Badge variant={alert.isActive ? 'default' : 'secondary'}>
                            {alert.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {alert.isTriggered && (
                            <Badge variant="destructive">
                              Triggered
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleAlert('technical', alert.id)}
                          >
                            {alert.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAlert('technical', alert.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Indicator</p>
                          <p className="font-medium">{alert.indicator}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Condition</p>
                          <p className="font-medium">{alert.condition}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Created</p>
                          <p className="font-medium">{alert.createdAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                View and manage your alert notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border rounded-lg ${!notification.isRead ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getAlertIcon(notification.type)}
                          <h3 className="font-semibold">{notification.title}</h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={notification.status === 'delivered' ? 'default' : 'secondary'}>
                            {notification.status}
                          </Badge>
                          <Badge variant="outline">{notification.method}</Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">{formatTimeAgo(notification.timestamp)}</p>
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Alert Dialog */}
      <Dialog open={isCreatingAlert} onOpenChange={setIsCreatingAlert}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Alert</DialogTitle>
            <DialogDescription>
              Set up a new alert to monitor market conditions
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="price" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="price">Price Alert</TabsTrigger>
              <TabsTrigger value="volume">Volume Alert</TabsTrigger>
              <TabsTrigger value="technical">Technical Alert</TabsTrigger>
            </TabsList>
            
            <TabsContent value="price" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="symbol">Symbol</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select symbol" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularSymbols.map(symbol => (
                        <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Price Above</SelectItem>
                      <SelectItem value="below">Price Below</SelectItem>
                      <SelectItem value="crosses">Price Crosses</SelectItem>
                      <SelectItem value="changes_by_percent">Price Changes By %</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="targetPrice">Target Price</Label>
                  <Input type="number" placeholder="45000" />
                </div>
                
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Input placeholder="Custom notification message" />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreatingAlert(false)}>
                  Cancel
                </Button>
                <Button onClick={() => createPriceAlert({})}>
                  Create Alert
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="volume" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="symbol">Symbol</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select symbol" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularSymbols.map(symbol => (
                        <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Volume Above</SelectItem>
                      <SelectItem value="below">Volume Below</SelectItem>
                      <SelectItem value="spike">Volume Spike</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="targetVolume">Target Volume</Label>
                  <Input type="number" placeholder="1000000000" />
                </div>
                
                <div>
                  <Label htmlFor="timeFrame">Time Frame</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeFrames.map(tf => (
                        <SelectItem key={tf} value={tf}>{tf}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreatingAlert(false)}>
                  Cancel
                </Button>
                <Button onClick={() => createVolumeAlert({})}>
                  Create Alert
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="symbol">Symbol</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select symbol" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularSymbols.map(symbol => (
                        <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="indicator">Indicator</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select indicator" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicalIndicators.map(indicator => (
                        <SelectItem key={indicator} value={indicator}>{indicator}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overbought">Overbought</SelectItem>
                      <SelectItem value="oversold">Oversold</SelectItem>
                      <SelectItem value="crossover">Crossover</SelectItem>
                      <SelectItem value="divergence">Divergence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Input placeholder="Custom notification message" />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreatingAlert(false)}>
                  Cancel
                </Button>
                <Button onClick={() => createTechnicalAlert({})}>
                  Create Alert
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}