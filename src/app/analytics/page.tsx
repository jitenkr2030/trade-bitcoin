"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity,
  Target,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  DollarSign,
  Percent,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  FileText,
  Eye,
  Share2,
  Plus
} from "lucide-react"
import { PerformanceChart } from "@/components/performance-chart"
import { WinRateChart } from "@/components/winrate-chart"
import { AssetPerformanceChart } from "@/components/asset-performance-chart"

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Performance</h1>
          <p className="text-muted-foreground">
            Comprehensive trading performance analysis and reporting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+23.8%</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73.2%</div>
            <p className="text-xs text-muted-foreground">
              347 wins / 127 losses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.85</div>
            <p className="text-xs text-muted-foreground">
              Risk-adjusted return
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-12.3%</div>
            <p className="text-xs text-muted-foreground">
              Worst peak to trough
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Portfolio Performance</CardTitle>
                  <CardDescription>Portfolio value over time</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Value</Badge>
                  <Badge variant="secondary">Returns</Badge>
                  <Badge variant="outline">Drawdown</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PerformanceChart />
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
              <CardDescription>Current month performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+8.4%</div>
                  <div className="text-xs text-muted-foreground">Return</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-xs text-muted-foreground">Trades</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Best Day</span>
                  <span className="font-medium text-green-600">+3.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Worst Day</span>
                  <span className="font-medium text-red-600">-1.8%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Daily</span>
                  <span className="font-medium">+0.4%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Metrics</CardTitle>
              <CardDescription>Current risk assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Volatility</span>
                  <span className="font-medium">18.5%</span>
                </div>
                <Progress value={65} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Beta</span>
                  <span className="font-medium">0.87</span>
                </div>
                <Progress value={35} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Value at Risk</span>
                  <span className="font-medium">$8,234</span>
                </div>
                <Progress value={45} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="trading" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trading">Trading Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="trading" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Win Rate Analysis</CardTitle>
                <CardDescription>Win rate by asset class</CardDescription>
              </CardHeader>
              <CardContent>
                <WinRateChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Performance</CardTitle>
                <CardDescription>Performance by asset type</CardDescription>
              </CardHeader>
              <CardContent>
                <AssetPerformanceChart />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Trading Statistics</CardTitle>
              <CardDescription>Detailed trading performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">474</div>
                  <div className="text-sm text-muted-foreground">Total Trades</div>
                  <div className="text-xs text-green-600">+12.5% vs last period</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">347</div>
                  <div className="text-sm text-muted-foreground">Winning Trades</div>
                  <div className="text-xs text-green-600">73.2% win rate</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">127</div>
                  <div className="text-sm text-muted-foreground">Losing Trades</div>
                  <div className="text-xs text-red-600">26.8% loss rate</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">2.47</div>
                  <div className="text-sm text-muted-foreground">Profit Factor</div>
                  <div className="text-xs text-green-600">Excellent</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trade Duration Analysis</CardTitle>
              <CardDescription>Average holding time by asset class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { asset: "Cryptocurrency", avgTime: "2.4 hours", trades: 234, winRate: 75.2 },
                  { asset: "Stocks", avgTime: "1.8 days", trades: 156, winRate: 68.4 },
                  { asset: "Forex", avgTime: "45 minutes", trades: 67, winRate: 71.1 },
                  { asset: "ETFs", avgTime: "3.2 days", trades: 17, winRate: 82.3 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{item.asset}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.trades} trades • {item.avgTime} avg hold
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${item.winRate > 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {item.winRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Essential trading metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+23.8%</div>
                    <div className="text-xs text-muted-foreground">Total Return</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">1.85</div>
                    <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">2.47</div>
                    <div className="text-xs text-muted-foreground">Profit Factor</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">-12.3%</div>
                    <div className="text-xs text-muted-foreground">Max Drawdown</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Month-over-month comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { month: "January", return: 5.2, trades: 89 },
                    { month: "February", return: -1.8, trades: 124 },
                    { month: "March", return: 8.4, trades: 156 },
                    { month: "April", return: 3.2, trades: 105 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium">{item.month.substring(0, 3)}</span>
                        </div>
                        <div>
                          <div className="font-medium">{item.month}</div>
                          <div className="text-xs text-muted-foreground">{item.trades} trades</div>
                        </div>
                      </div>
                      <div className={`text-right ${item.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <div className="font-semibold">
                          {item.return >= 0 ? '+' : ''}{item.return}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Attribution</CardTitle>
              <CardDescription>What contributed to your returns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Strategy Selection</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Market Timing</span>
                    <span className="font-medium">30%</span>
                  </div>
                  <Progress value={30} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Risk Management</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <Progress value={15} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Asset Allocation</span>
                    <span className="font-medium">10%</span>
                  </div>
                  <Progress value={10} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
                <CardDescription>Current risk exposure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Portfolio Volatility</span>
                    <div className="text-right">
                      <div className="font-semibold">18.5%</div>
                      <div className="text-xs text-muted-foreground">Annualized</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Beta vs Market</span>
                    <div className="text-right">
                      <div className="font-semibold">0.87</div>
                      <div className="text-xs text-muted-foreground">Less volatile</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Value at Risk (95%)</span>
                    <div className="text-right">
                      <div className="font-semibold text-red-600">$8,234</div>
                      <div className="text-xs text-muted-foreground">Daily</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Correlation to Market</span>
                    <div className="text-right">
                      <div className="font-semibold">0.72</div>
                      <div className="text-xs text-muted-foreground">Moderate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Drawdown Analysis</CardTitle>
                <CardDescription>Historical drawdown periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { period: "Current", drawdown: -2.1, duration: "3 days", recovery: "In progress" },
                    { period: "March 2024", drawdown: -8.4, duration: "12 days", recovery: "5 days" },
                    { period: "January 2024", drawdown: -12.3, duration: "18 days", recovery: "14 days" },
                    { period: "November 2023", drawdown: -5.7, duration: "8 days", recovery: "6 days" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.period}</div>
                        <div className="text-sm text-muted-foreground">{item.duration}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${item.drawdown < -5 ? 'text-red-600' : 'text-yellow-600'}`}>
                          {item.drawdown}%
                        </div>
                        <div className="text-xs text-muted-foreground">{item.recovery}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Overall portfolio risk evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="font-medium">Moderate Risk</div>
                  <div className="text-sm text-muted-foreground">Overall Risk Level</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="font-medium">Good</div>
                  <div className="text-sm text-muted-foreground">Risk Management</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="font-medium">7.2/10</div>
                  <div className="text-sm text-muted-foreground">Risk Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Monthly Report</CardTitle>
                <CardDescription>Comprehensive monthly performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last generated</span>
                  <span className="text-sm">2 days ago</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">Tax Report</CardTitle>
                <CardDescription>Tax-ready trading summary and gains/losses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last generated</span>
                  <span className="text-sm">1 week ago</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <PieChart className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Portfolio Analysis</CardTitle>
                <CardDescription>Detailed portfolio breakdown and analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last generated</span>
                  <span className="text-sm">3 days ago</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Bot Performance</CardTitle>
                <CardDescription>Individual trading bot performance reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last generated</span>
                  <span className="text-sm">1 day ago</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <CardTitle className="text-lg">Risk Analysis</CardTitle>
                <CardDescription>Comprehensive risk assessment report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last generated</span>
                  <span className="text-sm">5 days ago</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-cyan-600" />
                </div>
                <CardTitle className="text-lg">Custom Report</CardTitle>
                <CardDescription>Generate custom analytics report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Create new</span>
                  <span className="text-sm">Custom</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}