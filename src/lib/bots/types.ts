import { BotType, BotStatus, OrderType, OrderSide } from "@prisma/client"

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

export interface MarketData {
  symbol: string
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  indicators?: Record<string, number>
}

export interface Signal {
  type: 'BUY' | 'SELL' | 'HOLD'
  strength: number
  confidence: number
  reason: string
  timestamp: number
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

export interface GridStrategyConfig {
  upperPrice: number
  lowerPrice: number
  gridLevels: number
  orderAmount: number
  rebalanceThreshold?: number
}

export interface DCAStrategyConfig {
  totalAmount: number
  targetPrice: number
  orderCount: number
  priceDeviation: number
  maxOrders: number
}

export interface MartingaleStrategyConfig {
  baseAmount: number
  multiplier: number
  maxLevels: number
  takeProfit: number
  stopLoss: number
}

export interface ArbitrageStrategyConfig {
  exchanges: string[]
  minProfit: number
  maxSlippage: number
  orderAmount: number
}

export interface TrendFollowingStrategyConfig {
  fastPeriod: number
  slowPeriod: number
  signalPeriod: number
  riskPerTrade: number
  stopLoss: number
  takeProfit: number
}

export interface MeanReversionStrategyConfig {
  period: number
  standardDeviations: number
  entryThreshold: number
  exitThreshold: number
  riskPerTrade: number
}

// Bot execution context
export interface BotContext {
  bot: BotConfig
  marketData: MarketData[]
  currentPrice: number
  balance: Record<string, number>
  positions: Record<string, number>
  orders: any[]
  trades: any[]
  timestamp: number
}

export interface BotEngine {
  startBot(botId: string): Promise<void>
  stopBot(botId: string): Promise<void>
  pauseBot(botId: string): Promise<void>
  resumeBot(botId: string): Promise<void>
  getBotStatus(botId: string): Promise<BotStatus>
  getBotPerformance(botId: string): Promise<BotPerformance>
  getBotExecutions(botId: string): Promise<BotExecution[]>
  updateBotConfig(botId: string, config: Partial<BotConfig>): Promise<void>
}

// Strategy interface
export interface Strategy {
  name: string
  initialize(config: BotStrategy): Promise<void>
  execute(context: BotContext): Promise<Signal>
  cleanup(): Promise<void>
}

// Error types
export class BotError extends Error {
  constructor(
    message: string,
    public code?: string,
    public botId?: string
  ) {
    super(message)
    this.name = 'BotError'
  }
}

export class StrategyError extends BotError {
  constructor(message: string, botId?: string) {
    super(message, 'STRATEGY_ERROR', botId)
    this.name = 'StrategyError'
  }
}

export class ExecutionError extends BotError {
  constructor(message: string, botId?: string) {
    super(message, 'EXECUTION_ERROR', botId)
    this.name = 'ExecutionError'
  }
}

export class RiskLimitError extends BotError {
  constructor(message: string, botId?: string) {
    super(message, 'RISK_LIMIT_ERROR', botId)
    this.name = 'RiskLimitError'
  }
}

export class ConfigurationError extends BotError {
  constructor(message: string, botId?: string) {
    super(message, 'CONFIGURATION_ERROR', botId)
    this.name = 'ConfigurationError'
  }
}