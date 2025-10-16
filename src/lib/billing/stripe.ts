import Stripe from 'stripe'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Initialize Stripe with your secret key
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-09-30.clover',
    })
  : null

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  stripePriceId: string
  metadata?: Record<string, string>
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for beginners',
    price: 29,
    currency: 'usd',
    interval: 'month',
    features: [
      'Real-time market data',
      'Basic trading interface',
      'Portfolio tracking',
      'Email support',
      '1 trading bot'
    ],
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID!,
    metadata: {
      maxBots: '1',
      maxExchanges: '2',
      apiAccess: 'false'
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For serious traders',
    price: 99,
    currency: 'usd',
    interval: 'month',
    features: [
      'Everything in Starter',
      'Advanced analytics',
      '5 trading bots',
      'API access',
      'Priority support',
      'Custom indicators'
    ],
    stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID!,
    metadata: {
      maxBots: '5',
      maxExchanges: '5',
      apiAccess: 'true'
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For institutions',
    price: 299,
    currency: 'usd',
    interval: 'month',
    features: [
      'Everything in Professional',
      'Unlimited trading bots',
      'White-label solution',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee'
    ],
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    metadata: {
      maxBots: 'unlimited',
      maxExchanges: 'unlimited',
      apiAccess: 'true'
    }
  }
]

