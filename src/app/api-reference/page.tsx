'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, 
  Code, 
  Key, 
  Play, 
  Copy, 
  Download, 
  ExternalLink,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Shield,
  Database,
  Users,
  FileText,
  Settings,
  BarChart3,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Bell,
  CreditCard,
  Lock,
  Server,
  Globe,
  ArrowRight,
  Info,
  Asterisk,
  Hash,
  Type
} from 'lucide-react';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  title: string;
  description: string;
  category: string;
  version: string;
  authentication: boolean;
  rateLimit: {
    requests: number;
    window: string;
  };
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: string;
    defaultValue?: string;
    validation?: string;
  }>;
  requestBody?: {
    contentType: string;
    schema: any;
    example: any;
  };
  response: {
    status: number;
    description: string;
    schema: any;
    example: any;
  }[];
  errors?: Array<{
    status: number;
    code: string;
    description: string;
  }>;
  examples?: Array<{
    language: string;
    code: string;
  }>;
  notes?: string[];
  relatedEndpoints?: string[];
}

const apiEndpoints: ApiEndpoint[] = [
  {
    id: 'api-root',
    method: 'GET',
    path: '/api',
    title: 'API Root',
    description: 'Returns information about the API including available endpoints, version, and documentation links.',
    category: 'General',
    version: '1.0.0',
    authentication: false,
    rateLimit: { requests: 100, window: '1h' },
    response: [
      {
        status: 200,
        description: 'API information retrieved successfully',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            version: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
            endpoints: { type: 'object' },
            documentation: { type: 'object' }
          }
        },
        example: {
          message: 'Welcome to the Trading Platform API',
          version: '1.0.0',
          timestamp: '2025-01-08T09:37:32.609Z',
          endpoints: {
            health: '/api/health',
            auth: {
              session: '/api/auth/session'
            }
          }
        }
      }
    ],
    examples: [
      {
        language: 'curl',
        code: 'curl -X GET "https://api.example.com/api"'
      },
      {
        language: 'JavaScript',
        code: 'fetch("/api").then(response => response.json()).then(data => console.log(data));'
      }
    ]
  },
  {
    id: 'health-check',
    method: 'GET',
    path: '/api/health',
    title: 'Health Check',
    description: 'Basic health check endpoint to verify API is running and responding.',
    category: 'Health',
    version: '1.0.0',
    authentication: false,
    rateLimit: { requests: 200, window: '1h' },
    response: [
      {
        status: 200,
        description: 'API is healthy',
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['healthy'] },
            timestamp: { type: 'string', format: 'date-time' },
            uptime: { type: 'number' },
            version: { type: 'string' }
          }
        },
        example: {
          status: 'healthy',
          timestamp: '2025-01-08T09:37:32.609Z',
          uptime: 86400,
          version: '1.0.0'
        }
      }
    ]
  },
  {
    id: 'auth-login',
    method: 'POST',
    path: '/api/auth/login',
    title: 'User Login',
    description: 'Authenticate user credentials and return access token.',
    category: 'Authentication',
    version: '1.0.0',
    authentication: false,
    rateLimit: { requests: 10, window: '1m' },
    parameters: [
      {
        name: 'email',
        type: 'string',
        required: true,
        description: 'User email address',
        example: 'user@example.com',
        validation: 'Must be a valid email address'
      },
      {
        name: 'password',
        type: 'string',
        required: true,
        description: 'User password',
        validation: 'Minimum 8 characters, must include uppercase, lowercase, and number'
      }
    ],
    requestBody: {
      contentType: 'application/json',
      schema: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 }
        }
      },
      example: {
        email: 'user@example.com',
        password: 'Password123'
      }
    },
    response: [
      {
        status: 200,
        description: 'Login successful',
        schema: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' }
              }
            },
            expiresAt: { type: 'string', format: 'date-time' }
          }
        },
        example: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 'user_123',
            email: 'user@example.com',
            name: 'John Doe'
          },
          expiresAt: '2025-01-08T10:37:32.609Z'
        }
      }
    ],
    errors: [
      {
        status: 400,
        code: 'INVALID_CREDENTIALS',
        description: 'Invalid email or password'
      },
      {
        status: 429,
        code: 'RATE_LIMIT_EXCEEDED',
        description: 'Too many login attempts'
      }
    ],
    examples: [
      {
        language: 'curl',
        code: `curl -X POST "https://api.example.com/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"Password123"}'`
      },
      {
        language: 'JavaScript',
        code: `fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'Password123'
  })
}).then(response => response.json())
.then(data => console.log(data));`
      }
    ],
    notes: [
      'The token expires after 24 hours',
      'Failed login attempts are tracked and may result in temporary lockout',
      'Use HTTPS in production environments'
    ]
  },
  {
    id: 'trading-data',
    method: 'GET',
    path: '/api/trading',
    title: 'Get Trading Data',
    description: 'Retrieve comprehensive trading data including market statistics, user positions, and recent trades.',
    category: 'Trading',
    version: '1.0.0',
    authentication: true,
    rateLimit: { requests: 60, window: '1m' },
    parameters: [
      {
        name: 'symbols',
        type: 'string',
        required: false,
        description: 'Comma-separated list of trading symbols',
        example: 'BTC/USD,ETH/USD',
        defaultValue: 'all'
      },
      {
        name: 'timeframe',
        type: 'string',
        required: false,
        description: 'Timeframe for data aggregation',
        example: '1h',
        defaultValue: '1d',
        validation: 'Must be one of: 1m, 5m, 15m, 1h, 4h, 1d, 1w, 1M'
      },
      {
        name: 'limit',
        type: 'integer',
        required: false,
        description: 'Maximum number of records to return',
        example: '100',
        defaultValue: '50',
        validation: 'Must be between 1 and 1000'
      }
    ],
    response: [
      {
        status: 200,
        description: 'Trading data retrieved successfully',
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  symbol: { type: 'string' },
                  price: { type: 'number' },
                  change24h: { type: 'number' },
                  volume24h: { type: 'number' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'integer' },
                limit: { type: 'integer' },
                offset: { type: 'integer' }
              }
            }
          }
        },
        example: {
          data: [
            {
              symbol: 'BTC/USD',
              price: 45000.00,
              change24h: 2.5,
              volume24h: 1000000000,
              timestamp: '2025-01-08T09:37:32.609Z'
            }
          ],
          pagination: {
            total: 1,
            limit: 50,
            offset: 0
          }
        }
      }
    ],
    errors: [
      {
        status: 401,
        code: 'UNAUTHORIZED',
        description: 'Authentication required'
      },
      {
        status: 400,
        code: 'INVALID_PARAMETERS',
        description: 'Invalid query parameters'
      }
    ],
    examples: [
      {
        language: 'curl',
        code: `curl -X GET "https://api.example.com/api/trading?symbols=BTC/USD,ETH/USD&timeframe=1h&limit=100" \\
  -H "Authorization: Bearer your-token"`
      }
    ],
    relatedEndpoints: ['/api/exchanges', '/api/portfolio/tax']
  }
];

