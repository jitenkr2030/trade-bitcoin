'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  BookOpen, 
  Video, 
  Users, 
  Search, 
  Clock, 
  Star, 
  Play,
  CheckCircle,
  TrendingUp,
  Award,
  FileText,
  Download,
  ArrowRight,
  Filter,
  GraduationCap,
  Lightbulb,
  Target,
  BarChart3,
  Eye
} from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  instructor: {
    name: string
    avatar: string
    expertise: string
  }
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  lessons: number
  students: number
  rating: number
  price: number
  category: string
  tags: string[]
  featured: boolean
  progress?: number
  enrolled?: boolean
}

interface Tutorial {
  id: string
  title: string
  description: string
  type: 'article' | 'video' | 'interactive'
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  views: number
  likes: number
  publishedAt: string
  author: string
}

interface Guide {
  id: string
  title: string
  description: string
  category: string
  readTime: string
  downloads: number
  format: 'PDF' | 'eBook' | 'Cheat Sheet'
  size: string
  level: string
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Bitcoin Trading Fundamentals',
    description: 'Learn the basics of Bitcoin trading, including market analysis, risk management, and trading strategies for beginners.',
    instructor: {
      name: 'Dr. Sarah Chen',
      avatar: '/api/placeholder/40/40',
      expertise: 'Cryptocurrency Trading Expert'
    },
    level: 'Beginner',
    duration: '8 hours',
    lessons: 24,
    students: 15420,
    rating: 4.8,
    price: 0,
    category: 'Bitcoin Trading',
    tags: ['beginner', 'bitcoin', 'trading-basics', 'risk-management'],
    featured: true,
    enrolled: true,
    progress: 65
  },
  {
    id: '2',
    title: 'Advanced Technical Analysis',
    description: 'Master advanced technical analysis techniques including chart patterns, indicators, and trading strategies for experienced traders.',
    instructor: {
      name: 'Mike Johnson',
      avatar: '/api/placeholder/40/40',
      expertise: 'Technical Analysis Specialist'
    },
    level: 'Advanced',
    duration: '12 hours',
    lessons: 36,
    students: 8930,
    rating: 4.9,
    price: 199,
    category: 'Technical Analysis',
    tags: ['advanced', 'technical-analysis', 'chart-patterns', 'indicators'],
    featured: true
  },
  {
    id: '3',
    title: 'Cryptocurrency Portfolio Management',
    description: 'Learn how to build and manage a diversified cryptocurrency portfolio with proper risk allocation and rebalancing strategies.',
    instructor: {
      name: 'Emma Davis',
      avatar: '/api/placeholder/40/40',
      expertise: 'Portfolio Management Expert'
    },
    level: 'Intermediate',
    duration: '6 hours',
    lessons: 18,
    students: 6780,
    rating: 4.7,
    price: 149,
    category: 'Portfolio Management',
    tags: ['portfolio', 'risk-allocation', 'diversification', 'rebalancing'],
    featured: false
  },
  {
    id: '4',
    title: 'Algorithmic Trading with Python',
    description: 'Build automated trading bots using Python, including backtesting strategies and API integration with TradeBitcoin.',
    instructor: {
      name: 'Alex Thompson',
      avatar: '/api/placeholder/40/40',
      expertise: 'Algorithmic Trading Developer'
    },
    level: 'Advanced',
    duration: '15 hours',
    lessons: 45,
    students: 3450,
    rating: 4.9,
    price: 299,
    category: 'Algorithmic Trading',
    tags: ['python', 'algorithmic-trading', 'bots', 'backtesting', 'api'],
    featured: true
  },
  {
    id: '5',
    title: 'DeFi Trading Strategies',
    description: 'Explore decentralized finance trading opportunities, including yield farming, liquidity provision, and arbitrage strategies.',
    instructor: {
      name: 'David Wilson',
      avatar: '/api/placeholder/40/40',
      expertise: 'DeFi Specialist'
    },
    level: 'Intermediate',
    duration: '10 hours',
    lessons: 30,
    students: 4560,
    rating: 4.6,
    price: 179,
    category: 'DeFi',
    tags: ['defi', 'yield-farming', 'liquidity', 'arbitrage'],
    featured: false
  }
]

const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'How to Read Candlestick Charts',
    description: 'Learn to read and interpret candlestick charts for better trading decisions.',
    type: 'video',
    duration: '15 min',
    difficulty: 'Beginner',
    category: 'Technical Analysis',
    views: 45600,
    likes: 1230,
    publishedAt: '2024-01-15T10:00:00Z',
    author: 'Sarah Chen'
  },
  {
    id: '2',
    title: 'Risk Management Essentials',
    description: 'Essential risk management techniques every trader should know.',
    type: 'article',
    duration: '10 min read',
    difficulty: 'Beginner',
    category: 'Risk Management',
    views: 23400,
    likes: 890,
    publishedAt: '2024-01-14T14:30:00Z',
    author: 'Mike Johnson'
  },
  {
    id: '3',
    title: 'Interactive RSI Calculator',
    description: 'Learn and practice using the Relative Strength Index with our interactive tool.',
    type: 'interactive',
    duration: '20 min',
    difficulty: 'Intermediate',
    category: 'Technical Analysis',
    views: 18900,
    likes: 670,
    publishedAt: '2024-01-13T09:15:00Z',
    author: 'Emma Davis'
  }
]

