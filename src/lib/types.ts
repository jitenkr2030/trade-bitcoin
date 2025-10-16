// Core application types for TradeBitcoin platform

// Import Prisma enums and types
import { 
  User, 
  Portfolio, 
  Order, 
  Trade, 
  Asset, 
  Market, 
  Exchange,
  TradingBot,
  BlogPost,
  BlogComment,
  Subscription,
  Invoice
} from '@prisma/client'

// Re-export Prisma enums for easy access
export type {
  UserRole,
  UserStatus,
  OrderType,
  OrderSide,
  OrderStatus,
  PortfolioType,
  PortfolioStatus,
  RiskLevel,
  RebalanceFrequency,
  AssetType,
  AssetCategory,
  MarketStatus,
  ExchangeStatus,
  AccountStatus,
  GoalStatus,
  GoalPriority,
  RebalanceTriggerType,
  RebalanceStatus,
  RebalanceAction,
  TradeStatus,
  TaxReportType,
  ReportStatus,
  TaxTerm,
  BotType,
  BotStatus
} from '@prisma/client'

// Re-export exchange types
export type {
  OrderType as ExchangeOrderType,
  OrderSide as ExchangeOrderSide,
  OrderStatus as ExchangeOrderStatus,
  ExchangeCredentials,
  ExchangeConfig,
  ExchangeFeatures,
  RateLimit,
  MarketData,
  OrderBook,
  Ticker,
  Balance,
  CreateOrderRequest,
  CreateOrderResponse,
  Order as ExchangeOrder,
  Trade as ExchangeTrade,
  Candlestick,
  ExchangeInterface,
  ExchangeAdapter
} from './exchanges/types'

// Re-export exchange error classes
export {
  ExchangeError,
  AuthenticationError as ExchangeAuthenticationError,
  RateLimitError as ExchangeRateLimitError,
  InsufficientFundsError,
  OrderNotFoundError,
  NetworkError
} from './exchanges/types'

// Extended User types
export interface UserWithRelations extends User {
  accounts?: any[]
  sessions?: any[]
  portfolios?: Portfolio[]
  orders?: Order[]
  trades?: Trade[]
  bots?: TradingBot[]
  exchangeAccounts?: any[]
  blogPosts?: BlogPost[]
  blogComments?: BlogComment[]
  subscription?: Subscription | null
  invoices?: Invoice[]
}

