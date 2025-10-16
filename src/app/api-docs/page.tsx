'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { 
  Code, 
  Copy, 
  Download, 
  ExternalLink, 
  FileText, 
  Github, 
  Search, 
  Shield, 
  Zap,
  Database,
  Users,
  BarChart3,
  Key,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  description: string
  parameters?: Array<{
    name: string
    type: string
    required: boolean
    description: string
  }>
  response: {
    type: string
    description: string
    example: string
  }
  authentication: boolean
}

interface ApiSection {
  title: string
  description: string
  endpoints: ApiEndpoint[]
}

const apiSections: ApiSection[] = [
  {
    title: 'Authentication',
    description: 'Endpoints for user authentication and session management',
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/login',
        description: 'Authenticate user and create session',
        parameters: [
          { name: 'email', type: 'string', required: true, description: 'User email address' },
          { name: 'password', type: 'string', required: true, description: 'User password' }
        ],
        response: {
          type: 'object',
          description: 'Authentication response with session token',
          example: `{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}`
        },
        authentication: false
      },
      {
        method: 'POST',
        path: '/api/auth/register',
        description: 'Register new user account',
        parameters: [
          { name: 'email', type: 'string', required: true, description: 'User email address' },
          { name: 'password', type: 'string', required: true, description: 'User password' },
          { name: 'name', type: 'string', required: true, description: 'User full name' }
        ],
        response: {
          type: 'object',
          description: 'Registration response',
          example: `{
  "success": true,
  "userId": "user_123",
  "message": "Account created successfully"
}`
        },
        authentication: false
      },
      {
        method: 'POST',
        path: '/api/auth/logout',
        description: 'Terminate user session',
        response: {
          type: 'object',
          description: 'Logout confirmation',
          example: `{
  "success": true,
  "message": "Logged out successfully"
}`
        },
        authentication: true
      }
    ]
  },
  {
    title: 'Trading',
    description: 'Core trading endpoints for executing and managing trades',
    endpoints: [
      {
        method: 'POST',
        path: '/api/trading/execute',
        description: 'Execute a new trade',
        parameters: [
          { name: 'symbol', type: 'string', required: true, description: 'Trading pair (e.g., BTC/USD)' },
          { name: 'side', type: 'string', required: true, description: 'Trade direction (buy/sell)' },
          { name: 'amount', type: 'number', required: true, description: 'Trade amount' },
          { name: 'price', type: 'number', required: false, description: 'Limit price (for limit orders)' },
          { name: 'type', type: 'string', required: true, description: 'Order type (market/limit)' }
        ],
        response: {
          type: 'object',
          description: 'Trade execution result',
          example: `{
  "success": true,
  "orderId": "order_123456",
  "status": "filled",
  "executedPrice": 45000.00,
  "executedAmount": 0.1,
  "fee": 0.45
}`
        },
        authentication: true
      },
      {
        method: 'GET',
        path: '/api/trading/orders',
        description: 'Get user orders',
        parameters: [
          { name: 'status', type: 'string', required: false, description: 'Filter by order status' },
          { name: 'limit', type: 'number', required: false, description: 'Number of orders to return' }
        ],
        response: {
          type: 'array',
          description: 'List of user orders',
          example: `[{
  "id": "order_123456",
  "symbol": "BTC/USD",
  "side": "buy",
  "amount": 0.1,
  "price": 45000.00,
  "status": "filled",
  "createdAt": "2024-01-15T10:30:00Z"
}]`
        },
        authentication: true
      },
      {
        method: 'DELETE',
        path: '/api/trading/orders/{id}',
        description: 'Cancel an order',
        response: {
          type: 'object',
          description: 'Order cancellation result',
          example: `{
  "success": true,
  "orderId": "order_123456",
  "status": "cancelled"
}`
        },
        authentication: true
      }
    ]
  },
  {
    title: 'Market Data',
    description: 'Real-time market data and price information',
    endpoints: [
      {
        method: 'GET',
        path: '/api/markets/ticker/{symbol}',
        description: 'Get ticker information for a trading pair',
        response: {
          type: 'object',
          description: 'Ticker data',
          example: `{
  "symbol": "BTC/USD",
  "price": 45000.00,
  "change24h": 2.5,
  "volume24h": 123456789.00,
  "high24h": 46000.00,
  "low24h": 44000.00,
  "lastUpdate": "2024-01-15T10:30:00Z"
}`
        },
        authentication: false
      },
      {
        method: 'GET',
        path: '/api/markets/orderbook/{symbol}',
        description: 'Get order book depth',
        parameters: [
          { name: 'depth', type: 'number', required: false, description: 'Order book depth levels' }
        ],
        response: {
          type: 'object',
          description: 'Order book data',
          example: `{
  "symbol": "BTC/USD",
  "bids": [
    [44900.00, 0.5],
    [44800.00, 0.3]
  ],
  "asks": [
    [45100.00, 0.4],
    [45200.00, 0.6]
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}`
        },
        authentication: false
      },
      {
        method: 'GET',
        path: '/api/markets/trades/{symbol}',
        description: 'Get recent trades',
        parameters: [
          { name: 'limit', type: 'number', required: false, description: 'Number of trades to return' }
        ],
        response: {
          type: 'array',
          description: 'Recent trades',
          example: `[{
  "id": "trade_123456",
  "symbol": "BTC/USD",
  "price": 45000.00,
  "amount": 0.1,
  "side": "buy",
  "timestamp": "2024-01-15T10:30:00Z"
}]`
        },
        authentication: false
      }
    ]
  },
  {
    title: 'Account',
    description: 'Account management and user information',
    endpoints: [
      {
        method: 'GET',
        path: '/api/account/balance',
        description: 'Get account balance',
        response: {
          type: 'object',
          description: 'Account balance information',
          example: `{
  "total": 50000.00,
  "available": 45000.00,
  "inOrders": 5000.00,
  "currencies": [{
    "currency": "BTC",
    "balance": 0.5,
    "available": 0.4,
    "inOrders": 0.1
  }, {
    "currency": "USD",
    "balance": 27500.00,
    "available": 25000.00,
    "inOrders": 2500.00
  }]
}`
        },
        authentication: true
      },
      {
        method: 'GET',
        path: '/api/account/transactions',
        description: 'Get account transaction history',
        parameters: [
          { name: 'limit', type: 'number', required: false, description: 'Number of transactions' },
          { name: 'offset', type: 'number', required: false, description: 'Pagination offset' }
        ],
        response: {
          type: 'array',
          description: 'Transaction history',
          example: `[{
  "id": "tx_123456",
  "type": "deposit",
  "currency": "BTC",
  "amount": 0.1,
  "status": "completed",
  "timestamp": "2024-01-15T10:30:00Z"
}]`
        },
        authentication: true
      }
    ]
  },
  {
    title: 'WebSocket',
    description: 'Real-time data streaming via WebSocket',
    endpoints: [
      {
        method: 'GET',
        path: '/ws/trades/{symbol}',
        description: 'Stream real-time trades',
        response: {
          type: 'stream',
          description: 'Real-time trade data stream',
          example: `{
  "event": "trade",
  "data": {
    "symbol": "BTC/USD",
    "price": 45000.00,
    "amount": 0.1,
    "side": "buy",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}`
        },
        authentication: false
      },
      {
        method: 'GET',
        path: '/ws/orderbook/{symbol}',
        description: 'Stream real-time order book updates',
        response: {
          type: 'stream',
          description: 'Real-time order book updates',
          example: `{
  "event": "orderbook",
  "data": {
    "symbol": "BTC/USD",
    "bids": [[44900.00, 0.5]],
    "asks": [[45100.00, 0.4]],
    "timestamp": "2024-01-15T10:30:00Z"
  }
}`
        },
        authentication: false
      }
    ]
  }
]

