import { NextRequest, NextResponse } from 'next/server'
import { exchangeManager } from '@/lib/exchanges/manager'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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
        const exchanges = exchangeManager.getAvailableExchanges()
        return NextResponse.json({ exchanges })

      case 'accounts':
        const accounts = await exchangeManager.getExchangeAccountsByUser(session.user.id)
        return NextResponse.json({ accounts })

      case 'test':
        const accountId = searchParams.get('accountId')
        if (!accountId) {
          return NextResponse.json({ error: 'Account ID is required' }, { status: 400 })
        }
        const isConnected = await exchangeManager.testConnection(accountId)
        return NextResponse.json({ connected: isConnected })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Exchange API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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
        const newAccount = await exchangeManager.createExchangeAccount({
          userId: session.user.id,
          ...data
        })
        return NextResponse.json({ account: newAccount }, { status: 201 })

      case 'update':
        const updatedAccount = await exchangeManager.updateExchangeAccount(data.id, data)
        return NextResponse.json({ account: updatedAccount })

      case 'delete':
        await exchangeManager.deleteExchangeAccount(data.id)
        return NextResponse.json({ message: 'Exchange account deleted successfully' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Exchange API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}