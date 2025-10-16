import { NextRequest, NextResponse } from 'next/server'
import { SecurityAudit } from './security'
import { createRateLimitError } from './error-handler'

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum number of requests
  keyGenerator?: (request: NextRequest) => string // Custom key generator
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
  message?: string // Custom error message
}

export interface RateLimitInfo {
  remaining: number
  resetTime: number
  totalRequests: number
  windowMs: number
}

// In-memory store for rate limiting (for production, use Redis)
class RateLimitStore {
  private static store: Map<string, {
    count: number
    resetTime: number
    windowMs: number
  }> = new Map()
  
  static get(key: string, windowMs: number): { count: number; resetTime: number } | null {
    const record = this.store.get(key)
    const now = Date.now()
    
    if (!record || now > record.resetTime) {
      return null
    }
    
    return { count: record.count, resetTime: record.resetTime }
  }
  
  static increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now()
    const resetTime = now + windowMs
    
    const record = this.store.get(key)
    
    if (!record || now > record.resetTime) {
      // Create new record
      const newRecord = { count: 1, resetTime, windowMs }
      this.store.set(key, newRecord)
      return { count: 1, resetTime }
    }
    
    // Increment existing record
    record.count++
    this.store.set(key, record)
    return { count: record.count, resetTime: record.resetTime }
  }
  
  static cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []
    
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        keysToDelete.push(key)
      }
    }
    
    for (const key of keysToDelete) {
      this.store.delete(key)
    }
  }
  
  static getStats(): { totalKeys: number; activeKeys: number } {
    const now = Date.now()
    let activeKeys = 0
    
    for (const record of this.store.values()) {
      if (now <= record.resetTime) {
        activeKeys++
      }
    }
    
    return {
      totalKeys: this.store.size,
      activeKeys
    }
  }
}

// Start cleanup interval
setInterval(() => RateLimitStore.cleanup(), 60 * 1000) // Cleanup every minute

export class RateLimiter {
  private config: RateLimitConfig
  
  constructor(config: RateLimitConfig) {
    this.config = {
      message: 'Too many requests, please try again later.',
      ...config
    }
  }
  
  async check(request: NextRequest): Promise<{
    success: boolean
    limitInfo: RateLimitInfo
    response?: NextResponse
  }> {
    const key = this.getKey(request)
    const now = Date.now()
    
    // Get current record
    const record = RateLimitStore.get(key, this.config.windowMs)
    
    if (!record) {
      // First request in window
      RateLimitStore.increment(key, this.config.windowMs)
      
      return {
        success: true,
        limitInfo: {
          remaining: this.config.maxRequests - 1,
          resetTime: now + this.config.windowMs,
          totalRequests: 1,
          windowMs: this.config.windowMs
        }
      }
    }
    
    // Check if limit exceeded
    if (record.count >= this.config.maxRequests) {
      // Log rate limit exceeded
      SecurityAudit.log('RATE_LIMIT_EXCEEDED', {
        key,
        count: record.count,
        limit: this.config.maxRequests,
        windowMs: this.config.windowMs,
        path: request.nextUrl.pathname,
        method: request.method,
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      })
      
      return {
        success: false,
        limitInfo: {
          remaining: 0,
          resetTime: record.resetTime,
          totalRequests: record.count,
          windowMs: this.config.windowMs
        },
        response: this.createRateLimitResponse(record.resetTime)
      }
    }
    
    // Increment counter
    const newRecord = RateLimitStore.increment(key, this.config.windowMs)
    
    return {
      success: true,
      limitInfo: {
        remaining: this.config.maxRequests - newRecord.count,
        resetTime: newRecord.resetTime,
        totalRequests: newRecord.count,
        windowMs: this.config.windowMs
      }
    }
  }
  
  private getKey(request: NextRequest): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(request)
    }
    
    // Default key generation: IP + path
    const ip = this.getClientIP(request)
    const path = request.nextUrl.pathname
    return `${ip}:${path}`
  }
  
  private getClientIP(request: NextRequest): string {
    return (
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown'
    )
  }
  
  private createRateLimitResponse(resetTime: number): NextResponse {
    const error = createRateLimitError(this.config.message || 'Too many requests')
    
    const response = NextResponse.json({
      success: false,
      error: error.message,
      errorType: error.type,
      statusCode: error.statusCode,
      retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
    }, {
      status: error.statusCode,
      headers: {
        'X-RateLimit-Limit': this.config.maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
        'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString()
      }
    })
    
    return response
  }
}

