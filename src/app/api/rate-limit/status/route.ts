import { NextRequest, NextResponse } from 'next/server'
import { getRateLimitStatus, getRateLimitStats } from '@/lib/rate-limiting'
import { securityHeaders } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    // Get rate limit status for current request
    const status = await getRateLimitStatus(request)
    
    // Get global statistics
    const stats = getRateLimitStats()
    
    const response = NextResponse.json({
      success: true,
      rateLimit: status,
      stats: {
        totalKeys: stats.totalKeys,
        activeKeys: stats.activeKeys
      },
      timestamp: new Date().toISOString()
    })
    
    // Set security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    console.error('Rate limit status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}