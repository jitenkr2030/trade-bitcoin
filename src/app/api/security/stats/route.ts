import { NextRequest, NextResponse } from 'next/server'
import { SecurityAudit, SessionManager } from '@/lib/security'
import { securityHeaders } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const timeRange = searchParams.get('timeRange') 
      ? parseInt(searchParams.get('timeRange')!) 
      : 24 * 60 * 60 * 1000 // Default 24 hours
    
    // Get security statistics
    const securityStats = SecurityAudit.getSecurityStats(timeRange)
    
    // Get session statistics
    const sessionStats = await SessionManager.getSecurityStats()
    
    // Get recent alerts
    const recentAlerts = SecurityAudit.getRecentAlerts(10)
    
    // Detect anomalies
    const anomalies = SecurityAudit.detectAnomalies(60 * 60 * 1000) // 1 hour
    
    const response = NextResponse.json({
      success: true,
      data: {
        security: securityStats,
        sessions: sessionStats,
        alerts: recentAlerts,
        anomalies,
        timeRange,
        timestamp: new Date().toISOString()
      }
    })
    
    // Set security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    console.error('Security stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}