export class BillingService {
  async createCheckoutSession(
    userId: string,
    planId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ sessionId: string; url: string }> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.')
    }

    const plan = subscriptionPlans.find(p => p.id === planId)
    if (!plan) {
      throw new Error('Invalid plan ID')
    }

    // Check if user already has an active subscription
    const existingSubscription = await db.subscription.findFirst({
      where: {
        userId,
        status: {
          in: ['active', 'trialing']
        }
      }
    })

    if (existingSubscription) {
      throw new Error('User already has an active subscription')
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: (await db.user.findUnique({ where: { id: userId } }))?.email,
      metadata: {
        userId,
        planId,
      },
      subscription_data: {
        metadata: {
          userId,
          planId,
        },
      },
    })

    return {
      sessionId: session.id,
      url: session.url!,
    }
  }

  async createPortalSession(
    userId: string,
    returnUrl: string
  ): Promise<{ url: string }> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.')
    }

    // Get user's Stripe customer ID
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    })

    if (!user?.stripeCustomerId) {
      throw new Error('User does not have a Stripe customer ID')
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl,
    })

    return { url: session.url }
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.')
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const userId = session.metadata?.userId
    const planId = session.metadata?.planId

    if (!userId || !planId) {
      console.error('Missing metadata in checkout session')
      return
    }

    // Update user with Stripe customer ID
    await db.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId: session.customer as string,
      }
    })
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata?.userId
    const planId = subscription.metadata?.planId

    if (!userId || !planId) {
      console.error('Missing metadata in subscription')
      return
    }

    const plan = subscriptionPlans.find(p => p.id === planId)
    if (!plan) {
      console.error('Invalid plan ID in subscription metadata')
      return
    }

    // Create or update subscription in database
    await db.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        planId,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        metadata: plan.metadata,
      },
      update: {
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        metadata: plan.metadata,
      }
    })

    console.log(`Subscription created for user ${userId}: ${planId}`)
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata?.userId
    const planId = subscription.metadata?.planId

    if (!userId || !planId) {
      console.error('Missing metadata in subscription')
      return
    }

    const plan = subscriptionPlans.find(p => p.id === planId)
    if (!plan) {
      console.error('Invalid plan ID in subscription metadata')
      return
    }

    // Update subscription in database
    await db.subscription.update({
      where: { userId },
      data: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        metadata: plan.metadata,
      }
    })

    console.log(`Subscription updated for user ${userId}: ${planId}`)
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata?.userId

    if (!userId) {
      console.error('Missing metadata in subscription')
      return
    }

    // Update subscription status in database
    await db.subscription.update({
      where: { userId },
      data: {
        status: 'canceled',
        cancelAtPeriodEnd: true,
      }
    })

    console.log(`Subscription canceled for user ${userId}`)
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    const subscriptionId = invoice.subscription
    if (!subscriptionId) return

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId as string)
    const userId = subscription.metadata?.userId

    if (!userId) return

    // Create invoice record
    await db.invoice.create({
      data: {
        userId,
        stripeInvoiceId: invoice.id,
        stripeSubscriptionId: subscriptionId as string,
        amount: invoice.amount_paid / 100, // Convert from cents
        currency: invoice.currency,
        status: invoice.status,
        hostedInvoiceUrl: invoice.hosted_invoice_url,
        invoicePdf: invoice.invoice_pdf,
        periodStart: new Date(invoice.period_start * 1000),
        periodEnd: new Date(invoice.period_end * 1000),
      }
    })

    console.log(`Invoice payment succeeded for user ${userId}: ${invoice.id}`)
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const subscriptionId = invoice.subscription
    if (!subscriptionId) return

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId as string)
    const userId = subscription.metadata?.userId

    if (!userId) return

    // Create invoice record with failed status
    await db.invoice.create({
      data: {
        userId,
        stripeInvoiceId: invoice.id,
        stripeSubscriptionId: subscriptionId as string,
        amount: invoice.amount_due / 100, // Convert from cents
        currency: invoice.currency,
        status: invoice.status,
        hostedInvoiceUrl: invoice.hosted_invoice_url,
        invoicePdf: invoice.invoice_pdf,
        periodStart: new Date(invoice.period_start * 1000),
        periodEnd: new Date(invoice.period_end * 1000),
      }
    })

    // Send notification to user about failed payment
    // This would typically trigger an email notification
    console.log(`Invoice payment failed for user ${userId}: ${invoice.id}`)
  }

  async getUserSubscription(userId: string) {
    return await db.subscription.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      }
    })
  }

  async getUserInvoices(userId: string) {
    return await db.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
  }

  async cancelSubscription(userId: string, cancelImmediately: boolean = false) {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.')
    }

    const subscription = await db.subscription.findUnique({
      where: { userId }
    })

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('No active subscription found')
    }

    if (cancelImmediately) {
      // Cancel immediately
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId)
    } else {
      // Cancel at period end
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true
      })
    }

    // Update database
    await db.subscription.update({
      where: { userId },
      data: {
        cancelAtPeriodEnd: !cancelImmediately,
        status: cancelImmediately ? 'canceled' : 'active'
      }
    })

    return { success: true }
  }

  async reactivateSubscription(userId: string) {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.')
    }

    const subscription = await db.subscription.findUnique({
      where: { userId }
    })

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('No subscription found')
    }

    if (!subscription.cancelAtPeriodEnd) {
      throw new Error('Subscription is not scheduled for cancellation')
    }

    // Reactivate subscription
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false
    })

    // Update database
    await db.subscription.update({
      where: { userId },
      data: {
        cancelAtPeriodEnd: false,
        status: 'active'
      }
    })

    return { success: true }
  }

  async changeSubscriptionPlan(userId: string, newPlanId: string) {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.')
    }

    const subscription = await db.subscription.findUnique({
      where: { userId }
    })

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('No active subscription found')
    }

    const newPlan = subscriptionPlans.find(p => p.id === newPlanId)
    if (!newPlan) {
      throw new Error('Invalid plan ID')
    }

    // Get the subscription item ID
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId)
    const subscriptionItemId = stripeSubscription.items.data[0]?.id

    if (!subscriptionItemId) {
      throw new Error('No subscription item found')
    }

    // Update subscription
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [{
        id: subscriptionItemId,
        price: newPlan.stripePriceId,
      }],
      proration_behavior: 'create_prorations',
      metadata: {
        userId,
        planId: newPlanId,
      }
    })

    // Update database
    await db.subscription.update({
      where: { userId },
      data: {
        planId: newPlanId,
        metadata: newPlan.metadata,
      }
    })

    return { success: true }
  }

  async getUsageStats(userId: string) {
    const [botCount, exchangeCount] = await Promise.all([
      db.tradingBot.count({ where: { userId } }),
      db.exchangeAccount.count({ where: { userId } })
    ])

    const subscription = await this.getUserSubscription(userId)
    const plan = subscription ? subscriptionPlans.find(p => p.id === subscription.planId) : null

    return {
      botCount,
      exchangeCount,
      planLimits: plan?.metadata || {},
      planName: plan?.name || 'Free'
    }
  }

  async validateUserAccess(userId: string, feature: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId)
    
    if (!subscription || subscription.status !== 'active') {
      return false
    }

    const plan = subscriptionPlans.find(p => p.id === subscription.planId)
    if (!plan) {
      return false
    }

    switch (feature) {
      case 'api':
        return plan.metadata?.apiAccess === 'true'
      case 'bots':
        const botCount = await db.tradingBot.count({ where: { userId } })
        const maxBots = plan.metadata?.maxBots
        return maxBots === 'unlimited' || botCount < parseInt(maxBots)
      case 'exchanges':
        const exchangeCount = await db.exchangeAccount.count({ where: { userId } })
        const maxExchanges = plan.metadata?.maxExchanges
        return maxExchanges === 'unlimited' || exchangeCount < parseInt(maxExchanges)
      default:
        return false
    }
  }
}

// Singleton instance
export const billingService = new BillingService()