const categories = [
  'All',
  'General',
  'Health',
  'Authentication',
  'Trading',
  'Portfolio',
  'Exchanges',
  'Trading Bots',
  'Reports',
  'Notifications',
  'Billing',
  'Security',
  'Backup',
  'Sentiment Analysis',
  'Blog',
  'Webhooks',
  'System',
  'Rate Limiting',
  'Exports',
  'Users'
];

const methodColors = {
  GET: 'bg-green-100 text-green-800',
  POST: 'bg-blue-100 text-blue-800',
  PUT: 'bg-yellow-100 text-yellow-800',
  DELETE: 'bg-red-100 text-red-800',
  PATCH: 'bg-purple-100 text-purple-800'
};

const categoryIcons = {
  'General': <Globe className="h-4 w-4" />,
  'Health': <CheckCircle className="h-4 w-4" />,
  'Authentication': <Key className="h-4 w-4" />,
  'Trading': <TrendingUp className="h-4 w-4" />,
  'Portfolio': <BarChart3 className="h-4 w-4" />,
  'Exchanges': <Database className="h-4 w-4" />,
  'Trading Bots': <Zap className="h-4 w-4" />,
  'Reports': <FileText className="h-4 w-4" />,
  'Notifications': <Bell className="h-4 w-4" />,
  'Billing': <CreditCard className="h-4 w-4" />,
  'Security': <Shield className="h-4 w-4" />,
  'Backup': <Server className="h-4 w-4" />,
  'Sentiment Analysis': <MessageSquare className="h-4 w-4" />,
  'Blog': <BookOpen className="h-4 w-4" />,
  'Webhooks': <ExternalLink className="h-4 w-4" />,
  'System': <Settings className="h-4 w-4" />,
  'Rate Limiting': <Clock className="h-4 w-4" />,
  'Exports': <Download className="h-4 w-4" />,
  'Users': <Users className="h-4 w-4" />
};

