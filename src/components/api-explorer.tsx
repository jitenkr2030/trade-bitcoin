'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Copy, 
  Download, 
  RefreshCw, 
  Key, 
  Code, 
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
  Trash2,
  Save,
  ExternalLink
} from 'lucide-react';

interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: Record<string, string>;
  body?: string;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  duration: number;
}

interface SavedRequest {
  id: string;
  name: string;
  request: ApiRequest;
  timestamp: Date;
}

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const methodColors = {
  GET: 'bg-green-100 text-green-800',
  POST: 'bg-blue-100 text-blue-800',
  PUT: 'bg-yellow-100 text-yellow-800',
  DELETE: 'bg-red-100 text-red-800',
  PATCH: 'bg-purple-100 text-purple-800'
};

const sampleRequests = [
  {
    name: 'Get API Info',
    request: {
      method: 'GET' as const,
      url: '/api',
      headers: defaultHeaders
    }
  },
  {
    name: 'Health Check',
    request: {
      method: 'GET' as const,
      url: '/api/health',
      headers: defaultHeaders
    }
  },
  {
    name: 'Get Trading Data',
    request: {
      method: 'GET' as const,
      url: '/api/trading',
      headers: {
        ...defaultHeaders,
        'Authorization': 'Bearer your-api-token'
      }
    }
  },
  {
    name: 'User Login',
    request: {
      method: 'POST' as const,
      url: '/api/auth/login',
      headers: defaultHeaders,
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'password123'
      })
    }
  }
];

