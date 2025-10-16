import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const portfolioId = searchParams.get('portfolioId');
    const year = searchParams.get('year');

    if (!portfolioId) {
      return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 });
    }

    // Verify portfolio ownership
    const portfolio = await db.portfolio.findFirst({
      where: {
        id: portfolioId,
        userId: session.user.id,
      },
    });

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    // Get tax reports
    const whereClause: any = {
      portfolioId,
    };

    if (year) {
      whereClause.year = parseInt(year);
    }

    const taxReports = await db.taxReport.findMany({
      where: whereClause,
      orderBy: { year: 'desc' },
      include: {
        taxLots: {
          include: {
            portfolioAsset: {
              include: {
                asset: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ taxReports });
  } catch (error) {
    console.error('Error fetching tax reports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { portfolioId, year, reportType } = await request.json();

    if (!portfolioId || !year || !reportType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify portfolio ownership
    const portfolio = await db.portfolio.findFirst({
      where: {
        id: portfolioId,
        userId: session.user.id,
      },
    });

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    // Check if report already exists
    const existingReport = await db.taxReport.findFirst({
      where: {
        portfolioId,
        year,
        reportType,
      },
    });

    if (existingReport) {
      return NextResponse.json({ error: 'Report already exists' }, { status: 400 });
    }

    // Generate tax report (simplified for demo)
    const taxReport = await generateTaxReport(portfolioId, year, reportType);

    return NextResponse.json({ taxReport });
  } catch (error) {
    console.error('Error generating tax report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function generateTaxReport(portfolioId: string, year: number, reportType: string) {
  // Get all trades for the portfolio in the specified year
  const trades = await db.trade.findMany({
    where: {
      userId: (await db.portfolio.findUnique({ where: { id: portfolioId } }))?.userId,
      createdAt: {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      },
    },
    include: {
      market: {
        include: {
          baseAsset: true,
          quoteAsset: true,
        },
      },
    },
  });

  // Get dividends for the year
  const dividends = await db.dividend.findMany({
    where: {
      portfolioAsset: {
        portfolioId,
      },
      paymentDate: {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      },
    },
  });

  // Get staking rewards for the year
  const stakingRewards = await db.stakingReward.findMany({
    where: {
      portfolioAsset: {
        portfolioId,
      },
      createdAt: {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      },
    },
  });

  // Calculate tax metrics (simplified)
  let totalGains = 0;
  let totalLosses = 0;
  let shortTermGains = 0;
  let longTermGains = 0;
  let dividendIncome = 0;
  let stakingIncome = 0;

  // Process trades for capital gains/losses
  trades.forEach(trade => {
    // This is a simplified calculation - in reality, you'd need FIFO/LIFO/HIFO accounting
    const gainLoss = trade.price * trade.amount; // Simplified
    if (gainLoss > 0) {
      totalGains += gainLoss;
      // Simplified: assume trades within 1 year are short-term
      const tradeDate = new Date(trade.createdAt);
      const oneYearAgo = new Date(tradeDate.getTime() - 365 * 24 * 60 * 60 * 1000);
      if (tradeDate > oneYearAgo) {
        shortTermGains += gainLoss;
      } else {
        longTermGains += gainLoss;
      }
    } else {
      totalLosses += Math.abs(gainLoss);
    }
  });

  // Process dividends
  dividends.forEach(dividend => {
    dividendIncome += dividend.amount;
  });

  // Process staking rewards
  stakingRewards.forEach(reward => {
    stakingIncome += reward.amount;
  });

  // Create tax report
  const taxReport = await db.taxReport.create({
    data: {
      portfolioId,
      year,
      reportType: reportType as any,
      totalGains,
      totalLosses,
      netGains: totalGains - totalLosses,
      shortTermGains,
      longTermGains,
      costBasis: 0, // Would need to calculate from portfolio assets
      marketValue: 0, // Would need to calculate from current prices
      status: 'COMPLETED',
      generatedAt: new Date(),
    },
  });

  // Create tax lots for detailed tracking
  // In a real implementation, you'd create detailed tax lots here

  return taxReport;
}