const sdks = [
  {
    name: 'JavaScript/TypeScript',
    description: 'Modern JavaScript SDK with TypeScript support',
    language: 'javascript',
    install: 'npm install @tradebitcoin/sdk',
    example: `import { TradeBitcoin } from '@tradebitcoin/sdk';

const client = new TradeBitcoin({
  apiKey: 'your-api-key',
  secret: 'your-secret-key'
});

// Execute a trade
const trade = await client.trading.execute({
  symbol: 'BTC/USD',
  side: 'buy',
  amount: 0.1,
  type: 'market'
});`
  },
  {
    name: 'Python',
    description: 'Python SDK for algorithmic trading',
    language: 'python',
    install: 'pip install tradebitcoin-sdk',
    example: `import tradebitcoin

client = tradebitcoin.Client(
    api_key='your-api-key',
    secret='your-secret-key'
)

# Execute a trade
trade = client.trading.execute(
    symbol='BTC/USD',
    side='buy',
    amount=0.1,
    type='market'
)`
  },
  {
    name: 'Go',
    description: 'High-performance Go SDK',
    language: 'go',
    install: 'go get github.com/tradebitcoin/sdk-go',
    example: `package main

import (
    "github.com/tradebitcoin/sdk-go"
)

func main() {
    client := tradebitcoin.NewClient("your-api-key", "your-secret-key")
    
    // Execute a trade
    trade, err := client.Trading.Execute(&tradebitcoin.TradeRequest{
        Symbol: "BTC/USD",
        Side:   "buy",
        Amount: 0.1,
        Type:   "market",
    })
}`
  }
]

export default function ApiDocsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSection, setSelectedSection] = useState('all')

  const filteredSections = apiSections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.endpoints.some(endpoint => 
                           endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    const matchesSection = selectedSection === 'all' || section.title.toLowerCase() === selectedSection.toLowerCase()

    return matchesSearch && matchesSection
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3 mb-8 lg:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">API Documentation</h1>
              <p className="text-xl md:text-2xl mb-8">
                Build powerful trading applications with our comprehensive REST API and WebSocket streams.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                  <Key className="w-5 h-5 mr-2" />
                  Get API Key
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                  <Github className="w-5 h-5 mr-2" />
                  View on GitHub
                </Button>
              </div>
            </div>
            <div className="lg:w-1/3">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>API Endpoints</span>
                      <Badge variant="secondary">25+</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate Limit</span>
                      <Badge variant="secondary">1000/min</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>WebSocket Streams</span>
                      <Badge variant="secondary">Real-time</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>SDKs</span>
                      <Badge variant="secondary">5 Languages</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Getting Started</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to start using the TradeBitcoin API
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Key className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>1. Get API Keys</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Sign up for a TradeBitcoin account and generate your API keys from the dashboard.
                </p>
                <Button variant="outline" size="sm">
                  Generate Keys
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>2. Choose SDK</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Select from our official SDKs for JavaScript, Python, Go, and more.
                </p>
                <Button variant="outline" size="sm">
                  View SDKs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>3. Start Building</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Use our comprehensive documentation to build your trading application.
                </p>
                <Button variant="outline" size="sm">
                  View Examples
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* API Documentation */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">API Reference</h2>
            <p className="text-lg text-gray-600">
              Complete documentation for all API endpoints
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search endpoints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* API Sections */}
          <div className="space-y-8">
            {filteredSections.map(section => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {section.endpoints.map(endpoint => (
                      <div key={endpoint.path} className="border rounded-lg p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                          <div className="flex items-center gap-3 mb-2 md:mb-0">
                            <Badge 
                              variant={endpoint.method === 'GET' ? 'default' : 'secondary'}
                              className={
                                endpoint.method === 'GET' ? 'bg-green-600' :
                                endpoint.method === 'POST' ? 'bg-blue-600' :
                                endpoint.method === 'PUT' ? 'bg-yellow-600' :
                                endpoint.method === 'DELETE' ? 'bg-red-600' : 'bg-purple-600'
                              }
                            >
                              {endpoint.method}
                            </Badge>
                            <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                              {endpoint.path}
                            </code>
                          </div>
                          <div className="flex items-center gap-2">
                            {endpoint.authentication && (
                              <Badge variant="outline">
                                <Shield className="w-3 h-3 mr-1" />
                                Auth Required
                              </Badge>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(`${endpoint.method} ${endpoint.path}`)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{endpoint.description}</p>

                        {endpoint.parameters && endpoint.parameters.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-semibold mb-2">Parameters</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left py-2">Name</th>
                                    <th className="text-left py-2">Type</th>
                                    <th className="text-left py-2">Required</th>
                                    <th className="text-left py-2">Description</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {endpoint.parameters.map(param => (
                                    <tr key={param.name} className="border-b">
                                      <td className="py-2 font-mono">{param.name}</td>
                                      <td className="py-2">
                                        <Badge variant="outline">{param.type}</Badge>
                                      </td>
                                      <td className="py-2">
                                        {param.required ? (
                                          <Badge variant="destructive">Required</Badge>
                                        ) : (
                                          <Badge variant="secondary">Optional</Badge>
                                        )}
                                      </td>
                                      <td className="py-2">{param.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="font-semibold mb-2">Response</h4>
                          <p className="text-gray-600 mb-2">{endpoint.response.description}</p>
                          <div className="relative">
                            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                              <code>{endpoint.response.example}</code>
                            </pre>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(endpoint.response.example)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SDKs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Official SDKs</h2>
            <p className="text-lg text-gray-600">
              Integrate TradeBitcoin into your application with our official SDKs
            </p>
          </div>

          <Tabs defaultValue="javascript" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="go">Go</TabsTrigger>
            </TabsList>

            {sdks.map(sdk => (
              <TabsContent key={sdk.name} value={sdk.language}>
                <Card>
                  <CardHeader>
                    <CardTitle>{sdk.name}</CardTitle>
                    <CardDescription>{sdk.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Installation</h4>
                        <div className="relative">
                          <pre className="bg-gray-100 p-4 rounded-lg">
                            <code>{sdk.install}</code>
                          </pre>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(sdk.install)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Example Usage</h4>
                        <div className="relative">
                          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                            <code>{sdk.example}</code>
                          </pre>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(sdk.example)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button>
                          <Github className="w-4 h-4 mr-2" />
                          View on GitHub
                        </Button>
                        <Button variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Full Documentation
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Rate Limits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Rate Limits</h2>
            <p className="text-lg text-gray-600">
              Understand our API rate limits to ensure smooth integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Standard Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>REST API Requests</span>
                    <Badge>1,000 per minute</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>WebSocket Connections</span>
                    <Badge>10 per user</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Order Placement</span>
                    <Badge>100 per minute</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Data Requests</span>
                    <Badge>500 per minute</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Premium Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>REST API Requests</span>
                    <Badge variant="secondary">10,000 per minute</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>WebSocket Connections</span>
                    <Badge variant="secondary">50 per user</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Order Placement</span>
                    <Badge variant="secondary">1,000 per minute</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Data Requests</span>
                    <Badge variant="secondary">5,000 per minute</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Rate limits are reset every minute. Headers in the response indicate your current usage.
            </p>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Learn More About Rate Limits
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Building?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of developers building innovative trading applications with TradeBitcoin API.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
              <Key className="w-5 h-5 mr-2" />
              Get Your API Key
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
              <Download className="w-5 h-5 mr-2" />
              Download SDK
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}