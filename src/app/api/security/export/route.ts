import { NextRequest, NextResponse } from 'next/server'
import { SecurityAudit } from '@/lib/security'
import { securityHeaders } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const format = (searchParams.get('format') as 'json' | 'csv') || 'json'
    
    const filters = {
      userId: searchParams.get('userId') || undefined,
      category: searchParams.get('category') || undefined,
      severity: searchParams.get('severity') || undefined,
      action: searchParams.get('action') || undefined,
      startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined,
      endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    }
    
    const exportData = SecurityAudit.exportLogs(format, filters)
    
    const contentType = format === 'json' ? 'application/json' : 'text/csv'
    const filename = `security-logs-${new Date().toISOString().split('T')[0]}.${format}`
    
    const response = new NextResponse(exportData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        ...securityHeaders
      }
    })
    
    return response
  } catch (error) {
    console.error('Security export error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}