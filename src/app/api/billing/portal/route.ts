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
    const { returnUrl } = body

    if (!returnUrl) {
      return NextResponse.json({ error: 'Return URL is required' }, { status: 400 })
    }

    const portalSession = await billingService.createPortalSession(
      session.user.id,
      returnUrl
    )

    return NextResponse.json(portalSession)
  } catch (error) {
    console.error('Portal session creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}