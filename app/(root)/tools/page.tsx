"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Sparkles, FileText, Code, MessageSquare, Bug, User, Zap, ArrowRight, Star, Rocket } from "lucide-react"
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  SignUpButton, 
  UserButton 
} from "@clerk/nextjs"
import { ModeToggle } from "@/components/mode-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const tools = [
  {
    id: "blog-generator",
    title: "Blog Generator",
    description: "Create engaging blog posts with AI-powered content generation",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    comingSoon: false
  },
  {
    id: "resume-generator",
    title: "Resume Generator",
    description: "Craft professional resumes tailored to your target roles",
    icon: User,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    comingSoon: false
  },
  {
    id: "code-assistant",
    title: "Code Assistant",
    description: "Write, debug, and optimize code with AI pair programming",
    icon: Code,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    comingSoon: false
  },
  {
    id: "ai-chat",
    title: "AI Chat Tool",
    description: "Intelligent conversations with advanced language models",
    icon: MessageSquare,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    comingSoon: false
  },
  {
    id: "explainer-bug-finder",
    title: "Explainer & Bug Finder",
    description: "Understand code and detect bugs with AI analysis",
    icon: Bug,
    color: "from-yellow-500 to-amber-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    comingSoon: false
  },
  {
    id: "ai-templates",
    title: "AI Templates",
    description: "Pre-built templates for various content types",
    icon: Zap,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    comingSoon: true
  }
]

export default function AIDashboard() {
  const router = useRouter()

  const handleToolClick = (toolId: string) => {
    if (toolId === "blog-generator") {
      router.push("/tools/blog-generator")
    } else if (toolId === "resume-generator") {
      router.push("/tools/resume-generator")
    } else if(toolId === "code-assistant") {
      router.push("/tools/code-assistant")
    }
    // Add routes for other tools
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
      {/* Navigation */}
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-r from-blue-600 to-purple-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AIStudio
          </span>
          <Badge variant="secondary" className="ml-2 hidden sm:flex">
            Beta
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <ModeToggle />
          
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium text-sm sm:text-base px-4 py-2 cursor-pointer">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-[#5a3fe0] transition-colors">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
   

        {/* Tools Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              AI Tools & Features
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose from our powerful suite of AI tools designed to boost your productivity and creativity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <Card 
                  key={tool.id}
                  className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-blue-200 dark:hover:border-blue-800 ${tool.bgColor}`}
                  onClick={() => !tool.comingSoon && handleToolClick(tool.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl bg-linear-to-r ${tool.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      {tool.comingSoon && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                          Soon
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant={tool.comingSoon ? "outline" : "default"}
                      className={`w-full ${
                        tool.comingSoon 
                          ? "cursor-not-allowed opacity-50" 
                          : "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      }`}
                      disabled={tool.comingSoon}
                    >
                      {tool.comingSoon ? "Coming Soon" : "Get Started"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>


    
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-r from-blue-600 to-purple-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AIStudio
            </span>
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            © 2024 AIStudio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}