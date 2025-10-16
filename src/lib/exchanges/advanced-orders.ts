import { 
  CreateOrderRequest, 
  CreateOrderResponse, 
  Order, 
  ExchangeAdapter,
  ExchangeError,
  OrderType,
  OrderSide,
  OrderStatus
} from './types'

export interface OCOOrderRequest {
  symbol: string
  side: OrderSide
  amount: number
  limitPrice: number
  stopPrice: number
  stopLimitPrice?: number
  timeInForce?: 'GTC' | 'IOC' | 'FOK'
}

export interface IcebergOrderRequest {
  symbol: string
  side: OrderSide
  amount: number
  price: number
  icebergVisibleQty: number
  timeInForce?: 'GTC' | 'IOC' | 'FOK'
}

export interface TrailingStopOrderRequest {
  symbol: string
  side: OrderSide
  amount: number
  trailingStopAmount?: number
  trailingStopPercent?: number
  activationPrice?: number
  timeInForce?: 'GTC' | 'IOC' | 'FOK'
}

export interface ConditionalOrderRequest {
  symbol: string
  side: OrderSide
  amount: number
  price?: number
  triggerPrice: number
  triggerType: 'LAST_PRICE' | 'MARK_PRICE' | 'INDEX_PRICE'
  orderType: OrderType
  timeInForce?: 'GTC' | 'IOC' | 'FOK'
}

export class AdvancedOrdersService {
  constructor(private exchangeAdapter: ExchangeAdapter) {}

  /**
   * Create a One-Cancels-Other (OCO) order
   * Places two orders simultaneously - when one fills, the other is canceled
   */
  async createOCOOrder(request: OCOOrderRequest): Promise<{
    primaryOrder: CreateOrderResponse
    secondaryOrder: CreateOrderResponse
    ocoGroupId: string
  }> {
    if (!this.exchangeAdapter.isSupportedFeature('ocoOrders')) {
      throw new ExchangeError('OCO orders are not supported by this exchange')
    }

    // Validate OCO order parameters
    this.validateOCOOrder(request)

    try {
      // Create limit order (primary)
      const limitOrderRequest: CreateOrderRequest = {
        symbol: request.symbol,
        side: request.side,
        type: OrderType.LIMIT,
        amount: request.amount,
        price: request.limitPrice,
        timeInForce: request.timeInForce || 'GTC'
      }

      // Create stop order (secondary)
      const stopOrderRequest: CreateOrderRequest = {
        symbol: request.symbol,
        side: request.side === OrderSide.BUY ? OrderSide.SELL : OrderSide.BUY,
        type: OrderType.STOP,
        amount: request.amount,
        stopPrice: request.stopPrice,
        price: request.stopLimitPrice,
        timeInForce: request.timeInForce || 'GTC'
      }

      // For exchanges that support native OCO orders
      if (this.exchangeAdapter.isSupportedFeature('advancedOrderTypes')) {
        return await this.createNativeOCOOrder(limitOrderRequest, stopOrderRequest)
      }

      // Fallback: create two separate orders and link them
      const primaryOrder = await this.exchangeAdapter.createOrder(limitOrderRequest)
      const secondaryOrder = await this.exchangeAdapter.createOrder(stopOrderRequest)

      const ocoGroupId = this.generateOCOGroupId()

      return {
        primaryOrder,
        secondaryOrder,
        ocoGroupId
      }
    } catch (error) {
      throw new ExchangeError(`Failed to create OCO order: ${error.message}`)
    }
  }

  /**
   * Create an Iceberg order
   * Large order divided into smaller chunks to minimize market impact
   */
  async createIcebergOrder(request: IcebergOrderRequest): Promise<CreateOrderResponse> {
    if (!this.exchangeAdapter.isSupportedFeature('icebergOrders')) {
      throw new ExchangeError('Iceberg orders are not supported by this exchange')
    }

    this.validateIcebergOrder(request)

    try {
      const orderRequest: CreateOrderRequest = {
        symbol: request.symbol,
        side: request.side,
        type: OrderType.LIMIT,
        amount: request.amount,
        price: request.price,
        icebergQty: request.icebergVisibleQty,
        timeInForce: request.timeInForce || 'GTC'
      }

      return await this.exchangeAdapter.createOrder(orderRequest)
    } catch (error) {
      throw new ExchangeError(`Failed to create iceberg order: ${error.message}`)
    }
  }

