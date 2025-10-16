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
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  BarChart3, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Shield,
  Zap,
  Search,
  Plus,
  Download,
  Upload,
  Share2,
  Users,
  Activity,
  Layers,
  Grid3X3,
  Repeat,
  ArrowLeftRight,
  LineChart as LineChartIcon,
  PieChart,
  ShoppingCart,
  Eye,
  Cpu,
  Database,
  Settings,
  Play,
  Pause,
  Square,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ScatterChart, Scatter } from 'recharts';

interface MLModel {
  id: string;
  name: string;
  type: 'lstm' | 'random-forest' | 'svm' | 'neural-network' | 'gradient-boosting';
  status: 'training' | 'trained' | 'deployed' | 'error';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingTime: string;
  lastUpdated: string;
  description: string;
  features: string[];
  target: string;
  dataset: {
    name: string;
    size: number;
    startDate: string;
    endDate: string;
  };
  hyperparameters: Record<string, any>;
  performance: {
    trainLoss: number;
    validationLoss: number;
    testAccuracy: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

interface PredictionJob {
  id: string;
  modelId: string;
  modelName: string;
  symbol: string;
  timeframe: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  prediction: {
    direction: 'buy' | 'sell' | 'hold';
    confidence: number;
    targetPrice: number;
    stopLoss: number;
    timeframe: string;
  };
  createdAt: string;
  completedAt?: string;
  accuracy?: number;
}

interface FeatureImportance {
  feature: string;
  importance: number;
  description: string;
}

export default function MLIntegrationPage() {
  const [activeTab, setActiveTab] = useState('models');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);
  const [isTraining, setIsTraining] = useState(false);

  // Mock data for demonstration
  const [mlModels, setMlModels] = useState<MLModel[]>([
    {
      id: '1',
      name: 'BTC Price Predictor LSTM',
      type: 'lstm',
      status: 'deployed',
      accuracy: 0.8734,
      precision: 0.8456,
      recall: 0.8912,
      f1Score: 0.8678,
      trainingTime: '4h 32m',
      lastUpdated: '2024-01-15 14:30',
      description: 'Long Short-Term Memory network for Bitcoin price prediction using technical indicators and sentiment data',
      features: ['RSI', 'MACD', 'BB', 'Volume', 'Sentiment Score', 'Social Media Activity'],
      target: 'Price Direction (1h ahead)',
      dataset: {
        name: 'BTC Historical + Sentiment',
        size: 156789,
        startDate: '2020-01-01',
        endDate: '2024-01-01'
      },
      hyperparameters: {
        layers: 4,
        units: 128,
        dropout: 0.2,
        learning_rate: 0.001,
        batch_size: 32,
        epochs: 100
      },
      performance: {
        trainLoss: 0.2341,
        validationLoss: 0.2876,
        testAccuracy: 0.8734,
        sharpeRatio: 2.34,
        maxDrawdown: 12.5
      }
    },
    {
      id: '2',
      name: 'ETH Trend Detection RF',
      type: 'random-forest',
      status: 'trained',
      accuracy: 0.8123,
      precision: 0.7987,
      recall: 0.8345,
      f1Score: 0.8156,
      trainingTime: '2h 15m',
      lastUpdated: '2024-01-14 09:15',
      description: 'Random Forest classifier for Ethereum trend detection using multiple technical indicators',
      features: ['SMA', 'EMA', 'RSI', 'Stochastic', 'ADX', 'Volume Profile'],
      target: 'Trend Direction (4h ahead)',
      dataset: {
        name: 'ETH Technical Indicators',
        size: 98765,
        startDate: '2021-01-01',
        endDate: '2024-01-01'
      },
      hyperparameters: {
        n_estimators: 200,
        max_depth: 10,
        min_samples_split: 5,
        min_samples_leaf: 2,
        random_state: 42
      },
      performance: {
        trainLoss: 0.1876,
        validationLoss: 0.2341,
        testAccuracy: 0.8123,
        sharpeRatio: 1.98,
        maxDrawdown: 15.2
      }
    },
    {
      id: '3',
      name: 'Multi-Coin SVM Classifier',
      type: 'svm',
      status: 'training',
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      trainingTime: '1h 45m (est.)',
      lastUpdated: '2024-01-15 16:00',
      description: 'Support Vector Machine for multi-coin classification using market microstructure features',
      features: ['Order Book Depth', 'Trade Flow', 'Volatility', 'Correlation Matrix', 'Market Cap'],
      target: 'Coin Selection Score',
      dataset: {
        name: 'Multi-Coin Market Data',
        size: 234567,
        startDate: '2022-01-01',
        endDate: '2024-01-01'
      },
      hyperparameters: {
        kernel: 'rbf',
        C: 1.0,
        gamma: 'scale',
        probability: true
      },
      performance: {
        trainLoss: 0,
        validationLoss: 0,
        testAccuracy: 0,
        sharpeRatio: 0,
        maxDrawdown: 0
      }
    }
  ]);

  const [predictionJobs, setPredictionJobs] = useState<PredictionJob[]>([
    {
      id: '1',
      modelId: '1',
      modelName: 'BTC Price Predictor LSTM',
      symbol: 'BTC/USDT',
      timeframe: '1h',
      status: 'completed',
      prediction: {
        direction: 'buy',
        confidence: 0.87,
        targetPrice: 43250,
        stopLoss: 41800,
        timeframe: '4h'
      },
      createdAt: '2024-01-15 14:30',
      completedAt: '2024-01-15 14:35',
      accuracy: 0.85
    },
    {
      id: '2',
      modelId: '2',
      modelName: 'ETH Trend Detection RF',
      symbol: 'ETH/USDT',
      timeframe: '4h',
      status: 'running',
      prediction: {
        direction: 'hold',
        confidence: 0.72,
        targetPrice: 2250,
        stopLoss: 2150,
        timeframe: '12h'
      },
      createdAt: '2024-01-15 15:00'
    }
  ]);

  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([
    { feature: 'RSI', importance: 0.234, description: 'Relative Strength Index momentum indicator' },
    { feature: 'Sentiment Score', importance: 0.198, description: 'Market sentiment from news and social media' },
    { feature: 'MACD', importance: 0.176, description: 'Moving Average Convergence Divergence' },
    { feature: 'Volume', importance: 0.145, description: 'Trading volume analysis' },
    { feature: 'BB Width', importance: 0.123, description: 'Bollinger Bands volatility measure' },
    { feature: 'Social Media Activity', importance: 0.098, description: 'Social media mention frequency' },
    { feature: 'ADX', importance: 0.026, description: 'Average Directional Index trend strength' }
  ]);

  const filteredModels = mlModels.filter(model => 
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'lstm': return <Brain className="h-4 w-4" />;
      case 'random-forest': return <Activity className="h-4 w-4" />;
      case 'svm': return <Target className="h-4 w-4" />;
      case 'neural-network': return <Cpu className="h-4 w-4" />;
      case 'gradient-boosting': return <TrendingUp className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'text-green-600';
      case 'trained': return 'text-blue-600';
      case 'training': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'deployed': return 'default';
      case 'trained': return 'secondary';
      case 'training': return 'outline';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPredictionColor = (direction: string) => {
    switch (direction) {
      case 'buy': return 'text-green-600';
      case 'sell': return 'text-red-600';
      case 'hold': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const handleTrainModel = (modelId: string) => {
    setMlModels(prev => prev.map(model => {
      if (model.id === modelId) {
        return { ...model, status: 'training' as const };
      }
      return model;
    }));
    setIsTraining(true);
    
    // Simulate training completion
    setTimeout(() => {
      setMlModels(prev => prev.map(model => {
        if (model.id === modelId) {
          return { 
            ...model, 
            status: 'trained' as const,
            accuracy: 0.85 + Math.random() * 0.1,
            precision: 0.83 + Math.random() * 0.1,
            recall: 0.87 + Math.random() * 0.1,
            f1Score: 0.84 + Math.random() * 0.1,
            lastUpdated: new Date().toISOString()
          };
        }
        return model;
      }));
      setIsTraining(false);
    }, 3000);
  };

  const handleDeployModel = (modelId: string) => {
    setMlModels(prev => prev.map(model => {
      if (model.id === modelId) {
        return { ...model, status: 'deployed' as const };
      }
      return model;
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Machine Learning Integration</h1>
          <p className="text-muted-foreground">
            Advanced AI models for trading predictions and strategy optimization
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Model
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Models
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredModels.map((model) => (
              <Card key={model.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getModelTypeIcon(model.type)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{model.name}</h3>
                          <Badge variant={getStatusBadge(model.status)}>
                            {model.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{model.type.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {model.status === 'trained' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeployModel(model.id)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {model.status === 'deployed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTrainModel(model.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Accuracy</p>
                      <p className="font-semibold">{model.accuracy > 0 ? (model.accuracy * 100).toFixed(2) + '%' : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">F1 Score</p>
                      <p className="font-semibold">{model.f1Score > 0 ? (model.f1Score * 100).toFixed(2) + '%' : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Training Time</p>
                      <p className="font-semibold">{model.trainingTime}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Updated</p>
                      <p className="font-semibold">{new Date(model.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Training Progress</span>
                      <span>{model.status === 'training' ? '65%' : '100%'}</span>
                    </div>
                    <Progress value={model.status === 'training' ? 65 : 100} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedModel(model)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    {model.status === 'trained' && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleDeployModel(model.id)}
                      >
                        Deploy
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {predictionJobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{job.modelName}</h3>
                      <p className="text-sm text-muted-foreground">{job.symbol} - {job.timeframe}</p>
                    </div>
                    <Badge variant={job.status === 'completed' ? 'default' : job.status === 'running' ? 'outline' : 'secondary'}>
                      {job.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.prediction && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Prediction</span>
                        <span className={`font-semibold ${getPredictionColor(job.prediction.direction)}`}>
                          {job.prediction.direction.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Confidence</span>
                        <div className="flex items-center gap-2">
                          <Progress value={job.prediction.confidence * 100} className="h-2 w-20" />
                          <span className="text-sm font-semibold">{(job.prediction.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Target Price</span>
                          <p className="font-semibold">${job.prediction.targetPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stop Loss</span>
                          <p className="font-semibold">${job.prediction.stopLoss.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    <p>Created: {new Date(job.createdAt).toLocaleString()}</p>
                    {job.completedAt && (
                      <p>Completed: {new Date(job.completedAt).toLocaleString()}</p>
                    )}
                    {job.accuracy && (
                      <p>Accuracy: {(job.accuracy * 100).toFixed(2)}%</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Importance Analysis</CardTitle>
              <CardDescription>
                Understanding which features contribute most to model predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureImportance.map((feature, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{feature.feature}</span>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                      <span className="text-sm font-semibold">{(feature.importance * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={feature.importance * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={[
                    { name: 'Jan', accuracy: 0.82, precision: 0.80, recall: 0.84 },
                    { name: 'Feb', accuracy: 0.84, precision: 0.82, recall: 0.86 },
                    { name: 'Mar', accuracy: 0.83, precision: 0.81, recall: 0.85 },
                    { name: 'Apr', accuracy: 0.85, precision: 0.83, recall: 0.87 },
                    { name: 'May', accuracy: 0.87, precision: 0.85, recall: 0.89 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="accuracy" stroke="#8884d8" name="Accuracy" />
                    <Line type="monotone" dataKey="precision" stroke="#82ca9d" name="Precision" />
                    <Line type="monotone" dataKey="recall" stroke="#ffc658" name="Recall" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">CPU Usage</span>
                    <span className="text-sm font-semibold">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Memory Usage</span>
                    <span className="text-sm font-semibold">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">GPU Usage</span>
                    <span className="text-sm font-semibold">23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">API Response Time</span>
                    <span className="text-sm font-semibold">125ms</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedModel && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Model Details - {selectedModel.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Model Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span>{selectedModel.type.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant={getStatusBadge(selectedModel.status)}>
                      {selectedModel.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Training Time:</span>
                    <span>{selectedModel.trainingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span>{new Date(selectedModel.lastUpdated).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Performance Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span>{(selectedModel.accuracy * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precision:</span>
                    <span>{(selectedModel.precision * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recall:</span>
                    <span>{(selectedModel.recall * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>F1 Score:</span>
                    <span>{(selectedModel.f1Score * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Features</h4>
              <div className="flex flex-wrap gap-2">
                {selectedModel.features.map((feature, index) => (
                  <Badge key={index} variant="outline">{feature}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Target Variable</h4>
              <p className="text-sm text-muted-foreground">{selectedModel.target}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Dataset Information</h4>
              <div className="grid gap-4 md:grid-cols-2 text-sm">
                <div>
                  <p><strong>Name:</strong> {selectedModel.dataset.name}</p>
                  <p><strong>Size:</strong> {selectedModel.dataset.size.toLocaleString()} samples</p>
                </div>
                <div>
                  <p><strong>Period:</strong> {selectedModel.dataset.startDate} to {selectedModel.dataset.endDate}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Hyperparameters</h4>
              <div className="grid gap-2 md:grid-cols-3 text-sm">
                {Object.entries(selectedModel.hyperparameters).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span>{key}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}