// Example of good component style

"use client"

import { useState } from "react"

export function GamificationCard() {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  // Sample progress data - showing upward growth over time
  const progressData = [
    { week: 1, xp: 150 },
    { week: 2, xp: 320 },
    { week: 3, xp: 480 },
    { week: 4, xp: 720 },
    { week: 5, xp: 950 },
    { week: 6, xp: 1300 },
    { week: 7, xp: 1650 },
    { week: 8, xp: 2450 },
  ]

  const maxXP = Math.max(...progressData.map(d => d.xp))

  return (
    <div className="group relative">
      <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-phthalo-500 to-phthalo-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Progress Tracking</h3>
          </div>

          <p className="text-zinc-400 leading-relaxed">
            Level up through XP, unlock achievements, and watch your skills grow with real-time analytics
          </p>

          {/* Level Display - Hover Effect */}
          <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50 hover:border-phthalo-500/50 hover:shadow-lg hover:shadow-phthalo-500/10 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg transform hover:scale-110 transition-transform duration-300">
                  23
                </div>
                <div>
                  <div className="font-bold text-lg">Level 23</div>
                  <div className="text-sm text-zinc-500">Quant Apprentice</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-phthalo-400">2,450</div>
                <div className="text-xs text-zinc-500">Total XP</div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">450 / 800 XP to Level 24</span>
                <span className="text-phthalo-400 font-medium">56%</span>
              </div>
              <div className="h-3 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-phthalo-500 to-phthalo-600 rounded-full transition-all duration-500 hover:from-phthalo-400 hover:to-phthalo-500" style={{ width: '56%' }}></div>
              </div>
            </div>
          </div>

          {/* Skill Circles - Enhanced Hover Effects */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-zinc-800/30 rounded-xl p-4 text-center border border-zinc-700/30 hover:border-phthalo-500/50 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-phthalo-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group/skill">
              <div className="relative w-16 h-16 mx-auto mb-3">
                <svg className="transform -rotate-90 w-16 h-16">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" className="text-zinc-700" />
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" strokeDasharray={176} strokeDashoffset={176 * (1 - 0.87)} className="text-phthalo-500 transition-all duration-1000 group-hover/skill:text-phthalo-400" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold group-hover/skill:scale-110 transition-transform">87</div>
              </div>
              <div className="text-xs text-zinc-400 group-hover/skill:text-zinc-300 transition-colors">Mathematics</div>
            </div>

            <div className="bg-zinc-800/30 rounded-xl p-4 text-center border border-zinc-700/30 hover:border-blue-500/50 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group/skill">
              <div className="relative w-16 h-16 mx-auto mb-3">
                <svg className="transform -rotate-90 w-16 h-16">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" className="text-zinc-700" />
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" strokeDasharray={176} strokeDashoffset={176 * (1 - 0.64)} className="text-blue-500 transition-all duration-1000 group-hover/skill:text-blue-400" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold group-hover/skill:scale-110 transition-transform">64</div>
              </div>
              <div className="text-xs text-zinc-400 group-hover/skill:text-zinc-300 transition-colors">Finance</div>
            </div>

            <div className="bg-zinc-800/30 rounded-xl p-4 text-center border border-zinc-700/30 hover:border-purple-500/50 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group/skill">
              <div className="relative w-16 h-16 mx-auto mb-3">
                <svg className="transform -rotate-90 w-16 h-16">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" className="text-zinc-700" />
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" strokeDasharray={176} strokeDashoffset={176 * (1 - 0.92)} className="text-purple-500 transition-all duration-1000 group-hover/skill:text-purple-400" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold group-hover/skill:scale-110 transition-transform">92</div>
              </div>
              <div className="text-xs text-zinc-400 group-hover/skill:text-zinc-300 transition-colors">Coding</div>
            </div>
          </div>

          {/* XP Progress Graph - Enhanced */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-zinc-400">8-Week XP Growth</div>
              <div className="text-xs text-zinc-500">Total: {progressData[progressData.length - 1].xp} XP</div>
            </div>
            <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/30 hover:border-phthalo-500/50 hover:shadow-lg hover:shadow-phthalo-500/10 transition-all duration-300">
              <div className="relative h-48" style={{ paddingLeft: '24px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '28px' }}>
                {/* Y-axis labels */}
                <div className="absolute left-0 top-2 text-xs text-zinc-500 font-medium">
                  {maxXP}
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                  {Math.round(maxXP / 2)}
                </div>
                <div className="absolute left-0 bottom-7 text-xs text-zinc-500">0</div>
                
                {/* SVG Graph Container - with padding to prevent edge cutoff */}
                <svg className="absolute" style={{ left: '24px', right: '16px', top: '8px', bottom: '28px', width: 'calc(100% - 40px)', height: 'calc(100% - 36px)' }} viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgb(38, 128, 74)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(38, 128, 74)" stopOpacity="0.05" />
                    </linearGradient>
                    <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-zinc-700/20" />
                    </pattern>
                  </defs>
                  
                  {/* Fine grid overlay */}
                  <rect width="100" height="100" fill="url(#gridPattern)" />
                  
                  {/* Horizontal grid lines */}
                  <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-zinc-700/30" vectorEffect="non-scaling-stroke" />
                  <line x1="0" y1="33.33" x2="100" y2="33.33" stroke="currentColor" strokeWidth="0.5" className="text-zinc-700/20" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
                  <line x1="0" y1="66.66" x2="100" y2="66.66" stroke="currentColor" strokeWidth="0.5" className="text-zinc-700/20" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
                  <line x1="0" y1="100" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-zinc-700/30" vectorEffect="non-scaling-stroke" />
                  
                  {/* Area under the curve */}
                  <path
                    fill="url(#areaGradient)"
                    d={
                      `M 1,100 ` +
                      progressData.map((d, i) => {
                        const x = 1 + (i / (progressData.length - 1)) * 98
                        const y = (1 - (d.xp / maxXP)) * 100
                        return `L ${x},${y}`
                      }).join(' ') +
                      ` L 99,100 Z`
                    }
                  />
                  
                  {/* Progress line */}
                  <path
                    fill="none"
                    stroke="rgb(38, 128, 74)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    d={
                      progressData.map((d, i) => {
                        const x = 1 + (i / (progressData.length - 1)) * 98
                        const y = (1 - (d.xp / maxXP)) * 100
                        return `${i === 0 ? 'M' : 'L'} ${x},${y}`
                      }).join(' ')
                    }
                  />
                </svg>

                {/* Data points overlay - using absolute positioning */}
                <div className="absolute pointer-events-none" style={{ left: '24px', right: '16px', top: '8px', bottom: '28px', width: 'calc(100% - 40px)', height: 'calc(100% - 36px)' }}>
                  {progressData.map((d, i) => {
                    const xPercent = 1 + (i / (progressData.length - 1)) * 98
                    const yPercent = (1 - (d.xp / maxXP)) * 100
                    const isHovered = hoveredPoint === i
                    
                    return (
                      <div
                        key={i}
                        className="absolute pointer-events-auto"
                        style={{
                          left: `${xPercent}%`,
                          top: `${yPercent}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <div
                          className={`rounded-full bg-phthalo-500 cursor-pointer transition-all duration-200 ${
                            isHovered ? 'w-3 h-3 shadow-lg shadow-phthalo-500/50' : 'w-2 h-2'
                          }`}
                          onMouseEnter={() => setHoveredPoint(i)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                        
                        {/* Tooltip */}
                        {isHovered && (
                          <div
                            className="absolute whitespace-nowrap bg-zinc-900 border border-phthalo-500 rounded-lg px-3 py-2 shadow-xl"
                            style={{
                              left: i > progressData.length / 2 ? 'auto' : '12px',
                              right: i > progressData.length / 2 ? '12px' : 'auto',
                              top: '-48px'
                            }}
                          >
                            <div className="text-xs text-zinc-400">Week {d.week}</div>
                            <div className="text-sm font-bold text-phthalo-400">{d.xp} XP</div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* X-axis labels */}
                <div className="absolute bottom-0 left-6 right-3 flex justify-between text-xs text-zinc-500">
                  {progressData.map((d, i) => (
                    <span key={i} className={`transition-colors ${hoveredPoint === i ? 'text-phthalo-400 font-medium' : ''}`}>
                      W{d.week}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}