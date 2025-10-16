'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { 
  Download, 
  Eye, 
  Star, 
  Users, 
  TrendingUp, 
  Calendar, 
  Filter,
  Search,
  Grid3X3,
  Repeat,
  ArrowLeftRight,
  Brain,
  BarChart3,
  Zap,
  Shield,
  Target,
  Activity,
  Award,
  BookOpen,
  Code,
  Settings,
  Play,
  Plus,
  Heart,
  Share2,
  Bookmark,
  Clock,
  DollarSign,
  Percent,
  PieChart,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

interface BotTemplate {
  id: string
  name: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  longDescription: string
  tags: string[]
  popularity: number
  rating: number
  reviews: number
  downloads: number
  creator: {
    name: string
    avatar: string
    verified: boolean
    joinDate: string
  }
  performance: {
    avgReturn: number
    maxDrawdown: number
    winRate: number
    sharpeRatio: number
    profitFactor: number
  }
  features: string[]
  requirements: string[]
  supportedExchanges: string[]
  timeframe: string[]
  indicators: string[]
  riskLevel: 'low' | 'medium' | 'high'
  minCapital: number
  estimatedSetupTime: string
  lastUpdated: string
  preview: {
    equityCurve: { date: string; value: number }[]
    drawdownChart: { date: string; drawdown: number }[]
    monthlyReturns: { month: string; return: number }[]
  }
  pricing: {
    type: 'free' | 'premium' | 'enterprise'
    price?: number
    trialPeriod?: string
  }
  codePreview: string
  configuration: {
    parameters: Array<{
      name: string
      type: 'number' | 'string' | 'boolean' | 'select'
      defaultValue: any
      description: string
      options?: string[]
    }>
  }
}

