import { NextRequest, NextResponse } from 'next/server'
import { billingService } from '@/lib/billing/stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock Stripe configuration for development
const mockStripeConfig = {
  apiKey: process.env.STRIPE_SECRET_KEY || 'mock_key',
  apiVersion: '2024-12-18.acacia' as const
}

export async function GET(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ 
        error: 'Stripe not configured',
        invoices: [],
        message: 'Stripe integration is not configured. Please add STRIPE_SECRET_KEY to your environment variables.'
      }, { status: 200 })
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const invoices = await billingService.getUserInvoices(session.user.id)

    return NextResponse.json({ invoices })
  } catch (error) {
    console.error('Invoices fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}