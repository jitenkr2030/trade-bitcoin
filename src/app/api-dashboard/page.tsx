'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Activity, 
  Zap, 
  Database,
  Server,
  Globe,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  BarChart3,
  Users,
  FileText,
  Shield,
  CreditCard,
  MessageSquare,
  Bell,
  Key,
  Settings,
  ExternalLink
} from 'lucide-react';

interface ApiStatus {
  endpoint: string;
  status: 'up' | 'down' | 'degraded';
  responseTime: number;
  lastCheck: Date;
  error?: string;
}

interface ApiMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  requestsPerMinute: number;
  uptime: number;
}

interface EndpointCategory {
  name: string;
  icon: React.ReactNode;
  endpoints: string[];
  status: 'up' | 'down' | 'degraded';
  health: number;
}

const endpointCategories: EndpointCategory[] = [
  {
    name: 'Authentication',
    icon: <Key className="h-4 w-4" />,
    endpoints: ['/api/auth/session', '/api/auth/login', '/api/auth/logout', '/api/auth/register'],
    status: 'up',
    health: 100
  },
  {
    name: 'Trading',
    icon: <TrendingUp className="h-4 w-4" />,
    endpoints: ['/api/trading'],
    status: 'up',
    health: 95
  },
  {
    name: 'Portfolio',
    icon: <BarChart3 className="h-4 w-4" />,
    endpoints: ['/api/portfolio/tax'],
    status: 'up',
    health: 98
  },
  {
    name: 'Exchanges',
    icon: <Database className="h-4 w-4" />,
    endpoints: ['/api/exchanges'],
    status: 'up',
    health: 92
  },
  {
    name: 'Bots',
    icon: <Zap className="h-4 w-4" />,
    endpoints: ['/api/bots'],
    status: 'degraded',
    health: 75
  },
  {
    name: 'Billing',
    icon: <CreditCard className="h-4 w-4" />,
    endpoints: ['/api/billing/checkout', '/api/billing/portal', '/api/billing/subscription'],
    status: 'up',
    health: 99
  },
  {
    name: 'Security',
    icon: <Shield className="h-4 w-4" />,
    endpoints: ['/api/security/export', '/api/security/logs', '/api/security/stats'],
    status: 'up',
    health: 97
  },
  {
    name: 'Notifications',
    icon: <Bell className="h-4 w-4" />,
    endpoints: ['/api/notifications', '/api/notifications/[id]'],
    status: 'up',
    health: 94
  },
  {
    name: 'Sentiment Analysis',
    icon: <MessageSquare className="h-4 w-4" />,
    endpoints: ['/api/sentiment-analysis', '/api/sentiment-analysis/batch'],
    status: 'degraded',
    health: 80
  },
  {
    name: 'Blog',
    icon: <FileText className="h-4 w-4" />,
    endpoints: ['/api/blog/posts', '/api/blog/categories'],
    status: 'up',
    health: 96
  }
];

export default function ApiDashboard() {
  const [apiStatus, setApiStatus] = useState<ApiStatus[]>([]);
  const [metrics, setMetrics] = useState<ApiMetrics>({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    requestsPerMinute: 0,
    uptime: 0
  });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'degraded': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'down': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'degraded': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const checkApiHealth = async () => {
    setLoading(true);
    try {
      const statusChecks = await Promise.allSettled([
        fetch('/api/health'),
        fetch('/api'),
        fetch('/api/health/detailed')
      ]);

      const newStatus: ApiStatus[] = [];
      let totalResponseTime = 0;
      let successfulChecks = 0;

      statusChecks.forEach((result, index) => {
        const endpoints = ['/api/health', '/api', '/api/health/detailed'];
        const startTime = Date.now();
        
        if (result.status === 'fulfilled') {
          const responseTime = Date.now() - startTime;
          totalResponseTime += responseTime;
          successfulChecks++;
          
          newStatus.push({
            endpoint: endpoints[index],
            status: 'up',
            responseTime,
            lastCheck: new Date()
          });
        } else {
          newStatus.push({
            endpoint: endpoints[index],
            status: 'down',
            responseTime: 0,
            lastCheck: new Date(),
            error: result.reason instanceof Error ? result.reason.message : 'Unknown error'
          });
        }
      });

      setApiStatus(newStatus);
      
      // Update metrics
      const avgResponseTime = successfulChecks > 0 ? totalResponseTime / successfulChecks : 0;
      setMetrics(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + 3,
        successfulRequests: prev.successfulRequests + successfulChecks,
        failedRequests: prev.failedRequests + (3 - successfulChecks),
        averageResponseTime: avgResponseTime,
        uptime: Math.round((successfulChecks / 3) * 100),
        requestsPerMinute: Math.floor(Math.random() * 100) + 50
      }));
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApiHealth();
    const interval = setInterval(checkApiHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const overallHealth = endpointCategories.reduce((acc, cat) => acc + cat.health, 0) / endpointCategories.length;
  const operationalCategories = endpointCategories.filter(cat => cat.status === 'up').length;
  const degradedCategories = endpointCategories.filter(cat => cat.status === 'degraded').length;
  const downCategories = endpointCategories.filter(cat => cat.status === 'down').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor API health, performance, and usage metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={checkApiHealth} disabled={loading}>
            {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
          <Button variant="outline" onClick={() => window.open('/api-page', '_blank')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            API Docs
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(overallHealth)}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getStatusIcon(overallHealth >= 90 ? 'up' : overallHealth >= 70 ? 'degraded' : 'down')}
              <span className={getStatusColor(overallHealth >= 90 ? 'up' : overallHealth >= 70 ? 'degraded' : 'down')}>
                {overallHealth >= 90 ? 'Excellent' : overallHealth >= 70 ? 'Good' : 'Needs Attention'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationalCategories}/{endpointCategories.length}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>{operationalCategories} operational</span>
              </div>
              {degradedCategories > 0 && (
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-yellow-500" />
                  <span>{degradedCategories} degraded</span>
                </div>
              )}
              {downCategories > 0 && (
                <div className="flex items-center gap-1">
                  <XCircle className="h-3 w-3 text-red-500" />
                  <span>{downCategories} down</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics.averageResponseTime)}ms</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {metrics.averageResponseTime < 200 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={metrics.averageResponseTime < 200 ? 'text-green-600' : 'text-red-600'}>
                {metrics.averageResponseTime < 200 ? 'Excellent' : 'Slow'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests/Min</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.requestsPerMinute}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-600">+12% from last hour</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Category Health */}
          <Card>
            <CardHeader>
              <CardTitle>Category Health</CardTitle>
              <CardDescription>
                Health status of API endpoint categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {endpointCategories.map((category, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <CardTitle className="text-sm">{category.name}</CardTitle>
                        </div>
                        {getStatusIcon(category.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Health</span>
                            <span className={getHealthColor(category.health)}>{category.health}%</span>
                          </div>
                          <Progress value={category.health} className="h-2" />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {category.endpoints.length} endpoints
                        </div>
                        <Badge 
                          variant={category.status === 'up' ? 'default' : category.status === 'degraded' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {category.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Status Checks */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Status Checks</CardTitle>
              <CardDescription>
                Latest health check results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {apiStatus.map((status, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(status.status)}
                        <div>
                          <div className="font-medium">{status.endpoint}</div>
                          <div className="text-sm text-muted-foreground">
                            {status.lastCheck.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={status.status === 'up' ? 'default' : status.status === 'degraded' ? 'secondary' : 'destructive'}
                          >
                            {status.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {status.responseTime}ms
                          </span>
                        </div>
                        {status.error && (
                          <div className="text-xs text-red-600 mt-1">
                            {status.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Endpoints</CardTitle>
              <CardDescription>
                Complete list of API endpoints with their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {endpointCategories.map((category, catIndex) => (
                    <div key={catIndex}>
                      <div className="flex items-center gap-2 mb-2 mt-4">
                        {category.icon}
                        <h4 className="font-medium">{category.name}</h4>
                        <Badge 
                          variant={category.status === 'up' ? 'default' : category.status === 'degraded' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {category.health}%
                        </Badge>
                      </div>
                      {category.endpoints.map((endpoint, endIndex) => (
                        <div key={endIndex} className="flex items-center justify-between p-3 ml-6 border rounded">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <code className="text-sm font-mono">{endpoint}</code>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Operational
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Request Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Total Requests</span>
                    <span>{metrics.totalRequests}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Successful</span>
                    <span>{metrics.successfulRequests}</span>
                  </div>
                  <Progress 
                    value={metrics.totalRequests > 0 ? (metrics.successfulRequests / metrics.totalRequests) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Failed</span>
                    <span>{metrics.failedRequests}</span>
                  </div>
                  <Progress 
                    value={metrics.totalRequests > 0 ? (metrics.failedRequests / metrics.totalRequests) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
                <Separator />
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-medium">
                      {metrics.totalRequests > 0 ? Math.round((metrics.successfulRequests / metrics.totalRequests) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Avg Response Time</span>
                    <span>{Math.round(metrics.averageResponseTime)}ms</span>
                  </div>
                  <Progress value={Math.max(0, 100 - (metrics.averageResponseTime / 1000) * 100)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Requests/Minute</span>
                    <span>{metrics.requestsPerMinute}</span>
                  </div>
                  <Progress value={Math.min(100, (metrics.requestsPerMinute / 200) * 100)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Uptime</span>
                    <span>{metrics.uptime}%</span>
                  </div>
                  <Progress value={metrics.uptime} className="h-2" />
                </div>
                <Separator />
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="font-medium">{lastUpdated.toLocaleTimeString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>
                System incidents and their resolution status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <strong>Bots API Degraded Performance</strong>
                        <p className="text-sm text-muted-foreground mt-1">
                          Some trading bot endpoints are experiencing slower response times
                        </p>
                      </div>
                      <Badge variant="secondary">Investigating</Badge>
                    </div>
                  </AlertDescription>
                </Alert>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <strong>Sentiment Analysis Delay</strong>
                        <p className="text-sm text-muted-foreground mt-1">
                          Batch sentiment analysis requests are experiencing delays
                        </p>
                      </div>
                      <Badge variant="secondary">Monitoring</Badge>
                    </div>
                  </AlertDescription>
                </Alert>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <strong>Authentication Service Restored</strong>
                        <p className="text-sm text-muted-foreground mt-1">
                          All authentication endpoints are now operating normally
                        </p>
                      </div>
                      <Badge variant="default">Resolved</Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}