export default function ApiReference() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredEndpoints = apiEndpoints.filter(endpoint => {
    const matchesCategory = selectedCategory === 'All' || endpoint.category === selectedCategory;
    const matchesSearch = endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderSchema = (schema: any, level = 0) => {
    if (!schema) return null;

    const indent = '  '.repeat(level);
    
    if (schema.type === 'object') {
      return (
        <div className="font-mono text-sm">
          <div>{indent}{'{'}</div>
          {Object.entries(schema.properties || {}).map(([key, value]: [string, any]) => (
            <div key={key}>
              <div>{indent}  {key}: {value.type}{value.enum ? ` (${value.enum.join(', ')})` : ''}{value.format ? ` [${value.format}]` : ''}{value.minLength ? ` min: ${value.minLength}` : ''}{value.maxLength ? ` max: ${value.maxLength}` : ''}{value.minimum ? ` min: ${value.minimum}` : ''}{value.maximum ? ` max: ${value.maximum}` : ''}</div>
            </div>
          ))}
          <div>{indent}{'}'}</div>
        </div>
      );
    } else if (schema.type === 'array') {
      return (
        <div className="font-mono text-sm">
          <div>{indent}Array[{schema.items?.type || 'object'}]</div>
        </div>
      );
    } else {
      return (
        <div className="font-mono text-sm">
          <div>{indent}{schema.type}{schema.enum ? ` (${schema.enum.join(', ')})` : ''}{schema.format ? ` [${schema.format}]` : ''}</div>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Reference</h1>
          <p className="text-muted-foreground">
            Complete API documentation with detailed endpoint specifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open('/api', '_blank')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            API Root
          </Button>
          <Button variant="outline" onClick={() => window.open('/api-page', '_blank')}>
            <BookOpen className="h-4 w-4 mr-2" />
            API Docs
          </Button>
          <Button variant="outline" onClick={() => window.open('/api-dashboard', '_blank')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search endpoints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center gap-2">
                        {categoryIcons[category as keyof typeof categoryIcons]}
                        {category}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Statistics</label>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Endpoints:</span>
                  <span className="font-medium">{apiEndpoints.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Filtered:</span>
                  <span className="font-medium">{filteredEndpoints.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Authenticated:</span>
                  <span className="font-medium">
                    {apiEndpoints.filter(e => e.authentication).length}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Endpoint List */}
          <Card>
            <CardHeader>
              <CardTitle>Endpoints</CardTitle>
              <CardDescription>
                {filteredEndpoints.length} endpoints found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {filteredEndpoints.map((endpoint) => (
                    <Card 
                      key={endpoint.id} 
                      className={`hover:shadow-md transition-shadow cursor-pointer ${
                        selectedEndpoint?.id === endpoint.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedEndpoint(endpoint)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Badge className={methodColors[endpoint.method]}>
                              {endpoint.method}
                            </Badge>
                            <div className="flex items-center gap-2">
                              {categoryIcons[endpoint.category as keyof typeof categoryIcons]}
                              <Badge variant="outline">{endpoint.category}</Badge>
                            </div>
                            {endpoint.authentication && (
                              <Badge variant="secondary">
                                <Key className="h-3 w-3 mr-1" />
                                Auth
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            v{endpoint.version}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                              {endpoint.path}
                            </code>
                          </div>
                          <h4 className="font-medium">{endpoint.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {endpoint.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {endpoint.rateLimit.requests}/{endpoint.rateLimit.window}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Endpoint Details */}
          {selectedEndpoint && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={methodColors[selectedEndpoint.method]}>
                        {selectedEndpoint.method}
                      </Badge>
                      <Badge variant="outline">{selectedEndpoint.category}</Badge>
                      {selectedEndpoint.authentication && (
                        <Badge variant="secondary">
                          <Key className="h-3 w-3 mr-1" />
                          Auth Required
                        </Badge>
                      )}
                      <Badge variant="outline">v{selectedEndpoint.version}</Badge>
                    </div>
                    <CardTitle>{selectedEndpoint.title}</CardTitle>
                    <CardDescription>{selectedEndpoint.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="font-medium mb-3">Endpoint Information</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Path:</span>
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                          {selectedEndpoint.path}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Type className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Method:</span>
                        <Badge className={methodColors[selectedEndpoint.method]}>
                          {selectedEndpoint.method}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Rate Limit:</span>
                        <span className="text-sm font-medium">
                          {selectedEndpoint.rateLimit.requests} requests per {selectedEndpoint.rateLimit.window}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Authentication:</span>
                        <Badge variant={selectedEndpoint.authentication ? 'default' : 'secondary'}>
                          {selectedEndpoint.authentication ? 'Required' : 'Not Required'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parameters */}
                {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Parameters</h4>
                    <div className="space-y-3">
                      {selectedEndpoint.parameters.map((param, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                              {param.name}
                            </code>
                            <Badge variant="outline">{param.type}</Badge>
                            {param.required && (
                              <Badge variant="destructive" className="text-xs">
                                <Asterisk className="h-3 w-3 mr-1" />
                                required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {param.description}
                          </p>
                          {param.example && (
                            <div className="text-xs">
                              <span className="font-medium">Example:</span> {param.example}
                            </div>
                          )}
                          {param.defaultValue && (
                            <div className="text-xs">
                              <span className="font-medium">Default:</span> {param.defaultValue}
                            </div>
                          )}
                          {param.validation && (
                            <div className="text-xs">
                              <span className="font-medium">Validation:</span> {param.validation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Response */}
                <div>
                  <h4 className="font-medium mb-3">Response</h4>
                  <div className="space-y-4">
                    {selectedEndpoint.response.map((response, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge 
                            variant={response.status >= 200 && response.status < 300 ? 'default' : 'destructive'}
                          >
                            {response.status}
                          </Badge>
                          <span className="text-sm font-medium">{response.description}</span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium mb-2">Example</h5>
                            <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                              <code>{JSON.stringify(response.example, null, 2)}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Examples */}
                {selectedEndpoint.examples && selectedEndpoint.examples.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Code Examples</h4>
                    <div className="space-y-4">
                      {selectedEndpoint.examples.map((example, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-medium">{example.language}</h5>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyCode(example.code)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                            <code>{example.code}</code>
                          </pre>
                          {copiedCode === example.code && (
                            <div className="text-xs text-green-600 mt-1">
                              Copied to clipboard!
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}