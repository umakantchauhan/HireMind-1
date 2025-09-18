"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload, FileText, Briefcase, File, X } from 'lucide-react'

// Zod schema for form validation
const resumeUploadSchema = z.object({
  jobRole: z.string().optional(),
  jobDescription: z.string().optional(),
  resumeFile: z
    .any()
    .refine((file) => file && typeof file === 'object' && 'name' in file && 'size' in file && 'type' in file, {
      message: 'Please select a file',
    })
    .refine((file) => file && file.size <= 10 * 1024 * 1024, {
      message: 'File size must be less than 10MB',
    })
    .refine((file) => file && file.type === 'application/pdf', {
      message: 'Only PDF files are allowed',
    }),
})

type ResumeUploadForm = z.infer<typeof resumeUploadSchema>

interface AnalysisResult {
  score: number
  atsScore: number
  toneScore: number
  contentScore: number
  structureScore: number
  skillsScore: number
  toneDetails: {
    checks: string[]
    warnings: string[]
  }
  contentDetails: {
    checks: string[]
    warnings: string[]
  }
  structureDetails: {
    checks: string[]
    warnings: string[]
  }
  skillsDetails: {
    checks: string[]
    warnings: string[]
  }
}

interface AnalysisRequest {
  resumeFile: File
  jobRole?: string
  jobDescription?: string
}

// API function for resume analysis
const analyzeResume = async (data: AnalysisRequest): Promise<AnalysisResult> => {
  const formData = new FormData()
  formData.append('resumeFile', data.resumeFile)
  if (data.jobRole) {
    formData.append('jobRole', data.jobRole)
  }
  if (data.jobDescription) {
    formData.append('jobDescription', data.jobDescription)
  }

  console.log('Sending request to API with file:', data.resumeFile.name)

  const response = await fetch('/api/ats/analyze', {
    method: 'POST',
    body: formData,
  })

  console.log('Response status:', response.status)
  console.log('Response headers:', Object.fromEntries(response.headers.entries()))

  if (!response.ok) {
    const errorText = await response.text()
    console.error('API Error Response:', errorText)
    
    let errorData
    try {
      errorData = JSON.parse(errorText)
    } catch {
      errorData = { error: errorText }
    }
    
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
  }

  const result = await response.json()
  console.log('API Success Response:', result)

  if (!result.success || !result.analysis) {
    throw new Error('Invalid response from server')
  }

  return result.analysis
}

// Helper function to get color based on score
const getScoreColor = (score: number) => {
  if (score >= 75) return '#10b981' // green
  if (score >= 50) return '#f59e0b' // yellow
  return '#ef4444' // red
}

// Helper function to get gradient colors based on score
const getScoreGradient = (score: number) => {
  if (score >= 75) return ['#10b981', '#059669'] // green gradient
  if (score >= 50) return ['#f59e0b', '#d97706'] // yellow gradient
  return ['#ef4444', '#dc2626'] // red gradient
}

