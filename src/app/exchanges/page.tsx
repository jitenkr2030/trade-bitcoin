"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Building2, 
  Plus, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Key,
  Shield,
  Activity,
  Trash2,
  Edit,
  RefreshCw
} from "lucide-react"
import { useState } from "react"

export default function ExchangesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const exchanges = [
    {
      id: "1",
      name: "Binance",
      type: "BINANCE",
      status: "CONNECTED",
      lastSync: "2 minutes ago",
      permissions: ["READ", "TRADE"],
      accountType: "Futures",
      balance: "$45,230.50"
    },
    {
      id: "2",
      name: "Coinbase",
      type: "COINBASE",
      status: "CONNECTED",
      lastSync: "5 minutes ago",
      permissions: ["READ"],
      accountType: "Spot",
      balance: "$12,847.32"
    },
    {
      id: "3",
      name: "Interactive Brokers",
      type: "INTERACTIVE_BROKERS",
      status: "ERROR",
      lastSync: "1 hour ago",
      permissions: ["READ", "TRADE"],
      accountType: "Margin",
      balance: "$67,352.80"
    },
    {
      id: "4",
      name: "Bybit",
      type: "BYBIT",
      status: "DISCONNECTED",
      lastSync: "2 days ago",
      permissions: ["READ", "TRADE"],
      accountType: "Derivatives",
      balance: "$0.00"
    }
  ]

  const availableExchanges = [
    { value: "BINANCE", label: "Binance" },
    { value: "COINBASE", label: "Coinbase" },
    { value: "BYBIT", label: "Bybit" },
    { value: "INTERACTIVE_BROKERS", label: "Interactive Brokers" },
    { value: "OANDA", label: "OANDA" },
    { value: "ALPACA", label: "Alpaca" },
    { value: "KRAKEN", label: "Kraken" },
    { value: "KUCOIN", label: "KuCoin" },
    { value: "HUOBI", label: "Huobi" },
    { value: "OKX", label: "OKX" }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONNECTED":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "ERROR":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "DISCONNECTED":
        return <XCircle className="h-4 w-4 text-gray-400" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONNECTED":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case "ERROR":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      case "DISCONNECTED":
        return <Badge variant="secondary">Disconnected</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Connecting</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exchange Connections</h1>
          <p className="text-muted-foreground">
            Manage your exchange connections and API keys
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Exchange
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Exchange</DialogTitle>
              <DialogDescription>
                Connect a new exchange to start trading
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="exchange">Exchange</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exchange" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableExchanges.map((exchange) => (
                      <SelectItem key={exchange.value} value={exchange.value}>
                        {exchange.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input id="apiKey" placeholder="Enter your API key" type="password" />
              </div>
              <div>
                <Label htmlFor="apiSecret">API Secret</Label>
                <Input id="apiSecret" placeholder="Enter your API secret" type="password" />
              </div>
              <div>
                <Label htmlFor="permissions">Permissions</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="read" defaultChecked />
                    <Label htmlFor="read">Read Access</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="trade" />
                    <Label htmlFor="trade">Trade Access</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="withdraw" />
                    <Label htmlFor="withdraw">Withdraw Access</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Connect Exchange
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exchanges</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exchanges.length}</div>
            <p className="text-xs text-muted-foreground">
              {exchanges.filter(e => e.status === "CONNECTED").length} connected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$125,430.62</div>
            <p className="text-xs text-muted-foreground">
              Across all exchanges
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {exchanges.filter(e => e.status === "CONNECTED").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready to trade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {exchanges.filter(e => e.status === "ERROR").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="connections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-4">
          <div className="grid gap-4">
            {exchanges.map((exchange) => (
              <Card key={exchange.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{exchange.name}</CardTitle>
                        <CardDescription>{exchange.accountType} Account</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(exchange.status)}
                      {getStatusBadge(exchange.status)}
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Balance</div>
                      <div className="text-lg font-semibold">{exchange.balance}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Last Sync</div>
                      <div className="text-sm">{exchange.lastSync}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Permissions</div>
                      <div className="flex gap-1 mt-1">
                        {exchange.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    {exchange.status === "ERROR" && (
                      <Button size="sm">
                        <Shield className="h-4 w-4 mr-2" />
                        Troubleshoot
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Key Management</CardTitle>
              <CardDescription>Manage your exchange API keys securely</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">Binance API Key</div>
                      <div className="text-sm text-muted-foreground">Created 2 months ago</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">API Key:</span>
                      <span className="text-sm font-mono">binance_••••••••••••••••</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Secret:</span>
                      <span className="text-sm font-mono">•••••••••••••••••••••</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Revoke
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">Coinbase API Key</div>
                      <div className="text-sm text-muted-foreground">Created 1 month ago</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">API Key:</span>
                      <span className="text-sm font-mono">coinbase_••••••••••••••••</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Secret:</span>
                      <span className="text-sm font-mono">•••••••••••••••••••••</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exchange Permissions</CardTitle>
              <CardDescription>Configure permissions for each exchange connection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {exchanges.map((exchange) => (
                  <div key={exchange.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{exchange.name}</div>
                          <div className="text-sm text-muted-foreground">{exchange.accountType}</div>
                        </div>
                      </div>
                      {getStatusBadge(exchange.status)}
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Read Access</Label>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id={`read-${exchange.id}`} 
                            defaultChecked={exchange.permissions.includes("READ")}
                          />
                          <Label htmlFor={`read-${exchange.id}`} className="text-sm">
                            View balances and orders
                          </Label>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Trade Access</Label>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id={`trade-${exchange.id}`} 
                            defaultChecked={exchange.permissions.includes("TRADE")}
                          />
                          <Label htmlFor={`trade-${exchange.id}`} className="text-sm">
                            Place and manage orders
                          </Label>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Withdraw Access</Label>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id={`withdraw-${exchange.id}`} 
                            defaultChecked={false}
                          />
                          <Label htmlFor={`withdraw-${exchange.id}`} className="text-sm">
                            Withdraw funds
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>Recent exchange connection activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    exchange: "Binance",
                    action: "Connection established",
                    status: "SUCCESS",
                    time: "2 minutes ago",
                    details: "Successfully connected to Binance Futures API"
                  },
                  {
                    exchange: "Coinbase",
                    action: "Balance sync",
                    status: "SUCCESS",
                    time: "5 minutes ago",
                    details: "Synced account balance: $12,847.32"
                  },
                  {
                    exchange: "Interactive Brokers",
                    action: "Connection failed",
                    status: "ERROR",
                    time: "1 hour ago",
                    details: "API authentication failed - Invalid credentials"
                  },
                  {
                    exchange: "Bybit",
                    action: "Connection lost",
                    status: "WARNING",
                    time: "2 days ago",
                    details: "Connection timeout - Exchange maintenance"
                  },
                  {
                    exchange: "Binance",
                    action: "API key rotated",
                    status: "SUCCESS",
                    time: "3 days ago",
                    details: "API key successfully regenerated for security"
                  }
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        log.status === "SUCCESS" ? "bg-green-500" :
                        log.status === "ERROR" ? "bg-red-500" :
                        "bg-yellow-500"
                      }`} />
                      <div>
                        <div className="font-medium">{log.exchange} - {log.action}</div>
                        <div className="text-sm text-muted-foreground">{log.details}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">{log.time}</div>
                      <Badge 
                        variant={log.status === "SUCCESS" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}