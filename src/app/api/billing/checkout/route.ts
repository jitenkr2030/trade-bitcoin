import { NextRequest, NextResponse } from 'next/server'
import { billingService } from '@/lib/billing/stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { planId, successUrl, cancelUrl } = body

    if (!planId || !successUrl || !cancelUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const checkoutSession = await billingService.createCheckoutSession(
      session.user.id,
      planId,
      successUrl,
      cancelUrl
    )

    return NextResponse.json(checkoutSession)
  } catch (error) {
    console.error('Checkout session creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}