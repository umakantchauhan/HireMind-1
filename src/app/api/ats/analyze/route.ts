import { NextRequest, NextResponse } from 'next/server'
import pdf from 'pdf-parse'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // Parse the FormData
    const formData = await request.formData()
    const file = formData.get('resumeFile') as File
    const jobRole = formData.get('jobRole') as string
    const jobDescription = formData.get('jobDescription') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    console.log('Processing PDF file:', file.name, 'Size:', file.size)

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Parse PDF to text
    let pdfData
    try {
      pdfData = await pdf(buffer)
    } catch (pdfError) {
      console.error('PDF parsing error:', pdfError)
      return NextResponse.json(
        { error: 'Failed to parse PDF file' },
        { status: 400 }
      )
    }

    const resumeText = pdfData.text
    console.log('Extracted text length:', resumeText?.length || 0)

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF' },
        { status: 400 }
      )
    }

    // Prepare the prompt for Gemini
    let prompt = `Analyze this resume for job readiness. Give:
Overall Resume Score out of 100
ATS Score out of 100
Scores (out of 100) for: Tone & Style, Content, Structure, Skills
For each section, provide a mix of 2 or 3 checks (positives) and 2 or 3 warnings (negatives)
Return as structured JSON with the following format:
{
  "score": number,
  "atsScore": number,
  "toneScore": number,
  "contentScore": number,
  "structureScore": number,
  "skillsScore": number,
  "toneDetails": {
    "checks": ["positive1", "positive2"],
    "warnings": ["negative1", "negative2"]
  },
  "contentDetails": {
    "checks": ["positive1", "positive2"],
    "warnings": ["negative1", "negative2"]
  },
  "structureDetails": {
    "checks": ["positive1", "positive2"],
    "warnings": ["negative1", "negative2"]
  },
  "skillsDetails": {
    "checks": ["positive1", "positive2"],
    "warnings": ["negative1", "negative2"]
  }
}

Resume text:
${resumeText}`

    // Add job context if provided
    if (jobRole || jobDescription) {
      prompt += `\n\nJob Context:`
      if (jobRole) {
        prompt += `\nJob Role: ${jobRole}`
      }
      if (jobDescription) {
        prompt += `\nJob Description: ${jobDescription}`
      }
    }

    console.log('Sending request to Gemini API...')

    // Generate analysis using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const analysisText = response.text()

    console.log('Received response from Gemini:', analysisText.substring(0, 200) + '...')

    // Parse the JSON response
    let analysis
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError)
      console.error('Raw response:', analysisText)
      return NextResponse.json(
        { error: 'Failed to analyze resume - invalid response format' },
        { status: 500 }
      )
    }

    // Validate the analysis structure
    const requiredFields = [
      'score', 'atsScore', 'toneScore', 'contentScore', 
      'structureScore', 'skillsScore', 'toneDetails', 
      'contentDetails', 'structureDetails', 'skillsDetails'
    ]

    for (const field of requiredFields) {
      if (!(field in analysis)) {
        console.error(`Missing required field: ${field}`)
        return NextResponse.json(
          { error: `Invalid analysis response: missing ${field}` },
          { status: 500 }
        )
      }
    }

    console.log('Analysis completed successfully')

    // Return the structured analysis
    return NextResponse.json({
      success: true,
      analysis: {
        score: analysis.score,
        atsScore: analysis.atsScore,
        toneScore: analysis.toneScore,
        contentScore: analysis.contentScore,
        structureScore: analysis.structureScore,
        skillsScore: analysis.skillsScore,
        toneDetails: analysis.toneDetails,
        contentDetails: analysis.contentDetails,
        structureDetails: analysis.structureDetails,
        skillsDetails: analysis.skillsDetails,
      }
    })

  } catch (error) {
    console.error('ATS analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
} 