const guides: Guide[] = [
  {
    id: '1',
    title: 'Complete Trading Cheat Sheet',
    description: 'Essential trading formulas, indicators, and strategies in one comprehensive cheat sheet.',
    category: 'Reference',
    readTime: '5 min',
    downloads: 45600,
    format: 'Cheat Sheet',
    size: '2.5 MB',
    level: 'All Levels'
  },
  {
    id: '2',
    title: 'Bitcoin Trading Guide eBook',
    description: 'Comprehensive eBook covering everything you need to know about Bitcoin trading.',
    category: 'Bitcoin Trading',
    readTime: '2 hours',
    downloads: 23400,
    format: 'eBook',
    size: '15.8 MB',
    level: 'Beginner to Advanced'
  },
  {
    id: '3',
    title: 'Technical Analysis Patterns PDF',
    description: 'Detailed guide to chart patterns and technical analysis indicators.',
    category: 'Technical Analysis',
    readTime: '1 hour',
    downloads: 18900,
    format: 'PDF',
    size: '8.2 MB',
    level: 'Intermediate'
  }
]

export default function EducationPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('courses')

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced']
  const categories = ['all', 'Bitcoin Trading', 'Technical Analysis', 'Portfolio Management', 'Algorithmic Trading', 'DeFi']

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory

    return matchesSearch && matchesLevel && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3 mb-8 lg:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Trading Education</h1>
              <p className="text-xl md:text-2xl mb-8">
                Master cryptocurrency trading with our comprehensive courses, tutorials, and guides. From beginner basics to advanced strategies.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Start Learning
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                  <Target className="w-5 h-5 mr-2" />
                  View All Courses
                </Button>
              </div>
            </div>
            <div className="lg:w-1/3">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Learning Stats</CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Active Students</span>
                      <Badge variant="secondary">25,000+</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Course Completion</span>
                      <Badge variant="secondary">85%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Certificates Issued</span>
                      <Badge variant="secondary">12,000+</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Expert Instructors</span>
                      <Badge variant="secondary">15+</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Learning Paths</h2>
            <p className="text-lg text-gray-600">
              Choose your learning path based on your experience and goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Beginner Path</CardTitle>
                <CardDescription>Start your trading journey</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Bitcoin basics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Trading fundamentals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Risk management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Basic technical analysis</span>
                  </li>
                </ul>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Start Beginner Path
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>Intermediate Path</CardTitle>
                <CardDescription>Level up your trading skills</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Advanced technical analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Trading strategies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Portfolio management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Market psychology</span>
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Continue Intermediate Path
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle>Advanced Path</CardTitle>
                <CardDescription>Master professional trading</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Algorithmic trading</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Advanced strategies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>DeFi trading</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Professional risk management</span>
                  </li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Master Advanced Path
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(level => (
                        <SelectItem key={level} value={level}>
                          {level === 'all' ? 'All Levels' : level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    {course.featured && (
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2">
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          Featured Course
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge 
                          variant={
                            course.level === 'Beginner' ? 'default' :
                            course.level === 'Intermediate' ? 'secondary' : 'destructive'
                          }
                        >
                          {course.level}
                        </Badge>
                        <Badge variant="outline">{course.category}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                      
                      <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.lessons} lessons</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{course.students.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                            <AvatarFallback className="text-xs">
                              {course.instructor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">{course.instructor.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                      </div>

                      {course.enrolled && course.progress !== undefined && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          {course.price === 0 ? (
                            <Badge variant="secondary">Free</Badge>
                          ) : (
                            <span className="text-lg font-bold">${course.price}</span>
                          )}
                        </div>
                        <Button 
                          className={course.enrolled ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}
                        >
                          {course.enrolled ? 'Continue' : 'Enroll Now'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tutorials Tab */}
            <TabsContent value="tutorials" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorials.map(tutorial => (
                  <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge 
                          variant={
                            tutorial.type === 'video' ? 'default' :
                            tutorial.type === 'article' ? 'secondary' : 'outline'
                          }
                        >
                          {tutorial.type.charAt(0).toUpperCase() + tutorial.type.slice(1)}
                        </Badge>
                        <Badge variant="outline">{tutorial.category}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{tutorial.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{tutorial.description}</p>
                      
                      <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{tutorial.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{tutorial.views.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">By {tutorial.author}</span>
                        <Button variant="outline" size="sm">
                          {tutorial.type === 'video' ? (
                            <>
                              <Play className="w-4 h-4 mr-1" />
                              Watch
                            </>
                          ) : (
                            <>
                              <FileText className="w-4 h-4 mr-1" />
                              Read
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Guides Tab */}
            <TabsContent value="guides" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map(guide => (
                  <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{guide.category}</Badge>
                        <Badge variant="secondary">{guide.format}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{guide.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{guide.description}</p>
                      
                      <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{guide.readTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          <span>{guide.downloads.toLocaleString()}</span>
                        </div>
                        <span>{guide.size}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{guide.level}</span>
                        <Button className="bg-orange-600 hover:bg-orange-700">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Certificate Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Earn Certificates</h2>
            <p className="text-lg text-gray-600 mb-8">
              Complete courses and earn verified certificates to showcase your trading expertise
            </p>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <Award className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Verified Certificate</h3>
                  <p className="text-sm text-gray-600">
                    Industry-recognized certificates upon course completion
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Award className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Shareable Achievements</h3>
                  <p className="text-sm text-gray-600">
                    Share your certificates on LinkedIn and professional networks
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <TrendingUp className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Career Advancement</h3>
                  <p className="text-sm text-gray-600">
                    Boost your career prospects with verified skills
                  </p>
                </CardContent>
              </Card>
            </div>
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              View Certificate Programs
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of traders who have improved their skills through our comprehensive education programs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
              <GraduationCap className="w-5 h-5 mr-2" />
              Start Free Course
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
              <Target className="w-5 h-5 mr-2" />
              Browse All Courses
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}