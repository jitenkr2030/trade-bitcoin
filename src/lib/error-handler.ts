import { NextRequest, NextResponse } from 'next/server'
import { SecurityAudit } from './security'

// Error types
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  SECURITY_ERROR = 'SECURITY_ERROR'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Error interface
export interface AppError {
  type: ErrorType
  message: string
  statusCode: number
  severity: ErrorSeverity
  details?: any
  shouldLog: boolean
  userFriendly: boolean
}

// Error configurations
const ERROR_CONFIGS: Record<ErrorType, Omit<AppError, 'message' | 'details'>> = {
  [ErrorType.VALIDATION_ERROR]: {
    type: ErrorType.VALIDATION_ERROR,
    statusCode: 400,
    severity: ErrorSeverity.LOW,
    shouldLog: true,
    userFriendly: true
  },
  [ErrorType.AUTHENTICATION_ERROR]: {
    type: ErrorType.AUTHENTICATION_ERROR,
    statusCode: 401,
    severity: ErrorSeverity.MEDIUM,
    shouldLog: true,
    userFriendly: true
  },
  [ErrorType.AUTHORIZATION_ERROR]: {
    type: ErrorType.AUTHORIZATION_ERROR,
    statusCode: 403,
    severity: ErrorSeverity.MEDIUM,
    shouldLog: true,
    userFriendly: true
  },
  [ErrorType.NOT_FOUND]: {
    type: ErrorType.NOT_FOUND,
    statusCode: 404,
    severity: ErrorSeverity.LOW,
    shouldLog: false,
    userFriendly: true
  },
  [ErrorType.RATE_LIMIT_ERROR]: {
    type: ErrorType.RATE_LIMIT_ERROR,
    statusCode: 429,
    severity: ErrorSeverity.MEDIUM,
    shouldLog: true,
    userFriendly: true
  },
  [ErrorType.INTERNAL_ERROR]: {
    type: ErrorType.INTERNAL_ERROR,
    statusCode: 500,
    severity: ErrorSeverity.HIGH,
    shouldLog: true,
    userFriendly: false
  },
  [ErrorType.DATABASE_ERROR]: {
    type: ErrorType.DATABASE_ERROR,
    statusCode: 500,
    severity: ErrorSeverity.HIGH,
    shouldLog: true,
    userFriendly: false
  },
  [ErrorType.EXTERNAL_SERVICE_ERROR]: {
    type: ErrorType.EXTERNAL_SERVICE_ERROR,
    statusCode: 502,
    severity: ErrorSeverity.MEDIUM,
    shouldLog: true,
    userFriendly: false
  },
  [ErrorType.SECURITY_ERROR]: {
    type: ErrorType.SECURITY_ERROR,
    statusCode: 500,
    severity: ErrorSeverity.CRITICAL,
    shouldLog: true,
    userFriendly: false
  }
}

// User-friendly error messages
const USER_FRIENDLY_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.VALIDATION_ERROR]: 'Invalid input data. Please check your information and try again.',
  [ErrorType.AUTHENTICATION_ERROR]: 'Authentication failed. Please check your credentials.',
  [ErrorType.AUTHORIZATION_ERROR]: 'You do not have permission to perform this action.',
  [ErrorType.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorType.RATE_LIMIT_ERROR]: 'Too many requests. Please wait and try again later.',
  [ErrorType.INTERNAL_ERROR]: 'An internal server error occurred. Please try again later.',
  [ErrorType.DATABASE_ERROR]: 'A database error occurred. Please try again later.',
  [ErrorType.EXTERNAL_SERVICE_ERROR]: 'A service error occurred. Please try again later.',
  [ErrorType.SECURITY_ERROR]: 'A security error occurred. Please contact support.'
}

// Create error function
export function createError(
  type: ErrorType,
  message: string,
  details?: any,
  overrideSeverity?: ErrorSeverity
): AppError {
  const config = ERROR_CONFIGS[type]
  return {
    ...config,
    message,
    severity: overrideSeverity || config.severity,
    details
  }
}

// Create validation error
export function createValidationError(message: string, details?: any): AppError {
  return createError(ErrorType.VALIDATION_ERROR, message, details)
}

// Create authentication error
export function createAuthenticationError(message: string, details?: any): AppError {
  return createError(ErrorType.AUTHENTICATION_ERROR, message, details)
}

// Create authorization error
export function createAuthorizationError(message: string, details?: any): AppError {
  return createError(ErrorType.AUTHORIZATION_ERROR, message, details)
}

