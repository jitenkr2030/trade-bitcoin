import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiInfo = {
      message: 'Welcome to the Trading Platform API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/api/health',
        health_detailed: '/api/health/detailed',
        auth: {
          session: '/api/auth/session',
          login: '/api/auth/login',
          logout: '/api/auth/logout',
          register: '/api/auth/register',
          csrf: '/api/auth/csrf'
        },
        trading: '/api/trading',
        portfolio: {
          tax: '/api/portfolio/tax'
        },
        exchanges: '/api/exchanges',
        bots: '/api/bots',
        reports: '/api/reports',
        notifications: '/api/notifications',
        billing: {
          checkout: '/api/billing/checkout',
          portal: '/api/billing/portal',
          subscription: '/api/billing/subscription',
          invoices: '/api/billing/invoices',
          webhook: '/api/billing/webhook'
        },
        security: {
          export: '/api/security/export',
          logs: '/api/security/logs',
          stats: '/api/security/stats'
        },
        sentiment_analysis: '/api/sentiment-analysis',
        sentiment_analysis_batch: '/api/sentiment-analysis/batch',
        blog: {
          posts: '/api/blog/posts',
          categories: '/api/blog/categories',
          post_comments: '/api/blog/posts/[slug]/comments',
          post_like: '/api/blog/posts/[slug]/like'
        },
        webhooks: '/api/webhooks',
        webhook_by_id: '/api/webhooks/[id]',
        maintenance: '/api/maintenance',
        backup: '/api/backup',
        rate_limit: '/api/rate-limit/status',
        exports: '/api/exports',
        users: {
          profile_avatar: '/api/users/profile/avatar'
        }
      },
      documentation: {
        swagger: '/api-docs',
        postman: 'https://documenter.getpostman.com/view/your-collection'
      }
    }

    return NextResponse.json(apiInfo, { status: 200 })
  } catch (error) {
    console.error('API Root Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}