import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProgramCard } from "./components/program-card"
import { QuantframeNav } from "./components/academy-nav"
import { MathBackground } from "./components/math-background"
import { LearningExperience } from "./components/learning-experience"
import { RoadmapClean } from "./components/roadmap-clean"
import { ProjectsShowcase } from "./components/projects-showcase"
import { Github, Linkedin, Mail, Instagram } from "lucide-react"


// Programs data - easily expandable
// Using icon names as strings to avoid passing component functions to client components
const programs = [
  {
    iconName: "TrendingUp",
    title: "Math for Quants",
    description:
      "Build the mathematical foundation every quant relies on. Master calculus, linear algebra, probability, and optimization through real finance applications.",
    level: "Beginner-Intermediate",
    duration: "16 weeks",
    topics: [
      "Calculus",
      "Linear Algebra",
      "Probability",
      "Statistics",
      "Optimization"
    ],
    color: "from-phthalo-500 to-phthalo-700",
    available: true,
    slug: "math-for-quant"
  },

  {
    iconName: "Code",
    title: "Python for Quants",
    description: "Build production-grade trading systems, backtest strategies, and manipulate financial data at scale.",
    level: "Intermediate",
    duration: "10 weeks",
    topics: ["NumPy & Pandas", "Backtesting", "API Integration"],
    color: "from-blue-500 to-blue-700",
    available: false,
    slug: null
  },
  {
    iconName: "Zap",
    title: "Machine Learning for Finance",
    description: "Apply modern ML techniques to alpha generation, regime detection, and risk management.",
    level: "Advanced",
    duration: "14 weeks",
    topics: ["Feature Engineering", "Time Series ML", "Deep Learning"],
    color: "from-purple-500 to-purple-700",
    available: false,
    slug: null
  }
]

export default function quantframePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white overflow-hidden">
      {/* Animated Math Background */}
      <MathBackground />
      
      {/* Navigation */}
      <QuantframeNav />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-0">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-phthalo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-phthalo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-phthalo-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container relative z-10 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-block">
              <div className="relative px-4 py-2 text-sm font-medium rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="relative z-10 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  QuantFrame
                </span>
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-phthalo-500/20 to-phthalo-700/20 animate-pulse"></span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 via-phthalo-500 to-phthalo-600">
                Break into Quant.
              </span>
            </h1>

            {/* Subheadline - Made smaller on mobile */}
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-zinc-300 max-w-4xl mx-auto leading-relaxed">
              Learn the math, code, and mindset that top quant firms look for.
            </p>

            <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
              No fluff. No shortcuts. Just mastery.
            </p>

            {/* CTA Buttons - Reduced spacing on mobile */}
            <div className="flex flex-wrap gap-4 pt-4 sm:pt-8 justify-center">
              {/* Registration temporarily disabled */}
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 bg-transparent text-lg px-8 py-6"
                >
                  Back to Portfolio
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-phthalo-400">3</div>
                <div className="text-sm text-zinc-500">Programs</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-phthalo-400">100+</div>
                <div className="text-sm text-zinc-500">Hours of Content</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-phthalo-400">Real</div>
                <div className="text-sm text-zinc-500">Industry Projects</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center items-start p-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Projects Showcase Section */}
      <ProjectsShowcase />

      {/* Programs Section */}
      <section className="py-32 relative">
        <div className="container relative z-10 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
                  Master the Fundamentals
                </span>
              </h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Comprehensive programs designed to take you from theory to production
              </p>
            </div>

            {/* Program Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program, index) => (
                <ProgramCard key={index} {...program} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Learning Experience Section */}
      <LearningExperience />

      {/* Roadmap Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-phthalo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-phthalo-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        <div className="container relative z-10 px-4 sm:px-6">
          <RoadmapClean />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 relative">
        <div className="container relative z-10 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
                Ready to level up?
              </span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              We're currently in private beta. Enrollment will open soon for the Quant Math program and your path toward professional-grade quantitative skills.
            </p>
            {/* Registration temporarily disabled */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12">
        <div className="container px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left: Brand - centered on mobile, left-aligned on desktop */}
          <div className="flex-1 text-center md:text-left">
            <Link href="/quantframe/dashboard" className="font-bold text-xl inline-flex items-baseline">
              <span className="relative inline-block text-phthalo-500">
                Quant
              </span>
              <span className="text-white">Frame</span>
            </Link>
            <p className="text-sm text-zinc-500 mt-2">
              © {new Date().getFullYear()} Antonije Mirkovic. All rights reserved.
            </p>
          </div>

          {/* Middle: Social Media Icons */}
          <div className="flex gap-4 items-center">
            <Link href="https://github.com/mirkovicdev" target="_blank" rel="noopener noreferrer">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
            <Link href="https://www.linkedin.com/in/amirkovic" target="_blank" rel="noopener noreferrer">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </Link>
            <Link href="https://www.instagram.com/mirkovicdev/" target="_blank" rel="noopener noreferrer">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
            </Link>
            <Link href="https://www.tiktok.com/@mirkovicdev" target="_blank" rel="noopener noreferrer">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                {/* TikTok icon using SVG since lucide-react doesn't have it */}
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span className="sr-only">TikTok</span>
              </Button>
            </Link>
            <Link href="mailto:contact@mirkovic.dev">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Button>
            </Link>
          </div>

          {/* Right: Navigation Links */}
          <div className="flex gap-4 items-center flex-1 justify-center md:justify-end">
            <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
              Portfolio
            </Link>
            {/* Registration temporarily disabled */}
          </div>
        </div>
      </footer>
    </div>
  )
}