import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import crypto from 'crypto'

// Password complexity schema
export const passwordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
})

// Email validation schema
export const emailSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(254, 'Email must be less than 254 characters')
})

// Rate limiters
const loginRateLimiter = new RateLimiterMemory({
  points: 5, // Number of requests
  duration: 900, // Per 15 minutes (900 seconds)
})

const registerRateLimiter = new RateLimiterMemory({
  points: 3, // Number of requests
  duration: 3600, // Per 1 hour (3600 seconds)
})

const apiRateLimiter = new RateLimiterMemory({
  points: 100, // Number of requests
  duration: 60, // Per 1 minute (60 seconds)
})

// Failed login attempt tracking
const failedLoginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil?: number }>()

// Account lockout configuration
const LOCKOUT_THRESHOLD = 5 // Number of failed attempts
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds

// Session configuration
export const SESSION_CONFIG = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  httpOnly: true,
} as const

// Security headers
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' wss: https:; frame-ancestors 'none';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
} as const

// CORS configuration
export const corsConfig = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400, // 24 hours
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent XSS
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Password verification
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

// Check rate limit
export async function checkRateLimit(key: string, type: 'login' | 'register' | 'api'): Promise<boolean> {
  try {
    const limiter = type === 'login' ? loginRateLimiter :
                   type === 'register' ? registerRateLimiter :
                   apiRateLimiter
    
    await limiter.consume(key)
    return true
  } catch (rejRes) {
    return false
  }
}

// Check and update failed login attempts
export function checkFailedLoginAttempts(email: string): { canAttempt: boolean; remainingAttempts: number; lockedUntil?: number } {
  const now = Date.now()
  const attempts = failedLoginAttempts.get(email)
  
  if (!attempts) {
    return { canAttempt: true, remainingAttempts: LOCKOUT_THRESHOLD }
  }
  
  // Check if account is locked
  if (attempts.lockedUntil && attempts.lockedUntil > now) {
    return { 
      canAttempt: false, 
      remainingAttempts: 0, 
      lockedUntil: attempts.lockedUntil 
    }
  }
  
  // Reset if lockout period has passed
  if (attempts.lockedUntil && attempts.lockedUntil <= now) {
    failedLoginAttempts.delete(email)
    return { canAttempt: true, remainingAttempts: LOCKOUT_THRESHOLD }
  }
  
  const remainingAttempts = LOCKOUT_THRESHOLD - attempts.count
  return { canAttempt: remainingAttempts > 0, remainingAttempts }
}

// Record failed login attempt
export function recordFailedLoginAttempt(email: string): void {
  const now = Date.now()
  const attempts = failedLoginAttempts.get(email) || { count: 0, lastAttempt: now }
  
  attempts.count++
  attempts.lastAttempt = now
  
  // Lock account if threshold reached
  if (attempts.count >= LOCKOUT_THRESHOLD) {
    attempts.lockedUntil = now + LOCKOUT_DURATION
  }
  
  failedLoginAttempts.set(email, attempts)
  
  // Clean up old entries periodically
  if (failedLoginAttempts.size > 1000) {
    cleanupFailedLoginAttempts()
  }
}

// Reset failed login attempts on successful login
export function resetFailedLoginAttempts(email: string): void {
  failedLoginAttempts.delete(email)
}

// Clean up old failed login attempts
function cleanupFailedLoginAttempts(): void {
  const now = Date.now()
  const cutoff = now - (24 * 60 * 60 * 1000) // 24 hours ago
  
  for (const [email, attempts] of failedLoginAttempts.entries()) {
    if (attempts.lastAttempt < cutoff) {
      failedLoginAttempts.delete(email)
    }
  }
}