const mockTemplates: BotTemplate[] = [
  {
    id: '1',
    name: 'RSI Divergence Hunter',
    category: 'Momentum',
    difficulty: 'intermediate',
    description: 'Identifies RSI divergences for trend reversal signals',
    longDescription: 'This advanced trading template uses RSI divergence detection combined with volume confirmation and multiple timeframe analysis to identify high-probability trend reversal opportunities. The algorithm incorporates dynamic stop-loss management and position sizing based on market volatility.',
    tags: ['RSI', 'Divergence', 'Momentum', 'Multi-timeframe'],
    popularity: 85,
    rating: 4.5,
    reviews: 234,
    downloads: 1234,
    creator: {
      name: 'CryptoSignals',
      avatar: '/avatars/crypto-signals.jpg',
      verified: true,
      joinDate: '2023-01-15'
    },
    performance: {
      avgReturn: 28.5,
      maxDrawdown: -12.3,
      winRate: 68.2,
      sharpeRatio: 2.1,
      profitFactor: 2.4
    },
    features: [
      'RSI divergence detection',
      'Volume confirmation',
      'Multi-timeframe analysis',
      'Dynamic stop-loss',
      'Position sizing',
      'Risk management'
    ],
    requirements: [
      'Minimum capital: $1,000',
      'Supported exchanges: Binance, Coinbase Pro',
      'Timeframes: 1h, 4h, 1d',
      'Indicators: RSI, Volume, Moving Averages'
    ],
    supportedExchanges: ['Binance', 'Coinbase Pro', 'Kraken', 'FTX'],
    timeframe: ['1h', '4h', '1d'],
    indicators: ['RSI', 'Volume', 'EMA', 'MACD'],
    riskLevel: 'medium',
    minCapital: 1000,
    estimatedSetupTime: '15 minutes',
    lastUpdated: '2024-01-10',
    preview: {
      equityCurve: [
        { date: 'Jan', value: 10000 },
        { date: 'Feb', value: 10850 },
        { date: 'Mar', value: 11200 },
        { date: 'Apr', value: 12850 },
        { date: 'May', value: 13200 },
        { date: 'Jun', value: 12850 }
      ],
      drawdownChart: [
        { date: 'Jan', drawdown: -2.1 },
        { date: 'Feb', drawdown: -5.8 },
        { date: 'Mar', drawdown: -8.2 },
        { date: 'Apr', drawdown: -12.3 },
        { date: 'May', drawdown: -6.1 },
        { date: 'Jun', drawdown: -3.2 }
      ],
      monthlyReturns: [
        { month: 'Jan', return: 8.5 },
        { month: 'Feb', return: 3.2 },
        { month: 'Mar', return: 14.7 },
        { month: 'Apr', return: 2.8 },
        { month: 'May', return: -2.7 },
        { month: 'Jun', return: -2.6 }
      ]
    },
    pricing: {
      type: 'free'
    },
    codePreview: `// RSI Divergence Detection Strategy
function checkRSIDivergence(data) {
  const rsi = calculateRSI(data.close, 14);
  const price = data.close;
  
  // Check for bullish divergence
  if (price.low < previousPrice.low && rsi > previousRSI) {
    return 'bullish_signal';
  }
  
  // Check for bearish divergence
  if (price.high > previousPrice.high && rsi < previousRSI) {
    return 'bearish_signal';
  }
  
  return 'no_signal';
}`,
    configuration: {
      parameters: [
        {
          name: 'RSI Period',
          type: 'number',
          defaultValue: 14,
          description: 'Period for RSI calculation'
        },
        {
          name: 'Overbought Level',
          type: 'number',
          defaultValue: 70,
          description: 'RSI level considered overbought'
        },
        {
          name: 'Oversold Level',
          type: 'number',
          defaultValue: 30,
          description: 'RSI level considered oversold'
        },
        {
          name: 'Position Size',
          type: 'number',
          defaultValue: 2,
          description: 'Position size as percentage of capital'
        }
      ]
    }
  },
  {
    id: '2',
    name: 'Bollinger Bands Squeeze',
    category: 'Volatility',
    difficulty: 'beginner',
    description: 'Trades Bollinger Bands squeeze patterns for breakout opportunities',
    longDescription: 'This beginner-friendly template identifies low volatility periods (Bollinger Bands squeeze) and anticipates breakout moves. The strategy uses volatility contraction as a signal for potential trend expansion, with built-in risk management and position sizing.',
    tags: ['Bollinger Bands', 'Volatility', 'Breakout', 'Beginner Friendly'],
    popularity: 92,
    rating: 4.7,
    reviews: 456,
    downloads: 2156,
    creator: {
      name: 'BotMaster',
      avatar: '/avatars/botmaster.jpg',
      verified: true,
      joinDate: '2022-06-20'
    },
    performance: {
      avgReturn: 22.3,
      maxDrawdown: -8.5,
      winRate: 72.1,
      sharpeRatio: 1.8,
      profitFactor: 2.1
    },
    features: [
      'Bollinger Bands squeeze detection',
      'Volatility breakout trading',
      'Risk management',
      'Position sizing',
      'Stop-loss automation',
      'Take-profit targets'
    ],
    requirements: [
      'Minimum capital: $500',
      'Supported exchanges: All major exchanges',
      'Timeframes: 15m, 1h, 4h',
      'Indicators: Bollinger Bands, ATR'
    ],
    supportedExchanges: ['Binance', 'Coinbase Pro', 'Kraken', 'FTX', 'Huobi'],
    timeframe: ['15m', '1h', '4h'],
    indicators: ['Bollinger Bands', 'ATR', 'Volume'],
    riskLevel: 'low',
    minCapital: 500,
    estimatedSetupTime: '10 minutes',
    lastUpdated: '2024-01-08',
    preview: {
      equityCurve: [
        { date: 'Jan', value: 10000 },
        { date: 'Feb', value: 10200 },
        { date: 'Mar', value: 10850 },
        { date: 'Apr', value: 11200 },
        { date: 'May', value: 12230 },
        { date: 'Jun', value: 12230 }
      ],
      drawdownChart: [
        { date: 'Jan', drawdown: -1.2 },
        { date: 'Feb', drawdown: -3.8 },
        { date: 'Mar', drawdown: -5.2 },
        { date: 'Apr', drawdown: -8.5 },
        { date: 'May', drawdown: -4.1 },
        { date: 'Jun', drawdown: -2.1 }
      ],
      monthlyReturns: [
        { month: 'Jan', return: 2.0 },
        { month: 'Feb', return: 6.4 },
        { month: 'Mar', return: 3.2 },
        { month: 'Apr', return: 9.2 },
        { month: 'May', return: 0.0 },
        { month: 'Jun', return: 0.0 }
      ]
    },
    pricing: {
      type: 'free'
    },
    codePreview: `// Bollinger Bands Squeeze Strategy
function checkBBSqueeze(data) {
  const bb = calculateBollingerBands(data.close, 20, 2);
  const bandwidth = (bb.upper - bb.lower) / bb.middle;
  
  // Check for squeeze condition
  if (bandwidth < 0.1) {
    return 'squeeze_detected';
  }
  
  return 'no_squeeze';
}`,
    configuration: {
      parameters: [
        {
          name: 'BB Period',
          type: 'number',
          defaultValue: 20,
          description: 'Period for Bollinger Bands calculation'
        },
        {
          name: 'BB Deviations',
          type: 'number',
          defaultValue: 2,
          description: 'Standard deviations for Bollinger Bands'
        },
        {
          name: 'Squeeze Threshold',
          type: 'number',
          defaultValue: 0.1,
          description: 'Bandwidth threshold for squeeze detection'
        }
      ]
    }
  },
  {
    id: '3',
    name: 'ML Price Prediction',
    category: 'Machine Learning',
    difficulty: 'advanced',
    description: 'LSTM-based price prediction with sentiment analysis',
    longDescription: 'This advanced template uses Long Short-Term Memory (LSTM) neural networks for price prediction, combined with sentiment analysis from news and social media. The system employs ensemble methods and real-time data processing for high-accuracy predictions.',
    tags: ['LSTM', 'Machine Learning', 'Sentiment', 'Neural Networks'],
    popularity: 78,
    rating: 4.2,
    reviews: 89,
    downloads: 567,
    creator: {
      name: 'AICryptoLabs',
      avatar: '/avatars/ai-crypto-labs.jpg',
      verified: true,
      joinDate: '2023-03-05'
    },
    performance: {
      avgReturn: 35.8,
      maxDrawdown: -15.2,
      winRate: 74.5,
      sharpeRatio: 2.8,
      profitFactor: 3.2
    },
    features: [
      'LSTM neural networks',
      'Sentiment analysis',
      'Ensemble methods',
      'Real-time processing',
      'Multi-factor analysis',
      'Adaptive learning'
    ],
    requirements: [
      'Minimum capital: $5,000',
      'Supported exchanges: Binance, FTX',
      'Timeframes: 1h, 4h',
      'GPU recommended for training',
      'API keys for news sentiment data'
    ],
    supportedExchanges: ['Binance', 'FTX'],
    timeframe: ['1h', '4h'],
    indicators: ['LSTM', 'Sentiment Score', 'Volume Profile'],
    riskLevel: 'high',
    minCapital: 5000,
    estimatedSetupTime: '2 hours',
    lastUpdated: '2024-01-12',
    preview: {
      equityCurve: [
        { date: 'Jan', value: 10000 },
        { date: 'Feb', value: 11200 },
        { date: 'Mar', value: 12850 },
        { date: 'Apr', value: 13580 },
        { date: 'May', value: 14200 },
        { date: 'Jun', value: 13580 }
      ],
      drawdownChart: [
        { date: 'Jan', drawdown: -3.2 },
        { date: 'Feb', drawdown: -7.8 },
        { date: 'Mar', drawdown: -12.1 },
        { date: 'Apr', drawdown: -15.2 },
        { date: 'May', drawdown: -8.5 },
        { date: 'Jun', drawdown: -4.3 }
      ],
      monthlyReturns: [
        { month: 'Jan', return: 12.0 },
        { month: 'Feb', return: 14.7 },
        { month: 'Mar', return: 5.7 },
        { month: 'Apr', return: 4.6 },
        { month: 'May', return: -4.4 },
        { month: 'Jun', return: -4.4 }
      ]
    },
    pricing: {
      type: 'premium',
      price: 99,
      trialPeriod: '7 days'
    },
    codePreview: `// ML Price Prediction Strategy
class MLPredictionStrategy {
  constructor() {
    this.lstmModel = new LSTMModel();
    this.sentimentAnalyzer = new SentimentAnalyzer();
  }
  
  async predictPrice(data) {
    // Prepare features for LSTM
    const features = this.prepareFeatures(data);
    
    // Get LSTM prediction
    const lstmPrediction = await this.lstmModel.predict(features);
    
    // Get sentiment score
    const sentimentScore = await this.sentimentAnalyzer.analyze();
    
    // Combine predictions
    const finalPrediction = this.combinePredictions(lstmPrediction, sentimentScore);
    
    return finalPrediction;
  }
}`,
    configuration: {
      parameters: [
        {
          name: 'LSTM Layers',
          type: 'number',
          defaultValue: 3,
          description: 'Number of LSTM layers'
        },
        {
          name: 'Learning Rate',
          type: 'number',
          defaultValue: 0.001,
          description: 'Learning rate for neural network training'
        },
        {
          name: 'Sentiment Weight',
          type: 'number',
          defaultValue: 0.3,
          description: 'Weight of sentiment in final prediction'
        },
        {
          name: 'Prediction Horizon',
          type: 'select',
          defaultValue: '1h',
          description: 'Time horizon for predictions',
          options: ['1h', '4h', '1d']
        }
      ]
    }
  },
  {
    id: '4',
    name: 'Grid Trading Master',
    category: 'Grid',
    difficulty: 'intermediate',
    description: 'Advanced grid trading with dynamic grid spacing and volatility adjustment',
    longDescription: 'Professional grid trading template that automatically adjusts grid spacing based on market volatility. Features include dynamic grid management, volatility-based position sizing, and comprehensive risk controls for optimal performance in ranging markets.',
    tags: ['Grid', 'Volatility', 'Dynamic', 'Professional'],
    popularity: 88,
    rating: 4.6,
    reviews: 312,
    downloads: 1876,
    creator: {
      name: 'GridTradingPro',
      avatar: '/avatars/grid-trading-pro.jpg',
      verified: true,
      joinDate: '2022-09-12'
    },
    performance: {
      avgReturn: 32.1,
      maxDrawdown: -10.5,
      winRate: 78.3,
      sharpeRatio: 2.4,
      profitFactor: 2.8
    },
    features: [
      'Dynamic grid spacing',
      'Volatility adjustment',
      'Position sizing',
      'Risk management',
      'Multiple grid layers',
      'Profit optimization'
    ],
    requirements: [
      'Minimum capital: $2,000',
      'Supported exchanges: Binance, Kraken',
      'Timeframes: 5m, 15m, 1h',
      'Indicators: ATR, Volume, Bollinger Bands'
    ],
    supportedExchanges: ['Binance', 'Kraken', 'FTX'],
    timeframe: ['5m', '15m', '1h'],
    indicators: ['ATR', 'Volume', 'Bollinger Bands'],
    riskLevel: 'medium',
    minCapital: 2000,
    estimatedSetupTime: '30 minutes',
    lastUpdated: '2024-01-09',
    preview: {
      equityCurve: [
        { date: 'Jan', value: 10000 },
        { date: 'Feb', value: 10800 },
        { date: 'Mar', value: 11500 },
        { date: 'Apr', value: 13210 },
        { date: 'May', value: 13210 },
        { date: 'Jun', value: 13210 }
      ],
      drawdownChart: [
        { date: 'Jan', drawdown: -2.5 },
        { date: 'Feb', drawdown: -5.8 },
        { date: 'Mar', drawdown: -8.2 },
        { date: 'Apr', drawdown: -10.5 },
        { date: 'May', drawdown: -6.2 },
        { date: 'Jun', drawdown: -3.1 }
      ],
      monthlyReturns: [
        { month: 'Jan', return: 8.0 },
        { month: 'Feb', return: 6.5 },
        { month: 'Mar', return: 14.8 },
        { month: 'Apr', return: 0.0 },
        { month: 'May', return: 0.0 },
        { month: 'Jun', return: 0.0 }
      ]
    },
    pricing: {
      type: 'premium',
      price: 49,
      trialPeriod: '3 days'
    },
    codePreview: `// Dynamic Grid Trading Strategy
class DynamicGridStrategy {
  constructor() {
    this.gridLevels = [];
    this.volatility = 0;
  }
  
  updateGrid(currentPrice) {
    // Calculate current volatility
    this.volatility = calculateATR(14);
    
    // Calculate dynamic grid spacing
    const gridSpacing = this.volatility * 0.5;
    
    // Generate grid levels
    this.gridLevels = this.generateGridLevels(currentPrice, gridSpacing);
  }
  
  generateGridLevels(price, spacing) {
    const levels = [];
    const numLevels = 10;
    
    for (let i = -numLevels; i <= numLevels; i++) {
      levels.push(price + (i * spacing));
    }
    
    return levels;
  }
}`,
    configuration: {
      parameters: [
        {
          name: 'Grid Spacing Multiplier',
          type: 'number',
          defaultValue: 0.5,
          description: 'Multiplier for grid spacing based on ATR'
        },
        {
          name: 'Number of Grid Levels',
          type: 'number',
          defaultValue: 10,
          description: 'Number of grid levels above and below price'
        },
        {
          name: 'Position Size per Grid',
          type: 'number',
          defaultValue: 1,
          description: 'Position size as percentage of capital per grid level'
        },
        {
          name: 'Volatility Period',
          type: 'number',
          defaultValue: 14,
          description: 'Period for ATR calculation'
        }
      ]
    }
  },
  {
    id: '5',
    name: 'DCA Dollar Cost Averaging',
    category: 'DCA',
    difficulty: 'beginner',
    description: 'Automated dollar-cost averaging with market sentiment integration',
    longDescription: 'Simple yet effective DCA strategy that automatically invests fixed amounts at regular intervals. Enhanced with market sentiment analysis to adjust purchase amounts during favorable market conditions.',
    tags: ['DCA', 'Beginner', 'Passive', 'Long-term'],
    popularity: 95,
    rating: 4.8,
    reviews: 678,
    downloads: 3456,
    creator: {
      name: 'PassiveInvest',
      avatar: '/avatars/passive-invest.jpg',
      verified: true,
      joinDate: '2022-03-15'
    },
    performance: {
      avgReturn: 18.5,
      maxDrawdown: -25.3,
      winRate: 85.2,
      sharpeRatio: 1.2,
      profitFactor: 1.8
    },
    features: [
      'Automated DCA',
      'Fixed interval investing',
      'Sentiment integration',
      'Risk management',
      'Portfolio diversification',
      'Long-term focus'
    ],
    requirements: [
      'Minimum capital: $100',
      'Supported exchanges: All major exchanges',
      'Timeframes: Daily, Weekly',
      'No complex indicators required'
    ],
    supportedExchanges: ['Binance', 'Coinbase Pro', 'Kraken', 'FTX', 'Huobi', 'OKX'],
    timeframe: ['1d', '1w'],
    indicators: ['Sentiment Score'],
    riskLevel: 'low',
    minCapital: 100,
    estimatedSetupTime: '5 minutes',
    lastUpdated: '2024-01-05',
    preview: {
      equityCurve: [
        { date: 'Jan', value: 10000 },
        { date: 'Feb', value: 10150 },
        { date: 'Mar', value: 10300 },
        { date: 'Apr', value: 10850 },
        { date: 'May', value: 11850 },
        { date: 'Jun', value: 11850 }
      ],
      drawdownChart: [
        { date: 'Jan', drawdown: -1.5 },
        { date: 'Feb', drawdown: -8.2 },
        { date: 'Mar', drawdown: -15.3 },
        { date: 'Apr', drawdown: -25.3 },
        { date: 'May', drawdown: -18.5 },
        { date: 'Jun', drawdown: -12.1 }
      ],
      monthlyReturns: [
        { month: 'Jan', return: 1.5 },
        { month: 'Feb', return: 1.5 },
        { month: 'Mar', return: 5.3 },
        { month: 'Apr', return: 9.2 },
        { month: 'May', return: 0.0 },
        { month: 'Jun', return: 0.0 }
      ]
    },
    pricing: {
      type: 'free'
    },
    codePreview: `// DCA Strategy with Sentiment
function executeDCA() {
  const regularAmount = 100; // Fixed DCA amount
  const sentimentScore = getSentimentScore();
  
  // Adjust amount based on sentiment
  let adjustedAmount = regularAmount;
  if (sentimentScore < -0.5) {
    adjustedAmount *= 1.5; // Increase buy during negative sentiment
  } else if (sentimentScore > 0.5) {
    adjustedAmount *= 0.5; // Reduce buy during positive sentiment
  }
  
  // Execute purchase
  executeBuyOrder(adjustedAmount);
}`,
    configuration: {
      parameters: [
        {
          name: 'Regular Investment Amount',
          type: 'number',
          defaultValue: 100,
          description: 'Fixed amount to invest regularly'
        },
        {
          name: 'Investment Frequency',
          type: 'select',
          defaultValue: 'daily',
          description: 'How often to invest',
          options: ['daily', 'weekly', 'monthly']
        },
        {
          name: 'Sentiment Multiplier',
          type: 'number',
          defaultValue: 1.5,
          description: 'Multiplier for sentiment-based adjustments'
        }
      ]
    }
  }
]

