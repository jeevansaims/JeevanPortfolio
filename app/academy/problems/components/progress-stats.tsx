// app/academy/problems/components/progress-stats.tsx
'use client'

import { useEffect, useState } from 'react'
import { Trophy } from 'lucide-react'

interface ProgressStatsProps {
  mathSolved: number
  mathTotal: number
  codingSolved: number
  codingTotal: number
}

export function ProgressStats({ mathSolved, mathTotal, codingSolved, codingTotal }: ProgressStatsProps) {
  const mathPercentage = mathTotal > 0 ? Math.round((mathSolved / mathTotal) * 100) : 0
  const codingPercentage = codingTotal > 0 ? Math.round((codingSolved / codingTotal) * 100) : 0
  
  const [prevMathSolved, setPrevMathSolved] = useState(mathSolved)
  const [prevCodingSolved, setPrevCodingSolved] = useState(codingSolved)
  const [mathJustIncreased, setMathJustIncreased] = useState(false)
  const [codingJustIncreased, setCodingJustIncreased] = useState(false)
  
  useEffect(() => {
    if (mathSolved > prevMathSolved) {
      setMathJustIncreased(true)
      setTimeout(() => setMathJustIncreased(false), 800)
    }
    setPrevMathSolved(mathSolved)
  }, [mathSolved])
  
  useEffect(() => {
    if (codingSolved > prevCodingSolved) {
      setCodingJustIncreased(true)
      setTimeout(() => setCodingJustIncreased(false), 800)
    }
    setPrevCodingSolved(codingSolved)
  }, [codingSolved])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Math Progress */}
      <div className={`p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg backdrop-blur-sm transition-all duration-300 ${mathJustIncreased ? 'scale-[1.02] border-phthalo-500/50' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-phthalo-400" />
            <span className="text-sm font-medium text-white">Mathematics</span>
          </div>
          <span className={`text-sm font-semibold transition-all duration-300 ${mathJustIncreased ? 'text-phthalo-300 scale-110' : 'text-phthalo-400'}`}>
            {mathSolved}/{mathTotal} ({mathPercentage}%)
          </span>
        </div>
        
        <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-phthalo-600 to-phthalo-500 rounded-full relative overflow-hidden"
            style={{ 
              width: `${mathPercentage}%`,
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-slide"></div>
          </div>
        </div>
      </div>

      {/* Coding Progress */}
      <div className={`p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg backdrop-blur-sm transition-all duration-300 ${codingJustIncreased ? 'scale-[1.02] border-phthalo-500/50' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-phthalo-400" />
            <span className="text-sm font-medium text-white">Coding</span>
          </div>
          <span className={`text-sm font-semibold transition-all duration-300 ${codingJustIncreased ? 'text-phthalo-300 scale-110' : 'text-phthalo-400'}`}>
            {codingSolved}/{codingTotal} ({codingPercentage}%)
          </span>
        </div>
        
        <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-phthalo-600 to-phthalo-500 rounded-full relative overflow-hidden"
            style={{ 
              width: `${codingPercentage}%`,
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-slide"></div>
          </div>
        </div>
      </div>
    </div>
  )
}