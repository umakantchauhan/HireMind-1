"use client"

import { Button } from '@/components/ui/button'
import { 
  Search, 
  MapPin, 
  Building, 
  DollarSign, 
  Calendar, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Briefcase,
  Star,
  Eye,
  Send
} from 'lucide-react'
import { useState } from 'react'
import dayjs from 'dayjs'

export default function CandidateJobs() {
  const [searchLocation, setSearchLocation] = useState('')
  const [searchSkills, setSearchSkills] = useState('')
  const [expandedJobs, setExpandedJobs] = useState<Set<number>>(new Set())

  // Available skills for filter
  const availableSkills = [
    'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
    'Python', 'Java', 'C#', 'C++', 'Go', 'Rust', 'PHP', 'Ruby',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST API',
    'Machine Learning', 'Data Science', 'DevOps', 'CI/CD', 'Git',
    'Agile', 'Scrum', 'Product Management', 'UI/UX Design'
  ]

  // Dummy job data
  const jobs = [
    {
      id: 1,
      role: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      stipend: "$120,000 - $150,000",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      description: "We're looking for a Senior Frontend Developer to join our growing team. You'll be responsible for building and maintaining our web applications, working closely with designers and backend developers to create seamless user experiences. The ideal candidate has 5+ years of experience with modern JavaScript frameworks and a passion for clean, maintainable code.",
      expiryDate: "2024-02-15",
      postedDate: "2024-01-10",
      applications: 24,
      matchScore: 92
    },
    {
      id: 2,
      role: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Remote",
      stipend: "$100,000 - $130,000",
      skills: ["Node.js", "React", "MongoDB", "AWS"],
      description: "Join our fast-growing startup as a Full Stack Engineer. You'll work on both frontend and backend development, helping us scale our platform and add new features. We're looking for someone who can work independently, learn quickly, and contribute to our engineering culture.",
      expiryDate: "2024-01-30",
      postedDate: "2024-01-08",
      applications: 18,
      matchScore: 88
    },
    {
      id: 3,
      role: "DevOps Engineer",
      company: "CloudTech Solutions",
      location: "Austin, TX",
      stipend: "$140,000 - $180,000",
      skills: ["Docker", "Kubernetes", "AWS", "Terraform"],
      description: "We're seeking a DevOps Engineer to help us build and maintain our cloud infrastructure. You'll be responsible for CI/CD pipelines, monitoring, and ensuring our systems are scalable and reliable. Experience with cloud platforms and infrastructure as code is required.",
      expiryDate: "2024-01-20",
      postedDate: "2024-01-05",
      applications: 8,
      matchScore: 95
    },
    {
      id: 4,
      role: "Product Manager",
      company: "SaaS Company",
      location: "New York, NY",
      stipend: "$130,000 - $160,000",
      skills: ["Product Strategy", "Agile", "Data Analysis", "User Research"],
      description: "Lead product development for our SaaS platform. You'll work with cross-functional teams to define product strategy, prioritize features, and ensure successful product launches. Strong analytical skills and experience with B2B SaaS products preferred.",
      expiryDate: "2024-02-28",
      postedDate: "2024-01-12",
      applications: 12,
      matchScore: 87
    },
    {
      id: 5,
      role: "UI/UX Designer",
      company: "Design Studio",
      location: "Remote",
      stipend: "$90,000 - $120,000",
      skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Testing"],
      description: "Create beautiful and intuitive user experiences for our clients. You'll work on web and mobile applications, conducting user research, creating wireframes and prototypes, and collaborating with developers to bring designs to life.",
      expiryDate: "2024-01-10",
      postedDate: "2024-01-03",
      applications: 32,
      matchScore: 84
    },
    {
      id: 6,
      role: "Data Scientist",
      company: "AI Startup",
      location: "Boston, MA",
      stipend: "$150,000 - $200,000",
      skills: ["Python", "Machine Learning", "SQL", "Statistics"],
      description: "Join our AI team to develop machine learning models and data-driven solutions. You'll work with large datasets, build predictive models, and help drive business decisions through data analysis. PhD in Computer Science or related field preferred.",
      expiryDate: "2024-02-10",
      postedDate: "2024-01-15",
      applications: 15,
      matchScore: 96
    }
  ]

  // Filter jobs based on search criteria
  const filteredJobs = jobs.filter(job => {
    const matchesLocation = !searchLocation || 
      job.location.toLowerCase().includes(searchLocation.toLowerCase())
    const matchesSkills = !searchSkills || 
      job.skills.some(skill => 
        skill.toLowerCase().includes(searchSkills.toLowerCase())
      )
    return matchesLocation && matchesSkills
  })

  const toggleJobExpansion = (jobId: number) => {
    setExpandedJobs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }

  const handleApply = (jobId: number) => {
    console.log('Applying to job:', jobId)
    // Navigate to application form or open modal
  }

  const handleViewDetails = (jobId: number) => {
    console.log('Viewing job details:', jobId)
    // Navigate to detailed job page
  }

  const formatDate = (dateString: string) => dayjs(dateString).format("DD/MM/YYYY")

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Job Listings
        </h1>
        <p className="text-muted-foreground">
          Find your next opportunity from our curated job listings
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        {/* Location Search */}
        <div className="relative flex-1 max-w-md">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="pl-10 pr-4 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full border border-input"
          />
        </div>

        {/* Skills Search */}
        <div className="relative flex-1 max-w-md">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by skills..."
            value={searchSkills}
            onChange={(e) => setSearchSkills(e.target.value)}
            className="pl-10 pr-4 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full border border-input"
          />
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredJobs.length} jobs found
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-card rounded-lg border hover:shadow-md transition-shadow">
            {/* Job Header */}
            <div className="p-6 border-b">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{job.role}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.stipend}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{job.applications} applications</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className={`font-semibold ${getMatchScoreColor(job.matchScore)}`}>
                    {job.matchScore}%
                  </span>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Job Description */}
            <div className="p-6">
              <div className="mb-4">
                <div className={`text-sm text-muted-foreground ${!expandedJobs.has(job.id) ? 'line-clamp-3' : ''}`}>
                  {job.description}
                </div>
                <button
                  onClick={() => toggleJobExpansion(job.id)}
                  className="text-primary text-sm font-medium hover:underline mt-2 flex items-center space-x-1"
                >
                  {expandedJobs.has(job.id) ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span>Show less</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span>Show more</span>
                    </>
                  )}
                </button>
              </div>

              {/* Job Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Expires: {formatDate(job.expiryDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Posted: {formatDate(job.postedDate)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(job.id)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApply(job.id)}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No jobs found</p>
            <p className="text-sm">
              Try adjusting your search criteria or check back later for new opportunities
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 