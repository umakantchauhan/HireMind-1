"use client"

import { Button } from '@/components/ui/button'
import { Search, Filter, Eye, CheckCircle, XCircle, Calendar, User, Building, Briefcase } from 'lucide-react'
import { useState } from 'react'

export default function JobApplications() {
  const [selectedJob, setSelectedJob] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Dummy data for jobs dropdown
  const jobs = [
    { id: 'all', title: 'All Jobs' },
    { id: '1', title: 'Senior Frontend Developer' },
    { id: '2', title: 'Full Stack Engineer' },
    { id: '3', title: 'DevOps Engineer' },
    { id: '4', title: 'Product Manager' },
    { id: '5', title: 'UI/UX Designer' }
  ]

  // Dummy applications data
  const applications = [
    {
      id: 1,
      company: "TechCorp Inc.",
      jobTitle: "Senior Frontend Developer",
      candidate: "Sarah Johnson",
      matchScore: 92,
      status: "Pending",
      appliedDate: "2024-01-15",
      jobId: "1"
    },
    {
      id: 2,
      company: "TechCorp Inc.",
      jobTitle: "Senior Frontend Developer",
      candidate: "Michael Chen",
      matchScore: 87,
      status: "Accepted",
      appliedDate: "2024-01-14",
      jobId: "1"
    },
    {
      id: 3,
      company: "StartupXYZ",
      jobTitle: "Full Stack Engineer",
      candidate: "Emily Rodriguez",
      matchScore: 95,
      status: "Pending",
      appliedDate: "2024-01-16",
      jobId: "2"
    },
    {
      id: 4,
      company: "StartupXYZ",
      jobTitle: "Full Stack Engineer",
      candidate: "David Kim",
      matchScore: 78,
      status: "Rejected",
      appliedDate: "2024-01-13",
      jobId: "2"
    },
    {
      id: 5,
      company: "CloudTech Solutions",
      jobTitle: "DevOps Engineer",
      candidate: "Alex Thompson",
      matchScore: 89,
      status: "Accepted",
      appliedDate: "2024-01-12",
      jobId: "3"
    },
    {
      id: 6,
      company: "SaaS Company",
      jobTitle: "Product Manager",
      candidate: "Lisa Wang",
      matchScore: 91,
      status: "Pending",
      appliedDate: "2024-01-17",
      jobId: "4"
    },
    {
      id: 7,
      company: "Design Studio",
      jobTitle: "UI/UX Designer",
      candidate: "James Wilson",
      matchScore: 84,
      status: "Rejected",
      appliedDate: "2024-01-11",
      jobId: "5"
    },
    {
      id: 8,
      company: "TechCorp Inc.",
      jobTitle: "Senior Frontend Developer",
      candidate: "Rachel Green",
      matchScore: 96,
      status: "Pending",
      appliedDate: "2024-01-18",
      jobId: "1"
    }
  ]

  // Filter applications based on selected job and search query
  const filteredApplications = applications.filter(app => {
    const matchesJob = selectedJob === 'all' || app.jobId === selectedJob
    const matchesSearch = app.candidate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesJob && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-700'
      case 'Rejected':
        return 'bg-red-100 text-red-700'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="h-4 w-4" />
      case 'Rejected':
        return <XCircle className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Consistent date formatting function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${month}/${day}/${year}`
  }

  const handleViewApplication = (applicationId: number) => {
    console.log('Viewing application:', applicationId)
    // Navigate to application details page
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Job Applications
        </h1>
        <p className="text-muted-foreground">
          Review and manage candidate applications
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        {/* Job Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-input"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by candidate name, job title, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full border border-input"
          />
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredApplications.length} applications found
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-sm">Company</th>
                <th className="text-left p-4 font-medium text-sm">Job Title</th>
                <th className="text-left p-4 font-medium text-sm">Candidate</th>
                <th className="text-left p-4 font-medium text-sm">Match Score</th>
                <th className="text-left p-4 font-medium text-sm">Status</th>
                <th className="text-left p-4 font-medium text-sm">Applied Date</th>
                <th className="text-left p-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application.id} className="border-b hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{application.company}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{application.jobTitle}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{application.candidate}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`font-semibold ${getMatchScoreColor(application.matchScore)}`}>
                      {application.matchScore}%
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(application.status)}
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDate(application.appliedDate)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewApplication(application.id)}
                      title="View Application"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredApplications.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No applications found</p>
              <p className="text-sm">
                Try adjusting your filters or search criteria
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 