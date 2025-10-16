import { NextRequest, NextResponse } from 'next/server'
import { SecurityAudit, CSRFProtection, securityHeaders, SessionManager } from '@/lib/security'

export async function POST(request: NextRequest) {
  let user: any = null
  
  try {
    // Get user session from cookie
    const userSession = request.cookies.get('user-session')?.value
    user = userSession ? JSON.parse(userSession) : null
    const sessionId = request.cookies.get('session-id')?.value

    // Validate CSRF token for non-GET requests
    const body = await request.json()
    const { csrfToken } = body

    if (request.method !== 'GET') {
      const storedCsrfToken = request.cookies.get(CSRFProtection.getCookieName())?.value
      if (!csrfToken || !storedCsrfToken || !CSRFProtection.validateToken(csrfToken, storedCsrfToken)) {
        SecurityAudit.log('LOGOUT_CSRF_VALIDATION_FAILED', { userId: user?.id }, undefined, request)
        return NextResponse.json(
          { error: 'Invalid CSRF token' },
          { status: 403 }
        )
      }
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

    // Set security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // Invalidate session using SessionManager
    if (sessionId && user) {
      SessionManager.invalidateSession(sessionId)
      SecurityAudit.log('LOGOUT_SESSION_INVALIDATED', { 
        sessionId,
        userId: user.id,
        email: user.email 
      }, user.id, request)
    }

    // Clear the user session cookie
    response.cookies.set('user-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })

    // Clear session ID cookie
    response.cookies.set('session-id', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })

    // Clear CSRF token cookie
    response.cookies.set(CSRFProtection.getCookieName(), '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })

    // Log successful logout
    if (user) {
      SecurityAudit.log('LOGOUT_SUCCESS', { 
        userId: user.id,
        email: user.email 
      }, user.id, request)
    }

    return response
  } catch (error) {
    console.error('Logout error:', error)
    SecurityAudit.log('LOGOUT_ERROR', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: user?.id 
    }, undefined, request)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}