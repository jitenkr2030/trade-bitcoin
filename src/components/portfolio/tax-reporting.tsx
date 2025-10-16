'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  FileText, 
  Download, 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Target,
  RefreshCw,
  Plus
} from "lucide-react"

interface TaxReport {
  id: string
  year: number
  reportType: string
  totalGains?: number
  totalLosses?: number
  netGains?: number
  shortTermGains?: number
  longTermGains?: number
  status: string
  generatedAt?: Date
  filedAt?: Date
}

interface TaxCalculation {
  totalGains: number
  totalLosses: number
  netGains: number
  shortTermGains: number
  longTermGains: number
  dividendIncome: number
  stakingIncome: number
  taxLiability: {
    shortTerm: number
    longTerm: number
    dividend: number
    staking: number
    total: number
  }
  recommendations: string[]
}

interface TaxLossOpportunity {
  assetId: string
  assetName: string
  currentLoss: number
  unrealizedLoss: number
  recommendation: string
}

interface Props {
  portfolioId: string
}

export function TaxReporting({ portfolioId }: Props) {
  const [taxReports, setTaxReports] = useState<TaxReport[]>([])
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [isGenerating, setIsGenerating] = useState(false)
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculation | null>(null)
  const [taxLossOpportunities, setTaxLossOpportunities] = useState<TaxLossOpportunity[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadTaxReports()
    loadTaxCalculation()
    loadTaxLossOpportunities()
  }, [portfolioId, selectedYear])

  const loadTaxReports = async () => {
    setIsLoading(true)
    try {
      // Mock data - in real implementation, fetch from API
      const mockReports: TaxReport[] = [
        {
          id: '1',
          year: 2024,
          reportType: 'COMPREHENSIVE',
          totalGains: 15420.50,
          totalLosses: 2340.75,
          netGains: 13079.75,
          shortTermGains: 8920.30,
          longTermGains: 6500.20,
          status: 'COMPLETED',
          generatedAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          year: 2023,
          reportType: 'COMPREHENSIVE',
          totalGains: 12340.80,
          totalLosses: 1560.40,
          netGains: 10780.40,
          shortTermGains: 7230.50,
          longTermGains: 5110.30,
          status: 'FILED',
          generatedAt: new Date('2023-01-15'),
          filedAt: new Date('2023-04-15'),
        }
      ]
      setTaxReports(mockReports)
    } catch (error) {
      console.error('Error loading tax reports:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadTaxCalculation = async () => {
    try {
      // Mock tax calculation
      const mockCalculation: TaxCalculation = {
        totalGains: 15420.50,
        totalLosses: 2340.75,
        netGains: 13079.75,
        shortTermGains: 8920.30,
        longTermGains: 6500.20,
        dividendIncome: 2340.50,
        stakingIncome: 1560.25,
        taxLiability: {
          shortTerm: 2682.06, // 30% of short-term gains
          longTerm: 975.03,   // 15% of long-term gains
          dividend: 585.13,   // 25% of dividend income
          staking: 390.06,    // 25% of staking income
          total: 4632.28,
        },
        recommendations: [
          'Consider tax loss harvesting to offset capital gains',
          'Hold assets longer than 1 year to benefit from lower long-term capital gains rates',
          'Use tax-advantaged accounts for dividend-paying assets and staking',
          'Consider making estimated tax payments to avoid underpayment penalties'
        ]
      }
      setTaxCalculation(mockCalculation)
    } catch (error) {
      console.error('Error loading tax calculation:', error)
    }
  }

  const loadTaxLossOpportunities = async () => {
    try {
      // Mock tax loss harvesting opportunities
      const mockOpportunities: TaxLossOpportunity[] = [
        {
          assetId: '1',
          assetName: 'ETH',
          currentLoss: 2340.50,
          unrealizedLoss: -2340.50,
          recommendation: 'Consider selling ETH to harvest $2,340.50 in tax losses'
        },
        {
          assetId: '2',
          assetName: 'SOL',
          currentLoss: 1560.25,
          unrealizedLoss: -1560.25,
          recommendation: 'Consider selling SOL to harvest $1,560.25 in tax losses'
        }
      ]
      setTaxLossOpportunities(mockOpportunities)
    } catch (error) {
      console.error('Error loading tax loss opportunities:', error)
    }
  }

  const generateTaxReport = async (reportType: string) => {
    setIsGenerating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Add new report to list
      const newReport: TaxReport = {
        id: Date.now().toString(),
        year: parseInt(selectedYear),
        reportType,
        status: 'COMPLETED',
        generatedAt: new Date(),
      }
      
      setTaxReports(prev => [newReport, ...prev])
    } catch (error) {
      console.error('Error generating tax report:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600'
      case 'FILED': return 'text-blue-600'
      case 'GENERATING': return 'text-yellow-600'
      case 'ERROR': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />
      case 'FILED': return <FileText className="h-4 w-4" />
      case 'GENERATING': return <Clock className="h-4 w-4" />
      case 'ERROR': return <AlertTriangle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tax Reporting</h2>
          <p className="text-muted-foreground">
            Generate tax reports, calculate liabilities, and optimize your tax strategy
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => {}}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="harvesting">Loss Harvesting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Tax Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Gains</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(taxCalculation?.totalGains || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Short-term: {formatCurrency(taxCalculation?.shortTermGains || 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Losses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(taxCalculation?.totalLosses || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Available for offset
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Gains</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(taxCalculation?.netGains || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  After losses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tax Liability</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(taxCalculation?.taxLiability.total || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Estimated total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tax Breakdown */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Income Breakdown</CardTitle>
                <CardDescription>Sources of taxable income</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Short-term gains</span>
                  <span className="font-semibold">{formatCurrency(taxCalculation?.shortTermGains || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Long-term gains</span>
                  <span className="font-semibold">{formatCurrency(taxCalculation?.longTermGains || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Dividend income</span>
                  <span className="font-semibold">{formatCurrency(taxCalculation?.dividendIncome || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Staking rewards</span>
                  <span className="font-semibold">{formatCurrency(taxCalculation?.stakingIncome || 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Income</span>
                  <span>{formatCurrency((taxCalculation?.shortTermGains || 0) + (taxCalculation?.longTermGains || 0) + (taxCalculation?.dividendIncome || 0) + (taxCalculation?.stakingIncome || 0))}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Liability Breakdown</CardTitle>
                <CardDescription>Estimated tax by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Short-term tax (30%)</span>
                  <span className="font-semibold">{formatCurrency(taxCalculation?.taxLiability.shortTerm || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Long-term tax (15%)</span>
                  <span className="font-semibold">{formatCurrency(taxCalculation?.taxLiability.longTerm || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Dividend tax (25%)</span>
                  <span className="font-semibold">{formatCurrency(taxCalculation?.taxLiability.dividend || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Staking tax (25%)</span>
                  <span className="font-semibold">{formatCurrency(taxCalculation?.taxLiability.staking || 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-semibold text-red-600">
                  <span>Total Tax Liability</span>
                  <span>{formatCurrency(taxCalculation?.taxLiability.total || 0)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Optimization Recommendations</CardTitle>
              <CardDescription>Suggestions to minimize your tax liability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {taxCalculation?.recommendations.map((recommendation, index) => (
                  <Alert key={index}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{recommendation}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Tax Reports</h3>
              <p className="text-sm text-muted-foreground">Generate and download tax reports for filing</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => generateTaxReport('COMPREHENSIVE')} 
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Generate Report
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {taxReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(report.status)}
                        <span className={`font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{report.reportType} - {report.year}</h4>
                        <p className="text-sm text-muted-foreground">
                          Generated: {report.generatedAt?.toLocaleDateString()}
                          {report.filedAt && ` • Filed: ${report.filedAt.toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(report.netGains || 0)}</div>
                        <div className="text-sm text-muted-foreground">Net Gains</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Calculator</CardTitle>
              <CardDescription>Calculate your tax liability with different scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Tax Rates Input */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Short-term Rate (%)</label>
                    <input 
                      type="number" 
                      defaultValue="30" 
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Long-term Rate (%)</label>
                    <input 
                      type="number" 
                      defaultValue="15" 
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dividend Rate (%)</label>
                    <input 
                      type="number" 
                      defaultValue="25" 
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Staking Rate (%)</label>
                    <input 
                      type="number" 
                      defaultValue="25" 
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>

                <Button className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Tax Liability
                </Button>

                {/* Results */}
                {taxCalculation && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Calculation Results</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Short-term gains tax:</span>
                          <span className="font-semibold">{formatCurrency(taxCalculation.taxLiability.shortTerm)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Long-term gains tax:</span>
                          <span className="font-semibold">{formatCurrency(taxCalculation.taxLiability.longTerm)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dividend tax:</span>
                          <span className="font-semibold">{formatCurrency(taxCalculation.taxLiability.dividend)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Staking tax:</span>
                          <span className="font-semibold">{formatCurrency(taxCalculation.taxLiability.staking)}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between font-semibold">
                          <span>Total Tax Liability:</span>
                          <span className="text-red-600">{formatCurrency(taxCalculation.taxLiability.total)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Effective Tax Rate:</span>
                          <span className="font-semibold">
                            {((taxCalculation.taxLiability.total / (taxCalculation.totalGains + taxCalculation.dividendIncome + taxCalculation.stakingIncome)) * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax Savings with Long-term:</span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(taxCalculation.shortTermGains * 0.15)} {/* Savings from long-term rate */}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="harvesting" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Tax Loss Harvesting</h3>
              <p className="text-sm text-muted-foreground">Identify opportunities to harvest tax losses</p>
            </div>
            <Button variant="outline" onClick={() => {}}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Scan Opportunities
            </Button>
          </div>

          {taxLossOpportunities.length > 0 ? (
            <div className="space-y-4">
              {taxLossOpportunities.map((opportunity) => (
                <Card key={opportunity.assetId}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-semibold">{opportunity.assetName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Current unrealized loss: {formatCurrency(opportunity.unrealizedLoss)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold text-red-600">
                            {formatCurrency(opportunity.currentLoss)}
                          </div>
                          <div className="text-sm text-muted-foreground">Harvestable Loss</div>
                        </div>
                        <Button variant="outline" size="sm">
                          Execute Harvest
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{opportunity.recommendation}</AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-lg font-semibold mb-2">No Tax Loss Opportunities</h3>
                  <p className="text-gray-600">
                    No significant tax loss harvesting opportunities available at this time
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tax Loss Harvesting Info */}
          <Card>
            <CardHeader>
              <CardTitle>About Tax Loss Harvesting</CardTitle>
              <CardDescription>Important information about tax loss harvesting strategies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Wash Sale Rule:</strong> Be aware of wash sale rules - avoid repurchasing substantially identical assets within 30 days of selling at a loss.
                </AlertDescription>
              </Alert>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Benefits</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Offset capital gains up to $3,000 annually</li>
                    <li>• Carry forward excess losses indefinitely</li>
                    <li>• Rebalance portfolio without tax consequences</li>
                    <li>• Improve after-tax returns</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Considerations</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Transaction costs and fees</li>
                    <li>• Market timing risks</li>
                    <li>• Wash sale restrictions</li>
                    <li>• Potential missed opportunities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}