export default function BotTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<BotTemplate | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('popularity')
  const [activeTab, setActiveTab] = useState('templates')

  const categories = ['all', 'Momentum', 'Volatility', 'Machine Learning', 'Grid', 'DCA']
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced']
  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'downloads', label: 'Most Downloaded' },
    { value: 'newest', label: 'Newest' }
  ]

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'downloads':
        return b.downloads - a.downloads
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      default:
        return b.popularity - a.popularity
    }
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Momentum': return <TrendingUp className="h-4 w-4" />
      case 'Volatility': return <BarChart3 className="h-4 w-4" />
      case 'Machine Learning': return <Brain className="h-4 w-4" />
      case 'Grid': return <Grid3X3 className="h-4 w-4" />
      case 'DCA': return <Repeat className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const getPerformanceColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bot Templates Library</h1>
          <p className="text-muted-foreground">
            Pre-built trading strategies and bot templates
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{mockTemplates.length}</div>
                <div className="text-sm text-muted-foreground">Total Templates</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Download className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {mockTemplates.reduce((sum, template) => sum + template.downloads, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Downloads</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {mockTemplates.reduce((sum, template) => sum + template.reviews, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Reviews</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">
                  {(mockTemplates.reduce((sum, template) => sum + template.rating, 0) / mockTemplates.length).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.slice(1).map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {difficulties.slice(1).map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedTemplates.map(template => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(template.category)}
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {template.category}
                      <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                        {template.difficulty}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-semibold">{template.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.description}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Avg Return</p>
                  <p className={`font-semibold ${getPerformanceColor(template.performance.avgReturn)}`}>
                    {formatPercent(template.performance.avgReturn)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Win Rate</p>
                  <p className="font-semibold">{template.performance.winRate}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Downloads</p>
                  <p className="font-semibold">{template.downloads.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Min Capital</p>
                  <p className="font-semibold">{formatCurrency(template.minCapital)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={template.creator.avatar} />
                    <AvatarFallback>{template.creator.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{template.creator.name}</span>
                  {template.creator.verified && <Badge variant="secondary" className="text-xs">✓</Badge>}
                </div>
                <Badge variant={template.pricing.type === 'free' ? 'default' : 'secondary'}>
                  {template.pricing.type === 'free' ? 'FREE' : `$${template.pricing.price}`}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex-1" onClick={() => setSelectedTemplate(template)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        {getCategoryIcon(template.category)}
                        {template.name}
                        <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                          {template.difficulty}
                        </Badge>
                      </DialogTitle>
                      <DialogDescription>
                        {template.category} • Created by {template.creator.name}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <ScrollArea className="max-h-[70vh]">
                      <div className="space-y-6">
                        {/* Overview */}
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Overview</h3>
                          <p className="text-muted-foreground">{template.longDescription}</p>
                        </div>

                        {/* Performance Metrics */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="text-center p-3 border rounded">
                              <div className={`text-lg font-bold ${getPerformanceColor(template.performance.avgReturn)}`}>
                                {formatPercent(template.performance.avgReturn)}
                              </div>
                              <div className="text-xs text-muted-foreground">Avg Return</div>
                            </div>
                            <div className="text-center p-3 border rounded">
                              <div className="text-lg font-bold">{template.performance.winRate}%</div>
                              <div className="text-xs text-muted-foreground">Win Rate</div>
                            </div>
                            <div className="text-center p-3 border rounded">
                              <div className="text-lg font-bold">{template.performance.sharpeRatio}</div>
                              <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                            </div>
                            <div className="text-center p-3 border rounded">
                              <div className="text-lg font-bold">{template.performance.profitFactor}</div>
                              <div className="text-xs text-muted-foreground">Profit Factor</div>
                            </div>
                            <div className="text-center p-3 border rounded">
                              <div className={`text-lg font-bold ${getPerformanceColor(template.performance.maxDrawdown)}`}>
                                {formatPercent(template.performance.maxDrawdown)}
                              </div>
                              <div className="text-xs text-muted-foreground">Max Drawdown</div>
                            </div>
                          </div>
                        </div>

                        {/* Charts */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Performance Charts</h3>
                          <Tabs defaultValue="equity" className="space-y-4">
                            <TabsList>
                              <TabsTrigger value="equity">Equity Curve</TabsTrigger>
                              <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
                              <TabsTrigger value="returns">Monthly Returns</TabsTrigger>
                            </TabsList>
                            <TabsContent value="equity">
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <RechartsLineChart data={template.preview.equityCurve}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                                  </RechartsLineChart>
                                </ResponsiveContainer>
                              </div>
                            </TabsContent>
                            <TabsContent value="drawdown">
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={template.preview.drawdownChart}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="drawdown" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                            </TabsContent>
                            <TabsContent value="returns">
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <RechartsBarChart data={template.preview.monthlyReturns}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="return" fill="#8884d8" />
                                  </RechartsBarChart>
                                </ResponsiveContainer>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>

                        {/* Features */}
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Features</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {template.features.map(feature => (
                              <div key={feature} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Requirements */}
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                          <div className="space-y-1">
                            {template.requirements.map(requirement => (
                              <div key={requirement} className="flex items-center gap-2 text-sm">
                                <ArrowRight className="h-4 w-4 text-blue-500" />
                                {requirement}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Configuration */}
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Configuration Parameters</h3>
                          <div className="space-y-2">
                            {template.configuration.parameters.map(param => (
                              <div key={param.name} className="border rounded p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium">{param.name}</span>
                                  <Badge variant="outline">{param.type}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{param.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">Default: {param.defaultValue}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Code Preview */}
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Code Preview</h3>
                          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                            <pre className="text-sm">
                              <code>{template.codePreview}</code>
                            </pre>
                          </div>
                        </div>

                        {/* Creator Info */}
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Creator Information</h3>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={template.creator.avatar} />
                              <AvatarFallback>{template.creator.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{template.creator.name}</span>
                                {template.creator.verified && <Badge variant="secondary">✓ Verified</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Member since {new Date(template.creator.joinDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                    
                    <div className="flex gap-2 mt-4">
                      <Button className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        {template.pricing.type === 'free' ? 'Download Free' : `Purchase $${template.pricing.price}`}
                      </Button>
                      <Button variant="outline">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sortedTemplates.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Templates Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setSelectedDifficulty('all')
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}