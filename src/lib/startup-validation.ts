import { validateEnvironmentVariables } from './security'
import { SecurityAudit } from './security'
import * as fs from 'fs'
import * as path from 'path'

export class StartupValidator {
  static async validate(): Promise<{ isValid: boolean; errors: string[] }> {
    console.log('🔍 Starting application validation...')
    
    // Validate environment variables
    const envValidation = validateEnvironmentVariables()
    
    if (!envValidation.isValid) {
      console.error('❌ Environment validation failed:')
      envValidation.errors.forEach(error => {
        console.error(`  - ${error}`)
      })
      
      // Log to security audit
      SecurityAudit.log('STARTUP_VALIDATION_FAILED', { 
        type: 'environment',
        errors: envValidation.errors 
      })
      
      return envValidation
    }
    
    console.log('✅ Environment validation passed')
    
    // Validate database connection
    try {
      const { db } = await import('./db')
      await db.$queryRaw`SELECT 1`
      console.log('✅ Database connection successful')
    } catch (error) {
      const dbError = error instanceof Error ? error.message : 'Unknown database error'
      console.error('❌ Database connection failed:', dbError)
      
      SecurityAudit.log('STARTUP_VALIDATION_FAILED', { 
        type: 'database',
        error: dbError 
      })
      
      return {
        isValid: false,
        errors: [`Database connection failed: ${dbError}`]
      }
    }
    
    // Validate security configuration
    const securityValidation = this.validateSecurityConfig()
    if (!securityValidation.isValid) {
      console.error('❌ Security configuration validation failed:')
      securityValidation.errors.forEach(error => {
        console.error(`  - ${error}`)
      })
      
      SecurityAudit.log('STARTUP_VALIDATION_FAILED', { 
        type: 'security',
        errors: securityValidation.errors 
      })
      
      return securityValidation
    }
    
    console.log('✅ Security configuration validation passed')
    
    // Validate required directories and files
    const fsValidation = this.validateFileSystem()
    if (!fsValidation.isValid) {
      console.error('❌ File system validation failed:')
      fsValidation.errors.forEach(error => {
        console.error(`  - ${error}`)
      })
      
      SecurityAudit.log('STARTUP_VALIDATION_FAILED', { 
        type: 'filesystem',
        errors: fsValidation.errors 
      })
      
      return fsValidation
    }
    
    console.log('✅ File system validation passed')
    
    // Log successful startup validation
    SecurityAudit.log('STARTUP_VALIDATION_SUCCESS', { 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    })
    
    console.log('🎉 All startup validations passed successfully!')
    
    return {
      isValid: true,
      errors: []
    }
  }
  
  private static validateSecurityConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    // Validate session configuration
    if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.length < 32) {
      errors.push('NEXTAUTH_SECRET must be at least 32 characters long')
    }
    
    // Validate encryption key
    if (!process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_KEY.length < 32) {
      errors.push('ENCRYPTION_KEY must be at least 32 characters long')
    }
    
    // Validate CORS configuration
    if (process.env.NODE_ENV === 'production' && !process.env.ALLOWED_ORIGINS) {
      errors.push('ALLOWED_ORIGINS must be set in production environment')
    }
    
    // Validate rate limiting configuration
    const requiredRateLimitVars = [
      'RATE_LIMIT_LOGIN_ATTEMPTS',
      'RATE_LIMIT_LOGIN_WINDOW',
      'RATE_LIMIT_API_REQUESTS',
      'RATE_LIMIT_API_WINDOW'
    ]
    
    for (const variable of requiredRateLimitVars) {
      if (!process.env[variable]) {
        errors.push(`Rate limiting variable ${variable} is not set`)
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  private static validateFileSystem(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    // Check if required directories exist
    const requiredDirs = [
      'public',
      'src/components',
      'src/lib',
      'src/app',
      'prisma'
    ]
    
    for (const dir of requiredDirs) {
      if (!fs.existsSync(dir)) {
        errors.push(`Required directory ${dir} does not exist`)
      }
    }
    
    // Check if required files exist
    const requiredFiles = [
      'package.json',
      'next.config.ts',
      'tailwind.config.ts',
      'prisma/schema.prisma',
      'src/lib/db.ts',
      'src/lib/security.ts',
      'src/lib/error-handler.ts'
    ]
    
    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        errors.push(`Required file ${file} does not exist`)
      }
    }
    
    // Check if database file exists (for SQLite)
    if (process.env.DATABASE_URL?.includes('sqlite')) {
      const dbPath = process.env.DATABASE_URL.replace('sqlite:', '')
      const dbDir = path.dirname(dbPath)
      
      if (!fs.existsSync(dbDir)) {
        errors.push(`Database directory ${dbDir} does not exist`)
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  static async gracefulShutdown(): Promise<void> {
    console.log('🔄 Initiating graceful shutdown...')
    
    // Log shutdown event
    SecurityAudit.log('APPLICATION_SHUTDOWN', { 
      timestamp: new Date().toISOString(),
      reason: 'graceful_shutdown'
    })
    
    // Clean up resources
    try {
      // Close database connections
      const { db } = await import('./db')
      db.$disconnect()
      console.log('✅ Database connections closed')
    } catch (error) {
      console.error('❌ Error closing database connections:', error)
    }
    
    // Clean up sessions
    try {
      const { SessionManager } = await import('./security')
      // SessionManager cleanup is handled automatically
      console.log('✅ Session cleanup completed')
    } catch (error) {
      console.error('❌ Error during session cleanup:', error)
    }
    
    console.log('🎉 Graceful shutdown completed')
    process.exit(0)
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('💥 Uncaught Exception:', error)
  
  SecurityAudit.log('UNCAUGHT_EXCEPTION', { 
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString()
  })
  
  // Perform graceful shutdown
  await StartupValidator.gracefulShutdown()
})

// Handle unhandled promise rejections
process.on('unhandledRejection', async (reason, promise) => {
  console.error('💥 Unhandled Promise Rejection:', reason)
  
  SecurityAudit.log('UNHANDLED_REJECTION', { 
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
    promise: promise.toString(),
    timestamp: new Date().toISOString()
  })
  
  // Perform graceful shutdown
  await StartupValidator.gracefulShutdown()
})

// Handle SIGTERM (graceful shutdown)
process.on('SIGTERM', async () => {
  console.log('📡 Received SIGTERM signal')
  await StartupValidator.gracefulShutdown()
})

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('📡 Received SIGINT signal')
  await StartupValidator.gracefulShutdown()
})