export default function ApiExplorer() {
  const [request, setRequest] = useState<ApiRequest>({
    method: 'GET',
    url: '/api',
    headers: defaultHeaders,
    body: ''
  });
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([]);
  const [requestName, setRequestName] = useState('');
  const [showHeaders, setShowHeaders] = useState(true);
  const [showBody, setShowBody] = useState(false);
  const [authToken, setAuthToken] = useState('');

  const handleSendRequest = async () => {
    setLoading(true);
    const startTime = Date.now();
    
    try {
      const headers: Record<string, string> = {};
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value.trim()) {
          headers[key] = value;
        }
      });

      const config: RequestInit = {
        method: request.method,
        headers,
      };

      if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        config.body = request.body;
      }

      const response = await fetch(request.url, config);
      const endTime = Date.now();
      const duration = endTime - startTime;

      const responseData = await response.text();
      let parsedData;
      try {
        parsedData = JSON.parse(responseData);
      } catch {
        parsedData = responseData;
      }

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data: parsedData,
        duration
      });
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      setResponse({
        status: 0,
        statusText: 'Network Error',
        headers: {},
        data: { error: error instanceof Error ? error.message : 'Unknown error' },
        duration
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMethodChange = (method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') => {
    setRequest(prev => ({ ...prev, method }));
    if (method === 'GET') {
      setShowBody(false);
    } else {
      setShowBody(true);
    }
  };

  const handleHeaderChange = (key: string, value: string) => {
    setRequest(prev => ({
      ...prev,
      headers: { ...prev.headers, [key]: value }
    }));
  };

  const handleAddHeader = () => {
    const newKey = `Custom-${Object.keys(request.headers).length + 1}`;
    setRequest(prev => ({
      ...prev,
      headers: { ...prev.headers, [newKey]: '' }
    }));
  };

  const handleRemoveHeader = (key: string) => {
    const newHeaders = { ...request.headers };
    delete newHeaders[key];
    setRequest(prev => ({ ...prev, headers: newHeaders }));
  };

  const handleSaveRequest = () => {
    if (!requestName.trim()) return;
    
    const savedRequest: SavedRequest = {
      id: Date.now().toString(),
      name: requestName,
      request: { ...request },
      timestamp: new Date()
    };
    
    setSavedRequests(prev => [...prev, savedRequest]);
    setRequestName('');
  };

  const handleLoadRequest = (savedRequest: SavedRequest) => {
    setRequest({ ...savedRequest.request });
    setResponse(null);
  };

  const handleDeleteRequest = (id: string) => {
    setSavedRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
    }
  };

  const handleDownloadResponse = () => {
    if (response) {
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `response-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleLoadSample = (sample: typeof sampleRequests[0]) => {
    setRequest({ ...sample.request });
    setResponse(null);
  };

  const handleAddAuthToken = () => {
    if (authToken.trim()) {
      handleHeaderChange('Authorization', `Bearer ${authToken}`);
      setAuthToken('');
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 300 && status < 400) return 'text-yellow-600';
    if (status >= 400 && status < 500) return 'text-orange-600';
    if (status >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Explorer</h2>
          <p className="text-muted-foreground">
            Test API endpoints directly from your browser
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open('/api', '_blank')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            API Docs
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Request Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request</CardTitle>
              <CardDescription>
                Configure your API request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Method and URL */}
              <div className="flex gap-2">
                <Select value={request.method} onValueChange={handleMethodChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Enter API endpoint URL"
                  value={request.url}
                  onChange={(e) => setRequest(prev => ({ ...prev, url: e.target.value }))}
                  className="flex-1"
                />
                <Button onClick={handleSendRequest} disabled={loading}>
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>

              {/* Sample Requests */}
              <div>
                <h4 className="text-sm font-medium mb-2">Sample Requests</h4>
                <div className="flex flex-wrap gap-2">
                  {sampleRequests.map((sample, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadSample(sample)}
                    >
                      {sample.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Auth Token */}
              <div>
                <h4 className="text-sm font-medium mb-2">Authentication</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter auth token"
                    value={authToken}
                    onChange={(e) => setAuthToken(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleAddAuthToken}>
                    <Key className="h-4 w-4 mr-2" />
                    Add Auth
                  </Button>
                </div>
              </div>

              {/* Headers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Headers</h4>
                  <Button variant="ghost" size="sm" onClick={() => setShowHeaders(!showHeaders)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                {showHeaders && (
                  <div className="space-y-2">
                    {Object.entries(request.headers).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <Input
                          placeholder="Header name"
                          value={key}
                          onChange={(e) => {
                            const newHeaders = { ...request.headers };
                            delete newHeaders[key];
                            newHeaders[e.target.value] = value;
                            setRequest(prev => ({ ...prev, headers: newHeaders }));
                          }}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Header value"
                          value={value}
                          onChange={(e) => handleHeaderChange(key, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveHeader(key)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={handleAddHeader}>
                      Add Header
                    </Button>
                  </div>
                )}
              </div>

              {/* Body */}
              {showBody && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Body</h4>
                  <Textarea
                    placeholder="Enter request body (JSON)"
                    value={request.body || ''}
                    onChange={(e) => setRequest(prev => ({ ...prev, body: e.target.value }))}
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
              )}

              {/* Save Request */}
              <div className="flex gap-2">
                <Input
                  placeholder="Request name"
                  value={requestName}
                  onChange={(e) => setRequestName(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleSaveRequest}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Response Panel */}
          {response && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Response</CardTitle>
                    <CardDescription>
                      {response.duration}ms • {response.status} {response.statusText}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCopyResponse}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDownloadResponse}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="body" className="w-full">
                  <TabsList>
                    <TabsTrigger value="body">Body</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    <TabsTrigger value="status">Status</TabsTrigger>
                  </TabsList>
                  <TabsContent value="body">
                    <ScrollArea className="h-96">
                      <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                        <code>{JSON.stringify(response.data, null, 2)}</code>
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="headers">
                    <ScrollArea className="h-96">
                      <div className="space-y-2">
                        {Object.entries(response.headers).map(([key, value]) => (
                          <div key={key} className="flex justify-between p-2 bg-muted rounded">
                            <span className="font-medium">{key}:</span>
                            <span className="text-sm text-muted-foreground">{value}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="status">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Badge className={methodColors[request.method]}>
                          {request.method}
                        </Badge>
                        <div className={`text-lg font-semibold ${getStatusColor(response.status)}`}>
                          {response.status} {response.statusText}
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Request Information</h4>
                          <div className="space-y-1 text-sm">
                            <div><strong>URL:</strong> {request.url}</div>
                            <div><strong>Method:</strong> {request.method}</div>
                            <div><strong>Headers:</strong> {Object.keys(request.headers).length}</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Response Information</h4>
                          <div className="space-y-1 text-sm">
                            <div><strong>Status:</strong> {response.status} {response.statusText}</div>
                            <div><strong>Duration:</strong> {response.duration}ms</div>
                            <div><strong>Headers:</strong> {Object.keys(response.headers).length}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Saved Requests Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Requests</CardTitle>
              <CardDescription>
                Your saved API requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {savedRequests.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No saved requests yet
                    </p>
                  ) : (
                    savedRequests.map((savedRequest) => (
                      <Card key={savedRequest.id} className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={methodColors[savedRequest.request.method]}>
                              {savedRequest.request.method}
                            </Badge>
                            <span className="text-sm font-medium">{savedRequest.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRequest(savedRequest.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {savedRequest.request.url}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {savedRequest.timestamp.toLocaleString()}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleLoadRequest(savedRequest)}
                        >
                          Load Request
                        </Button>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Use Sample Requests</p>
                  <p className="text-xs text-muted-foreground">
                    Quick start with pre-configured requests
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Key className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Add Authentication</p>
                  <p className="text-xs text-muted-foreground">
                    Include auth tokens for protected endpoints
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Save className="h-4 w-4 text-purple-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Save Requests</p>
                  <p className="text-xs text-muted-foreground">
                    Store frequently used requests for quick access
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Code className="h-4 w-4 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Format JSON</p>
                  <p className="text-xs text-muted-foreground">
                    Responses are automatically formatted for readability
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}