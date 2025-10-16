import { NextRequest, NextResponse } from 'next/server'
import { exchangeManager } from '@/lib/exchanges/manager'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { OrderType, OrderSide, OrderStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const accountId = searchParams.get('accountId')
    const symbol = searchParams.get('symbol')

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 })
    }

    // Verify user owns the exchange account
    const exchangeAccount = await db.exchangeAccount.findFirst({
      where: {
        id: accountId,
        userId: session.user.id
      }
    })

    if (!exchangeAccount) {
      return NextResponse.json({ error: 'Exchange account not found' }, { status: 404 })
    }

    switch (action) {
      case 'balances':
        const balances = await exchangeManager.getAccountBalances(accountId)
        return NextResponse.json({ balances })

      case 'orders':
        const orders = await exchangeManager.getOpenOrders(accountId, symbol || undefined)
        return NextResponse.json({ orders })

      case 'ticker':
        if (!symbol) {
          return NextResponse.json({ error: 'Symbol is required' }, { status: 400 })
        }
        const ticker = await exchangeManager.getTicker(accountId, symbol)
        return NextResponse.json({ ticker })

      case 'orderbook':
        if (!symbol) {
          return NextResponse.json({ error: 'Symbol is required' }, { status: 400 })
        }
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
        const orderBook = await exchangeManager.getOrderBook(accountId, symbol, limit)
        return NextResponse.json({ orderBook })

      case 'market-data':
        if (!symbol) {
          return NextResponse.json({ error: 'Symbol is required' }, { status: 400 })
        }
        const marketData = await exchangeManager.getMarketData(accountId, symbol)
        return NextResponse.json({ marketData })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Trading API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, accountId, ...data } = body

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 })
    }

    // Verify user owns the exchange account
    const exchangeAccount = await db.exchangeAccount.findFirst({
      where: {
        id: accountId,
        userId: session.user.id
      }
    })

    if (!exchangeAccount) {
      return NextResponse.json({ error: 'Exchange account not found' }, { status: 404 })
    }

    switch (action) {
      case 'create-order':
        const orderRequest = {
          symbol: data.symbol,
          side: data.side as OrderSide,
          type: data.type as OrderType,
          amount: parseFloat(data.amount),
          price: data.price ? parseFloat(data.price) : undefined,
          stopPrice: data.stopPrice ? parseFloat(data.stopPrice) : undefined,
          timeInForce: data.timeInForce
        }

        const order = await exchangeManager.createOrder(accountId, orderRequest)
        
        // Store order in our database
        const savedOrder = await db.order.create({
          data: {
            userId: session.user.id,
            exchangeAccountId: accountId,
            marketId: data.marketId, // This would need to be resolved from symbol
            type: orderRequest.type,
            side: orderRequest.side,
            amount: orderRequest.amount,
            price: orderRequest.price,
            status: OrderStatus.PENDING,
            clientOrderId: order.clientOrderId,
            exchangeOrderId: order.orderId
          }
        })

        return NextResponse.json({ 
          order: { ...order, id: savedOrder.id },
          message: 'Order created successfully' 
        })

      case 'cancel-order':
        if (!data.orderId) {
          return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
        }
        const cancelledOrder = await exchangeManager.cancelOrder(accountId, data.orderId, data.symbol)
        
        // Update order status in our database
        await db.order.updateMany({
          where: {
            userId: session.user.id,
            exchangeAccountId: accountId,
            OR: [
              { clientOrderId: data.orderId },
              { exchangeOrderId: data.orderId }
            ]
          },
          data: {
            status: OrderStatus.CANCELLED,
            updatedAt: new Date()
          }
        })

        return NextResponse.json({ 
          order: cancelledOrder,
          message: 'Order cancelled successfully' 
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Trading API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}