// Create not found error
export function createNotFoundError(message: string, details?: any): AppError {
  return createError(ErrorType.NOT_FOUND, message, details)
}

// Create rate limit error
export function createRateLimitError(message: string, details?: any): AppError {
  return createError(ErrorType.RATE_LIMIT_ERROR, message, details)
}

// Create internal error
export function createInternalError(message: string, details?: any): AppError {
  return createError(ErrorType.INTERNAL_ERROR, message, details)
}

// Create database error
export function createDatabaseError(message: string, details?: any): AppError {
  return createError(ErrorType.DATABASE_ERROR, message, details)
}

// Create external service error
export function createExternalServiceError(message: string, details?: any): AppError {
  return createError(ErrorType.EXTERNAL_SERVICE_ERROR, message, details)
}

// Create security error
export function createSecurityError(message: string, details?: any): AppError {
  return createError(ErrorType.SECURITY_ERROR, message, details, ErrorSeverity.CRITICAL)
}

// Handle error and return response
export function handleError(error: AppError | Error, request?: NextRequest): NextResponse {
  let appError: AppError

  if (isAppError(error)) {
    appError = error
  } else {
    // Convert unknown error to AppError
    appError = createInternalError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      error instanceof Error ? { stack: error.stack } : undefined
    )
  }

  // Log error if needed
  if (appError.shouldLog) {
    logError(appError, request)
  }

  // Create response
  const response = NextResponse.json({
    success: false,
    error: appError.userFriendly ? USER_FRIENDLY_MESSAGES[appError.type] : 'An error occurred',
    errorType: appError.type,
    statusCode: appError.statusCode,
    // Only include details in development environment or for user-friendly errors
    ...(appError.userFriendly && process.env.NODE_ENV === 'development' && appError.details
      ? { details: appError.details }
      : {})
  }, {
    status: appError.statusCode
  })

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  return response
}

// Check if error is AppError
function isAppError(error: any): error is AppError {
  return error && typeof error === 'object' && 'type' in error && 'message' in error
}

// Log error to security audit
function logError(error: AppError, request?: NextRequest): void {
  const logData = {
    errorType: error.type,
    message: error.message,
    severity: error.severity,
    statusCode: error.statusCode,
    details: error.details,
    timestamp: new Date().toISOString(),
    userAgent: request?.headers.get('user-agent'),
    ip: request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || 'unknown'
  }

  SecurityAudit.log('ERROR_OCCURRED', logData, undefined, request)

  // For critical errors, also log to console for immediate visibility
  if (error.severity === ErrorSeverity.CRITICAL || error.severity === ErrorSeverity.HIGH) {
    console.error('CRITICAL ERROR:', logData)
  }
}

// Async error wrapper for API routes
export function withErrorHandling(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    try {
      return await handler(request, ...args)
    } catch (error) {
      return handleError(error as Error, request)
    }
  }
}

// Database error handler
export function handleDatabaseError(error: any): AppError {
  // Prisma specific error handling
  if (error?.code === 'P2002') {
    return createValidationError('Unique constraint violation', {
      field: error.meta?.target,
      code: error.code
    })
  }

  if (error?.code === 'P2025') {
    return createNotFoundError('Record not found', {
      code: error.code
    })
  }

  if (error?.code === 'P2003') {
    return createValidationError('Foreign key constraint violation', {
      field: error.meta?.field_name,
      code: error.code
    })
  }

  // Generic database error
  return createDatabaseError(
    'Database operation failed',
    {
      code: error?.code,
      message: error?.message
    }
  )
}

// Validation error handler for Zod errors
export function handleZodError(error: any): AppError {
  if (!error?.errors) {
    return createValidationError('Validation failed')
  }

  const details = error.errors.map((err: any) => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }))

  return createValidationError('Validation failed', { details })
}

// Security error handler
export function handleSecurityError(error: any, request?: NextRequest): AppError {
  // Log security errors immediately
  SecurityAudit.log('SECURITY_ERROR_DETECTED', {
    error: error instanceof Error ? error.message : 'Unknown security error',
    stack: error instanceof Error ? error.stack : undefined,
    userAgent: request?.headers.get('user-agent'),
    ip: request?.headers.get('x-forwarded-for') || 'unknown'
  }, undefined, request)

  return createSecurityError(
    'Security violation detected',
    {
      originalError: error instanceof Error ? error.message : 'Unknown error'
    }
  )
}