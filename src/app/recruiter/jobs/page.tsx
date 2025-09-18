"use client"

import { useMemo, useReducer, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, Filter } from "lucide-react"
import dayjs from "dayjs"
import { JobTable } from "@/components/jobs/job-table"
import { JobPostingModal } from "@/components/job-posting-modal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreateJobForm } from "@/components/jobs/create-job-form"
import type { Job } from "@/components/jobs/types"

type Action =
  | { type: "add"; job: Job }
  | { type: "update"; job: Job }
  | { type: "delete"; id: number }

function jobsReducer(state: Job[], action: Action): Job[] {
  switch (action.type) {
    case "add":
      return [action.job, ...state]
    case "update":
      return state.map((j) => (j.id === action.job.id ? action.job : j))
    case "delete":
      return state.filter((j) => j.id !== action.id)
    default:
      return state
  }
}

const initialJobs: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    location: "San Francisco, CA",
    expiryDate: dayjs("2024-02-15").toISOString(),
    status: "Active",
    applications: 24,
    description: "Build and scale rich frontend experiences.",
    salaryRange: "$120,000 - $150,000",
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    skills: ["Node.js", "React", "MongoDB", "AWS"],
    location: "Remote",
    expiryDate: dayjs("2024-01-30").toISOString(),
    status: "Active",
    applications: 18,
    description: "Own features end-to-end across the stack.",
    salaryRange: "$100,000 - $130,000",
  },
]

export default function JobListings() {
  const [jobs, dispatch] = useReducer(jobsReducer, initialJobs)
  const [query, setQuery] = useState("")
  const [filterLocation, setFilterLocation] = useState("")
  const [filterSkill, setFilterSkill] = useState("")
  const [viewJob, setViewJob] = useState<Job | null>(null)
  const [editJob, setEditJob] = useState<Job | null>(null)

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase()
    const loc = filterLocation.trim().toLowerCase()
    const skill = filterSkill.trim().toLowerCase()
    return jobs.filter((job) => {
      const matchesTitle = !q || job.title.toLowerCase().includes(q)
      const matchesLocation = !loc || job.location.toLowerCase().includes(loc)
      const matchesSkill = !skill || job.skills.some((s) => s.toLowerCase().includes(skill))
      return matchesTitle && matchesLocation && matchesSkill
    })
  }, [jobs, query, filterLocation, filterSkill])

  function handleView(job: Job) {
    setViewJob(job)
  }
  function handleEdit(job: Job) {
    setEditJob(job)
  }
  function handleCopyUrl(job: Job) {
    const url = `${window.location.origin}/jobs/${job.id}`
    navigator.clipboard.writeText(url)
    alert("Job URL copied to clipboard")
  }
  function handleDelete(job: Job) {
    if (confirm("Are you sure you want to delete this job?")) {
      dispatch({ type: "delete", id: job.id })
    }
  }
  function handleCreate(newJob: Job) {
    dispatch({ type: "add", job: newJob })
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Job Listings</h1>
            <p className="text-muted-foreground">Manage your job postings and track applications</p>
          </div>
          <JobPostingModal onCreate={handleCreate} />
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jobs by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <JobTable jobs={filteredJobs} onView={handleView} onEdit={handleEdit} onCopyUrl={handleCopyUrl} onDelete={handleDelete} />

      {/* View Job Modal */}
      <Dialog open={!!viewJob} onOpenChange={(open) => !open && setViewJob(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewJob?.title}</DialogTitle>
            <DialogDescription>
              {viewJob?.company} • {viewJob?.location} • Expires {dayjs(viewJob?.expiryDate).format("DD/MM/YYYY")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {viewJob?.salaryRange && <p className="text-sm">Salary: {viewJob.salaryRange}</p>}
            <div className="flex flex-wrap gap-1">
              {viewJob?.skills.map((s) => (
                <span key={s} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {s}
                </span>
              ))}
            </div>
            {viewJob?.description && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewJob.description}</p>}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Job Modal */}
      <Dialog open={!!editJob} onOpenChange={(open) => !open && setEditJob(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>Update the fields and save your changes.</DialogDescription>
          </DialogHeader>
          {editJob && (
            <CreateJobForm
              initialValues={editJob}
              submitLabel="Save Changes"
              onSubmit={(updated) => {
                dispatch({ type: "update", job: updated })
                setEditJob(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}