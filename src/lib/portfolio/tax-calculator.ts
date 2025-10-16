import { db } from '@/lib/db';

export interface TaxCalculationResult {
  totalGains: number;
  totalLosses: number;
  netGains: number;
  shortTermGains: number;
  longTermGains: number;
  dividendIncome: number;
  stakingIncome: number;
  taxLiability: {
    shortTerm: number;
    longTerm: number;
    dividend: number;
    staking: number;
    total: number;
  };
  recommendations: string[];
}

export class TaxCalculator {
  static async calculateTaxLiability(
    portfolioId: string,
    year: number,
    taxRates: {
      shortTerm: number;
      longTerm: number;
      dividend: number;
      staking: number;
    }
  ): Promise<TaxCalculationResult> {
    // Get all trades for the year
    const trades = await db.trade.findMany({
      where: {
        portfolioAsset: {
          portfolioId,
        },
        createdAt: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        },
      },
      include: {
        portfolioAsset: true,
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

    // Calculate gains/losses using FIFO method
    const gainsLosses = await this.calculateGainsLossesFIFO(trades);
    
    // Calculate income
    const dividendIncome = dividends.reduce((sum, d) => sum + d.amount, 0);
    const stakingIncome = stakingRewards.reduce((sum, r) => sum + r.amount, 0);

    // Calculate tax liability
    const shortTermTax = gainsLosses.shortTermGains * (taxRates.shortTerm / 100);
    const longTermTax = gainsLosses.longTermGains * (taxRates.longTerm / 100);
    const dividendTax = dividendIncome * (taxRates.dividend / 100);
    const stakingTax = stakingIncome * (taxRates.staking / 100);

    // Generate recommendations
    const recommendations = this.generateTaxRecommendations({
      gainsLosses,
      dividendIncome,
      stakingIncome,
      taxRates,
    });

    return {
      totalGains: gainsLosses.totalGains,
      totalLosses: gainsLosses.totalLosses,
      netGains: gainsLosses.netGains,
      shortTermGains: gainsLosses.shortTermGains,
      longTermGains: gainsLosses.longTermGains,
      dividendIncome,
      stakingIncome,
      taxLiability: {
        shortTerm: shortTermTax,
        longTerm: longTermTax,
        dividend: dividendTax,
        staking: stakingTax,
        total: shortTermTax + longTermTax + dividendTax + stakingTax,
      },
      recommendations,
    };
  }

  private static async calculateGainsLossesFIFO(trades: any[]) {
    // This is a simplified FIFO calculation
    // In a real implementation, you'd need to track cost basis and holding periods
    
    let totalGains = 0;
    let totalLosses = 0;
    let shortTermGains = 0;
    let longTermGains = 0;

    // Group trades by asset
    const tradesByAsset = trades.reduce((acc, trade) => {
      const assetId = trade.portfolioAsset.assetId;
      if (!acc[assetId]) {
        acc[assetId] = [];
      }
      acc[assetId].push(trade);
      return acc;
    }, {} as Record<string, any[]>);

    // Calculate gains/losses for each asset
    for (const [assetId, assetTrades] of Object.entries(tradesByAsset)) {
      // Sort by date (FIFO)
      assetTrades.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      // Separate buys and sells
      const buys = assetTrades.filter(t => t.side === 'BUY');
      const sells = assetTrades.filter(t => t.side === 'SELL');

      // Match sells with buys (FIFO)
      let buyIndex = 0;
      for (const sell of sells) {
        let remainingSellAmount = sell.amount;
        
        while (remainingSellAmount > 0 && buyIndex < buys.length) {
          const buy = buys[buyIndex];
          const matchedAmount = Math.min(remainingSellAmount, buy.amount);
          
          // Calculate gain/loss
          const proceeds = matchedAmount * sell.price;
          const costBasis = matchedAmount * buy.price;
          const gainLoss = proceeds - costBasis;
          
          // Determine holding period
          const buyDate = new Date(buy.createdAt);
          const sellDate = new Date(sell.createdAt);
          const holdingDays = Math.floor((sellDate.getTime() - buyDate.getTime()) / (1000 * 60 * 60 * 24));
          const isLongTerm = holdingDays > 365;

          if (gainLoss > 0) {
            totalGains += gainLoss;
            if (isLongTerm) {
              longTermGains += gainLoss;
            } else {
              shortTermGains += gainLoss;
            }
          } else {
            totalLosses += Math.abs(gainLoss);
          }

          remainingSellAmount -= matchedAmount;
          buy.amount -= matchedAmount;
          
          if (buy.amount === 0) {
            buyIndex++;
          }
        }
      }
    }

    return {
      totalGains,
      totalLosses,
      netGains: totalGains - totalLosses,
      shortTermGains,
      longTermGains,
    };
  }

  private static generateTaxRecommendations(data: {
    gainsLosses: any;
    dividendIncome: number;
    stakingIncome: number;
    taxRates: any;
  }): string[] {
    const recommendations: string[] = [];

    // Tax loss harvesting recommendations
    if (data.gainsLosses.totalGains > 0 && data.gainsLosses.totalLosses > 0) {
      recommendations.push('Consider tax loss harvesting to offset capital gains');
    }

    // Long-term holding recommendations
    if (data.gainsLosses.shortTermGains > data.gainsLosses.longTermGains) {
      recommendations.push('Consider holding assets longer than 1 year to benefit from lower long-term capital gains rates');
    }

    // Tax-advantaged accounts
    if (data.dividendIncome > 1000 || data.stakingIncome > 1000) {
      recommendations.push('Consider using tax-advantaged accounts for dividend-paying assets and staking');
    }

    // Wash sale rule awareness
    if (data.gainsLosses.totalLosses > 0) {
      recommendations.push('Be aware of wash sale rules - avoid repurchasing substantially identical assets within 30 days of selling at a loss');
    }

    // Estimated tax payments
    const totalTaxLiability = 
      (data.gainsLosses.shortTermGains * data.taxRates.shortTerm / 100) +
      (data.gainsLosses.longTermGains * data.taxRates.longTerm / 100) +
      (data.dividendIncome * data.taxRates.dividend / 100) +
      (data.stakingIncome * data.taxRates.staking / 100);

    if (totalTaxLiability > 1000) {
      recommendations.push('Consider making estimated tax payments to avoid underpayment penalties');
    }

    return recommendations;
  }

  static async generateTaxLossHarvestingOpportunities(portfolioId: string) {
    const portfolioAssets = await db.portfolioAsset.findMany({
      where: { portfolioId },
      include: {
        asset: true,
      },
    });

    const opportunities: Array<{
      assetId: string;
      assetName: string;
      currentLoss: number;
      unrealizedLoss: number;
      recommendation: string;
    }> = [];

    for (const asset of portfolioAssets) {
      // This is simplified - in reality, you'd need current market data
      const currentPrice = asset.avgPrice || 0; // Simplified
      const unrealizedGainLoss = (currentPrice - (asset.avgPrice || 0)) * asset.amount;

      if (unrealizedGainLoss < -100) { // Loss threshold
        opportunities.push({
          assetId: asset.assetId,
          assetName: asset.asset.name,
          currentLoss: Math.abs(unrealizedGainLoss),
          unrealizedGainLoss,
          recommendation: `Consider selling ${asset.asset.name} to harvest $${Math.abs(unrealizedGainLoss).toFixed(2)} in tax losses`,
        });
      }
    }

    return opportunities;
  }
}