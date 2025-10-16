import { NextRequest, NextResponse } from 'next/server'
import { billingService } from '@/lib/billing/stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await billingService.getUserSubscription(session.user.id)
    const usageStats = await billingService.getUsageStats(session.user.id)

    return NextResponse.json({
      subscription,
      usageStats
    })
  } catch (error) {
    console.error('Subscription fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cancelImmediately = searchParams.get('immediate') === 'true'

    await billingService.cancelSubscription(session.user.id, cancelImmediately)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscription cancellation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, planId } = body

    switch (action) {
      case 'reactivate':
        await billingService.reactivateSubscription(session.user.id)
        return NextResponse.json({ success: true })

      case 'change_plan':
        if (!planId) {
          return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
        }
        await billingService.changeSubscriptionPlan(session.user.id, planId)
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Subscription update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}