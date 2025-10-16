import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { text, type = 'general' } = await request.json()
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      )
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Create prompt for sentiment analysis
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
      
      Guidelines:
      - Score: -100 (extremely negative) to 100 (extremely positive)
      - Magnitude: 0 (neutral) to 10 (extremely strong sentiment)
      - Confidence: 0 (low confidence) to 1 (high confidence)
      - Identify cryptocurrency assets mentioned (BTC, ETH, etc.)
      - Assess market impact potential
      - Evaluate risk level based on language used
    `

    // Get sentiment analysis from ZAI
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

    // Extract the response
    const responseText = completion.choices[0]?.message?.content || ''
    
    // Parse JSON from response (handle potential formatting issues)
    let sentimentData
    try {
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        sentimentData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse sentiment response:', parseError)
      return NextResponse.json(
        { error: 'Failed to analyze sentiment', details: responseText },
        { status: 500 }
      )
    }

    // Validate and sanitize the response
    const validatedData = {
      sentiment: {
        classification: sentimentData.sentiment?.classification || 'neutral',
        score: Math.max(-100, Math.min(100, Number(sentimentData.sentiment?.score) || 0)),
        magnitude: Math.max(0, Math.min(10, Number(sentimentData.sentiment?.magnitude) || 0)),
        confidence: Math.max(0, Math.min(1, Number(sentimentData.sentiment?.confidence) || 0.5))
      },
      keywords: Array.isArray(sentimentData.keywords) ? sentimentData.keywords : [],
      assets: Array.isArray(sentimentData.assets) ? sentimentData.assets : [],
      topics: Array.isArray(sentimentData.topics) ? sentimentData.topics : [],
      emotional_tone: sentimentData.emotional_tone || 'neutral',
      risk_level: sentimentData.risk_level || 'medium',
      market_impact: sentimentData.market_impact || 'medium',
      processed_at: new Date().toISOString(),
      text_length: text.length,
      type
    }

    // Log the analysis for monitoring
    console.log('Sentiment analysis completed:', {
      text: text.substring(0, 100) + '...',
      classification: validatedData.sentiment.classification,
      score: validatedData.sentiment.score,
      assets: validatedData.assets
    })

    return NextResponse.json(validatedData)
  } catch (error) {
    console.error('Sentiment analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze sentiment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Sentiment Analysis API',
    version: '1.0.0',
    endpoints: {
      'POST /api/sentiment-analysis': 'Analyze sentiment of text content',
    },
    usage: 'POST with { text: "content to analyze", type?: "general|news|social" }'
  })
}