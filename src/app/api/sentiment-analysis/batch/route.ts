import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { texts, type = 'general' } = await request.json()
    
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { error: 'Texts array is required and must not be empty' },
        { status: 400 }
      )
    }

    if (texts.length > 50) {
      return NextResponse.json(
        { error: 'Maximum 50 texts per batch request' },
        { status: 400 }
      )
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Process texts in batches to avoid overwhelming the API
    const batchSize = 10
    const results: any[] = []
    
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async (text, index) => {
        try {
          const sentimentPrompt = `
            Analyze the sentiment of the following text and provide a detailed analysis.
            
            Text: "${text}"
            
            Please provide the analysis in the following JSON format:
            {
              "sentiment": {
                "classification": "positive|negative|neutral",
                "score": -100 to 100,
                "magnitude": 0 to 10,
                "confidence": 0 to 1
              },
              "keywords": ["array", "of", "keywords"],
              "assets": ["array", "of", "mentioned", "crypto", "assets"],
              "topics": ["array", "of", "topics"],
              "emotional_tone": "string describing emotional tone",
              "risk_level": "low|medium|high",
              "market_impact": "low|medium|high"
            }
          `

          const completion = await zai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: 'You are an expert sentiment analysis AI specializing in cryptocurrency and financial markets. Provide accurate, detailed sentiment analysis with structured JSON output.'
              },
              {
                role: 'user',
                content: sentimentPrompt
              }
            ],
            temperature: 0.3,
            max_tokens: 1000
          })

          const responseText = completion.choices[0]?.message?.content || ''
          
          // Parse JSON from response
          const jsonMatch = responseText.match(/\{[\s\S]*\}/)
          let sentimentData
          
          if (jsonMatch) {
            sentimentData = JSON.parse(jsonMatch[0])
          }

          return {
            index: i + index,
            text: text.substring(0, 100) + '...',
            success: true,
            data: {
              sentiment: {
                classification: sentimentData?.sentiment?.classification || 'neutral',
                score: Math.max(-100, Math.min(100, Number(sentimentData?.sentiment?.score) || 0)),
                magnitude: Math.max(0, Math.min(10, Number(sentimentData?.sentiment?.magnitude) || 0)),
                confidence: Math.max(0, Math.min(1, Number(sentimentData?.sentiment?.confidence) || 0.5))
              },
              keywords: Array.isArray(sentimentData?.keywords) ? sentimentData.keywords : [],
              assets: Array.isArray(sentimentData?.assets) ? sentimentData.assets : [],
              topics: Array.isArray(sentimentData?.topics) ? sentimentData.topics : [],
              emotional_tone: sentimentData?.emotional_tone || 'neutral',
              risk_level: sentimentData?.risk_level || 'medium',
              market_impact: sentimentData?.market_impact || 'medium',
              processed_at: new Date().toISOString(),
              text_length: text.length,
              type
            }
          }
        } catch (error) {
          return {
            index: i + index,
            text: text.substring(0, 100) + '...',
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
    }

    // Calculate aggregate statistics
    const successfulResults = results.filter(r => r.success)
    const aggregateSentiment = {
      averageScore: successfulResults.reduce((sum, r) => sum + r.data.sentiment.score, 0) / successfulResults.length,
      positiveCount: successfulResults.filter(r => r.data.sentiment.classification === 'positive').length,
      negativeCount: successfulResults.filter(r => r.data.sentiment.classification === 'negative').length,
      neutralCount: successfulResults.filter(r => r.data.sentiment.classification === 'neutral').length,
      totalProcessed: results.length,
      successRate: (successfulResults.length / results.length) * 100
    }

    // Log batch analysis
    console.log('Batch sentiment analysis completed:', {
      totalTexts: texts.length,
      successful: successfulResults.length,
      averageScore: aggregateSentiment.averageScore,
      positiveCount: aggregateSentiment.positiveCount,
      negativeCount: aggregateSentiment.negativeCount
    })

    return NextResponse.json({
      results,
      aggregate: aggregateSentiment,
      processed_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('Batch sentiment analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze batch sentiment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Batch Sentiment Analysis API',
    version: '1.0.0',
    endpoints: {
      'POST /api/sentiment-analysis/batch': 'Analyze sentiment of multiple texts in batch',
    },
    usage: 'POST with { texts: ["text1", "text2", ...], type?: "general|news|social" }',
    limits: {
      max_texts_per_request: 50,
      processing_batch_size: 10
    }
  })
}