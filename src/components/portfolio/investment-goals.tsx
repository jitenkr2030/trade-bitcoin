'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Target, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Clock,
  Star,
  Award,
  Gift,
  House,
  GraduationCap,
  Plane,
  Shield,
  Heart
} from "lucide-react"

interface InvestmentGoal {
  id: string
  name: string
  description?: string
  targetValue: number
  currentProgress: number
  targetDate: Date
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  category: 'retirement' | 'education' | 'home' | 'travel' | 'emergency' | 'other'
  createdAt: Date
  updatedAt: Date
}

interface GoalContribution {
  id: string
  goalId: string
  amount: number
  date: Date
  description?: string
}

interface RetirementProjection {
  currentAge: number
  retirementAge: number
  currentSavings: number
  monthlyContribution: number
  expectedReturn: number
  projectedValue: number
  monthlyNeeded: number
  shortfall?: number
}

interface Props {
  portfolioId: string
}

export function InvestmentGoals({ portfolioId }: Props) {
  const [goals, setGoals] = useState<InvestmentGoal[]>([])
  const [contributions, setContributions] = useState<GoalContribution[]>([])
  const [retirementProjection, setRetirementProjection] = useState<RetirementProjection | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingGoal, setIsCreatingGoal] = useState(false)

  useEffect(() => {
    loadGoals()
    loadRetirementProjection()
  }, [portfolioId])

  const loadGoals = async () => {
    setIsLoading(true)
    try {
      // Mock goals data
      const mockGoals: InvestmentGoal[] = [
        {
          id: '1',
          name: 'Emergency Fund',
          description: '6 months of living expenses',
          targetValue: 50000,
          currentProgress: 35000,
          targetDate: new Date('2024-12-31'),
          status: 'ACTIVE',
          priority: 'HIGH',
          category: 'emergency',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'House Down Payment',
          description: 'Down payment for first home',
          targetValue: 200000,
          currentProgress: 85000,
          targetDate: new Date('2026-06-30'),
          status: 'ACTIVE',
          priority: 'CRITICAL',
          category: 'home',
          createdAt: new Date('2023-06-01'),
          updatedAt: new Date()
        },
        {
          id: '3',
          name: 'Retirement Fund',
          description: 'Comfortable retirement at age 65',
          targetValue: 1500000,
          currentProgress: 285000,
          targetDate: new Date('2055-01-01'),
          status: 'ACTIVE',
          priority: 'HIGH',
          category: 'retirement',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date()
        }
      ]

      const mockContributions: GoalContribution[] = [
        {
          id: '1',
          goalId: '1',
          amount: 5000,
          date: new Date('2024-01-15'),
          description: 'Monthly contribution'
        },
        {
          id: '2',
          goalId: '2',
          amount: 2000,
          date: new Date('2024-01-15'),
          description: 'Monthly contribution'
        }
      ]

      setGoals(mockGoals)
      setContributions(mockContributions)
    } catch (error) {
      console.error('Error loading goals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadRetirementProjection = async () => {
    try {
      // Mock retirement projection
      const mockProjection: RetirementProjection = {
        currentAge: 35,
        retirementAge: 65,
        currentSavings: 285000,
        monthlyContribution: 1500,
        expectedReturn: 7,
        projectedValue: 2234567,
        monthlyNeeded: 8500,
        shortfall: -500000 // Negative means surplus
      }
      setRetirementProjection(mockProjection)
    } catch (error) {
      console.error('Error loading retirement projection:', error)
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

  const formatPercent = (num: number) => {
    return `${num.toFixed(2)}%`
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600'
    if (percentage >= 75) return 'text-blue-600'
    if (percentage >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600'
      case 'COMPLETED': return 'text-blue-600'
      case 'PAUSED': return 'text-yellow-600'
      case 'CANCELLED': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-600'
      case 'HIGH': return 'text-orange-600'
      case 'MEDIUM': return 'text-yellow-600'
      case 'LOW': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'retirement': return <Shield className="h-5 w-5" />
      case 'education': return <GraduationCap className="h-5 w-5" />
      case 'home': return <House className="h-5 w-5" />
      case 'travel': return <Plane className="h-5 w-5" />
      case 'emergency': return <Heart className="h-5 w-5" />
      default: return <Star className="h-5 w-5" />
    }
  }

  const getTimeRemaining = (targetDate: Date) => {
    const now = new Date()
    const target = new Date(targetDate)
    const diffTime = target.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Overdue'
    if (diffDays < 30) return `${diffDays} days`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months`
    return `${Math.ceil(diffDays / 365)} years`
  }

  const getTotalTargetValue = () => {
    return goals.reduce((sum, goal) => sum + goal.targetValue, 0)
  }

  const getTotalProgress = () => {
    return goals.reduce((sum, goal) => sum + goal.currentProgress, 0)
  }

  const getCompletedGoals = () => {
    return goals.filter(goal => goal.status === 'COMPLETED').length
  }

  const getActiveGoals = () => {
    return goals.filter(goal => goal.status === 'ACTIVE').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Investment Goals</h2>
          <p className="text-muted-foreground">
            Set, track, and achieve your financial goals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadGoals} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsCreatingGoal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Goals Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Target</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalTargetValue())}</div>
            <p className="text-xs text-muted-foreground">
              Across all goals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalProgress())}</div>
            <p className="text-xs text-muted-foreground">
              {formatPercent(getProgressPercentage(getTotalProgress(), getTotalTargetValue()))} complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getActiveGoals()}</div>
            <p className="text-xs text-muted-foreground">
              {getCompletedGoals()} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Track</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {goals.filter(g => {
                const progress = getProgressPercentage(g.currentProgress, g.targetValue)
                const timeRemaining = new Date(g.targetDate).getTime() - new Date().getTime()
                const expectedProgress = 100 - (timeRemaining / (new Date(g.targetDate).getTime() - g.createdAt.getTime())) * 100
                return progress >= expectedProgress * 0.8 // Within 80% of expected progress
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Goals on schedule
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="goals" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="retirement">Retirement</TabsTrigger>
          <TabsTrigger value="planning">Goal Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4">
          <div className="space-y-4">
            {goals.map((goal) => {
              const progressPercentage = getProgressPercentage(goal.currentProgress, goal.targetValue)
              const timeRemaining = getTimeRemaining(goal.targetDate)
              const isOverdue = timeRemaining === 'Overdue'
              
              return (
                <Card key={goal.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${
                          goal.category === 'retirement' ? 'bg-blue-100' :
                          goal.category === 'education' ? 'bg-purple-100' :
                          goal.category === 'home' ? 'bg-green-100' :
                          goal.category === 'travel' ? 'bg-yellow-100' :
                          goal.category === 'emergency' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          {getCategoryIcon(goal.category)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{goal.name}</h3>
                            <Badge variant="outline" className={getStatusColor(goal.status)}>
                              {goal.status}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                              {goal.priority}
                            </Badge>
                          </div>
                          {goal.description && (
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span className={`font-semibold ${getProgressColor(progressPercentage)}`}>
                            {formatCurrency(goal.currentProgress)} / {formatCurrency(goal.targetValue)}
                            ({progressPercentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-3" />
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center">
                          <div className="text-lg font-semibold">{formatCurrency(goal.targetValue - goal.currentProgress)}</div>
                          <div className="text-sm text-muted-foreground">Remaining</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-semibold ${isOverdue ? 'text-red-600' : 'text-blue-600'}`}>
                            {timeRemaining}
                          </div>
                          <div className="text-sm text-muted-foreground">Time Left</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">
                            {formatCurrency((goal.targetValue - goal.currentProgress) / Math.max(1, (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)))}
                          </div>
                          <div className="text-sm text-muted-foreground">Monthly Needed</div>
                        </div>
                      </div>

                      {progressPercentage >= 100 && (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Congratulations!</strong> You've achieved your goal for {goal.name}!
                          </AlertDescription>
                        </Alert>
                      )}

                      {isOverdue && progressPercentage < 100 && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Goal Overdue:</strong> This goal was supposed to be completed by now. 
                            Consider adjusting your timeline or increasing contributions.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="retirement" className="space-y-4">
          {retirementProjection && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Retirement Projection</CardTitle>
                  <CardDescription>Based on your current savings and contributions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Current Age</label>
                      <Input 
                        type="number" 
                        value={retirementProjection.currentAge}
                        onChange={(e) => setRetirementProjection(prev => prev ? { ...prev, currentAge: parseInt(e.target.value) } : null)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Retirement Age</label>
                      <Input 
                        type="number" 
                        value={retirementProjection.retirementAge}
                        onChange={(e) => setRetirementProjection(prev => prev ? { ...prev, retirementAge: parseInt(e.target.value) } : null)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Current Savings</label>
                      <Input 
                        type="number" 
                        value={retirementProjection.currentSavings}
                        onChange={(e) => setRetirementProjection(prev => prev ? { ...prev, currentSavings: parseFloat(e.target.value) } : null)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Monthly Contribution</label>
                      <Input 
                        type="number" 
                        value={retirementProjection.monthlyContribution}
                        onChange={(e) => setRetirementProjection(prev => prev ? { ...prev, monthlyContribution: parseFloat(e.target.value) } : null)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Expected Annual Return (%)</label>
                    <Input 
                      type="number" 
                      value={retirementProjection.expectedReturn}
                      onChange={(e) => setRetirementProjection(prev => prev ? { ...prev, expectedReturn: parseFloat(e.target.value) } : null)}
                    />
                  </div>
                  <Button className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Update Projection
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Projection Results</CardTitle>
                  <CardDescription>Your retirement outlook based on current inputs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Years to Retirement:</span>
                      <span className="font-semibold">{retirementProjection.retirementAge - retirementProjection.currentAge} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projected Value:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(retirementProjection.projectedValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Needed in Retirement:</span>
                      <span className="font-semibold">{formatCurrency(retirementProjection.monthlyNeeded)}</span>
                    </div>
                    <Separator />
                    {retirementProjection.shortfall && retirementProjection.shortfall < 0 ? (
                      <div className="flex justify-between">
                        <span>Projected Surplus:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(Math.abs(retirementProjection.shortfall))}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <span>Projected Shortfall:</span>
                        <span className="font-semibold text-red-600">{formatCurrency(retirementProjection.shortfall || 0)}</span>
                      </div>
                    )}
                  </div>

                  {retirementProjection.shortfall && retirementProjection.shortfall > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Retirement Shortfall:</strong> You may need to increase your monthly contributions 
                        by {formatCurrency(retirementProjection.shortfall / ((retirementProjection.retirementAge - retirementProjection.currentAge) * 12))} 
                        to meet your retirement goals.
                      </AlertDescription>
                    </Alert>
                  )}

                  {retirementProjection.shortfall && retirementProjection.shortfall < 0 && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Great News!</strong> You're on track to have a surplus in retirement. 
                        Consider retiring earlier or increasing your lifestyle.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Goal Planning Tips</CardTitle>
              <CardDescription>Best practices for setting and achieving financial goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">SMART Goals</h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-600">S</span>
                      <span><strong>pecific:</strong> Clearly define what you want to achieve</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-600">M</span>
                      <span><strong>easurable:</strong> Track progress with concrete numbers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-600">A</span>
                      <span><strong>chievable:</strong> Set realistic targets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-600">R</span>
                      <span><strong>elevant:</strong> Align with your values and priorities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-600">T</span>
                      <span><strong>ime-bound:</strong> Set clear deadlines</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Goal Categories</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Retirement</div>
                        <div className="text-sm text-muted-foreground">Long-term financial security</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-red-600" />
                      <div>
                        <div className="font-medium">Emergency Fund</div>
                        <div className="text-sm text-muted-foreground">3-6 months of expenses</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <House className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Home Purchase</div>
                        <div className="text-sm text-muted-foreground">Down payment and closing costs</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium">Education</div>
                        <div className="text-sm text-muted-foreground">College or vocational training</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Goal Success Strategies</CardTitle>
              <CardDescription>Proven approaches to achieve your financial goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Automate Contributions</h4>
                  <p className="text-sm text-muted-foreground">
                    Set up automatic transfers to ensure consistent progress toward your goals
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Regular Reviews</h4>
                  <p className="text-sm text-muted-foreground">
                    Review your goals monthly and adjust as needed based on life changes
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Celebrate Milestones</h4>
                  <p className="text-sm text-muted-foreground">
                    Acknowledge progress along the way to stay motivated and on track
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}