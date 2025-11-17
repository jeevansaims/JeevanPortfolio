"use client"

import { useState } from "react"
import { BookOpen, Code, FileCheck, Lock } from "lucide-react"

interface Module {
  id: number
  title: string
  status: "completed" | "in-progress" | "locked"
  lessonsCount: number
  lessonPreview: string[]
  projectTitle: string
  examPoints: string
  yOffset: number // vertical offset for zig-zag
}

const modules: Module[] = [
  {
    id: 1,
    title: "Calculus",
    status: "completed",
    lessonsCount: 4,
    lessonPreview: ["Limits & Continuity", "Derivatives", "Integrals", "Optimization"],
    projectTitle: "Gradient Descent on Sharpe",
    examPoints: "20-25",
    yOffset: 0
  },
  {
    id: 2,
    title: "Linear Algebra",
    status: "in-progress",
    lessonsCount: 4,
    lessonPreview: ["Vectors & Norms", "Matrices & Factorizations", "Eigenvalues & PCA", "Quadratic Forms"],
    projectTitle: "Covariance & Portfolio Variance",
    examPoints: "20-25",
    yOffset: -40
  },
  {
    id: 3,
    title: "Probability",
    status: "locked",
    lessonsCount: 4,
    lessonPreview: ["Random Variables", "Variance & Correlation", "CLT & Confidence", "Hypothesis Testing"],
    projectTitle: "Monte Carlo Simulation",
    examPoints: "20-25",
    yOffset: 40
  },
  {
    id: 4,
    title: "Optimization",
    status: "locked",
    lessonsCount: 4,
    lessonPreview: ["Lagrange Multipliers", "Convex Optimization", "Quadratic Programming", "Regularization"],
    projectTitle: "Mean-Variance with Regularization",
    examPoints: "20-25",
    yOffset: -30
  }
]

export function ProgramRoadmap() {
  const [hoveredModule, setHoveredModule] = useState<number | null>(null)
  const [hoveredSubnode, setHoveredSubnode] = useState<{ moduleId: number; type: "lesson" | "project" | "exam"; index?: number } | null>(null)

  const getStatusColor = (status: Module["status"]) => {
    switch (status) {
      case "completed":
        return "bg-phthalo-500"
      case "in-progress":
        return "bg-phthalo-400"
      case "locked":
        return "bg-zinc-600"
    }
  }

  const getLineColor = (status: Module["status"]) => {
    switch (status) {
      case "completed":
        return "bg-phthalo-500"
      case "in-progress":
        return "bg-phthalo-400/50"
      case "locked":
        return "bg-zinc-700/30"
    }
  }

  return (
    <div className="w-full">
      <style jsx>{`
        @keyframes pulseOpacity {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }
      `}</style>
      
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
            Structured Learning Roadmap
          </span>
        </h2>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Each module combines rigorous theory with practical projects and performance-based evaluations
        </p>
      </div>

      {/* Main Roadmap Card */}
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-phthalo-500/10 to-phthalo-700/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"></div>

        {/* Main Card Container */}
        <div className="relative p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-700/50">
          
          {/* Card Header - Inside */}
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white">
              Quant Math Roadmap
            </h3>
            <p className="text-sm text-zinc-500">
              14-16 weeks • 4 modules • 16 lessons • 4 projects • 4 exams
            </p>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="relative h-[550px]">
              {/* Zig-zag timeline connecting main modules */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                <defs>
                  <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgb(38, 128, 74)" stopOpacity="1" />
                    <stop offset="100%" stopColor="rgb(38, 128, 74)" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgb(38, 128, 74)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="rgb(63, 63, 70)" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="lineGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgb(63, 63, 70)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="rgb(63, 63, 70)" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                
                {/* Draw diagonal connecting lines between modules */}
                {modules.slice(0, -1).map((module, index) => {
                  const nextModule = modules[index + 1]
                  const startX = ((index + 0.5) / modules.length) * 100
                  const endX = ((index + 1.5) / modules.length) * 100
                  const startY = module.yOffset + 275 // Adjust for center of container
                  const endY = nextModule.yOffset + 275
                  
                  // Get gradient based on status
                  let gradientId = `lineGradient${index + 1}`
                  
                  return (
                    <line
                      key={index}
                      x1={`${startX}%`}
                      y1={startY}
                      x2={`${endX}%`}
                      y2={endY}
                      stroke={`url(#${gradientId})`}
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                  )
                })}
              </svg>

              {/* Module nodes and sub-nodes */}
              {modules.map((module, index) => {
                const xPosition = ((index + 0.5) / modules.length) * 100
                const isModuleHovered = hoveredModule === module.id
                const isLocked = module.status === "locked"

                return (
                  <div
                    key={module.id}
                    className="absolute"
                    style={{ 
                      left: `${xPosition}%`,
                      top: `calc(50% + ${module.yOffset}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {/* Lessons sub-nodes (top) */}
                    <div className="absolute bottom-full mb-20 left-1/2 -translate-x-1/2 flex gap-3">
                      {[...Array(module.lessonsCount)].map((_, i) => {
                        const isSubnodeHovered = hoveredSubnode?.moduleId === module.id && 
                                                 hoveredSubnode?.type === "lesson" && 
                                                 hoveredSubnode?.index === i
                        const shouldHighlight = isModuleHovered || isSubnodeHovered
                        
                        // Calculate angle for outer nodes to bend inward
                        const totalNodes = module.lessonsCount
                        const isOuterNode = i === 0 || i === totalNodes - 1
                        const bendOffset = isOuterNode ? (i === 0 ? 20 : -20) : 0

                        return (
                          <div key={i} className="relative">
                            {/* Connecting line to main node - angled for outer nodes */}
                            <svg
                              className="absolute pointer-events-none"
                              style={{
                                left: '50%',
                                top: '100%',
                                width: '100px',
                                height: '90px',
                                transform: 'translateX(-50%)'
                              }}
                            >
                              <line
                                x1="50%"
                                y1="0"
                                x2={`calc(50% + ${bendOffset}px)`}
                                y2="90"
                                stroke={
                                  isLocked 
                                    ? "rgb(63, 63, 70)" 
                                    : shouldHighlight 
                                    ? "rgb(96, 165, 250)" 
                                    : "rgb(82, 82, 91)"
                                }
                                strokeWidth={shouldHighlight ? "3" : "1.5"}
                                strokeOpacity={isLocked ? "0.3" : shouldHighlight ? "0.8" : "0.5"}
                                className="transition-all duration-300"
                              />
                              {shouldHighlight && (
                                <line
                                  x1="50%"
                                  y1="0"
                                  x2={`calc(50% + ${bendOffset}px)`}
                                  y2="90"
                                  stroke="rgb(96, 165, 250)"
                                  strokeWidth="3"
                                  strokeOpacity="0.3"
                                  className="animate-pulse"
                                  style={{ filter: 'blur(3px)' }}
                                />
                              )}
                            </svg>
                          
                            {/* Lesson node */}
                            <div
                              className={`w-8 h-8 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                                isLocked
                                  ? "bg-zinc-800/50 border-zinc-700/30"
                                  : shouldHighlight
                                  ? "border-blue-400 bg-blue-500/30 scale-110 shadow-lg shadow-blue-400/50"
                                  : "bg-zinc-800 border-blue-500/40"
                              } flex items-center justify-center`}
                              onMouseEnter={() => {
                                if (!isLocked) {
                                  setHoveredSubnode({ moduleId: module.id, type: "lesson", index: i })
                                }
                              }}
                              onMouseLeave={() => setHoveredSubnode(null)}
                            >
                              <BookOpen 
                                className={`w-3.5 h-3.5 transition-colors ${
                                  isLocked 
                                    ? "text-zinc-600" 
                                    : shouldHighlight 
                                    ? "text-blue-400" 
                                    : "text-blue-500/70"
                                }`} 
                              />
                            </div>

                            {/* Tooltip - only on individual subnode hover */}
                            {isSubnodeHovered && (
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-zinc-900 border border-blue-400/50 rounded-lg px-3 py-1.5 text-xs text-blue-400 shadow-xl z-50">
                                {module.lessonPreview[i]}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Main module node */}
                    <div
                      className="relative cursor-pointer z-10"
                      onMouseEnter={() => !isLocked && setHoveredModule(module.id)}
                      onMouseLeave={() => setHoveredModule(null)}
                    >
                      {/* In-progress glow effect */}
                      {module.status === "in-progress" && (
                        <div className="absolute -inset-4 bg-gradient-to-r from-green-500/30 to-phthalo-500/30 rounded-2xl blur-xl animate-pulse" 
                             style={{ animationDuration: '3s' }} />
                      )}

                      {/* Hover glow */}
                      {isModuleHovered && (
                        <div className="absolute -inset-3 bg-gradient-to-r from-phthalo-500/30 to-phthalo-600/30 rounded-2xl blur-xl animate-pulse" />
                      )}

                      {/* Module card */}
                      <div
                        className={`relative w-32 h-32 rounded-2xl border-2 transition-all duration-300 ${
                          isLocked
                            ? "bg-zinc-900/50 border-zinc-700/50"
                            : module.status === "in-progress"
                            ? "bg-zinc-900 border-green-500/40 shadow-lg shadow-green-500/20"
                            : `${getStatusColor(module.status).replace('bg-', 'border-')}/50 bg-zinc-900`
                        } ${isModuleHovered ? "scale-110 shadow-2xl shadow-phthalo-500/50 border-phthalo-400" : ""}`}
                        style={
                          module.status === "in-progress" 
                            ? { 
                                animation: 'pulseOpacity 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                              } 
                            : undefined
                        }
                      >
                        {/* Module number/icon */}
                        <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                          module.status === "in-progress" 
                            ? "bg-gradient-to-br from-green-500 to-phthalo-600" 
                            : "bg-gradient-to-br from-phthalo-500 to-phthalo-600"
                        }`}>
                          {isLocked ? <Lock className="w-4 h-4" /> : module.id}
                        </div>

                        {/* Module content */}
                        <div className="p-4 h-full flex flex-col items-center justify-center text-center">
                          <div className="text-sm font-bold mb-1 leading-tight">{module.title}</div>
                          <div className={`text-xs text-zinc-500 space-y-0.5 ${module.status === "in-progress" ? "mb-1" : ""}`}>
                            <div>{module.lessonsCount} lessons</div>
                            <div>1 project</div>
                            <div>1 exam</div>
                          </div>
                        </div>

                        {/* Status indicator */}
                        <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${
                          module.status === "in-progress" ? "bg-green-500" : getStatusColor(module.status)
                        }`} />
                      </div>

                      {/* Module tooltip on hover */}
                      {isModuleHovered && (
                        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-zinc-900 border border-phthalo-400/50 rounded-lg px-4 py-2 text-sm text-phthalo-400 shadow-xl z-50">
                          <div className="font-bold mb-1">{module.title}</div>
                          <div className="text-xs text-zinc-400">
                            {module.status === "completed" && "✓ Completed"}
                            {module.status === "in-progress" && "⏳ In Progress"}
                            {module.status === "locked" && "🔒 Locked"}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Project sub-node (bottom-left) */}
                    <div className="absolute top-full mt-20 -left-12">
                      {/* Connecting line - angled to bottom-left of main node */}
                      <svg
                        className="absolute pointer-events-none"
                        style={{
                          left: '50%',
                          bottom: '100%',
                          width: '100px',
                          height: '90px',
                          transform: 'translateX(-50%)'
                        }}
                      >
                        <line
                          x1="50%"
                          y1="90"
                          x2="80%"
                          y2="0"
                          stroke={
                            isLocked 
                              ? "rgb(63, 63, 70)" 
                              : (isModuleHovered || (hoveredSubnode?.moduleId === module.id && hoveredSubnode?.type === "project"))
                              ? "rgb(38, 128, 74)" 
                              : "rgb(82, 82, 91)"
                          }
                          strokeWidth={(isModuleHovered || (hoveredSubnode?.moduleId === module.id && hoveredSubnode?.type === "project")) ? "3" : "1.5"}
                          strokeOpacity={isLocked ? "0.3" : (isModuleHovered || (hoveredSubnode?.moduleId === module.id && hoveredSubnode?.type === "project")) ? "0.8" : "0.5"}
                          className="transition-all duration-300"
                        />
                        {(isModuleHovered || (hoveredSubnode?.moduleId === module.id && hoveredSubnode?.type === "project")) && (
                          <line
                            x1="50%"
                            y1="90"
                            x2="80%"
                            y2="0"
                            stroke="rgb(38, 128, 74)"
                            strokeWidth="3"
                            strokeOpacity="0.3"
                            className="animate-pulse"
                            style={{ filter: 'blur(3px)' }}
                          />
                        )}
                      </svg>

                      {/* Project node */}
                      <div
                        className={`w-10 h-10 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                          isLocked
                            ? "bg-zinc-800/50 border-zinc-700/30"
                            : (isModuleHovered || (hoveredSubnode?.moduleId === module.id && hoveredSubnode?.type === "project"))
                            ? "border-phthalo-400 bg-phthalo-500/30 scale-110 shadow-lg shadow-phthalo-400/50"
                            : "bg-zinc-800 border-phthalo-500/40"
                        } flex items-center justify-center`}
                        onMouseEnter={() => {
                          if (!isLocked) {
                            setHoveredSubnode({ moduleId: module.id, type: "project" })
                          }
                        }}
                        onMouseLeave={() => setHoveredSubnode(null)}
                      >
                        <Code 
                          className={`w-4 h-4 transition-colors ${
                            isLocked 
                              ? "text-zinc-600" 
                              : (isModuleHovered || (hoveredSubnode?.moduleId === module.id && hoveredSubnode?.type === "project"))
                              ? "text-phthalo-400" 
                              : "text-phthalo-500/70"
                          }`} 
                        />
                      </div>

                      {/* Project tooltip - only on subnode hover */}
                      {hoveredSubnode?.moduleId === module.id && hoveredSubnode?.type === "project" && (
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-zinc-900 border border-phthalo-400/50 rounded-lg px-3 py-1.5 text-xs text-phthalo-400 shadow-xl z-50">
                          Project: {module.projectTitle}
                        </div>
                      )}
                    </div>

                    {/* Exam sub-node (bottom-right) */}
                    <div className="absolute top-full mt-20 -right-12">
                      {/* Connecting line - angled to bottom-right of main node */}
                      <svg
                        className="absolute pointer-events-none"
                        style={{
                          left: '50%',
                          bottom: '100%',
                          width: '100px',
                          height: '90px',
                          transform: 'translateX(-50%)'
                        }}
                      >
                        <line
                          x1="50%"
                          y1="90"
                          x2="20%"
                          y2="0"
                          stroke={
                            isLocked 
                              ? "rgb(63, 63, 70)" 
                              : (isModuleHovered || (hoveredSubnode?.moduleId === module.id && hoveredSubnode?.type === "exam"))
                              ? "rgb(192, 132, 252)" 
                              : "rgb(82, 82, 91)"
                          }
                          strokeWidth={(isModuleHovered || (hoveredSubnode?.moduleId === module.id && hoveredSubnode?.type === "exam")) ? "3" : "1.5"}
                          strokeOpacity={isLocked ? "0.3" : (isModuleHovered || (hoveredSubnode?.moduleId === module.id && hoveredSubnode?.type === "exam")) ? "0.8" : "0.5"}
                          className="transition-all duration-300"
                        />
                        {(isModuleHovered || (hoveredSubnode?.moduleId === module.id && hoveredSubnode?.type === "exam")) && (
                          <line
                            x1="50%"
                            y1="90"
                            x2="20%"
                            y2="0"
                            stroke="rgb(192, 132, 252)"
                            strokeWidth="3"
                            strokeOpacity="0.3"
                            className="animate-pulse"
                            style={{ filter: 'blur(3px)' }}
                          />
                        )}
                      </svg>

                      {/* Exam node */}
                      <div
                        className={`w-10 h-10 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                          isLocked
                            ? "bg-zinc-800/50 border-zinc-700/30"
                            : (isModuleHovered || (hoveredSubnode?.moduleId === module.id && hoveredSubnode?.type === "exam"))
                            ? "border-purple-400 bg-purple-500/30 scale-110 shadow-lg shadow-purple-400/50"
                            : "bg-zinc-800 border-purple-500/40"
                        } flex items-center justify-center`}
                        onMouseEnter={() => {
                          if (!isLocked) {
                            setHoveredSubnode({ moduleId: module.id, type: "exam" })
                          }
                        }}
                        onMouseLeave={() => setHoveredSubnode(null)}
                      >
                        <FileCheck 
                          className={`w-4 h-4 transition-colors ${
                            isLocked 
                              ? "text-zinc-600" 
                              : (isModuleHovered || (hoveredSubnode?.moduleId === module.id && hoveredSubnode?.type === "exam"))
                              ? "text-purple-400" 
                              : "text-purple-500/70"
                          }`} 
                        />
                      </div>

                      {/* Exam tooltip - only on subnode hover */}
                      {hoveredSubnode?.moduleId === module.id && hoveredSubnode?.type === "exam" && (
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-zinc-900 border border-purple-400/50 rounded-lg px-3 py-1.5 text-xs text-purple-400 shadow-xl z-50">
                          Exam: {module.examPoints} pts
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Legend */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-6 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="w-3.5 h-3.5 text-phthalo-400" />
                  <span>Project</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Exam</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden">
            <div className="space-y-8">
              {modules.map((module, index) => (
                <div key={module.id} className="relative">
                  {/* Connecting line to next module */}
                  {index < modules.length - 1 && (
                    <div className={`absolute left-8 top-20 w-0.5 h-12 ${getLineColor(module.status)}`} />
                  )}

                  <div className="flex gap-6">
                    {/* Module node */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-16 h-16 rounded-xl border-2 ${
                          module.status === "locked"
                            ? "bg-zinc-900/50 border-zinc-700/50"
                            : module.status === "in-progress"
                            ? "bg-zinc-900 border-green-500/50"
                            : `bg-zinc-900 border-${getStatusColor(module.status).split('-')[1]}-500/50`
                        } flex items-center justify-center`}
                      >
                        <div className="text-xl font-bold">
                          {module.status === "locked" ? <Lock className="w-6 h-6 text-zinc-600" /> : module.id}
                        </div>
                      </div>
                    </div>

                    {/* Module details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold mb-2">{module.title}</h3>
                      
                      {module.status !== "locked" && (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-blue-400">
                            <BookOpen className="w-4 h-4 flex-shrink-0" />
                            <span>{module.lessonsCount} Lessons</span>
                          </div>
                          <div className="flex items-center gap-2 text-phthalo-400">
                            <Code className="w-4 h-4 flex-shrink-0" />
                            <span>{module.projectTitle}</span>
                          </div>
                          <div className="flex items-center gap-2 text-purple-400">
                            <FileCheck className="w-4 h-4 flex-shrink-0" />
                            <span>Exam ({module.examPoints} pts)</span>
                          </div>
                        </div>
                      )}

                      {module.status === "locked" && (
                        <p className="text-sm text-zinc-500">Complete previous modules to unlock</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}