// Predefined rate limiters for different endpoints
export const rateLimiters = {
  // Auth endpoints - very strict
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts. Please wait 15 minutes and try again.'
  }),
  
  // Login endpoint - extremely strict
  login: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 3, // 3 attempts per 15 minutes
    message: 'Too many login attempts. Account temporarily locked. Please wait 15 minutes.'
  }),
  
  // Register endpoint - strict
  register: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 registrations per hour
    message: 'Too many registration attempts. Please wait 1 hour and try again.'
  }),
  
  // API endpoints - general
  api: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    message: 'API rate limit exceeded. Please wait 1 minute and try again.'
  }),
  
  // Sensitive operations - very strict
  sensitive: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // 10 sensitive operations per hour
    message: 'Too many sensitive operations. Please wait 1 hour and try again.'
  }),
  
  // File upload - strict
  upload: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20, // 20 uploads per hour
    message: 'Too many file uploads. Please wait 1 hour and try again.'
  }),
  
  // WebSocket connections - moderate
  websocket: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 connections per minute
    message: 'Too many WebSocket connections. Please wait 1 minute and try again.'
  })
}

// Rate limiting middleware factory
export function createRateLimitMiddleware(limiter: RateLimiter) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const result = await limiter.check(request)
    
    if (!result.success) {
      return result.response!
    }
    
    // Add rate limit headers to successful responses
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', limiter.config.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', result.limitInfo.remaining.toString())
    response.headers.set('X-RateLimit-Reset', Math.ceil(result.limitInfo.resetTime / 1000).toString())
    
    return null // Continue to next handler
  }
}

// Route-specific rate limiting
export function getRateLimiterForPath(path: string): RateLimiter {
  if (path.startsWith('/api/auth/login')) {
    return rateLimiters.login
  }
  
  if (path.startsWith('/api/auth/register')) {
    return rateLimiters.register
  }
  
  if (path.startsWith('/api/auth')) {
    return rateLimiters.auth
  }
  
  if (path.startsWith('/api/upload')) {
    return rateLimiters.upload
  }
  
  if (path.startsWith('/api/websocket')) {
    return rateLimiters.websocket
  }
  
  if (path.includes('/password') || path.includes('/email') || path.includes('/2fa')) {
    return rateLimiters.sensitive
  }
  
  // Default API rate limiter
  return rateLimiters.api
}

// Global rate limiting middleware
export async function applyRateLimiting(request: NextRequest): Promise<NextResponse | null> {
  // Skip rate limiting for non-API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return null
  }
  
  // Get appropriate rate limiter for this path
  const limiter = getRateLimiterForPath(request.nextUrl.pathname)
  
  // Check rate limit
  const result = await limiter.check(request)
  
  if (!result.success) {
    return result.response!
  }
  
  // Add rate limit headers
  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', limiter.config.maxRequests.toString())
  response.headers.set('X-RateLimit-Remaining', result.limitInfo.remaining.toString())
  response.headers.set('X-RateLimit-Reset', Math.ceil(result.limitInfo.resetTime / 1000).toString())
  
  return null
}

// Utility function to get current rate limit status
export async function getRateLimitStatus(request: NextRequest): Promise<RateLimitInfo | null> {
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return null
  }
  
  const limiter = getRateLimiterForPath(request.nextUrl.pathname)
  const key = limiter['getKey'](request)
  const record = RateLimitStore.get(key, limiter.config.windowMs)
  
  if (!record) {
    return {
      remaining: limiter.config.maxRequests,
      resetTime: Date.now() + limiter.config.windowMs,
      totalRequests: 0,
      windowMs: limiter.config.windowMs
    }
  }
  
  return {
    remaining: Math.max(0, limiter.config.maxRequests - record.count),
    resetTime: record.resetTime,
    totalRequests: record.count,
    windowMs: limiter.config.windowMs
  }
}

// Get rate limiting statistics
export function getRateLimitStats(): { totalKeys: number; activeKeys: number } {
  return RateLimitStore.getStats()
}