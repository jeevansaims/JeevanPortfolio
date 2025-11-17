"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Code, Zap, ArrowRight, type LucideIcon } from "lucide-react"

interface ProgramCardProps {
  iconName: string
  title: string
  description: string
  level: string
  duration: string
  topics: string[]
  color: string
  available?: boolean
  slug?: string | null
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Code,
  Zap,
}

export function ProgramCard({
  iconName,
  title,
  description,
  level,
  duration,
  topics,
  color,
  available = false,
  slug = null
}: ProgramCardProps) {
  const Icon = iconMap[iconName] || Code
  const CardWrapper = available && slug ? Link : 'div'
  const wrapperProps = available && slug ? { href: `/quantframe/programs/${slug}` } : {}

  return (
    <CardWrapper {...wrapperProps}>
      <div className={`group relative h-full ${available ? 'cursor-pointer' : 'cursor-default'}`}>
        {/* Card */}
        <div className="relative h-full p-8 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 group-hover:border-zinc-700 transition-all duration-300">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center mb-6`}>
            <Icon className="w-7 h-7 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold mb-3 text-white">
            {title}
          </h3>

          {/* Meta Info */}
          <div className="flex gap-2 mb-4">
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-0">
              {level}
            </Badge>
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-0">
              {duration}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-zinc-400 mb-6 leading-relaxed">
            {description}
          </p>

          {/* Topics */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-zinc-500">
              Key Topics:
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 rounded-full bg-zinc-800/50 text-zinc-400 border border-zinc-700/50"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Footer - Available or Coming Soon */}
          <div className="mt-6 pt-6 border-t border-zinc-800">
            {available ? (
              <div className="flex items-center justify-between text-phthalo-400 group-hover:text-phthalo-300 transition-colors">
                <span className="text-sm font-medium">Start Learning</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 text-sm text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-phthalo-400 animate-pulse"></div>
                Coming Soon
              </div>
            )}
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}