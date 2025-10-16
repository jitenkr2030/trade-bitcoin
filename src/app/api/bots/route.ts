import { NextRequest, NextResponse } from 'next/server'
import { botEngine } from '@/lib/bots/engine'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { BotType, BotStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'list':
        const bots = await db.tradingBot.findMany({
          where: { userId: session.user.id },
          orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json({ bots })

      case 'status':
        const botId = searchParams.get('botId')
        if (!botId) {
          return NextResponse.json({ error: 'Bot ID is required' }, { status: 400 })
        }
        
        // Verify user owns the bot
        const bot = await db.tradingBot.findFirst({
          where: { id: botId, userId: session.user.id }
        })
        
        if (!bot) {
          return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
        }
        
        const status = await botEngine.getBotStatus(botId)
        return NextResponse.json({ status })

      case 'performance':
        const perfBotId = searchParams.get('botId')
        if (!perfBotId) {
          return NextResponse.json({ error: 'Bot ID is required' }, { status: 400 })
        }
        
        // Verify user owns the bot
        const perfBot = await db.tradingBot.findFirst({
          where: { id: perfBotId, userId: session.user.id }
        })
        
        if (!perfBot) {
          return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
        }
        
        const performance = await botEngine.getBotPerformance(perfBotId)
        return NextResponse.json({ performance })

      case 'executions':
        const execBotId = searchParams.get('botId')
        if (!execBotId) {
          return NextResponse.json({ error: 'Bot ID is required' }, { status: 400 })
        }
        
        // Verify user owns the bot
        const execBot = await db.tradingBot.findFirst({
          where: { id: execBotId, userId: session.user.id }
        })
        
        if (!execBot) {
          return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
        }
        
        const executions = await botEngine.getBotExecutions(execBotId)
        return NextResponse.json({ executions })

      case 'types':
        const botTypes = Object.values(BotType).map(type => ({
          value: type,
          label: type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')
        }))
        return NextResponse.json({ types: botTypes })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Bots API error:', error)
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
    const { action, ...data } = body

    switch (action) {
      case 'create':
        const { name, description, type, strategy, marketId, exchangeAccountId, config } = data
        
        // Validate required fields
        if (!name || !type || !strategy || !exchangeAccountId) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Verify user owns the exchange account
        const exchangeAccount = await db.exchangeAccount.findFirst({
          where: { 
            id: exchangeAccountId, 
            userId: session.user.id 
          }
        })

        if (!exchangeAccount) {
          return NextResponse.json({ error: 'Exchange account not found' }, { status: 404 })
        }

        // Create bot
        const newBot = await db.tradingBot.create({
          data: {
            userId: session.user.id,
            name,
            description,
            type: type as BotType,
            strategy: {
              ...strategy,
              symbol: strategy.symbol || 'BTCUSDT'
            },
            marketId,
            exchangeAccountId,
            config: config || {},
            status: BotStatus.STOPPED
          }
        })

        return NextResponse.json({ bot: newBot }, { status: 201 })

      case 'start':
        const startBotId = data.botId
        if (!startBotId) {
          return NextResponse.json({ error: 'Bot ID is required' }, { status: 400 })
        }

        // Verify user owns the bot
        const startBot = await db.tradingBot.findFirst({
          where: { id: startBotId, userId: session.user.id }
        })

        if (!startBot) {
          return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
        }

        await botEngine.startBot(startBotId)
        return NextResponse.json({ message: 'Bot started successfully' })

      case 'stop':
        const stopBotId = data.botId
        if (!stopBotId) {
          return NextResponse.json({ error: 'Bot ID is required' }, { status: 400 })
        }

        // Verify user owns the bot
        const stopBot = await db.tradingBot.findFirst({
          where: { id: stopBotId, userId: session.user.id }
        })

        if (!stopBot) {
          return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
        }

        await botEngine.stopBot(stopBotId)
        return NextResponse.json({ message: 'Bot stopped successfully' })

      case 'pause':
        const pauseBotId = data.botId
        if (!pauseBotId) {
          return NextResponse.json({ error: 'Bot ID is required' }, { status: 400 })
        }

        // Verify user owns the bot
        const pauseBot = await db.tradingBot.findFirst({
          where: { id: pauseBotId, userId: session.user.id }
        })

        if (!pauseBot) {
          return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
        }

        await botEngine.pauseBot(pauseBotId)
        return NextResponse.json({ message: 'Bot paused successfully' })

      case 'resume':
        const resumeBotId = data.botId
        if (!resumeBotId) {
          return NextResponse.json({ error: 'Bot ID is required' }, { status: 400 })
        }

        // Verify user owns the bot
        const resumeBot = await db.tradingBot.findFirst({
          where: { id: resumeBotId, userId: session.user.id }
        })

        if (!resumeBot) {
          return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
        }

        await botEngine.resumeBot(resumeBotId)
        return NextResponse.json({ message: 'Bot resumed successfully' })

      case 'update':
        const updateBotId = data.botId
        if (!updateBotId) {
          return NextResponse.json({ error: 'Bot ID is required' }, { status: 400 })
        }

        // Verify user owns the bot
        const updateBot = await db.tradingBot.findFirst({
          where: { id: updateBotId, userId: session.user.id }
        })

        if (!updateBot) {
          return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
        }

        const { botId, ...updateData } = data
        
        // Update bot configuration
        await botEngine.updateBotConfig(updateBotId, updateData)
        
        // Also update database fields
        const updatedBot = await db.tradingBot.update({
          where: { id: updateBotId },
          data: {
            name: updateData.name,
            description: updateData.description,
            strategy: updateData.strategy,
            config: updateData.config,
            updatedAt: new Date()
          }
        })

        return NextResponse.json({ bot: updatedBot })

      case 'delete':
        const deleteBotId = data.botId
        if (!deleteBotId) {
          return NextResponse.json({ error: 'Bot ID is required' }, { status: 400 })
        }

        // Verify user owns the bot
        const deleteBot = await db.tradingBot.findFirst({
          where: { id: deleteBotId, userId: session.user.id }
        })

        if (!deleteBot) {
          return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
        }

        // Stop bot if running
        if (deleteBot.status === BotStatus.RUNNING) {
          await botEngine.stopBot(deleteBotId)
        }

        // Delete bot
        await db.tradingBot.delete({
          where: { id: deleteBotId }
        })

        return NextResponse.json({ message: 'Bot deleted successfully' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Bots API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}