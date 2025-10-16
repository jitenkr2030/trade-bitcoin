import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/notifications - Get user notifications
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
    const type = searchParams.get('type')
    const status = searchParams.get('status') // 'read', 'unread', 'all'
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      userId: session.user.id
    }
    
    if (type) {
      where.type = type
    }
    
    if (status === 'read') {
      where.status = 'READ'
    } else if (status === 'unread') {
      where.status = 'UNREAD'
    }
    
    if (unreadOnly) {
      where.status = 'UNREAD'
    }

    // Get notifications with pagination
    const [notifications, total, unreadCount] = await Promise.all([
      db.notification.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      db.notification.count({ where }),
      db.notification.count({
        where: {
          userId: session.user.id,
          status: 'UNREAD'
        }
      })
    ])

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Create notification
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only admins can create notifications for other users
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      userId,
      type,
      title,
      message
    } = body

    // Validate required fields
    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { success: false, error: 'userId, type, title, and message are required' },
        { status: 400 }
      )
    }

    // Create the notification
    const notification = await db.notification.create({
      data: {
        userId,
        type,
        title,
        message
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // TODO: Send push notification if user has push notifications enabled
    // This would integrate with services like Firebase Cloud Messaging, OneSignal, etc.

    return NextResponse.json({
      success: true,
      data: notification,
      message: 'Notification created successfully'
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

// PATCH /api/notifications - Batch update notifications
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { notificationIds, action } = body

    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'notificationIds array is required' },
        { status: 400 }
      )
    }

    if (!action || !['markAsRead', 'markAsUnread', 'delete'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      )
    }

    // Verify user owns these notifications
    const userNotifications = await db.notification.findMany({
      where: {
        id: {
          in: notificationIds
        },
        userId: session.user.id
      }
    })

    if (userNotifications.length !== notificationIds.length) {
      return NextResponse.json(
        { success: false, error: 'Some notifications not found or access denied' },
        { status: 404 }
      )
    }

    let result

    switch (action) {
      case 'markAsRead':
        result = await db.notification.updateMany({
          where: {
            id: {
              in: notificationIds
            }
          },
          data: {
            status: 'READ'
          }
        })
        break
      case 'markAsUnread':
        result = await db.notification.updateMany({
          where: {
            id: {
              in: notificationIds
            }
          },
          data: {
            status: 'UNREAD'
          }
        })
        break
      case 'delete':
        result = await db.notification.deleteMany({
          where: {
            id: {
              in: notificationIds
            }
          }
        })
        break
    }

    return NextResponse.json({
      success: true,
      data: {
        affected: result.count
      },
      message: `Notifications ${action} successfully`
    })
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update notifications' },
      { status: 500 }
    )
  }
}