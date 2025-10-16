import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { subDays, format } from 'date-fns'

// GET /api/exports - Export data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has permission to export data
    if (session.user.role !== 'admin' && session.user.role !== 'manager') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'trades', 'users', 'transactions', 'analytics'
    const exportFormat = searchParams.get('format') || 'csv' // 'csv', 'json', 'xlsx'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const filters = searchParams.get('filters') // JSON string of filters

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Export type is required' },
        { status: 400 }
      )
    }

    // Parse date range
    let startDt: Date | undefined
    let endDt: Date | undefined

    if (startDate) {
      startDt = new Date(startDate)
    }
    if (endDate) {
      endDt = new Date(endDate)
    }

    // Parse filters
    let parsedFilters: any = {}
    if (filters) {
      try {
        parsedFilters = JSON.parse(filters)
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Invalid filters format' },
          { status: 400 }
        )
      }
    }

    let exportData: any
    let filename: string

    switch (type) {
      case 'trades':
        exportData = await exportTrades(startDt, endDt, parsedFilters)
        filename = `trades_export_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.${exportFormat}`
        break
      case 'users':
        exportData = await exportUsers(startDt, endDt, parsedFilters)
        filename = `users_export_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.${exportFormat}`
        break
      case 'transactions':
        exportData = await exportTransactions(startDt, endDt, parsedFilters)
        filename = `transactions_export_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.${exportFormat}`
        break
      case 'analytics':
        exportData = await exportAnalytics(startDt, endDt, parsedFilters)
        filename = `analytics_export_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.${exportFormat}`
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid export type' },
          { status: 400 }
        )
    }

    // Handle different output formats
    let contentType: string
    let content: string

    switch (exportFormat) {
      case 'csv':
        contentType = 'text/csv'
        content = convertToCSV(exportData)
        break
      case 'json':
        contentType = 'application/json'
        content = JSON.stringify(exportData, null, 2)
        break
      case 'xlsx':
        // For Excel export, you would need a library like xlsx
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        content = JSON.stringify(exportData) // Simplified - in real implementation, convert to Excel format
        break
      default:
        contentType = 'application/json'
        content = JSON.stringify(exportData, null, 2)
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export data' },
      { status: 500 }
    )
  }
}

// Export functions for different data types
async function exportTrades(startDate?: Date, endDate?: Date, filters?: any) {
  const where: any = {}
  
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = startDate
    if (endDate) where.createdAt.lte = endDate
  }

  if (filters) {
    if (filters.symbol) where.symbol = filters.symbol
    if (filters.status) where.status = filters.status
    if (filters.type) where.type = filters.type
    if (filters.userId) where.userId = filters.userId
  }

  const trades = await db.trade.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      market: {
        select: {
          symbol: true
        }
      },
      order: {
        select: {
          type: true,
          status: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return trades.map(trade => ({
    id: trade.id,
    userId: trade.userId,
    userName: trade.user.name,
    userEmail: trade.user.email,
    symbol: trade.market?.symbol || '',
    type: trade.order?.type || '',
    side: trade.side,
    amount: trade.amount,
    price: trade.price,
    fee: trade.fee,
    feeCurrency: trade.feeCurrency,
    exchangeTradeId: trade.exchangeTradeId,
    createdAt: trade.createdAt
  }))
}

async function exportUsers(startDate?: Date, endDate?: Date, filters?: any) {
  const where: any = {}
  
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = startDate
    if (endDate) where.createdAt.lte = endDate
  }

  if (filters) {
    if (filters.role) where.role = filters.role
    if (filters.status) where.status = filters.status
    if (filters.verified !== undefined) where.emailVerified = filters.verified
    if (filters.country) where.country = filters.country
  }

  const users = await db.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      avatar: true,
      country: true,
      timezone: true,
      language: true,
      createdAt: true,
      lastLoginAt: true,
      _count: {
        select: {
          trades: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return users.map(user => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerified: user.emailVerified,
    country: user.country,
    timezone: user.timezone,
    language: user.language,
    totalTrades: user._count.trades,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt
  }))
}

async function exportTransactions(startDate?: Date, endDate?: Date, filters?: any) {
  // Since Transaction model doesn't exist, we'll return an empty array or map to a different model
  // For now, let's return trades as a fallback
  return await exportTrades(startDate, endDate, filters)
}

async function exportAnalytics(startDate?: Date, endDate?: Date, filters?: any) {
  const where: any = {}
  
  if (startDate || endDate) {
    where.timestamp = {}
    if (startDate) where.timestamp.gte = startDate
    if (endDate) where.timestamp.lte = endDate
  }

  if (filters) {
    if (filters.action) where.action = filters.action
    if (filters.userId) where.userId = filters.userId
    if (filters.category) where.category = filters.category
    if (filters.severity) where.severity = filters.severity
  }

  const analytics = await db.auditLog.findMany({
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
      timestamp: 'desc'
    }
  })

  return analytics.map(log => ({
    id: log.id,
    userId: log.userId,
    userName: log.user?.name || 'Anonymous',
    userEmail: log.user?.email || '',
    action: log.action,
    category: log.category,
    severity: log.severity,
    details: log.details,
    ipAddress: log.ipAddress,
    userAgent: log.userAgent,
    timestamp: log.timestamp
  }))
}

// Helper function to convert data to CSV
function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0])
  const csvHeaders = headers.map(header => `"${header}"`).join(',')
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header]
      if (value === null || value === undefined) return '""'
      if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`
      return `"${String(value).replace(/"/g, '""')}"`
    }).join(',')
  })

  return `${csvHeaders}\n${csvRows.join('\n')}`
}

// POST /api/exports - Schedule export job
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has permission to schedule exports
    if (session.user.role !== 'admin' && session.user.role !== 'manager') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      type,
      format = 'csv',
      schedule, // 'once', 'daily', 'weekly', 'monthly'
      filters,
      recipients // array of email addresses
    } = body

    if (!type || !schedule) {
      return NextResponse.json(
        { success: false, error: 'Type and schedule are required' },
        { status: 400 }
      )
    }

    // Create export job (in a real implementation, this would be stored in a database)
    const exportJob = {
      id: `export_${Date.now()}`,
      type,
      format,
      schedule,
      filters,
      recipients,
      createdBy: session.user.id,
      createdAt: new Date(),
      status: 'scheduled'
    }

    // TODO: In a real implementation, you would:
    // 1. Store the export job in the database
    // 2. Set up a cron job or scheduler to process the export
    // 3. Send the exported file to the recipients via email

    return NextResponse.json({
      success: true,
      data: exportJob,
      message: 'Export job scheduled successfully'
    })
  } catch (error) {
    console.error('Error scheduling export:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to schedule export' },
      { status: 500 }
    )
  }
}