  /**
   * Create a Trailing Stop order
   * Stop order that adjusts automatically as price moves in favor
   */
  async createTrailingStopOrder(request: TrailingStopOrderRequest): Promise<CreateOrderResponse> {
    if (!this.exchangeAdapter.isSupportedFeature('trailingStop')) {
      throw new ExchangeError('Trailing stop orders are not supported by this exchange')
    }

    this.validateTrailingStopOrder(request)

    try {
      const orderRequest: CreateOrderRequest = {
        symbol: request.symbol,
        side: request.side,
        type: OrderType.TRAILING_STOP,
        amount: request.amount,
        trailingStopAmount: request.trailingStopAmount,
        trailingStopPercent: request.trailingStopPercent,
        timeInForce: request.timeInForce || 'GTC'
      }

      return await this.exchangeAdapter.createOrder(orderRequest)
    } catch (error) {
      throw new ExchangeError(`Failed to create trailing stop order: ${error.message}`)
    }
  }

  /**
   * Create a Conditional order
   * Order that is only placed when certain conditions are met
   */
  async createConditionalOrder(request: ConditionalOrderRequest): Promise<CreateOrderResponse> {
    if (!this.exchangeAdapter.isSupportedFeature('conditionalOrders')) {
      throw new ExchangeError('Conditional orders are not supported by this exchange')
    }

    this.validateConditionalOrder(request)

    try {
      const orderRequest: CreateOrderRequest = {
        symbol: request.symbol,
        side: request.side,
        type: request.orderType,
        amount: request.amount,
        price: request.price,
        conditionalTriggerPrice: request.triggerPrice,
        conditionalTriggerType: request.triggerType,
        timeInForce: request.timeInForce || 'GTC'
      }

      return await this.exchangeAdapter.createOrder(orderRequest)
    } catch (error) {
      throw new ExchangeError(`Failed to create conditional order: ${error.message}`)
    }
  }

  /**
   * Create a Fill-or-Kill (FOK) order
   * Order must be filled immediately and completely or canceled
   */
  async createFillOrKillOrder(orderRequest: CreateOrderRequest): Promise<CreateOrderResponse> {
    if (!this.exchangeAdapter.isSupportedFeature('fillOrKill')) {
      throw new ExchangeError('Fill-or-Kill orders are not supported by this exchange')
    }

    this.validateOrderRequest(orderRequest)

    try {
      const fokOrderRequest: CreateOrderRequest = {
        ...orderRequest,
        timeInForce: 'FOK'
      }

      return await this.exchangeAdapter.createOrder(fokOrderRequest)
    } catch (error) {
      throw new ExchangeError(`Failed to create FOK order: ${error.message}`)
    }
  }

  /**
   * Create an Immediate-or-Cancel (IOC) order
   * Order must be filled immediately and partially, unfilled portion is canceled
   */
  async createImmediateOrCancelOrder(orderRequest: CreateOrderRequest): Promise<CreateOrderResponse> {
    if (!this.exchangeAdapter.isSupportedFeature('immediateOrCancel')) {
      throw new ExchangeError('Immediate-or-Cancel orders are not supported by this exchange')
    }

    this.validateOrderRequest(orderRequest)

    try {
      const iocOrderRequest: CreateOrderRequest = {
        ...orderRequest,
        timeInForce: 'IOC'
      }

      return await this.exchangeAdapter.createOrder(iocOrderRequest)
    } catch (error) {
      throw new ExchangeError(`Failed to create IOC order: ${error.message}`)
    }
  }

  /**
   * Monitor and manage OCO orders
   * Automatically cancel the secondary order when primary is filled
   */
  async monitorOCOOrders(ocoGroupId: string): Promise<void> {
    // This would typically be implemented with a background job or WebSocket monitoring
    // For now, we'll provide the structure
    console.log(`Monitoring OCO group: ${ocoGroupId}`)
  }