// Authentication types
export interface JWT {
  sub: string
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

export interface Session {
  user: {
    id: string
    email: string
    name?: string
    role: UserRole
    avatar?: string
  }
  expires: string
}

export interface AuthConfig {
  session: {
    strategy: 'jwt' | 'database'
    maxAge: number
    updateAge: number
  }
  providers: any[]
  callbacks: {
    jwt: (token: JWT, user?: any) => Promise<JWT>
    session: (session: Session, token: JWT) => Promise<Session>
  }
  pages: {
    signIn: string
    signUp: string
    error: string
  }
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: Date
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Trading types
export interface MarketData {
  symbol: string
  price: number
  bid: number
  ask: number
  volume24h: number
  change24h: number
  changePercent24h: number
  high24h: number
  low24h: number
  open24h: number
  close24h: number
  timestamp: number
}

export interface OrderBook {
  symbol: string
  bids: [number, number][] // [price, quantity]
  asks: [number, number][] // [price, quantity]
  timestamp: number
}

export interface Ticker {
  symbol: string
  price: number
  volume: number
  quoteVolume: number
  lastPrice: number
  bidPrice: number
  askPrice: number
  high24h: number
  low24h: number
  open24h: number
  close24h: number
  timestamp: number
}

export interface Candlestick {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  quoteVolume?: number
  tradesCount?: number
}

export interface Balance {
  asset: string
  free: number
  locked: number
  total: number
  valueInUSD?: number
}

export interface CreateOrderRequest {
  symbol: string
  side: OrderSide
  type: OrderType
  amount: number
  price?: number
  stopPrice?: number
  icebergQty?: number
  timeInForce?: 'GTC' | 'IOC' | 'FOK'
  leverage?: number
  takeProfitPrice?: number
  stopLossPrice?: number
  trailingStopAmount?: number
  trailingStopPercent?: number
  ocoSecondaryPrice?: number
  ocoSecondaryType?: 'LIMIT' | 'STOP'
  icebergVisibleQty?: number
  conditionalTriggerPrice?: number
  conditionalTriggerType?: 'LAST_PRICE' | 'MARK_PRICE' | 'INDEX_PRICE'
}

export interface CreateOrderResponse {
  orderId: string
  clientOrderId?: string
  symbol: string
  status: OrderStatus
  side: OrderSide
  type: OrderType
  amount: number
  price?: number
  stopPrice?: number
  icebergQty?: number
  timeInForce?: string
  executedAmount: number
  executedPrice?: number
  createdAt: Date
  updatedAt: Date
  takeProfitPrice?: number
  stopLossPrice?: number
  trailingStopAmount?: number
  trailingStopPercent?: number
  ocoSecondaryOrderId?: string
  ocoSecondaryPrice?: number
  ocoSecondaryType?: 'LIMIT' | 'STOP'
  icebergVisibleQty?: number
  conditionalTriggerPrice?: number
  conditionalTriggerType?: 'LAST_PRICE' | 'MARK_PRICE' | 'INDEX_PRICE'
}

// Portfolio types
export interface PortfolioWithRelations extends Portfolio {
  assets?: PortfolioAsset[]
  performance?: PortfolioPerformance[]
  goals?: InvestmentGoal[]
  rebalances?: PortfolioRebalance[]
  taxReports?: TaxReport[]
  defiPositions?: DeFiPosition[]
  nfts?: NFT[]
  correlations?: AssetCorrelation[]
  performanceAttributions?: PerformanceAttribution[]
}

export interface PortfolioAsset {
  id: string
  portfolioId: string
  assetId: string
  amount: number
  avgPrice?: number
  value?: number
  costBasis?: number
  acquisitionDate?: Date
  targetAllocation?: number
  currentAllocation?: number
  createdAt: Date
  updatedAt: Date
  asset?: Asset
  dividends?: Dividend[]
  stakingRewards?: StakingReward[]
  rebalanceTrades?: RebalanceTrade[]
  taxLots?: TaxLot[]
}

export interface PortfolioPerformance {
  id: string
  portfolioId: string
  date: DateTime
  totalValue: number
  dailyChange?: number
  dailyChangePercent?: number
  totalReturn?: number
  totalReturnPercent?: number
  volatility?: number
  sharpeRatio?: number
  maxDrawdown?: number
  beta?: number
  alpha?: number
  informationRatio?: number
  sortinoRatio?: number
  calmarRatio?: number
  createdAt: DateTime
}

export interface InvestmentGoal {
  id: string
  portfolioId: string
  name: string
  description?: string
  targetValue: number
  targetDate: DateTime
  currentProgress: number
  status: GoalStatus
  priority: GoalPriority
  createdAt: DateTime
  updatedAt: DateTime
}

// Exchange types
export interface ExchangeCredentials {
  apiKey: string
  apiSecret: string
  passphrase?: string
}

export interface ExchangeConfig {
  name: string
  displayName: string
  baseUrl: string
  wsUrl?: string
  features: ExchangeFeatures
  rateLimits: RateLimit[]
}

export interface ExchangeFeatures {
  spot: boolean
  margin: boolean
  futures: boolean
  spotTrading: boolean
  marginTrading: boolean
  futuresTrading: boolean
  ocoOrders: boolean
  stopOrders: boolean
  takeProfitOrders: boolean
  trailingStop: boolean
  icebergOrders: boolean
  fillOrKill: boolean
  immediateOrCancel: boolean
  postOnly: boolean
  reduceOnly: boolean
  conditionalOrders: boolean
  triggerOrders: boolean
  advancedOrderTypes: boolean
}

export interface RateLimit {
  rateLimitType: 'REQUEST_WEIGHT' | 'ORDERS' | 'REQUESTS'
  interval: 'SECOND' | 'MINUTE' | 'HOUR' | 'DAY'
  intervalNum: number
  limit: number
}

export interface ExchangeWithRelations extends Exchange {
  assets?: Asset[]
  markets?: Market[]
  exchangeAccounts?: any[]
}

// Bot types
export interface BotConfig {
  id: string
  name: string
  description?: string
  type: BotType
  strategy: BotStrategy
  market: {
    symbol: string
    exchangeAccountId: string
  }
  risk: RiskManagement
  execution: ExecutionConfig
  status: BotStatus
  createdAt: Date
  updatedAt: Date
}

export interface BotStrategy {
  type: string
  parameters: Record<string, any>
  indicators?: IndicatorConfig[]
  conditions?: ConditionConfig[]
}

export interface IndicatorConfig {
  name: string
  parameters: Record<string, any>
  timeframe: string
}

export interface ConditionConfig {
  type: 'AND' | 'OR' | 'NOT'
  conditions: Condition[]
}

export interface Condition {
  indicator: string
  operator: 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS' | 'CROSS_ABOVE' | 'CROSS_BELOW'
  value: number
  timeframe?: string
}

export interface RiskManagement {
  maxPositionSize: number
  maxDailyLoss: number
  stopLoss: number
  takeProfit: number
  maxLeverage: number
  riskPerTrade: number
}

export interface ExecutionConfig {
  orderType: OrderType
  timeInForce: 'GTC' | 'IOC' | 'FOK'
  slippageTolerance: number
  retryAttempts: number
  cooldownPeriod: number
}

export interface BotExecution {
  id: string
  botId: string
  action: 'START' | 'STOP' | 'PAUSE' | 'RESUME' | 'TRADE'
  status: 'SUCCESS' | 'FAILED' | 'PENDING'
  details: Record<string, any>
  error?: string
  timestamp: Date
}

export interface BotPerformance {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalProfit: number
  totalLoss: number
  netProfit: number
  profitFactor: number
  maxDrawdown: number
  sharpeRatio: number
  sortinoRatio: number
  calmarRatio: number
  totalReturn: number
  annualizedReturn: number
  volatility: number
}

// Blog types
export interface BlogPostWithRelations extends BlogPost {
  author?: {
    id: string
    name: string
    avatar?: string
  }
  comments?: BlogCommentWithRelations[]
  category?: {
    id: string
    name: string
    slug: string
  }
  _count?: {
    comments: number
    likes: number
  }
}

export interface BlogCommentWithRelations extends BlogComment {
  author?: {
    id: string
    name: string
    avatar?: string
  }
  replies?: BlogCommentWithRelations[]
}

// Billing types
export interface SubscriptionWithRelations extends Subscription {
  user?: User
  invoices?: Invoice[]
}

export interface InvoiceWithRelations extends Invoice {
  user?: User
  subscription?: Subscription
}

// Security types
export interface SecurityLog {
  id: string
  userId?: string
  action: string
  ipAddress: string
  userAgent: string
  details: Record<string, any>
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  timestamp: Date
}

export interface SecurityStats {
  totalUsers: number
  activeUsers: number
  failedLogins: number
  successfulLogins: number
  securityEvents: number
  lastIncident?: Date
}

// API types
export interface ApiKey {
  id: string
  userId: string
  key: string
  secret: string
  name: string
  permissions: string[]
  lastUsed?: Date
  expiresAt?: Date
  createdAt: Date
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED'
}

// Form types
export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

export interface UpdateProfileForm {
  name?: string
  email?: string
  avatar?: string
  bio?: string
  preferences?: Record<string, any>
}

// Error types
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, details)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND_ERROR', 404)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 'CONFLICT_ERROR', 409)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT_ERROR', 429)
    this.name = 'RateLimitError'
  }
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// WebSocket types
export interface WebSocketMessage {
  type: string
  data: any
  timestamp: Date
}

