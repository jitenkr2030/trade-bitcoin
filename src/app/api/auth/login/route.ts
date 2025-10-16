import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { 
  hashPassword, 
  verifyPassword, 
  checkRateLimit, 
  checkFailedLoginAttempts, 
  recordFailedLoginAttempt, 
  resetFailedLoginAttempts,
  validateEnvironmentVariables,
  sanitizeInput,
  SecurityAudit,
  CSRFProtection,
  securityHeaders,
  SessionManager
} from '@/lib/security'
import { passwordSchema, emailSchema } from '@/lib/security'
import { 
  withErrorHandling, 
  createValidationError, 
  createAuthenticationError, 
  createRateLimitError, 
  handleDatabaseError,
  handleZodError,
  handleSecurityError 
} from '@/lib/error-handler'

const handler = withErrorHandling(async (request: NextRequest) => {
  // Validate environment variables
  const envValidation = validateEnvironmentVariables()
  if (!envValidation.isValid) {
    SecurityAudit.log('ENV_VALIDATION_FAILED', { errors: envValidation.errors }, undefined, request, 'HIGH', 'SYSTEM')
    throw createValidationError('Server configuration error')
  }

  // Check rate limiting
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
  const rateLimitResult = await checkRateLimit(clientIP, 'login')
  
  if (!rateLimitResult) {
    SecurityAudit.log('RATE_LIMIT_EXCEEDED', { type: 'login' }, undefined, request, 'MEDIUM', 'RATE_LIMIT')
    throw createRateLimitError('Too many login attempts. Please try again later.')
  }

  // Parse and validate input
  const body = await request.json()
  const { email, password, csrfToken } = body

  // Validate CSRF token for non-GET requests
  if (request.method !== 'GET') {
    const storedCsrfToken = request.cookies.get(CSRFProtection.getCookieName())?.value
    if (!csrfToken || !storedCsrfToken || !CSRFProtection.validateToken(csrfToken, storedCsrfToken)) {
      SecurityAudit.log('CSRF_VALIDATION_FAILED', { email: sanitizeInput(email) }, undefined, request, 'HIGH', 'SECURITY')
      throw handleSecurityError(new Error('Invalid CSRF token'), request)
    }
  }

  // Validate input using Zod schemas
  const emailValidation = emailSchema.safeParse({ email })
  const passwordValidation = passwordSchema.safeParse({ password })

  if (!emailValidation.success || !passwordValidation.success) {
    const errors = [
      ...(emailValidation.error?.issues || []),
      ...(passwordValidation.error?.issues || [])
    ]
    SecurityAudit.log('INPUT_VALIDATION_FAILED', { 
      email: sanitizeInput(email), 
      errors: errors.map(e => e.message) 
    }, undefined, request, 'MEDIUM', 'VALIDATION')
    throw handleZodError({
      errors: errors.map(e => ({
        path: [e.path.join('.')],
        message: e.message,
        code: 'invalid_input'
      }))
    })
  }

  const sanitizedEmail = sanitizeInput(email)

  // Check failed login attempts
  const attemptCheck = checkFailedLoginAttempts(sanitizedEmail)
  if (!attemptCheck.canAttempt) {
    SecurityAudit.log('ACCOUNT_LOCKED', { 
      email: sanitizedEmail, 
      lockedUntil: attemptCheck.lockedUntil 
    }, undefined, request, 'HIGH', 'AUTHENTICATION')
    throw createRateLimitError(
      'Account temporarily locked due to too many failed attempts',
      { lockedUntil: attemptCheck.lockedUntil }
    )
  }

  // Find user by email
  let user
  try {
    user = await db.user.findUnique({
      where: { email: sanitizedEmail }
    })
  } catch (error) {
    throw handleDatabaseError(error)
  }

  if (!user) {
    recordFailedLoginAttempt(sanitizedEmail)
    SecurityAudit.log('LOGIN_FAILED_USER_NOT_FOUND', { email: sanitizedEmail }, undefined, request, 'MEDIUM', 'AUTHENTICATION')
    throw createAuthenticationError('Invalid credentials')
  }

  // Check password
  const isPasswordValid = await verifyPassword(password, user.password)
  if (!isPasswordValid) {
    recordFailedLoginAttempt(sanitizedEmail)
    SecurityAudit.log('LOGIN_FAILED_INVALID_PASSWORD', { 
      email: sanitizedEmail, 
      userId: user.id 
    }, undefined, request, 'MEDIUM', 'AUTHENTICATION')
    throw createAuthenticationError('Invalid credentials')
  }

  // Check if user is active
  if (!user.isActive) {
    SecurityAudit.log('LOGIN_FAILED_INACTIVE_ACCOUNT', { 
      email: sanitizedEmail, 
      userId: user.id 
    }, undefined, request, 'MEDIUM', 'AUTHENTICATION')
    throw createAuthenticationError('Account is deactivated')
  }

  // Reset failed login attempts on successful login
  resetFailedLoginAttempts(sanitizedEmail)

  // Create user session using SessionManager
  const { password: _, ...userWithoutPassword } = user
  const sessionId = await SessionManager.createSession(user.id, userWithoutPassword, request)

  // Create response
  const response = NextResponse.json({
    success: true,
    user: userWithoutPassword,
    sessionId,
    redirectUrl: getRedirectUrl(user.role)
  })

  // Set security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Set user session in cookie
  response.cookies.set('user-session', JSON.stringify(userWithoutPassword), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/'
  })

  // Set session ID in cookie
  response.cookies.set('session-id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/'
  })

  // Generate and set CSRF token
  const csrfTokenValue = CSRFProtection.generateToken()
  response.cookies.set(CSRFProtection.getCookieName(), csrfTokenValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/'
  })

  // Log successful login
  SecurityAudit.log('LOGIN_SUCCESS', { 
    email: sanitizedEmail, 
    userId: user.id,
    role: user.role,
    sessionId
  }, user.id, request, 'LOW', 'AUTHENTICATION')

  return response
})

export { handler as POST }

function getRedirectUrl(role: string): string {
  switch (role) {
    case 'TRADER':
      return '/trader-dashboard'
    case 'INVESTOR':
      return '/investor-dashboard'
    case 'ADMIN':
      return '/admin-dashboard'
    default:
      return '/dashboard'
  }
}