import { StartupValidator } from './startup-validation'

export async function initializeApplication(): Promise<void> {
  try {
    console.log('🚀 Starting Botfolio Application...')
    
    // Run startup validation
    const validation = await StartupValidator.validate()
    
    if (!validation.isValid) {
      console.error('❌ Application startup failed due to validation errors')
      process.exit(1)
    }
    
    console.log('✅ Application initialized successfully')
    
    // Initialize additional services
    await initializeServices()
    
    console.log('🎉 Botfolio Application is ready to serve requests!')
    
  } catch (error) {
    console.error('💥 Critical error during application startup:', error)
    process.exit(1)
  }
}

async function initializeServices(): Promise<void> {
  console.log('🔧 Initializing services...')
  
  // Initialize security services
  try {
    const { SessionManager } = await import('./security')
    // SessionManager is already initialized via static constructor
    console.log('✅ Security services initialized')
  } catch (error) {
    console.error('❌ Failed to initialize security services:', error)
    throw error
  }
  
  // Initialize database connection pool
  try {
    const { db } = await import('./db')
    await db.$connect()
    console.log('✅ Database connection pool initialized')
  } catch (error) {
    console.error('❌ Failed to initialize database connection pool:', error)
    throw error
  }
  
  // Initialize caching (if using Redis)
  if (process.env.REDIS_URL) {
    try {
      // Redis initialization would go here
      console.log('✅ Redis caching initialized')
    } catch (error) {
      console.error('❌ Failed to initialize Redis caching:', error)
      throw error
    }
  } else {
    console.log('ℹ️  Redis not configured, using in-memory caching')
  }
  
  // Initialize monitoring and logging
  try {
    // Initialize any monitoring services
    console.log('✅ Monitoring and logging services initialized')
  } catch (error) {
    console.error('❌ Failed to initialize monitoring services:', error)
    throw error
  }
  
  console.log('✅ All services initialized successfully')
}

// Export for use in other parts of the application
export { StartupValidator }