// Validate environment variables
export function validateEnvironmentVariables(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'ENCRYPTION_KEY'
  ]
  
  for (const variable of required) {
    if (!process.env[variable]) {
      errors.push(`Missing required environment variable: ${variable}`)
    }
  }
  
  // Validate database URL format
  if (process.env.DATABASE_URL) {
    if (!process.env.DATABASE_URL.startsWith('postgresql://') && 
        !process.env.DATABASE_URL.startsWith('sqlite:') &&
        !process.env.DATABASE_URL.startsWith('file:')) {
      errors.push('DATABASE_URL must use PostgreSQL or SQLite')
    }
  }
  
  // Validate secret strength
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    errors.push('NEXTAUTH_SECRET must be at least 32 characters long')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// CSRF token generation and validation
export class CSRFProtection {
  private static readonly CSRF_TOKEN_LENGTH = 32
  private static readonly CSRF_COOKIE_NAME = 'csrf-token'
  private static readonly CSRF_HEADER_NAME = 'X-CSRF-Token'
  
  static generateToken(): string {
    return crypto.randomBytes(this.CSRF_TOKEN_LENGTH).toString('hex')
  }
  
  static validateToken(token: string, storedToken: string): boolean {
    return crypto.timingSafeEqual(
      Buffer.from(token, 'hex'),
      Buffer.from(storedToken, 'hex')
    )
  }
  
  static getCookieName(): string {
    return this.CSRF_COOKIE_NAME
  }
  
  static getHeaderName(): string {
    return this.CSRF_HEADER_NAME
  }
}

// Data encryption for sensitive information
export class DataEncryption {
  private static readonly ALGORITHM = 'aes-256-gcm'
  private static readonly IV_LENGTH = 16
  private static readonly TAG_LENGTH = 16
  
  static encrypt(data: string, key: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(this.IV_LENGTH)
    const cipher = crypto.createCipher(this.ALGORITHM, key)
    
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const tag = cipher.getAuthTag()
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    }
  }
  
  static decrypt(encrypted: string, key: string, iv: string, tag: string): string {
    const decipher = crypto.createDecipher(this.ALGORITHM, key)
    decipher.setAuthTag(Buffer.from(tag, 'hex'))
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }
}

// Security audit logging
export class SecurityAudit {
  private static logs: Array<{
    id: string
    timestamp: Date
    action: string
    userId?: string
    ipAddress: string
    userAgent: string
    details: any
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    category: 'AUTHENTICATION' | 'AUTHORIZATION' | 'SESSION' | 'RATE_LIMIT' | 'VALIDATION' | 'ERROR' | 'SECURITY' | 'SYSTEM'
  }> = []
  
  private static readonly MAX_LOGS = 5000 // Increased log retention
  private static readonly LOG_FILE = process.env.SECURITY_LOG_FILE || 'security-audit.log'
  
