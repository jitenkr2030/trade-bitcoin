import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import crypto from 'crypto'

// GET /api/webhooks - Get user webhooks
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') // 'active', 'inactive', 'all'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      userId: session.user.id
    }
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase() as any
    }

    // Get webhooks with pagination
    const [webhooks, total] = await Promise.all([
      db.webhook.findMany({
        where,
        include: {
          webhookEvents: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      db.webhook.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: webhooks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching webhooks:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch webhooks' },
      { status: 500 }
    )
  }
}

// POST /api/webhooks - Create new webhook or handle actions
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action } = body

    // Handle different actions
    if (action === 'test') {
      const { url, secret } = body

      if (!url) {
        return NextResponse.json(
          { success: false, error: 'URL is required' },
          { status: 400 }
        )
      }

      // Create test payload
      const testPayload = {
        event: 'webhook.test',
        timestamp: new Date().toISOString(),
        data: {
          message: 'This is a test webhook from TradeBitcoin',
          userId: session.user.id
        }
      }

      // Create signature if secret is provided
      const signature = secret 
        ? crypto.createHmac('sha256', secret).update(JSON.stringify(testPayload)).digest('hex')
        : null

      // Send test webhook
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'TradeBitcoin-Webhook/1.0',
          ...(signature && { 'X-Webhook-Signature': `sha256=${signature}` })
        },
        body: JSON.stringify(testPayload)
      })

      const result = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        response: await response.text().catch(() => null)
      }

      return NextResponse.json({
        success: true,
        data: result,
        message: 'Webhook test completed'
      })
    }

    // Default action: create new webhook
    const {
      url,
      name,
      events,
      secret,
      status = 'ACTIVE'
    } = body

    // Validate required fields
    if (!url || !name || !events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { success: false, error: 'url, name, and events are required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Generate secret if not provided
    const webhookSecret = secret || crypto.randomBytes(32).toString('hex')

    // Create the webhook
    const webhook = await db.webhook.create({
      data: {
        url,
        name,
        secret: webhookSecret,
        status,
        userId: session.user.id,
        events: JSON.stringify(events)
      },
      include: {
        webhookEvents: true
      }
    })

    return NextResponse.json({
      success: true,
      data: webhook,
      message: 'Webhook created successfully'
    })
  } catch (error) {
    console.error('Error in webhook POST:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook request' },
      { status: 500 }
    )
  }
}