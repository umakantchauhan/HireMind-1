import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Users, UserCheck } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">H</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Hiremind</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            AI-Powered Interview Automation
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Transform Your
            <span className="text-primary block">Hiring Process</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Advanced AI-powered interview automation platform designed to modernize 
            and streamline the technical hiring process.
          </p>

          {/* Sign In Options */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link href="/recruiter">
              <Button 
                size="lg" 
                className="w-full h-16 text-lg font-semibold group"
              >
                <Users className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Sign in as Recruiter
              </Button>
            </Link>
            
            <Link href="/candidate">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full h-16 text-lg font-semibold group"
              >
                <UserCheck className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Sign in as Candidate
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Screening</h3>
              <p className="text-muted-foreground">
                AI-powered candidate screening and assessment
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Automated Interviews</h3>
              <p className="text-muted-foreground">
                Conduct technical interviews with AI assistance
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-lg">⚡</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-muted-foreground">
                Comprehensive insights and performance metrics
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 