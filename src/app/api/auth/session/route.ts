import { NextRequest, NextResponse } from 'next/server'
import { SessionManager, SecurityAudit, securityHeaders } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    // Get user session from cookie
    const userSession = request.cookies.get('user-session')?.value
    const user = userSession ? JSON.parse(userSession) : null

    if (!user) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      )
    }

    // Get session info
    const sessionId = request.cookies.get('session-id')?.value
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID not found' },
        { status: 401 }
      )
    }

    const sessionInfo = await SessionManager.getSessionInfo(sessionId)
    if (!sessionInfo) {
      return NextResponse.json(
        { error: 'Session not found or expired' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      success: true,
      session: sessionInfo
    })

    // Set security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error('Session info error:', error)
    SecurityAudit.log('SESSION_INFO_ERROR', { 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, undefined, request)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user session from cookie
    const userSession = request.cookies.get('user-session')?.value
    const user = userSession ? JSON.parse(userSession) : null

    if (!user) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action } = body

    let response

    switch (action) {
      case 'refresh':
        // Update session activity
        const sessionId = request.cookies.get('session-id')?.value
        if (sessionId) {
          await SessionManager.updateSessionActivity(sessionId)
          SecurityAudit.log('SESSION_REFRESHED', { userId: user.id }, user.id, request)
        }
        response = NextResponse.json({
          success: true,
          message: 'Session refreshed'
        })
        break

      case 'invalidate':
        // Invalidate current session
        if (sessionId) {
          await SessionManager.invalidateSession(sessionId)
          SecurityAudit.log('SESSION_INVALIDATED_BY_USER', { userId: user.id }, user.id, request)
        }
        response = NextResponse.json({
          success: true,
          message: 'Session invalidated'
        })
        // Clear cookies
        response.cookies.set('user-session', '', { maxAge: 0, path: '/' })
        response.cookies.set('session-id', '', { maxAge: 0, path: '/' })
        break

      case 'invalidate_all':
        // Invalidate all user sessions
        await SessionManager.invalidateAllUserSessions(user.id)
        SecurityAudit.log('ALL_SESSIONS_INVALIDATED_BY_USER', { userId: user.id }, user.id, request)
        response = NextResponse.json({
          success: true,
          message: 'All sessions invalidated'
        })
        // Clear cookies
        response.cookies.set('user-session', '', { maxAge: 0, path: '/' })
        response.cookies.set('session-id', '', { maxAge: 0, path: '/' })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Set security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error('Session management error:', error)
    SecurityAudit.log('SESSION_MANAGEMENT_ERROR', { 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, undefined, request)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}