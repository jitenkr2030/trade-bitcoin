'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin, Clock, DollarSign, Briefcase, Search, Filter } from 'lucide-react'

interface JobListing {
  id: string
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
  experience: string
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  postedDate: string
}

const jobListings: JobListing[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    experience: '5+ years',
    salary: '$120k - $160k',
    description: 'We are looking for a Senior Frontend Developer to join our growing team and help build the next generation of cryptocurrency trading platforms.',
    requirements: [
      '5+ years of experience with React and TypeScript',
      'Strong knowledge of Next.js and modern frontend frameworks',
      'Experience with trading or financial applications is a plus',
      'Bachelor\'s degree in Computer Science or related field'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Remote-first culture',
      'Flexible working hours',
      'Health, dental, and vision insurance',
      'Professional development budget'
    ],
    postedDate: '2024-01-15'
  },
  {
    id: '2',
    title: 'Blockchain Security Engineer',
    department: 'Security',
    location: 'San Francisco, CA',
    type: 'Full-time',
    experience: '3+ years',
    salary: '$140k - $180k',
    description: 'Join our security team to ensure the safety and integrity of our cryptocurrency exchange platform.',
    requirements: [
      '3+ years of experience in blockchain security',
      'Strong understanding of smart contracts and DeFi protocols',
      'Experience with security audits and penetration testing',
      'Knowledge of common blockchain vulnerabilities'
    ],
    benefits: [
      'Top-tier compensation package',
      'Cutting-edge security tools and resources',
      'Conference and training budget',
      'Stock options',
      'Relocation assistance'
    ],
    postedDate: '2024-01-12'
  },
  {
    id: '3',
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    type: 'Full-time',
    experience: '4+ years',
    salary: '$130k - $170k',
    description: 'Lead product development for our trading platform features and user experience improvements.',
    requirements: [
      '4+ years of product management experience',
      'Experience with fintech or trading platforms',
      'Strong analytical and problem-solving skills',
      'Excellent communication and leadership abilities'
    ],
    benefits: [
      'Competitive salary and bonus structure',
      'Equity participation',
      'Flexible work arrangements',
      'Comprehensive health benefits',
      'Learning and development opportunities'
    ],
    postedDate: '2024-01-10'
  },
  {
    id: '4',
    title: 'Data Scientist',
    department: 'Data Science',
    location: 'Remote',
    type: 'Full-time',
    experience: '3+ years',
    salary: '$110k - $150k',
    description: 'Analyze trading data and develop machine learning models to improve our platform\'s predictive capabilities.',
    requirements: [
      '3+ years of experience in data science or machine learning',
      'Proficiency in Python, R, and statistical analysis',
      'Experience with financial data and time series analysis',
      'Master\'s degree in Data Science, Statistics, or related field'
    ],
    benefits: [
      'Competitive compensation',
      'Remote work flexibility',
      'Access to cutting-edge technology',
      'Professional development support',
      'Collaborative team environment'
    ],
    postedDate: '2024-01-08'
  },
  {
    id: '5',
    title: 'Customer Support Specialist',
    department: 'Support',
    location: 'London, UK',
    type: 'Full-time',
    experience: '2+ years',
    salary: '$45k - $60k',
    description: 'Provide exceptional support to our cryptocurrency traders and help resolve their issues efficiently.',
    requirements: [
      '2+ years of customer support experience',
      'Knowledge of cryptocurrency and blockchain technology',
      'Excellent communication and problem-solving skills',
      'Ability to work in a fast-paced environment'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      'Paid time off',
      'Career growth opportunities',
      'Cryptocurrency trading account with benefits'
    ],
    postedDate: '2024-01-05'
  },
  {
    id: '6',
    title: 'Marketing Intern',
    department: 'Marketing',
    location: 'Remote',
    type: 'Internship',
    experience: '0-2 years',
    salary: '$20 - $25/hour',
    description: 'Join our marketing team to help promote TradeBitcoin and grow our user base.',
    requirements: [
      'Currently enrolled in or recent graduate of a marketing program',
      'Interest in cryptocurrency and blockchain technology',
      'Strong written and verbal communication skills',
      'Creative thinking and problem-solving abilities'
    ],
    benefits: [
      'Competitive internship pay',
      'Flexible work schedule',
      'Mentorship from industry professionals',
      'Opportunity for full-time employment',
      'Learning about cryptocurrency industry'
    ],
    postedDate: '2024-01-03'
  }
]

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  const departments = ['all', ...new Set(jobListings.map(job => job.department))]
  const locations = ['all', ...new Set(jobListings.map(job => job.location))]
  const types = ['all', ...new Set(jobListings.map(job => job.type))]

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation
    const matchesType = selectedType === 'all' || job.type === selectedType

    return matchesSearch && matchesDepartment && matchesLocation && matchesType
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Build the future of cryptocurrency trading with us. We're looking for passionate individuals who want to make an impact.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
              View Open Positions
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
              Learn About Our Culture
            </Button>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Work With Us?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're building a team of innovators who are passionate about cryptocurrency and committed to excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle>Impactful Work</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Build products that millions of traders use daily. Your work directly impacts the cryptocurrency ecosystem.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle>Flexibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Remote-first culture with flexible working hours. We trust our team to deliver results, not just hours.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle>Competitive Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Top-tier compensation, equity packages, health insurance, and professional development opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Open Positions</h2>
            <p className="text-lg text-gray-600">
              Find your perfect role and join our growing team
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>
                      {loc === 'all' ? 'All Locations' : loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job Cards */}
          <div className="space-y-6">
            {filteredJobs.map(job => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <CardDescription className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Badge variant="outline">{job.experience}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{job.description}</p>
                  
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="requirements">Requirements</TabsTrigger>
                      <TabsTrigger value="benefits">Benefits</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="mt-4">
                      <p className="text-gray-600">{job.description}</p>
                    </TabsContent>
                    
                    <TabsContent value="requirements" className="mt-4">
                      <ul className="space-y-2">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-600">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                    
                    <TabsContent value="benefits" className="mt-4">
                      <ul className="space-y-2">
                        {job.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-600">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>

                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      Apply Now
                    </Button>
                    <Button variant="outline">
                      Save Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No positions match your current filters.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedDepartment('all')
                  setSelectedLocation('all')
                  setSelectedType('all')
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't See Your Perfect Role?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
            Submit Your Resume
          </Button>
        </div>
      </section>
    </div>
  )
}