  static log(
    action: string, 
    details: any, 
    userId?: string, 
    request?: Request,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM',
    category: 'AUTHENTICATION' | 'AUTHORIZATION' | 'SESSION' | 'RATE_LIMIT' | 'VALIDATION' | 'ERROR' | 'SECURITY' | 'SYSTEM' = 'SECURITY'
  ) {
    const logId = crypto.randomUUID()
    const log = {
      id: logId,
      timestamp: new Date(),
      action,
      userId,
      ipAddress: request?.headers.get('x-forwarded-for') || 
                request?.headers.get('x-real-ip') || 
                request?.headers.get('cf-connecting-ip') || 'unknown',
      userAgent: request?.headers.get('user-agent') || 'unknown',
      details,
      severity,
      category
    }
    
    this.logs.push(log)
    
    // Keep only recent logs
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS)
    }
    
    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      const logLevel = severity === 'CRITICAL' ? 'error' : 
                      severity === 'HIGH' ? 'warn' : 
                      severity === 'MEDIUM' ? 'info' : 'debug'
      
      console[logLevel](`[${category}] ${action}:`, {
        id: logId,
        userId,
        severity,
        details,
        ip: log.ipAddress
      })
    }
    
    // Log to file in production
    if (process.env.NODE_ENV === 'production') {
      this.writeToLogFile(log)
    }
    
    // Send to external monitoring service if configured
    if (process.env.MONITORING_SERVICE_URL) {
      this.sendToMonitoringService(log)
    }
    
    // Send critical security events to admin email if configured
    if (severity === 'CRITICAL' && process.env.ADMIN_EMAIL) {
      this.sendSecurityAlert(log)
    }
  }
  
  static getLogs(
    filters?: {
      userId?: string
      category?: string
      severity?: string
      action?: string
      startDate?: Date
      endDate?: Date
      limit?: number
    }
  ) {
    let filteredLogs = [...this.logs]
    
    if (filters) {
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId)
      }
      
      if (filters.category) {
        filteredLogs = filteredLogs.filter(log => log.category === filters.category)
      }
      
      if (filters.severity) {
        filteredLogs = filteredLogs.filter(log => log.severity === filters.severity)
      }
      
      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action.includes(filters.action!))
      }
      
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!)
      }
      
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!)
      }
      
      if (filters.limit) {
        filteredLogs = filteredLogs.slice(-filters.limit)
      }
    }
    
    // Return in reverse chronological order
    return filteredLogs.reverse()
  }
  
  static getSecurityStats(timeRange: number = 24 * 60 * 60 * 1000) { // Default 24 hours
    const cutoff = new Date(Date.now() - timeRange)
    const recentLogs = this.logs.filter(log => log.timestamp >= cutoff)
    
    const stats = {
      totalEvents: recentLogs.length,
      byCategory: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      byAction: {} as Record<string, number>,
      uniqueUsers: new Set(recentLogs.filter(log => log.userId).map(log => log.userId)).size,
      uniqueIPs: new Set(recentLogs.map(log => log.ipAddress)).size,
      criticalEvents: recentLogs.filter(log => log.severity === 'CRITICAL').length,
      failedLogins: recentLogs.filter(log => log.action.includes('LOGIN_FAILED')).length,
      successfulLogins: recentLogs.filter(log => log.action.includes('LOGIN_SUCCESS')).length,
      sessionCreations: recentLogs.filter(log => log.action.includes('SESSION_CREATED')).length,
      sessionInvalidations: recentLogs.filter(log => log.action.includes('SESSION_INVALIDATED')).length,
      rateLimitExceeded: recentLogs.filter(log => log.action.includes('RATE_LIMIT_EXCEEDED')).length,
      validationErrors: recentLogs.filter(log => log.category === 'VALIDATION').length,
      timeRange
    }
    
    // Count by category
    for (const log of recentLogs) {
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1
      stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1
    }
    
    return stats
  }
  
  static getRecentAlerts(limit: number = 10) {
    return this.logs
      .filter(log => log.severity === 'CRITICAL' || log.severity === 'HIGH')
      .slice(-limit)
      .reverse()
  }
  
  static getUserActivity(userId: string, timeRange: number = 24 * 60 * 60 * 1000) {
    const cutoff = new Date(Date.now() - timeRange)
    return this.logs
      .filter(log => log.userId === userId && log.timestamp >= cutoff)
      .reverse()
  }
  
  static getIPActivity(ipAddress: string, timeRange: number = 24 * 60 * 60 * 1000) {
    const cutoff = new Date(Date.now() - timeRange)
    return this.logs
      .filter(log => log.ipAddress === ipAddress && log.timestamp >= cutoff)
      .reverse()
  }
  
  static detectAnomalies(timeRange: number = 60 * 60 * 1000) { // 1 hour
    const cutoff = new Date(Date.now() - timeRange)
    const recentLogs = this.logs.filter(log => log.timestamp >= cutoff)
    
    const anomalies: Array<{
      type: string
      severity: 'HIGH' | 'CRITICAL'
      description: string
      details: any
    }> = []
    
    // Detect brute force attacks
    const failedLoginByIP = new Map<string, number>()
    const failedLoginByUser = new Map<string, number>()
    
    for (const log of recentLogs) {
      if (log.action.includes('LOGIN_FAILED')) {
        failedLoginByIP.set(log.ipAddress, (failedLoginByIP.get(log.ipAddress) || 0) + 1)
        if (log.userId) {
          failedLoginByUser.set(log.userId, (failedLoginByUser.get(log.userId) || 0) + 1)
        }
      }
    }
    
    // Check for IP-based brute force
    for (const [ip, count] of failedLoginByIP.entries()) {
      if (count > 10) { // More than 10 failed logins per hour
        anomalies.push({
          type: 'BRUTE_FORCE_IP',
          severity: 'HIGH',
          description: `Potential brute force attack from IP ${ip}`,
          details: { ip, failedAttempts: count, timeRange }
        })
      }
    }
    
    // Check for user-based brute force
    for (const [userId, count] of failedLoginByUser.entries()) {
      if (count > 5) { // More than 5 failed logins per hour per user
        anomalies.push({
          type: 'BRUTE_FORCE_USER',
          severity: 'HIGH',
          description: `Potential brute force attack on user ${userId}`,
          details: { userId, failedAttempts: count, timeRange }
        })
      }
    }
    
    // Detect rate limit exceeded patterns
    const rateLimitByIP = new Map<string, number>()
    for (const log of recentLogs) {
      if (log.action.includes('RATE_LIMIT_EXCEEDED')) {
        rateLimitByIP.set(log.ipAddress, (rateLimitByIP.get(log.ipAddress) || 0) + 1)
      }
    }
    
    for (const [ip, count] of rateLimitByIP.entries()) {
      if (count > 5) { // More than 5 rate limit violations per hour
        anomalies.push({
          type: 'RATE_LIMIT_ABUSE',
          severity: 'HIGH',
          description: `Excessive rate limit violations from IP ${ip}`,
          details: { ip, violations: count, timeRange }
        })
      }
    }
    
    // Detect session anomalies
    const sessionCreationsByIP = new Map<string, number>()
    for (const log of recentLogs) {
      if (log.action.includes('SESSION_CREATED')) {
        sessionCreationsByIP.set(log.ipAddress, (sessionCreationsByIP.get(log.ipAddress) || 0) + 1)
      }
    }
    
    for (const [ip, count] of sessionCreationsByIP.entries()) {
      if (count > 20) { // More than 20 session creations per hour
        anomalies.push({
          type: 'SESSION_ABUSE',
          severity: 'HIGH',
          description: `Excessive session creation from IP ${ip}`,
          details: { ip, sessionCreations: count, timeRange }
        })
      }
    }
    
    return anomalies
  }
  
  private static async writeToLogFile(log: any) {
    try {
      const fs = await import('fs')
      const path = await import('path')
      
      const logLine = JSON.stringify({
        timestamp: log.timestamp.toISOString(),
        id: log.id,
        action: log.action,
        userId: log.userId,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        details: log.details,
        severity: log.severity,
        category: log.category
      }) + '\n'
      
      fs.appendFileSync(this.LOG_FILE, logLine)
      
      // Rotate log file if it gets too large
      try {
        const stats = fs.statSync(this.LOG_FILE)
        if (stats.size > 10 * 1024 * 1024) { // 10MB
          const backupPath = `${this.LOG_FILE}.${Date.now()}.backup`
          fs.renameSync(this.LOG_FILE, backupPath)
        }
      } catch (error) {
        console.error('Error rotating log file:', error)
      }
    } catch (error) {
      console.error('Error writing to log file:', error)
    }
  }
  
  private static async sendToMonitoringService(log: any) {
    try {
      const response = await fetch(process.env.MONITORING_SERVICE_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MONITORING_SERVICE_TOKEN}`
        },
        body: JSON.stringify({
          timestamp: log.timestamp.toISOString(),
          level: log.severity.toLowerCase(),
          message: log.action,
          userId: log.userId,
          ipAddress: log.ipAddress,
          userAgent: log.userAgent,
          details: log.details,
          category: log.category
        })
      })
      
      if (!response.ok) {
        console.error('Failed to send log to monitoring service:', await response.text())
      }
    } catch (error) {
      console.error('Error sending log to monitoring service:', error)
    }
  }
  
  private static async sendSecurityAlert(log: any) {
    try {
      // This would integrate with your email service
      // For now, we'll just log it
      console.error('SECURITY ALERT:', {
        type: 'CRITICAL_SECURITY_EVENT',
        action: log.action,
        userId: log.userId,
        ipAddress: log.ipAddress,
        details: log.details,
        timestamp: log.timestamp.toISOString()
      })
      
      // In a real implementation, you would send an email
      // await sendEmail({
      //   to: process.env.ADMIN_EMAIL,
      //   subject: `Critical Security Alert: ${log.action}`,
      //   body: JSON.stringify(log, null, 2)
      // })
    } catch (error) {
      console.error('Error sending security alert:', error)
    }
  }
  
  static exportLogs(format: 'json' | 'csv' = 'json', filters?: any) {
    const logs = this.getLogs(filters)
    
    if (format === 'json') {
      return JSON.stringify(logs, null, 2)
    }
    
    if (format === 'csv') {
      const headers = [
        'timestamp',
        'action',
        'userId',
        'ipAddress',
        'userAgent',
        'severity',
        'category',
        'details'
      ]
      
      const rows = logs.map(log => [
        log.timestamp.toISOString(),
        log.action,
        log.userId || '',
        log.ipAddress,
        log.userAgent.replace(/,/g, ';'), // Escape commas
        log.severity,
        log.category,
        JSON.stringify(log.details).replace(/,/g, ';') // Escape commas
      ])
      
      return [headers, ...rows].map(row => row.join(',')).join('\n')
    }
    
    throw new Error('Unsupported export format')
  }
  
  static clearOldLogs(olderThanDays: number = 30) {
    const cutoff = new Date(Date.now() - (olderThanDays * 24 * 60 * 60 * 1000))
    const originalLength = this.logs.length
    
    this.logs = this.logs.filter(log => log.timestamp >= cutoff)
    
    const clearedCount = originalLength - this.logs.length
    if (clearedCount > 0) {
      console.log(`Cleared ${clearedCount} old security logs (older than ${olderThanDays} days)`)
    }
    
    return clearedCount
  }
}

// Session management
export class SessionManager {
  private static readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes inactivity
  
  static async createSession(userId: string, userData: any, request?: Request): Promise<string> {
    const { DatabaseSessionStorage } = await import('./session-storage')
    return await DatabaseSessionStorage.createSession(userId, userData, request)
  }
  
  static async validateSession(sessionId: string): Promise<any | null> {
    const { DatabaseSessionStorage } = await import('./session-storage')
    return await DatabaseSessionStorage.validateSession(sessionId)
  }
  
  static async updateSessionActivity(sessionId: string): Promise<boolean> {
    const { DatabaseSessionStorage } = await import('./session-storage')
    return await DatabaseSessionStorage.updateSessionActivity(sessionId)
  }
  
  static async invalidateSession(sessionId: string): Promise<void> {
    const { DatabaseSessionStorage } = await import('./session-storage')
    await DatabaseSessionStorage.invalidateSession(sessionId)
  }
  
  static async invalidateAllUserSessions(userId: string): Promise<void> {
    const { DatabaseSessionStorage } = await import('./session-storage')
    await DatabaseSessionStorage.invalidateAllUserSessions(userId)
  }
  
  static async getSessionInfo(sessionId: string): Promise<any | null> {
    const { DatabaseSessionStorage } = await import('./session-storage')
    return await DatabaseSessionStorage.getSessionInfo(sessionId)
  }
  
  static async getActiveSessionsCount(): Promise<number> {
    const { DatabaseSessionStorage } = await import('./session-storage')
    return await DatabaseSessionStorage.getActiveSessionsCount()
  }
  
  static async getUserActiveSessions(userId: string): Promise<any[]> {
    const { DatabaseSessionStorage } = await import('./session-storage')
    return await DatabaseSessionStorage.getUserActiveSessions(userId)
  }
  
  static async getSecurityStats(): Promise<{
    totalSessions: number
    activeSessions: number
    blacklistedSessions: number
    expiredSessions: number
  }> {
    const { DatabaseSessionStorage } = await import('./session-storage')
    return await DatabaseSessionStorage.getSecurityStats()
  }
}