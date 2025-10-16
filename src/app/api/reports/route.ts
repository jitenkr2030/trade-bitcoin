import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

// GET /api/reports - Generate reports
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has permission to generate reports
    if (session.user.role !== 'admin' && session.user.role !== 'manager') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'trading', 'users', 'revenue', 'activity'
    const period = searchParams.get('period') || '30d' // '7d', '30d', '90d', '1y'
    const format = searchParams.get('format') || 'json' // 'json', 'csv', 'pdf'

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Report type is required' },
        { status: 400 }
      )
    }

    // Calculate date range based on period
    const now = new Date()
    let startDate: Date
    let endDate: Date

    switch (period) {
      case '7d':
        startDate = startOfDay(subDays(now, 7))
        endDate = endOfDay(now)
        break
      case '30d':
        startDate = startOfDay(subDays(now, 30))
        endDate = endOfDay(now)
        break
      case '90d':
        startDate = startOfDay(subDays(now, 90))
        endDate = endOfDay(now)
        break
      case '1y':
        startDate = startOfDay(subDays(now, 365))
        endDate = endOfDay(now)
        break
      default:
        startDate = startOfDay(subDays(now, 30))
        endDate = endOfDay(now)
    }

    let reportData: any

    switch (type) {
      case 'trading':
        reportData = await generateTradingReport(startDate, endDate)
        break
      case 'users':
        reportData = await generateUsersReport(startDate, endDate)
        break
      case 'revenue':
        reportData = await generateRevenueReport(startDate, endDate)
        break
      case 'activity':
        reportData = await generateActivityReport(startDate, endDate)
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid report type' },
          { status: 400 }
        )
    }

    // Add metadata
    const report = {
      id: `report_${type}_${period}_${Date.now()}`,
      type,
      period,
      startDate,
      endDate,
      generatedAt: new Date(),
      generatedBy: session.user.id,
      data: reportData
    }

    // Handle different output formats
    if (format === 'csv') {
      // Convert to CSV format (simplified example)
      const csvData = convertToCSV(reportData)
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${type}_report_${period}.csv"`
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: report
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

// Helper functions for generating different report types
async function generateTradingReport(startDate: Date, endDate: Date) {
  const [
    totalTrades,
    totalVolume,
    totalFees,
    topSymbols,
    dailyStats
  ] = await Promise.all([
    db.trade.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    }),
    db.trade.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        amount: true
      }
    }),
    db.trade.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        fee: true
      }
    }),
    // Get top symbols by joining with Market model
    db.$queryRaw`
      SELECT 
        m.symbol,
        COUNT(t.id) as trade_count
      FROM trades t
      JOIN markets m ON t.market_id = m.id
      WHERE t.created_at >= ${startDate}
      AND t.created_at <= ${endDate}
      GROUP BY m.symbol
      ORDER BY trade_count DESC
      LIMIT 10
    ` as unknown as any[],
    // Get daily trading statistics
    db.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as trade_count,
        SUM(amount) as volume,
        SUM(fee) as fees,
        AVG(amount) as avg_trade_size
      FROM trades 
      WHERE created_at >= ${startDate} AND created_at <= ${endDate}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    ` as unknown as any[]
  ])

  return {
    summary: {
      totalTrades,
      totalVolume: totalVolume._sum.amount || 0,
      totalFees: totalFees._sum.fee || 0
    },
    topSymbols: topSymbols.map((item: any) => ({
      symbol: item.symbol,
      tradeCount: parseInt(item.trade_count)
    })),
    dailyStats: dailyStats.map(stat => ({
      date: stat.date,
      tradeCount: parseInt(stat.trade_count),
      volume: parseFloat(stat.volume),
      fees: parseFloat(stat.fees),
      avgTradeSize: parseFloat(stat.avg_trade_size)
    }))
  }
}

async function generateUsersReport(startDate: Date, endDate: Date) {
  const [
    totalUsers,
    newUsers,
    activeUsers,
    inactiveUsers,
    verifiedUsers,
    userByCountry,
    userByRole
  ] = await Promise.all([
    db.user.count(),
    db.user.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    }),
    db.user.count({
      where: {
        lastLoginAt: {
          gte: subDays(new Date(), 30)
        }
      }
    }),
    db.user.count({
      where: {
        lastLoginAt: {
          lt: subDays(new Date(), 30)
        }
      }
    }),
    db.user.count({
      where: {
        emailVerified: true
      }
    }),
    db.user.groupBy({
      by: ['country'],
      where: {
        country: {
          not: null
        }
      },
      _count: {
        country: true
      },
      orderBy: {
        _count: {
          country: 'desc'
        }
      },
      take: 10
    }),
    db.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    })
  ])

  return {
    summary: {
      totalUsers,
      newUsers,
      activeUsers,
      inactiveUsers,
      verifiedUsers,
      verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers * 100).toFixed(2) + '%' : '0%',
      activityRate: totalUsers > 0 ? (activeUsers / totalUsers * 100).toFixed(2) + '%' : '0%'
    },
    userByCountry: userByCountry.map(item => ({
      country: item.country,
      count: item._count.country
    })),
    userByRole: userByRole.map(item => ({
      role: item.role,
      count: item._count.role
    }))
  }
}

async function generateRevenueReport(startDate: Date, endDate: Date) {
  const [
    tradingFees,
    revenueByDay
  ] = await Promise.all([
    db.trade.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        fee: true
      }
    }),
    // Get daily revenue statistics
    db.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        SUM(fee) as daily_fees
      FROM trades 
      WHERE created_at >= ${startDate} AND created_at <= ${endDate}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    ` as unknown as any[]
  ])

  const totalRevenue = tradingFees._sum.fee || 0

  return {
    summary: {
      totalRevenue,
      tradingFees: tradingFees._sum.fee || 0,
      depositFees: 0,
      withdrawalFees: 0
    },
    revenueByDay: revenueByDay.map((item: any) => ({
      date: item.date,
      revenue: parseFloat(item.daily_fees) || 0
    })),
    revenueBySource: [
      {
        source: 'Trading Fees',
        revenue: tradingFees._sum.fee || 0,
        percentage: totalRevenue > 0 ? 100 : 0
      },
      {
        source: 'Deposit Fees',
        revenue: 0,
        percentage: 0
      },
      {
        source: 'Withdrawal Fees',
        revenue: 0,
        percentage: 0
      }
    ]
  }
}

