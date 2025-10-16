import { db } from './db'
import { SecurityAudit } from './security'
import { generateSecureToken } from './security'

export interface SessionData {
  id: string
  userId: string
  userData: any
  createdAt: Date
  lastAccessed: Date
  expiresAt: Date
  isActive: boolean
  ipAddress?: string
  userAgent?: string
}

export class DatabaseSessionStorage {
  private static readonly SESSION_PREFIX = 'session:'
  private static readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes
  private static readonly CLEANUP_INTERVAL = 5 * 60 * 1000 // 5 minutes
  
  static {
    // Start cleanup interval
    setInterval(() => this.cleanupExpiredSessions(), this.CLEANUP_INTERVAL)
  }
  
  static async createSession(
    userId: string, 
    userData: any, 
    request?: Request
  ): Promise<string> {
    const sessionId = generateSecureToken()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours
    
    try {
      await db.session.create({
        data: {
          id: sessionId,
          userId,
          userData: JSON.stringify(userData),
          createdAt: now,
          lastAccessed: now,
          expiresAt,
          isActive: true,
          ipAddress: request?.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request?.headers.get('user-agent') || 'unknown'
        }
      })
      
      // Log session creation
      SecurityAudit.log('SESSION_CREATED', { 
        sessionId,
        userId,
        expiresAt: expiresAt.toISOString()
      }, userId, request)
      
      return sessionId
    } catch (error) {
      console.error('Error creating session:', error)
      SecurityAudit.log('SESSION_CREATION_FAILED', { 
        sessionId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, userId, request)
      throw new Error('Failed to create session')
    }
  }
  
  static async validateSession(sessionId: string): Promise<SessionData | null> {
    if (!sessionId) return null
    
    try {
      const session = await db.session.findUnique({
        where: { id: sessionId }
      })
      
      if (!session || !session.isActive) {
        SecurityAudit.log('SESSION_NOT_FOUND', { sessionId })
        return null
      }
      
      const now = new Date()
      
      // Check if session is expired
      if (session.expiresAt < now) {
        await this.invalidateSession(sessionId)
        SecurityAudit.log('SESSION_EXPIRED', { sessionId })
        return null
      }
      
      // Check inactivity timeout
      const inactivityTime = now.getTime() - session.lastAccessed.getTime()
      if (inactivityTime > this.INACTIVITY_TIMEOUT) {
        await this.invalidateSession(sessionId)
        SecurityAudit.log('SESSION_INACTIVITY_TIMEOUT', { sessionId })
        return null
      }
      
      // Update last accessed time
      await db.session.update({
        where: { id: sessionId },
        data: { lastAccessed: now }
      })
      
      return {
        id: session.id,
        userId: session.userId,
        userData: JSON.parse(session.userData),
        createdAt: session.createdAt,
        lastAccessed: now,
        expiresAt: session.expiresAt,
        isActive: session.isActive,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent
      }
    } catch (error) {
      console.error('Error validating session:', error)
      SecurityAudit.log('SESSION_VALIDATION_ERROR', { 
        sessionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      return null
    }
  }
  
  static async updateSessionActivity(sessionId: string): Promise<boolean> {
    try {
      const result = await db.session.updateMany({
        where: { 
          id: sessionId,
          isActive: true
        },
        data: { lastAccessed: new Date() }
      })
      
      return result.count > 0
    } catch (error) {
      console.error('Error updating session activity:', error)
      return false
    }
  }
  
  static async invalidateSession(sessionId: string): Promise<void> {
    try {
      const session = await db.session.findUnique({
        where: { id: sessionId }
      })
      
      if (session) {
        await db.session.update({
          where: { id: sessionId },
          data: { isActive: false }
        })
        
        // Add to blacklist
        await db.sessionBlacklist.create({
          data: {
            sessionId,
            invalidatedAt: new Date(),
            reason: 'manual_invalidation'
          }
        })
        
        // Log session invalidation
        SecurityAudit.log('SESSION_INVALIDATED', { 
          sessionId,
          userId: session.userId 
        }, session.userId)
      }
    } catch (error) {
      console.error('Error invalidating session:', error)
      SecurityAudit.log('SESSION_INVALIDATION_ERROR', { 
        sessionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  static async invalidateAllUserSessions(userId: string): Promise<void> {
    try {
      // Find all active sessions for the user
      const sessions = await db.session.findMany({
        where: { 
          userId,
          isActive: true 
        }
      })
      
      if (sessions.length > 0) {
        const sessionIds = sessions.map(s => s.id)
        
        // Invalidate all sessions
        await db.session.updateMany({
          where: { id: { in: sessionIds } },
          data: { isActive: false }
        })
        
        // Add all sessions to blacklist
        await db.sessionBlacklist.createMany({
          data: sessionIds.map(sessionId => ({
            sessionId,
            invalidatedAt: new Date(),
            reason: 'user_requested_invalidation'
          }))
        })
        
        // Log session invalidation
        SecurityAudit.log('ALL_USER_SESSIONS_INVALIDATED', { 
          userId,
          invalidatedSessions: sessionIds 
        }, userId)
      }
    } catch (error) {
      console.error('Error invalidating user sessions:', error)
      SecurityAudit.log('USER_SESSIONS_INVALIDATION_ERROR', { 
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  static async getSessionInfo(sessionId: string): Promise<SessionData | null> {
    try {
      const session = await db.session.findUnique({
        where: { id: sessionId }
      })
      
      if (!session) return null
      
      const now = new Date()
      
      return {
        id: session.id,
        userId: session.userId,
        userData: JSON.parse(session.userData),
        createdAt: session.createdAt,
        lastAccessed: session.lastAccessed,
        expiresAt: session.expiresAt,
        isActive: session.isActive,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent
      }
    } catch (error) {
      console.error('Error getting session info:', error)
      return null
    }
  }
  
  static async getActiveSessionsCount(): Promise<number> {
    try {
      return await db.session.count({
        where: { isActive: true }
      })
    } catch (error) {
      console.error('Error getting active sessions count:', error)
      return 0
    }
  }
  
  static async getUserActiveSessions(userId: string): Promise<SessionData[]> {
    try {
      const sessions = await db.session.findMany({
        where: { 
          userId,
          isActive: true 
        },
        orderBy: { lastAccessed: 'desc' }
      })
      
      return sessions.map(session => ({
        id: session.id,
        userId: session.userId,
        userData: JSON.parse(session.userData),
        createdAt: session.createdAt,
        lastAccessed: session.lastAccessed,
        expiresAt: session.expiresAt,
        isActive: session.isActive,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent
      }))
    } catch (error) {
      console.error('Error getting user active sessions:', error)
      return []
    }
  }
  
  static async isSessionBlacklisted(sessionId: string): Promise<boolean> {
    try {
      const blacklistEntry = await db.sessionBlacklist.findUnique({
        where: { sessionId }
      })
      
      return !!blacklistEntry
    } catch (error) {
      console.error('Error checking session blacklist:', error)
      return false
    }
  }
  
  static async cleanupExpiredSessions(): Promise<void> {
    try {
      const now = new Date()
      
      // Find expired sessions
      const expiredSessions = await db.session.findMany({
        where: {
          OR: [
            { expiresAt: { lt: now } },
            { isActive: false }
          ]
        }
      })
      
      if (expiredSessions.length > 0) {
        const expiredSessionIds = expiredSessions.map(s => s.id)
        
        // Delete expired sessions older than 7 days
        const cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        
        await db.session.deleteMany({
          where: {
            id: { in: expiredSessionIds },
            expiresAt: { lt: cutoffDate }
          }
        })
        
        // Clean old blacklist entries (older than 24 hours)
        const blacklistCutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        await db.sessionBlacklist.deleteMany({
          where: { invalidatedAt: { lt: blacklistCutoff } }
        })
        
        SecurityAudit.log('SESSION_CLEANUP', { 
          cleanedSessions: expiredSessionIds.length,
          remainingSessions: await this.getActiveSessionsCount()
        })
      }
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error)
      SecurityAudit.log('SESSION_CLEANUP_ERROR', { 
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  static async getSecurityStats(): Promise<{
    totalSessions: number
    activeSessions: number
    blacklistedSessions: number
    expiredSessions: number
  }> {
    try {
      const [total, active, blacklisted] = await Promise.all([
        db.session.count(),
        db.session.count({ where: { isActive: true } }),
        db.sessionBlacklist.count()
      ])
      
      return {
        totalSessions: total,
        activeSessions: active,
        blacklistedSessions: blacklisted,
        expiredSessions: total - active
      }
    } catch (error) {
      console.error('Error getting security stats:', error)
      return {
        totalSessions: 0,
        activeSessions: 0,
        blacklistedSessions: 0,
        expiredSessions: 0
      }
    }
  }
}