export default function ATSResumeAnalyzer() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState<string>('')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ResumeUploadForm>({
    resolver: zodResolver(resumeUploadSchema),
  })

  const selectedFile = watch('resumeFile')

  // TanStack Query mutation
  const analysisMutation = useMutation({
    mutationFn: analyzeResume,
    onSuccess: () => {
      setIsDialogOpen(false)
      reset()
      setSelectedFileName('')
    },
  })

  // Toggle accordion section
  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName)
      } else {
        newSet.add(sectionName)
      }
      return newSet
    })
  }

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check if it's a PDF file
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file only.')
        event.target.value = ''
        setSelectedFileName('')
        setValue('resumeFile', undefined as any)
        return
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB.')
        event.target.value = ''
        setSelectedFileName('')
        setValue('resumeFile', undefined as any)
        return
      }

      setSelectedFileName(file.name)
      setValue('resumeFile', file)
    }
  }

  // Clear selected file
  const clearSelectedFile = () => {
    setSelectedFileName('')
    setValue('resumeFile', undefined as any)
    // Reset the file input
    const fileInput = document.getElementById('resumeFile') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const onSubmit = async (data: ResumeUploadForm) => {
    analysisMutation.mutate({
      resumeFile: data.resumeFile,
      jobRole: data.jobRole,
      jobDescription: data.jobDescription,
    })
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    reset()
    setSelectedFileName('')
    analysisMutation.reset()
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          ATS Resume Analyzer
        </h1>
        <p className="text-muted-foreground">
          Optimize your resume for Applicant Tracking Systems
        </p>
      </div>

      {/* Centered Card */}
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>ATS Resume Analyzer</CardTitle>
            <CardDescription>
              Upload your resume to analyze its ATS compatibility and get optimization suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <p className="text-lg font-medium mb-2">Upload Your Resume</p>
                <p className="text-sm mb-6">
                  Get detailed analysis and optimization suggestions for your resume
                </p>
                
                {/* Upload Button */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Your Resume
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Resume Analysis</DialogTitle>
                      <DialogDescription>
                        Upload your resume and optionally provide job details for targeted analysis
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      {/* Job Role */}
                      <div className="space-y-2">
                        <Label htmlFor="jobRole">Job Role (Optional)</Label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="jobRole"
                            placeholder="e.g., Senior Software Engineer"
                            className="pl-10"
                            {...register('jobRole')}
                          />
                        </div>
                        {errors.jobRole && (
                          <p className="text-sm text-red-600">{errors.jobRole.message?.toString()}</p>
                        )}
                      </div>

                      {/* Job Description */}
                      <div className="space-y-2">
                        <Label htmlFor="jobDescription">Job Description (Optional)</Label>
                        <Textarea
                          id="jobDescription"
                          placeholder="Paste the job description here for targeted analysis..."
                          className="min-h-[100px]"
                          {...register('jobDescription')}
                        />
                        {errors.jobDescription && (
                          <p className="text-sm text-red-600">{errors.jobDescription.message?.toString()}</p>
                        )}
                      </div>

                      {/* Resume Upload */}
                      <div className="space-y-2">
                        <Label htmlFor="resumeFile">Upload Resume *</Label>
                        <div className="relative">
                          <File className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="resumeFile"
                            type="file"
                            accept=".pdf"
                            className="pl-10 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground hover:file:bg-accent"
                            onChange={handleFileChange}
                          />
                        </div>
                        
                        {/* Selected File Display */}
                        {selectedFileName && (
                          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <div className="flex items-center space-x-2">
                              <File className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">{selectedFileName}</span>
                              {selectedFile && (
                                <span className="text-xs text-muted-foreground">
                                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={clearSelectedFile}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        
                        {errors.resumeFile && (
                          <p className="text-sm text-red-600">{errors.resumeFile.message?.toString()}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Only PDF files accepted, max 10MB
                        </p>
                      </div>

                      {/* Error Display */}
                      {analysisMutation.error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm text-red-600">{analysisMutation.error.message}</p>
                        </div>
                      )}

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleDialogClose}
                          disabled={analysisMutation.isPending}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={analysisMutation.isPending || !selectedFileName}
                          className="flex items-center gap-2"
                        >
                          {analysisMutation.isPending ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4" />
                              Analyze Resume
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Results - Optimistic UI */}
      {(analysisMutation.data || analysisMutation.isPending) && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Resume Review</CardTitle>
              <CardDescription>
                Your resume analysis and optimization suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Overall Scores with Circular Progress */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Overall Resume Score */}
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4">
                    <CircularProgressbar
                      value={analysisMutation.data?.score || 0}
                      text={`${analysisMutation.data?.score || 0}%`}
                      styles={buildStyles({
                        pathColor: getScoreColor(analysisMutation.data?.score || 0),
                        textColor: getScoreColor(analysisMutation.data?.score || 0),
                        trailColor: '#e5e7eb',
                        strokeLinecap: 'round',
                      })}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Your Resume Score</h3>
                  <p className="text-sm text-muted-foreground">
                    {analysisMutation.isPending ? 'Analyzing...' : 'Overall resume quality'}
                  </p>
                </div>
                
                {/* ATS Score */}
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4">
                    <CircularProgressbar
                      value={analysisMutation.data?.atsScore || 0}
                      text={`${analysisMutation.data?.atsScore || 0}%`}
                      styles={buildStyles({
                        pathColor: getScoreColor(analysisMutation.data?.atsScore || 0),
                        textColor: getScoreColor(analysisMutation.data?.atsScore || 0),
                        trailColor: '#e5e7eb',
                        strokeLinecap: 'round',
                      })}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">ATS Score</h3>
                  <p className="text-sm text-muted-foreground">
                    {analysisMutation.isPending ? 'Analyzing...' : 'ATS compatibility'}
                  </p>
                </div>
              </div>

              {/* Section Scores as Accordions */}
              {analysisMutation.data && (
                <div className="space-y-4">
                  {Object.entries({
                    'Tone & Style': { score: analysisMutation.data.toneScore, details: analysisMutation.data.toneDetails },
                    'Content': { score: analysisMutation.data.contentScore, details: analysisMutation.data.contentDetails },
                    'Structure': { score: analysisMutation.data.structureScore, details: analysisMutation.data.structureDetails },
                    'Skills': { score: analysisMutation.data.skillsScore, details: analysisMutation.data.skillsDetails },
                  }).map(([category, { score, details }]) => (
                    <div key={category} className="border rounded-lg overflow-hidden">
                      {/* Accordion Header */}
                      <div 
                        className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => toggleSection(category)}
                      >
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-foreground">{category}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Score:</span>
                            <span className={`text-lg font-bold ${
                              score >= 75 ? 'text-green-600' : 
                              score >= 50 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {score}/100
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            score >= 75 ? 'bg-green-500' : 
                            score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <svg 
                            className={`w-5 h-5 text-muted-foreground transition-transform ${
                              expandedSections.has(category) ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {/* Accordion Content */}
                      {expandedSections.has(category) && (
                        <div className="p-4 border-t bg-card">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Checks (Positives) */}
                            <div>
                              <h4 className="text-sm font-semibold text-green-600 mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Strengths
                              </h4>
                              <ul className="space-y-2">
                                {details.checks.map((check, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span className="text-sm text-muted-foreground">{check}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Warnings (Negatives) */}
                            <div>
                              <h4 className="text-sm font-semibold text-red-600 mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Areas for Improvement
                              </h4>
                              <ul className="space-y-2">
                                {details.warnings.map((warning, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <span className="text-red-500 mt-1">•</span>
                                    <span className="text-sm text-muted-foreground">{warning}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Summary */}
              {analysisMutation.data && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {analysisMutation.data.score >= 75 
                      ? "Excellent resume! Your document is well-optimized for ATS systems and presents your qualifications effectively."
                      : analysisMutation.data.score >= 50
                      ? "Good resume with room for improvement. Focus on the areas highlighted above to enhance your ATS compatibility."
                      : "Your resume needs significant improvements. Consider the suggestions above to better align with ATS requirements and job market standards."
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}