'use client';

import { useState, useEffect } from 'react';
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
  Globe
} from 'lucide-react';
import ApiExplorer from '@/components/api-explorer';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  category: string;
  authentication: boolean;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  response?: {
    type: string;
    description: string;
  };
  example?: {
    request?: any;
    response?: any;
  };
}

const apiEndpoints: ApiEndpoint[] = [
  {
    method: 'GET',
    path: '/api',
    description: 'API root endpoint with available endpoints information',
    category: 'General',
    authentication: false,
    response: {
      type: 'JSON',
      description: 'API information and available endpoints'
    }
  },
  {
    method: 'GET',
    path: '/api/health',
    description: 'Basic health check endpoint',
    category: 'Health',
    authentication: false,
    response: {
      type: 'JSON',
      description: 'Health status information'
    }
  },
  {
    method: 'GET',
    path: '/api/health/detailed',
    description: 'Detailed health check with system metrics',
    category: 'Health',
    authentication: false,
    response: {
      type: 'JSON',
      description: 'Detailed health metrics and system information'
    }
  },
  {
    method: 'GET',
    path: '/api/auth/session',
    description: 'Get current user session information',
    category: 'Authentication',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'User session data'
    }
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    description: 'User login endpoint',
    category: 'Authentication',
    authentication: false,
    parameters: [
      { name: 'email', type: 'string', required: true, description: 'User email address' },
      { name: 'password', type: 'string', required: true, description: 'User password' }
    ],
    response: {
      type: 'JSON',
      description: 'Authentication token and user data'
    }
  },
  {
    method: 'POST',
    path: '/api/auth/logout',
    description: 'User logout endpoint',
    category: 'Authentication',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Logout confirmation'
    }
  },
  {
    method: 'POST',
    path: '/api/auth/register',
    description: 'User registration endpoint',
    category: 'Authentication',
    authentication: false,
    parameters: [
      { name: 'email', type: 'string', required: true, description: 'User email address' },
      { name: 'password', type: 'string', required: true, description: 'User password' },
      { name: 'name', type: 'string', required: true, description: 'User full name' }
    ],
    response: {
      type: 'JSON',
      description: 'Registration confirmation and user data'
    }
  },
  {
    method: 'GET',
    path: '/api/auth/csrf',
    description: 'Get CSRF token for form protection',
    category: 'Authentication',
    authentication: false,
    response: {
      type: 'JSON',
      description: 'CSRF token'
    }
  },
  {
    method: 'GET',
    path: '/api/trading',
    description: 'Get trading data and statistics',
    category: 'Trading',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Trading data and statistics'
    }
  },
  {
    method: 'GET',
    path: '/api/portfolio/tax',
    description: 'Get portfolio tax calculations',
    category: 'Portfolio',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Tax calculation results'
    }
  },
  {
    method: 'GET',
    path: '/api/exchanges',
    description: 'Get available exchanges and their status',
    category: 'Exchanges',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Exchange information and status'
    }
  },
  {
    method: 'GET',
    path: '/api/bots',
    description: 'Get trading bots and their status',
    category: 'Trading Bots',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Trading bots information'
    }
  },
  {
    method: 'GET',
    path: '/api/reports',
    description: 'Get trading reports and analytics',
    category: 'Reports',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Trading reports and analytics'
    }
  },
  {
    method: 'GET',
    path: '/api/notifications',
    description: 'Get user notifications',
    category: 'Notifications',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'User notifications list'
    }
  },
  {
    method: 'GET',
    path: '/api/notifications/[id]',
    description: 'Get specific notification details',
    category: 'Notifications',
    authentication: true,
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'Notification ID' }
    ],
    response: {
      type: 'JSON',
      description: 'Notification details'
    }
  },
  {
    method: 'GET',
    path: '/api/billing/checkout',
    description: 'Create billing checkout session',
    category: 'Billing',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Checkout session information'
    }
  },
  {
    method: 'GET',
    path: '/api/billing/portal',
    description: 'Access billing portal',
    category: 'Billing',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Billing portal access URL'
    }
  },
  {
    method: 'GET',
    path: '/api/billing/subscription',
    description: 'Get subscription information',
    category: 'Billing',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Subscription details'
    }
  },
  {
    method: 'GET',
    path: '/api/billing/invoices',
    description: 'Get billing invoices',
    category: 'Billing',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Invoice list and details'
    }
  },
  {
    method: 'POST',
    path: '/api/billing/webhook',
    description: 'Billing webhook handler',
    category: 'Billing',
    authentication: false,
    response: {
      type: 'JSON',
      description: 'Webhook processing result'
    }
  },
  {
    method: 'GET',
    path: '/api/security/export',
    description: 'Export security data',
    category: 'Security',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Security data export'
    }
  },
  {
    method: 'GET',
    path: '/api/security/logs',
    description: 'Get security logs',
    category: 'Security',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Security logs'
    }
  },
  {
    method: 'GET',
    path: '/api/security/stats',
    description: 'Get security statistics',
    category: 'Security',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Security statistics'
    }
  },
  {
    method: 'POST',
    path: '/api/backup',
    description: 'Create data backup',
    category: 'Backup',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Backup creation result'
    }
  },
  {
    method: 'GET',
    path: '/api/sentiment-analysis',
    description: 'Get sentiment analysis data',
    category: 'Sentiment Analysis',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Sentiment analysis results'
    }
  },
  {
    method: 'POST',
    path: '/api/sentiment-analysis/batch',
    description: 'Batch sentiment analysis',
    category: 'Sentiment Analysis',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Batch sentiment analysis results'
    }
  },
  {
    method: 'GET',
    path: '/api/blog/posts',
    description: 'Get blog posts',
    category: 'Blog',
    authentication: false,
    response: {
      type: 'JSON',
      description: 'Blog posts list'
    }
  },
  {
    method: 'GET',
    path: '/api/blog/categories',
    description: 'Get blog categories',
    category: 'Blog',
    authentication: false,
    response: {
      type: 'JSON',
      description: 'Blog categories'
    }
  },
  {
    method: 'GET',
    path: '/api/blog/posts/[slug]/comments',
    description: 'Get comments for a blog post',
    category: 'Blog',
    authentication: false,
    parameters: [
      { name: 'slug', type: 'string', required: true, description: 'Blog post slug' }
    ],
    response: {
      type: 'JSON',
      description: 'Blog post comments'
    }
  },
  {
    method: 'POST',
    path: '/api/blog/posts/[slug]/like',
    description: 'Like a blog post',
    category: 'Blog',
    authentication: true,
    parameters: [
      { name: 'slug', type: 'string', required: true, description: 'Blog post slug' }
    ],
    response: {
      type: 'JSON',
      description: 'Like operation result'
    }
  },
  {
    method: 'GET',
    path: '/api/webhooks',
    description: 'Get webhooks configuration',
    category: 'Webhooks',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Webhooks configuration'
    }
  },
  {
    method: 'POST',
    path: '/api/webhooks/[id]',
    description: 'Handle webhook events',
    category: 'Webhooks',
    authentication: false,
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'Webhook ID' }
    ],
    response: {
      type: 'JSON',
      description: 'Webhook processing result'
    }
  },
  {
    method: 'GET',
    path: '/api/maintenance',
    description: 'Get maintenance status',
    category: 'System',
    authentication: false,
    response: {
      type: 'JSON',
      description: 'Maintenance status information'
    }
  },
  {
    method: 'GET',
    path: '/api/rate-limit/status',
    description: 'Get rate limiting status',
    category: 'Rate Limiting',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Rate limiting status'
    }
  },
  {
    method: 'GET',
    path: '/api/exports',
    description: 'Get data exports',
    category: 'Exports',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Export data'
    }
  },
  {
    method: 'POST',
    path: '/api/users/profile/avatar',
    description: 'Update user profile avatar',
    category: 'Users',
    authentication: true,
    response: {
      type: 'JSON',
      description: 'Avatar update result'
    }
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

export default function ApiPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const filteredEndpoints = apiEndpoints.filter(endpoint => {
    const matchesCategory = selectedCategory === 'All' || endpoint.category === selectedCategory;
    const matchesSearch = endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleTestEndpoint = async (endpoint: ApiEndpoint) => {
    try {
      const response = await fetch(endpoint.path, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSelectedEndpoint({ ...endpoint, example: { response: data } });
    } catch (error) {
      setSelectedEndpoint({ 
        ...endpoint, 
        example: { 
          response: { 
            error: error instanceof Error ? error.message : 'Unknown error' 
          } 
        } 
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
          <p className="text-muted-foreground">
            Explore and test the Trading Platform API endpoints
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open('/api', '_blank')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View API Root
          </Button>
          <Button variant="outline" onClick={() => window.open('/api-dashboard', '_blank')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            API Dashboard
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Docs
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-1">
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

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
            <CardDescription>
              {filteredEndpoints.length} endpoints found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredEndpoints.map((endpoint, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
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
                              Auth Required
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyPath(endpoint.path)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTestEndpoint(endpoint)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                            {endpoint.path}
                          </code>
                          {copiedPath === endpoint.path && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {endpoint.description}
                        </p>
                        {endpoint.parameters && endpoint.parameters.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Parameters</h4>
                            <div className="space-y-1">
                              {endpoint.parameters.map((param, paramIndex) => (
                                <div key={paramIndex} className="flex items-center gap-2 text-sm">
                                  <code className="bg-muted px-1 rounded">{param.name}</code>
                                  <Badge variant="outline" className="text-xs">
                                    {param.type}
                                  </Badge>
                                  {param.required && (
                                    <Badge variant="destructive" className="text-xs">
                                      required
                                    </Badge>
                                  )}
                                  <span className="text-muted-foreground">
                                    - {param.description}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedEndpoint === endpoint && selectedEndpoint.example && (
                          <div className="mt-4">
                            <Separator className="my-3" />
                            <h4 className="text-sm font-medium mb-2">Response Example</h4>
                            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                              <code>{JSON.stringify(selectedEndpoint.example.response, null, 2)}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Usage Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="authentication" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="rate-limiting">Rate Limiting</TabsTrigger>
              <TabsTrigger value="errors">Error Handling</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="explorer">API Explorer</TabsTrigger>
            </TabsList>
            <TabsContent value="authentication" className="space-y-4">
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  Most API endpoints require authentication. Include your API token in the Authorization header.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <h4 className="font-medium">Authentication Header</h4>
                <pre className="bg-muted p-3 rounded text-sm">
                  <code>Authorization: Bearer your-api-token</code>
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="rate-limiting" className="space-y-4">
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  API requests are rate limited to ensure fair usage. Check your rate limit status using the dedicated endpoint.
                </AlertDescription>
              </Alert>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Rate Limits</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Authenticated users: 1000 requests/hour</li>
                    <li>• Unauthenticated users: 100 requests/hour</li>
                    <li>• Burst limit: 100 requests/minute</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Response Headers</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• X-RateLimit-Limit: Request limit</li>
                    <li>• X-RateLimit-Remaining: Remaining requests</li>
                    <li>• X-RateLimit-Reset: Reset time</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="errors" className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  All API errors return consistent error responses with status codes and detailed messages.
                </AlertDescription>
              </Alert>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Error Response Format</h4>
                  <pre className="bg-muted p-3 rounded text-sm">
                    <code>{`{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": "Additional error details"
  }
}`}</code>
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Common HTTP Status Codes</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">200</Badge>
                      <span className="text-sm">Success</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-100 text-yellow-800">400</Badge>
                      <span className="text-sm">Bad Request</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-100 text-yellow-800">401</Badge>
                      <span className="text-sm">Unauthorized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-100 text-yellow-800">403</Badge>
                      <span className="text-sm">Forbidden</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-100 text-yellow-800">404</Badge>
                      <span className="text-sm">Not Found</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-800">429</Badge>
                      <span className="text-sm">Too Many Requests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-800">500</Badge>
                      <span className="text-sm">Internal Server Error</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-800">503</Badge>
                      <span className="text-sm">Service Unavailable</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="examples" className="space-y-4">
              <Alert>
                <Code className="h-4 w-4" />
                <AlertDescription>
                  Here are some common examples of how to use the API with different programming languages.
                </AlertDescription>
              </Alert>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">JavaScript/Node.js</h4>
                  <pre className="bg-muted p-3 rounded text-sm">
                    <code>{`// Using fetch API
const response = await fetch('/api/trading', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your-api-token',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`}</code>
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Python</h4>
                  <pre className="bg-muted p-3 rounded text-sm">
                    <code>{`import requests

headers = {
    'Authorization': 'Bearer your-api-token',
    'Content-Type': 'application/json'
}

response = requests.get('/api/trading', headers=headers)
data = response.json()
print(data)`}</code>
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium mb-2">cURL</h4>
                  <pre className="bg-muted p-3 rounded text-sm">
                    <code>{`curl -X GET "/api/trading" \\
  -H "Authorization: Bearer your-api-token" \\
  -H "Content-Type: application/json"`}</code>
                  </pre>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="explorer" className="space-y-4">
              <Alert>
                <Code className="h-4 w-4" />
                <AlertDescription>
                  Interactive API explorer to test endpoints directly from your browser. 
                  Try the sample requests or configure your own custom requests.
                </AlertDescription>
              </Alert>
              <ApiExplorer />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}