async function generateActivityReport(startDate: Date, endDate: Date) {
  const [
    totalLogins,
    uniqueLogins,
    pageViews,
    apiCalls,
    activitiesByType
  ] = await Promise.all([
    db.auditLog.count({
      where: {
        action: 'login',
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      }
    }),
    db.auditLog.groupBy({
      by: ['userId'],
      where: {
        action: 'login',
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        userId: true
      }
    }),
    db.auditLog.count({
      where: {
        action: 'page_view',
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      }
    }),
    db.auditLog.count({
      where: {
        action: {
          startsWith: 'api_'
        },
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      }
    }),
    db.auditLog.groupBy({
      by: ['action'],
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        action: true
      },
      orderBy: {
        _count: {
          action: 'desc'
        }
      },
      take: 10
    })
  ])

  return {
    summary: {
      totalLogins,
      uniqueLogins: uniqueLogins.length,
      pageViews,
      apiCalls,
      avgLoginsPerUser: uniqueLogins.length > 0 ? (totalLogins / uniqueLogins.length).toFixed(2) : '0'
    },
    activitiesByType: activitiesByType.map(item => ({
      action: item.action,
      count: item._count.action
    }))
  }
}

// Helper function to convert data to CSV
function convertToCSV(data: any): string {
  if (Array.isArray(data) && data.length > 0) {
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(obj => 
      Object.values(obj).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    ).join('\n')
    return `${headers}\n${rows}`
  }
  return JSON.stringify(data, null, 2)
}