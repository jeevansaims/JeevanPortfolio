'use client'

import { useEffect, useState } from 'react'

interface ProgressBarProps {
  solved: number
  total: number
  category: string
  difficulty: string
}

export function ProgressBar({ solved, total, category, difficulty }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0
  const [prevSolved, setPrevSolved] = useState(solved)
  const [justIncreased, setJustIncreased] = useState(false)
  
  // Detect when solved increases and trigger celebration
  useEffect(() => {
    if (solved > prevSolved) {
      setJustIncreased(true)
      setTimeout(() => setJustIncreased(false), 800)
    }
    setPrevSolved(solved)
  }, [solved])
  
  // Safety check
  if (total === 0 || total === undefined) {
    return null
  }

  return (
    <div className={`mb-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg backdrop-blur-sm transition-all duration-300 ${justIncreased ? 'scale-[1.02] border-phthalo-500/50' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-zinc-400">
          Progress: {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')} • {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
        <span className={`text-sm font-semibold transition-all duration-300 ${justIncreased ? 'text-phthalo-300 scale-110' : 'text-phthalo-400'}`}>
          {solved}/{total} solved ({percentage}%)
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
        {/* Progress fill */}
        <div 
          className="h-full bg-gradient-to-r from-phthalo-600 to-phthalo-500 rounded-full relative overflow-hidden"
          style={{ 
            width: `${percentage}%`,
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Sharp shine effect */}
          <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-slide"></div>
        </div>
      </div>
    </div>
  )
}