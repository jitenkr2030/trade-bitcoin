import { useState, useCallback } from 'react'

interface SentimentResult {
  sentiment: {
    classification: 'positive' | 'negative' | 'neutral'
    score: number
    magnitude: number
    confidence: number
  }
  keywords: string[]
  assets: string[]
  topics: string[]
  emotional_tone: string
  risk_level: 'low' | 'medium' | 'high'
  market_impact: 'low' | 'medium' | 'high'
  processed_at: string
  text_length: number
  type: string
}

interface BatchSentimentResult {
  index: number
  text: string
  success: boolean
  data?: SentimentResult
  error?: string
}

interface BatchSentimentResponse {
  results: BatchSentimentResult[]
  aggregate: {
    averageScore: number
    positiveCount: number
    negativeCount: number
    neutralCount: number
    totalProcessed: number
    successRate: number
  }
  processed_at: string
}

export function useSentimentAnalysis() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<SentimentResult | null>(null)

  const analyzeSentiment = useCallback(async (
    text: string, 
    type: 'general' | 'news' | 'social' = 'general'
  ): Promise<SentimentResult> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/sentiment-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, type }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze sentiment')
      }

      const result: SentimentResult = await response.json()
      setLastResult(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const analyzeBatchSentiment = useCallback(async (
    texts: string[], 
    type: 'general' | 'news' | 'social' = 'general'
  ): Promise<BatchSentimentResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/sentiment-analysis/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texts, type }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze batch sentiment')
      }

      const result: BatchSentimentResponse = await response.json()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getSentimentColor = useCallback((classification: string) => {
    switch (classification) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      case 'neutral': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }, [])

  const getSentimentIcon = useCallback((classification: string) => {
    switch (classification) {
      case 'positive': return '📈'
      case 'negative': return '📉'
      case 'neutral': return '➖'
      default: return '❓'
    }
  }, [])

  const getRiskColor = useCallback((riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }, [])

  const getImpactColor = useCallback((impact: string) => {
    switch (impact) {
      case 'low': return 'text-blue-600'
      case 'medium': return 'text-orange-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }, [])

  return {
    isLoading,
    error,
    lastResult,
    analyzeSentiment,
    analyzeBatchSentiment,
    getSentimentColor,
    getSentimentIcon,
    getRiskColor,
    getImpactColor,
  }
}