  /**
   * Cancel all orders in an OCO group
   */
  async cancelOCOGroup(ocoGroupId: string): Promise<{
    canceledOrders: Order[]
    failedCancellations: string[]
  }> {
    // Implementation would depend on how OCO groups are tracked
    // This is a placeholder for the actual implementation
    return {
      canceledOrders: [],
      failedCancellations: []
    }
  }

  // Private helper methods
  private async createNativeOCOOrder(
    limitOrder: CreateOrderRequest,
    stopOrder: CreateOrderRequest
  ): Promise<{
    primaryOrder: CreateOrderResponse
    secondaryOrder: CreateOrderResponse
    ocoGroupId: string
  }> {
    // This would be implemented for exchanges that support native OCO orders
    // For now, we'll simulate it
    const ocoGroupId = this.generateOCOGroupId()
    
    // In a real implementation, this would call the exchange's OCO API
    const primaryOrder = await this.exchangeAdapter.createOrder(limitOrder)
    const secondaryOrder = await this.exchangeAdapter.createOrder(stopOrder)

    return {
      primaryOrder,
      secondaryOrder,
      ocoGroupId
    }
  }

  private validateOCOOrder(request: OCOOrderRequest): void {
    if (request.amount <= 0) {
      throw new ExchangeError('Amount must be positive')
    }

    if (request.limitPrice <= 0) {
      throw new ExchangeError('Limit price must be positive')
    }

    if (request.stopPrice <= 0) {
      throw new ExchangeError('Stop price must be positive')
    }

    if (request.stopLimitPrice && request.stopLimitPrice <= 0) {
      throw new ExchangeError('Stop limit price must be positive')
    }

    // Validate price relationships
    if (request.side === OrderSide.BUY) {
      if (request.stopPrice >= request.limitPrice) {
        throw new ExchangeError('For buy orders, stop price must be less than limit price')
      }
    } else {
      if (request.stopPrice <= request.limitPrice) {
        throw new ExchangeError('For sell orders, stop price must be greater than limit price')
      }
    }
  }

  private validateIcebergOrder(request: IcebergOrderRequest): void {
    if (request.amount <= 0) {
      throw new ExchangeError('Amount must be positive')
    }

    if (request.price <= 0) {
      throw new ExchangeError('Price must be positive')
    }

    if (request.icebergVisibleQty <= 0) {
      throw new ExchangeError('Visible quantity must be positive')
    }

    if (request.icebergVisibleQty >= request.amount) {
      throw new ExchangeError('Visible quantity must be less than total amount')
    }
  }

  private validateTrailingStopOrder(request: TrailingStopOrderRequest): void {
    if (request.amount <= 0) {
      throw new ExchangeError('Amount must be positive')
    }

    if (!request.trailingStopAmount && !request.trailingStopPercent) {
      throw new ExchangeError('Either trailing stop amount or percentage must be specified')
    }

    if (request.trailingStopAmount && request.trailingStopAmount <= 0) {
      throw new ExchangeError('Trailing stop amount must be positive')
    }

    if (request.trailingStopPercent && request.trailingStopPercent <= 0) {
      throw new ExchangeError('Trailing stop percentage must be positive')
    }

    if (request.activationPrice && request.activationPrice <= 0) {
      throw new ExchangeError('Activation price must be positive')
    }
  }

  private validateConditionalOrder(request: ConditionalOrderRequest): void {
    if (request.amount <= 0) {
      throw new ExchangeError('Amount must be positive')
    }

    if (request.triggerPrice <= 0) {
      throw new ExchangeError('Trigger price must be positive')
    }

    if (request.price && request.price <= 0) {
      throw new ExchangeError('Price must be positive')
    }

    if (!['LAST_PRICE', 'MARK_PRICE', 'INDEX_PRICE'].includes(request.triggerType)) {
      throw new ExchangeError('Invalid trigger type')
    }
  }

  private validateOrderRequest(request: CreateOrderRequest): void {
    if (request.amount <= 0) {
      throw new ExchangeError('Amount must be positive')
    }

    if (request.price !== undefined && request.price <= 0) {
      throw new ExchangeError('Price must be positive')
    }
  }

  private generateOCOGroupId(): string {
    return `OCO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}