// app/academy/programs/page.tsx
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { TrendingUp, Code, Zap, ArrowRight } from 'lucide-react'

// Static programs data - matches /academy page style
const programs = [
  {
    iconName: 'TrendingUp',
    title: 'Math for Quants',
    description:
      'Build the mathematical foundation every quant relies on. Master calculus, linear algebra, probability, and optimization through real finance applications.',
    level: 'Beginner-Intermediate',
    duration: '16 weeks',
    topics: [
      'Calculus',
      'Linear Algebra',
      'Probability',
      'Statistics',
      'Optimization'
    ],
    color: 'from-phthalo-500 to-phthalo-700',
    available: true,
    slug: 'math-for-quant'
  },
  {
    iconName: 'Code',
    title: 'Python for Quants',
    description: 'Build production-grade trading systems, backtest strategies, and manipulate financial data at scale.',
    level: 'Intermediate',
    duration: '10 weeks',
    topics: ['NumPy & Pandas', 'Backtesting', 'API Integration'],
    color: 'from-blue-500 to-blue-700',
    available: false,
    slug: null
  },
  {
    iconName: 'Zap',
    title: 'Machine Learning for Finance',
    description: 'Apply modern ML techniques to alpha generation, regime detection, and risk management.',
    level: 'Advanced',
    duration: '14 weeks',
    topics: ['Feature Engineering', 'Time Series ML', 'Deep Learning'],
    color: 'from-purple-500 to-purple-700',
    available: false,
    slug: null
  }
]

const iconMap = {
  TrendingUp,
  Code,
  Zap,
}

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-black border-b border-zinc-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-phthalo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-phthalo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
            Master the Fundamentals
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl">
            Three comprehensive programs designed to take you from theory to production
          </p>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => {
            const Icon = iconMap[program.iconName as keyof typeof iconMap] || Code
            const CardWrapper = program.available ? Link : 'div'
            const wrapperProps = program.available && program.slug
              ? { href: `/academy/programs/${program.slug}` }
              : {}

            return (
              <CardWrapper key={index} {...wrapperProps}>
                <div className={`group relative h-full ${program.available ? 'cursor-pointer' : 'cursor-default'}`}>
                  {/* Hover glow effect - only for available programs */}
                  {program.available && (
                    <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${program.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`}></div>
                  )}

                  {/* Card */}
                  <div className={`relative h-full p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                    program.available
                      ? 'bg-zinc-900/50 border-zinc-800 group-hover:border-zinc-700'
                      : 'bg-zinc-900/30 border-zinc-800/50 opacity-60'
                  }`}>
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                      program.available
                        ? `bg-gradient-to-r ${program.color}`
                        : 'bg-zinc-800'
                    }`}>
                      <Icon className={`w-7 h-7 ${program.available ? 'text-white' : 'text-zinc-600'}`} />
                    </div>

                    {/* Title */}
                    <h3 className={`text-2xl font-bold mb-3 ${program.available ? 'text-white' : 'text-zinc-500'}`}>
                      {program.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="flex gap-2 mb-4">
                      <Badge variant="secondary" className={`border-0 ${
                        program.available
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'bg-zinc-800/50 text-zinc-500'
                      }`}>
                        {program.level}
                      </Badge>
                      <Badge variant="secondary" className={`border-0 ${
                        program.available
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'bg-zinc-800/50 text-zinc-500'
                      }`}>
                        {program.duration}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className={`mb-6 leading-relaxed ${program.available ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {program.description}
                    </p>

                    {/* Topics */}
                    <div className="space-y-2">
                      <div className={`text-sm font-medium ${program.available ? 'text-zinc-500' : 'text-zinc-600'}`}>
                        Key Topics:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {program.topics.map((topic, topicIndex) => (
                          <span
                            key={topicIndex}
                            className={`text-xs px-3 py-1 rounded-full border ${
                              program.available
                                ? 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50'
                                : 'bg-zinc-800/30 text-zinc-600 border-zinc-700/30'
                            }`}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer - Available or Coming Soon */}
                    <div className="mt-6 pt-6 border-t border-zinc-800">
                      {program.available ? (
                        <div className="flex items-center justify-between text-phthalo-400 group-hover:text-phthalo-300 transition-colors">
                          <span className="text-sm font-medium">Start Learning</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 text-sm text-zinc-600">
                          <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                          Coming Soon
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardWrapper>
            )
          })}
        </div>
      </div>
    </div>
  )
}
