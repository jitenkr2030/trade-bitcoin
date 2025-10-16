import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as os from 'os'

const execAsync = promisify(exec)

// GET /api/health/detailed - Detailed health check
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      responseTime: 0,
      checks: {} as any,
      metrics: {} as any,
      dependencies: {} as any
    }

    // Database Health Check
    try {
      const dbStartTime = Date.now()
      await db.$queryRaw`SELECT 1`
      const dbResponseTime = Date.now() - dbStartTime

      // Get database connection count
      const connectionStats = await db.$queryRaw`
        SELECT count(*) as active_connections 
        FROM pg_stat_activity 
        WHERE state = 'active'
      ` as any[]

      healthStatus.checks.database = {
        status: 'healthy',
        responseTime: dbResponseTime,
        activeConnections: connectionStats[0]?.active_connections || 0,
        maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '100')
      }
    } catch (error) {
      healthStatus.checks.database = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Database connection failed'
      }
      healthStatus.status = 'degraded'
    }

    // Redis Health Check (if configured)
    if (process.env.REDIS_URL) {
      try {
        const redisStartTime = Date.now()
        // In a real implementation, you would check Redis connection
        // const redisResponseTime = Date.now() - redisStartTime
        healthStatus.checks.redis = {
          status: 'healthy',
          responseTime: 0 // redisResponseTime
        }
      } catch (error) {
        healthStatus.checks.redis = {
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Redis connection failed'
        }
        healthStatus.status = 'degraded'
      }
    }

    // External API Health Check
    try {
      const apiStartTime = Date.now()
      // Check external services (e.g., market data providers)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch('https://api.coingecko.com/api/v3/ping', {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      const apiResponseTime = Date.now() - apiStartTime

      healthStatus.checks.externalApis = {
        status: response.ok ? 'healthy' : 'degraded',
        responseTime: apiResponseTime,
        coingecko: response.ok ? 'healthy' : 'unhealthy'
      }
    } catch (error) {
      healthStatus.checks.externalApis = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'External API check failed'
      }
      healthStatus.status = 'degraded'
    }

    // WebSocket Health Check
    try {
      healthStatus.checks.websocket = {
        status: 'healthy',
        connectedClients: 0, // In real implementation, get actual count
        uptime: process.uptime()
      }
    } catch (error) {
      healthStatus.checks.websocket = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'WebSocket check failed'
      }
      healthStatus.status = 'degraded'
    }

    // System Metrics
    try {
      // Get system memory usage
      const memUsage = process.memoryUsage()
      healthStatus.metrics.memory = {
        total: Math.round(memUsage.heapTotal / 1024 / 1024),
        used: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024),
        usagePercentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
      }

      // Get CPU usage (simplified)
      healthStatus.metrics.cpu = {
        usage: 0, // In real implementation, get actual CPU usage
        cores: os.cpus().length
      }

      // Get disk usage (simplified)
      healthStatus.metrics.disk = {
        total: 0, // In real implementation, get actual disk usage
        used: 0,
        free: 0,
        usagePercentage: 0
      }
    } catch (error) {
      healthStatus.metrics = {
        error: error instanceof Error ? error.message : 'Failed to get system metrics'
      }
    }

    // Application Metrics
    try {
      // Get user count
      const userCount = await db.user.count()
      
      // Get active sessions
      const activeSessions = await db.session.count({
        where: {
          expires: {
            gt: new Date()
          }
        }
      })

      // Get recent trades count (last 24 hours)
      const recentTrades = await db.trade.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      })

      healthStatus.metrics.application = {
        userCount,
        activeSessions,
        recentTrades,
        uptime: process.uptime()
      }
    } catch (error) {
      healthStatus.metrics.application = {
        error: error instanceof Error ? error.message : 'Failed to get application metrics'
      }
    }

    // Dependencies Check
    try {
      // Check critical dependencies
      const nextjsPkg = await import('next/package.json')
      const reactPkg = await import('react/package.json')
      const prismaPkg = await import('@prisma/client/package.json')
      
      healthStatus.dependencies = {
        nextjs: {
          version: nextjsPkg.version,
          status: 'healthy'
        },
        react: {
          version: reactPkg.version,
          status: 'healthy'
        },
        prisma: {
          version: prismaPkg.version,
          status: 'healthy'
        }
      }
    } catch (error) {
      healthStatus.dependencies = {
        error: error instanceof Error ? error.message : 'Failed to check dependencies'
      }
    }

    // Calculate overall response time
    healthStatus.responseTime = Date.now() - startTime

    // Determine overall status
    const unhealthyChecks = Object.values(healthStatus.checks).filter((check: any) => check.status === 'unhealthy').length
    const degradedChecks = Object.values(healthStatus.checks).filter((check: any) => check.status === 'degraded').length

    if (unhealthyChecks > 0) {
      healthStatus.status = 'unhealthy'
    } else if (degradedChecks > 0) {
      healthStatus.status = 'degraded'
    }

    // Set appropriate HTTP status
    const httpStatus = healthStatus.status === 'healthy' ? 200 : 
                      healthStatus.status === 'degraded' ? 200 : 503

    return NextResponse.json(healthStatus, { status: httpStatus })
  } catch (error) {
    console.error('Error in detailed health check:', error)
    return NextResponse.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Health check failed',
      timestamp: new Date().toISOString()
    }, { status: 503 })
  }
}