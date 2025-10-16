import { PrismaClient } from '@prisma/client'
import { UserRole, UserStatus, ExchangeStatus, AssetType, AssetCategory, MarketStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default user roles and permissions
  console.log('Creating default users...')
  
  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@tradebitcoin.com' },
    update: {},
    create: {
      email: 'admin@tradebitcoin.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZeUfkZMBs9kYZP6i', // password: admin123
    },
  })

  // Create demo trader user
  const traderUser = await prisma.user.upsert({
    where: { email: 'trader@tradebitcoin.com' },
    update: {},
    create: {
      email: 'trader@tradebitcoin.com',
      name: 'Demo Trader',
      role: UserRole.TRADER,
      status: UserStatus.ACTIVE,
      password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZeUfkZMBs9kYZP6i', // password: admin123
    },
  })

  // Create demo investor user
  const investorUser = await prisma.user.upsert({
    where: { email: 'investor@tradebitcoin.com' },
    update: {},
    create: {
      email: 'investor@tradebitcoin.com',
      name: 'Demo Investor',
      role: UserRole.INVESTOR,
      status: UserStatus.ACTIVE,
      password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZeUfkZMBs9kYZP6i', // password: admin123
    },
  })

  console.log('✅ Default users created')

  // Create exchanges
  console.log('Creating exchanges...')
  
  const binanceExchange = await prisma.exchange.upsert({
    where: { name: 'binance' },
    update: {},
    create: {
      name: 'binance',
      displayName: 'Binance',
      logo: '/exchanges/binance.png',
      website: 'https://binance.com',
      apiBaseUrl: 'https://api.binance.com/api/v3',
      wsUrl: 'wss://stream.binance.com:9443',
      status: ExchangeStatus.ACTIVE,
      features: {
        spot: true,
        margin: true,
        futures: true,
        spotTrading: true,
        marginTrading: true,
        futuresTrading: true,
        ocoOrders: true,
        stopOrders: true,
        takeProfitOrders: true,
        trailingStop: true,
        icebergOrders: true,
        fillOrKill: true,
        immediateOrCancel: true,
        postOnly: false,
        reduceOnly: true,
        conditionalOrders: true,
        triggerOrders: true,
        advancedOrderTypes: true,
      },
    },
  })

  const coinbaseExchange = await prisma.exchange.upsert({
    where: { name: 'coinbase' },
    update: {},
    create: {
      name: 'coinbase',
      displayName: 'Coinbase',
      logo: '/exchanges/coinbase.png',
      website: 'https://coinbase.com',
      apiBaseUrl: 'https://api.pro.coinbase.com',
      wsUrl: 'wss://ws-feed.pro.coinbase.com',
      status: ExchangeStatus.ACTIVE,
      features: {
        spot: true,
        margin: false,
        futures: false,
        spotTrading: true,
        marginTrading: false,
        futuresTrading: false,
        ocoOrders: false,
        stopOrders: true,
        takeProfitOrders: true,
        trailingStop: false,
        icebergOrders: false,
        fillOrKill: true,
        immediateOrCancel: true,
        postOnly: true,
        reduceOnly: false,
        conditionalOrders: false,
        triggerOrders: false,
        advancedOrderTypes: false,
      },
    },
  })

  const krakenExchange = await prisma.exchange.upsert({
    where: { name: 'kraken' },
    update: {},
    create: {
      name: 'kraken',
      displayName: 'Kraken',
      logo: '/exchanges/kraken.png',
      website: 'https://kraken.com',
      apiBaseUrl: 'https://api.kraken.com/0',
      wsUrl: 'wss://ws.kraken.com',
      status: ExchangeStatus.ACTIVE,
      features: {
        spot: true,
        margin: true,
        futures: false,
        spotTrading: true,
        marginTrading: true,
        futuresTrading: false,
        ocoOrders: false,
        stopOrders: true,
        takeProfitOrders: true,
        trailingStop: true,
        icebergOrders: false,
        fillOrKill: true,
        immediateOrCancel: true,
        postOnly: true,
        reduceOnly: true,
        conditionalOrders: false,
        triggerOrders: true,
        advancedOrderTypes: false,
      },
    },
  })

  console.log('✅ Exchanges created')

  // Create assets
  console.log('Creating assets...')
  
  const btcAsset = await prisma.asset.upsert({
    where: { symbol: 'BTC' },
    update: {},
    create: {
      symbol: 'BTC',
      name: 'Bitcoin',
      type: AssetType.CRYPTO,
      category: AssetCategory.CRYPTO,
      precision: 8,
      description: 'The world\'s first cryptocurrency',
      website: 'https://bitcoin.org',
      whitepaper: 'https://bitcoin.org/bitcoin.pdf',
    },
  })

  const ethAsset = await prisma.asset.upsert({
    where: { symbol: 'ETH' },
    update: {},
    create: {
      symbol: 'ETH',
      name: 'Ethereum',
      type: AssetType.CRYPTO,
      category: AssetCategory.CRYPTO,
      precision: 18,
      description: 'A decentralized platform for applications',
      website: 'https://ethereum.org',
      whitepaper: 'https://ethereum.org/en/whitepaper/',
    },
  })

  const usdtAsset = await prisma.asset.upsert({
    where: { symbol: 'USDT' },
    update: {},
    create: {
      symbol: 'USDT',
      name: 'Tether',
      type: AssetType.CRYPTO,
      category: AssetCategory.CRYPTO,
      precision: 6,
      description: 'A stablecoin pegged to the US dollar',
      website: 'https://tether.to',
    },
  })

  const usdcAsset = await prisma.asset.upsert({
    where: { symbol: 'USDC' },
    update: {},
    create: {
      symbol: 'USDC',
      name: 'USD Coin',
      type: AssetType.CRYPTO,
      category: AssetCategory.CRYPTO,
      precision: 6,
      description: 'A fully collateralized US dollar stablecoin',
      website: 'https://www.centre.io/usdc',
    },
  })

  console.log('✅ Assets created')

  // Create markets
  console.log('Creating markets...')
  
  // Binance markets
  await prisma.market.upsert({
    where: { 
      exchangeId_symbol: {
        exchangeId: binanceExchange.id,
        symbol: 'BTCUSDT'
      }
    },
    update: {},
    create: {
      exchangeId: binanceExchange.id,
      baseAssetId: btcAsset.id,
      quoteAssetId: usdtAsset.id,
      symbol: 'BTCUSDT',
      status: MarketStatus.ACTIVE,
      minPrice: 0.01,
      maxPrice: 1000000,
      tickSize: 0.01,
      stepSize: 0.000001,
    },
  })

  await prisma.market.upsert({
    where: { 
      exchangeId_symbol: {
        exchangeId: binanceExchange.id,
        symbol: 'ETHUSDT'
      }
    },
    update: {},
    create: {
      exchangeId: binanceExchange.id,
      baseAssetId: ethAsset.id,
      quoteAssetId: usdtAsset.id,
      symbol: 'ETHUSDT',
      status: MarketStatus.ACTIVE,
      minPrice: 0.01,
      maxPrice: 10000,
      tickSize: 0.01,
      stepSize: 0.000001,
    },
  })

  await prisma.market.upsert({
    where: { 
      exchangeId_symbol: {
        exchangeId: binanceExchange.id,
        symbol: 'ETHBTC'
      }
    },
    update: {},
    create: {
      exchangeId: binanceExchange.id,
      baseAssetId: ethAsset.id,
      quoteAssetId: btcAsset.id,
      symbol: 'ETHBTC',
      status: MarketStatus.ACTIVE,
      minPrice: 0.00000001,
      maxPrice: 1,
      tickSize: 0.00000001,
      stepSize: 0.000001,
    },
  })

  // Coinbase markets
  await prisma.market.upsert({
    where: { 
      exchangeId_symbol: {
        exchangeId: coinbaseExchange.id,
        symbol: 'BTC-USD'
      }
    },
    update: {},
    create: {
      exchangeId: coinbaseExchange.id,
      baseAssetId: btcAsset.id,
      quoteAssetId: usdcAsset.id,
      symbol: 'BTC-USD',
      status: MarketStatus.ACTIVE,
      minPrice: 0.01,
      maxPrice: 1000000,
      tickSize: 0.01,
      stepSize: 0.00000001,
    },
  })

  await prisma.market.upsert({
    where: { 
      exchangeId_symbol: {
        exchangeId: coinbaseExchange.id,
        symbol: 'ETH-USD'
      }
    },
    update: {},
    create: {
      exchangeId: coinbaseExchange.id,
      baseAssetId: ethAsset.id,
      quoteAssetId: usdcAsset.id,
      symbol: 'ETH-USD',
      status: MarketStatus.ACTIVE,
      minPrice: 0.01,
      maxPrice: 10000,
      tickSize: 0.01,
      stepSize: 0.00000001,
    },
  })

  // Kraken markets
  await prisma.market.upsert({
    where: { 
      exchangeId_symbol: {
        exchangeId: krakenExchange.id,
        symbol: 'XBTUSD'
      }
    },
    update: {},
    create: {
      exchangeId: krakenExchange.id,
      baseAssetId: btcAsset.id,
      quoteAssetId: usdtAsset.id,
      symbol: 'XBTUSD',
      status: MarketStatus.ACTIVE,
      minPrice: 0.01,
      maxPrice: 1000000,
      tickSize: 0.01,
      stepSize: 0.00000001,
    },
  })

  await prisma.market.upsert({
    where: { 
      exchangeId_symbol: {
        exchangeId: krakenExchange.id,
        symbol: 'ETHUSD'
      }
    },
    update: {},
    create: {
      exchangeId: krakenExchange.id,
      baseAssetId: ethAsset.id,
      quoteAssetId: usdtAsset.id,
      symbol: 'ETHUSD',
      status: MarketStatus.ACTIVE,
      minPrice: 0.01,
      maxPrice: 10000,
      tickSize: 0.01,
      stepSize: 0.00000001,
    },
  })

  console.log('✅ Markets created')

  // Create sample portfolios
  console.log('Creating portfolios...')
  
  const traderPortfolio = await prisma.portfolio.upsert({
    where: { 
      userId_name: {
        userId: traderUser.id,
        name: 'Main Trading Portfolio'
      }
    },
    update: {},
    create: {
      userId: traderUser.id,
      name: 'Main Trading Portfolio',
      description: 'Primary trading portfolio for demo purposes',
      type: 'TRADING',
      status: 'ACTIVE',
      totalValue: 50000,
      riskLevel: 'MEDIUM',
      rebalanceFrequency: 'MANUAL',
      autoRebalance: false,
    },
  })

  const investorPortfolio = await prisma.portfolio.upsert({
    where: { 
      userId_name: {
        userId: investorUser.id,
        name: 'Long-term Investment Portfolio'
      }
    },
    update: {},
    create: {
      userId: investorUser.id,
      name: 'Long-term Investment Portfolio',
      description: 'Diversified investment portfolio for long-term growth',
      type: 'INVESTMENT',
      status: 'ACTIVE',
      totalValue: 100000,
      targetValue: 200000,
      targetDate: new Date('2025-12-31'),
      riskLevel: 'LOW',
      rebalanceFrequency: 'QUARTERLY',
      autoRebalance: true,
    },
  })

  console.log('✅ Portfolios created')

  // Create blog categories
  console.log('Creating blog categories...')
  
  const tradingCategory = await prisma.blogCategory.upsert({
    where: { slug: 'trading' },
    update: {},
    create: {
      name: 'Trading',
      slug: 'trading',
      description: 'Trading strategies and tips',
      color: '#3B82F6',
    },
  })

  const analysisCategory = await prisma.blogCategory.upsert({
    where: { slug: 'analysis' },
    update: {},
    create: {
      name: 'Market Analysis',
      slug: 'analysis',
      description: 'Technical and fundamental analysis',
      color: '#10B981',
    },
  })

  const newsCategory = await prisma.blogCategory.upsert({
    where: { slug: 'news' },
    update: {},
    create: {
      name: 'News',
      slug: 'news',
      description: 'Latest cryptocurrency news',
      color: '#F59E0B',
    },
  })

  console.log('✅ Blog categories created')

  console.log('🎉 Database seeded successfully!')
  console.log('')
  console.log('Default login credentials:')
  console.log('Admin: admin@tradebitcoin.com / admin123')
  console.log('Trader: trader@tradebitcoin.com / admin123')
  console.log('Investor: investor@tradebitcoin.com / admin123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })