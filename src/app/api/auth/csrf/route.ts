import { NextRequest, NextResponse } from 'next/server'
import { CSRFProtection, securityHeaders, SecurityAudit } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    // Generate CSRF token
    const csrfToken = CSRFProtection.generateToken()
    
    // Create response
    const response = NextResponse.json({
      csrfToken
    })

    // Set security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // Set CSRF token in cookie
    response.cookies.set(CSRFProtection.getCookieName(), csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    })

    // Log CSRF token generation (for audit purposes)
    SecurityAudit.log('CSRF_TOKEN_GENERATED', { 
      clientIP: request.headers.get('x-forwarded-for') || 'unknown'
    }, undefined, request)

    return response
  } catch (error) {
    console.error('CSRF token generation error:', error)
    SecurityAudit.log('CSRF_TOKEN_ERROR', { 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, undefined, request)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}