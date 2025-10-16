"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  BarChart3, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Eye,
  Edit,
  Ban,
  Check,
  Database,
  Server,
  Globe,
  CreditCard,
  UserPlus,
  TrendingDown,
  Zap,
  Mail,
  Phone,
  Building2
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { DashboardNav } from "@/components/dashboard-nav"
import Link from "next/link"

interface User {
  id: string
  name: string
  email: string
  role: string
  plan: string
  isActive: boolean
  createdAt: string
  lastLogin?: string
}

interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalBots: number
  activeBots: number
  totalVolume: number
  dailyVolume: number
  systemHealth: number
  uptime: string
}

interface Alert {
  id: string
  type: string
  message: string
  severity: string
  timestamp: string
  resolved: boolean
}

interface ExchangeStatus {
  name: string
  status: string
  latency: number
  uptime: number
  lastSync: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [exchangeStatus, setExchangeStatus] = useState<ExchangeStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user session from cookie
    const userSession = document.cookie
      .split('; ')
      .find(row => row.startsWith('user-session='))
      ?.split('=')[1]

    if (userSession) {
      try {
        const userData = JSON.parse(decodeURIComponent(userSession))
        setUser(userData)
      } catch (error) {
        console.error('Error parsing user session:', error)
      }
    }

    // Mock data for demonstration
    setTimeout(() => {
      setUsers([
        {
          id: "1",
          name: "Sarah Chen",
          email: "sarah@example.com",
          role: "TRADER",
          plan: "PRO",
          isActive: true,
          createdAt: "2024-01-15",
          lastLogin: "2024-01-20T10:30:00Z"
        },
        {
          id: "2",
          name: "Marcus Rodriguez",
          email: "marcus@example.com",
          role: "INVESTOR",
          plan: "PREMIUM",
          isActive: true,
          createdAt: "2024-01-10",
          lastLogin: "2024-01-20T09:15:00Z"
        },
        {
          id: "3",
          name: "Emily Watson",
          email: "emily@example.com",
          role: "TRADER",
          plan: "FREE",
          isActive: false,
          createdAt: "2024-01-05",
          lastLogin: "2024-01-18T16:45:00Z"
        }
      ])

      setSystemStats({
        totalUsers: 52480,
        activeUsers: 12350,
        totalBots: 89750,
        activeBots: 32450,
        totalVolume: 284750000,
        dailyVolume: 8750000,
        systemHealth: 98.5,
        uptime: "99.9%"
      })

      setAlerts([
        {
          id: "1",
          type: "SYSTEM",
          message: "High CPU usage detected on server-01",
          severity: "HIGH",
          timestamp: "2024-01-20T11:30:00Z",
          resolved: false
        },
        {
          id: "2",
          type: "SECURITY",
          message: "Multiple failed login attempts from IP 192.168.1.100",
          severity: "MEDIUM",
          timestamp: "2024-01-20T10:15:00Z",
          resolved: true
        },
        {
          id: "3",
          type: "EXCHANGE",
          message: "Binance API latency increased to 850ms",
          severity: "LOW",
          timestamp: "2024-01-20T09:45:00Z",
          resolved: false
        }
      ])

      setExchangeStatus([
        {
          name: "Binance",
          status: "OPERATIONAL",
          latency: 120,
          uptime: 99.9,
          lastSync: "2024-01-20T11:28:00Z"
        },
        {
          name: "Coinbase",
          status: "OPERATIONAL",
          latency: 95,
          uptime: 99.8,
          lastSync: "2024-01-20T11:28:00Z"
        },
        {
          name: "Bybit",
          status: "DEGRADED",
          latency: 450,
          uptime: 98.5,
          lastSync: "2024-01-20T11:25:00Z"
        }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    ))
  }

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, resolved: true }
        : alert
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardNav user={user!} dashboardType="admin" />

      <div className="container mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'Admin'}!</h1>
            <p className="text-muted-foreground">
              System overview and administrative controls
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </Button>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats?.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {systemStats?.activeUsers.toLocaleString()} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats?.activeBots.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {systemStats?.totalBots.toLocaleString()} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${((systemStats?.dailyVolume || 0) / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">
                ${((systemStats?.totalVolume || 0) / 1000000).toFixed(0)}M total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{systemStats?.systemHealth}%</div>
              <p className="text-xs text-muted-foreground">
                Uptime: {systemStats?.uptime}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="system">System Status</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="exchanges">Exchange Status</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all registered users and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{user.role}</Badge>
                            <Badge variant="secondary">{user.plan}</Badge>
                            <Badge 
                              variant={user.isActive ? "outline" : "destructive"}
                              className="gap-1"
                            >
                              {user.isActive ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <Ban className="h-3 w-3" />
                              )}
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.isActive ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Resources</CardTitle>
                  <CardDescription>Current system performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CPU Usage</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <Progress value={45} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Memory Usage</span>
                        <span className="font-medium">62%</span>
                      </div>
                      <Progress value={62} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Disk Usage</span>
                        <span className="font-medium">38%</span>
                      </div>
                      <Progress value={38} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Network I/O</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <Progress value={78} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Server Status</CardTitle>
                  <CardDescription>Individual server health monitoring</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Web Server", status: "OPERATIONAL", cpu: 45, memory: 62 },
                    { name: "Database Server", status: "OPERATIONAL", cpu: 38, memory: 71 },
                    { name: "Cache Server", status: "OPERATIONAL", cpu: 12, memory: 45 },
                    { name: "API Gateway", status: "DEGRADED", cpu: 78, memory: 85 }
                  ].map((server, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{server.name}</span>
                        <Badge 
                          variant={server.status === 'OPERATIONAL' ? 'outline' : 'destructive'}
                          className="gap-1"
                        >
                          {server.status === 'OPERATIONAL' ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <AlertTriangle className="h-3 w-3" />
                          )}
                          {server.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">CPU: </span>
                          <span className="font-medium">{server.cpu}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Memory: </span>
                          <span className="font-medium">{server.memory}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent system alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          alert.severity === 'HIGH' ? 'bg-red-500' :
                          alert.severity === 'MEDIUM' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`} />
                        <div>
                          <div className="font-medium">{alert.message}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{alert.type}</Badge>
                            <Badge 
                              variant={alert.severity === 'HIGH' ? 'destructive' : 
                                      alert.severity === 'MEDIUM' ? 'default' : 'secondary'}
                            >
                              {alert.severity}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(alert.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!alert.resolved && (
                          <Button 
                            size="sm" 
                            onClick={() => resolveAlert(alert.id)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                        <Badge 
                          variant={alert.resolved ? 'outline' : 'secondary'}
                          className="gap-1"
                        >
                          {alert.resolved ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {alert.resolved ? 'Resolved' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exchanges" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Exchange Status</CardTitle>
                <CardDescription>Real-time status of connected exchanges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exchangeStatus.map((exchange, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium">{exchange.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant={exchange.status === 'OPERATIONAL' ? 'outline' : 'destructive'}
                              className="gap-1"
                            >
                              {exchange.status === 'OPERATIONAL' ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <AlertTriangle className="h-3 w-3" />
                              )}
                              {exchange.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Latency: {exchange.latency}ms
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{exchange.uptime}% uptime</div>
                        <div className="text-sm text-muted-foreground">
                          Last sync: {new Date(exchange.lastSync).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}