import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/webhooks/[id] - Get single webhook
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await context.params

    const webhook = await db.webhook.findUnique({
      where: { id },
      include: {
        webhookEvents: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    })

    if (!webhook) {
      return NextResponse.json(
        { success: false, error: 'Webhook not found' },
        { status: 404 }
      )
    }

    // Check if user owns this webhook
    if (webhook.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: webhook
    })
  } catch (error) {
    console.error('Error fetching webhook:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch webhook' },
      { status: 500 }
    )
  }
}

// PUT /api/webhooks/[id] - Update webhook
export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const body = await request.json()
    const {
      url,
      name,
      events,
      secret,
      status
    } = body

    // Check if webhook exists and user owns it
    const existingWebhook = await db.webhook.findUnique({
      where: { id }
    })

    if (!existingWebhook) {
      return NextResponse.json(
        { success: false, error: 'Webhook not found' },
        { status: 404 }
      )
    }

    if (existingWebhook.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Validate URL format if provided
    if (url) {
      try {
        new URL(url)
      } catch {
        return NextResponse.json(
          { success: false, error: 'Invalid URL format' },
          { status: 400 }
        )
      }
    }

    // Update the webhook
    const updateData: any = {}
    if (url !== undefined) updateData.url = url
    if (name !== undefined) updateData.name = name
    if (secret !== undefined) updateData.secret = secret
    if (status !== undefined) updateData.status = status

    // Handle webhookEvents update
    if (events && Array.isArray(events)) {
      // Update events JSON field
      updateData.events = JSON.stringify(events)
    }

    const updatedWebhook = await db.webhook.update({
      where: { id },
      data: updateData,
      include: {
        webhookEvents: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedWebhook,
      message: 'Webhook updated successfully'
    })
  } catch (error) {
    console.error('Error updating webhook:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update webhook' },
      { status: 500 }
    )
  }
}

// DELETE /api/webhooks/[id] - Delete webhook
export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await context.params

    // Check if webhook exists and user owns it
    const existingWebhook = await db.webhook.findUnique({
      where: { id }
    })

    if (!existingWebhook) {
      return NextResponse.json(
        { success: false, error: 'Webhook not found' },
        { status: 404 }
      )
    }

    if (existingWebhook.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Delete the webhook (cascade will delete related events and logs)
    await db.webhook.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Webhook deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting webhook:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete webhook' },
      { status: 500 }
    )
  }
}

// POST /api/webhooks/[id] - Handle webhook actions (toggle, etc.)
export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const body = await request.json()
    const { action } = body

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      )
    }

    // Check if webhook exists and user owns it
    const existingWebhook = await db.webhook.findUnique({
      where: { id }
    })

    if (!existingWebhook) {
      return NextResponse.json(
        { success: false, error: 'Webhook not found' },
        { status: 404 }
      )
    }

    if (existingWebhook.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Handle different actions
    switch (action) {
      case 'toggle':
        const updatedWebhook = await db.webhook.update({
          where: { id },
          data: {
            status: existingWebhook.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
          }
        })

        return NextResponse.json({
          success: true,
          data: updatedWebhook,
          message: `Webhook ${updatedWebhook.status === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error handling webhook action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to handle webhook action' },
      { status: 500 }
    )
  }
}