export interface MarketDataUpdate {
  symbol: string
  price: number
  bid: number
  ask: number
  volume: number
  timestamp: number
}

export interface OrderUpdate {
  orderId: string
  symbol: string
  status: OrderStatus
  filledAmount: number
  filledPrice?: number
  timestamp: number
}

export interface TradeUpdate {
  tradeId: string
  orderId?: string
  symbol: string
  side: OrderSide
  amount: number
  price: number
  timestamp: number
}

// Dashboard types
export interface DashboardData {
  portfolioValue: number
  dailyChange: number
  dailyChangePercent: number
  totalReturn: number
  totalReturnPercent: number
  topPerformers: PortfolioAsset[]
  recentTrades: Trade[]
  openOrders: Order[]
  marketOverview: MarketData[]
  botStatus: BotStatus[]
}

// Notification types
export interface Notification {
  id: string
  userId: string
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS'
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  createdAt: Date
  expiresAt?: Date
}

// Report types
export interface ReportConfig {
  type: 'PORTFOLIO' | 'TAX' | 'TRADING' | 'PERFORMANCE'
  format: 'PDF' | 'CSV' | 'JSON'
  dateRange: {
    start: Date
    end: Date
  }
  filters?: Record<string, any>
}

export interface GeneratedReport {
  id: string
  filename: string
  url: string
  size: number
  generatedAt: Date
  expiresAt: Date
}

// Search types
export interface SearchResult<T = any> {
  id: string
  type: string
  title: string
  description?: string
  data: T
  relevance: number
  createdAt: Date
}

export interface SearchQuery {
  query: string
  type?: string
  filters?: Record<string, any>
  sort?: 'relevance' | 'date' | 'title'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// Export all types for easy importing
export type {
  User,
  Portfolio,
  Order,
  Trade,
  Asset,
  Market,
  Exchange,
  TradingBot,
  BlogPost,
  BlogComment,
  Subscription,
  Invoice
} from '@prisma/client'