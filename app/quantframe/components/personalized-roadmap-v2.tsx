"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, RefreshCw, Loader2, ExternalLink, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const DIFFICULTY_ORDER = ['foundation', 'core-early', 'core-late', 'advanced-early', 'advanced-late', 'frontier']

const DIFFICULTY_LABELS = {
  foundation: 'Foundation',
  'core-early': 'Core Concepts - Part 1',
  'core-late': 'Core Concepts - Part 2',
  'advanced-early': 'Advanced Topics - Part 1',
  'advanced-late': 'Advanced Topics - Part 2',
  frontier: 'Cutting Edge'
}

const DIFFICULTY_COLORS = {
  foundation: {
    badge: 'bg-green-500/20 text-green-400 border-green-500/30',
    accent: 'border-green-500/30'
  },
  'core-early': {
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    accent: 'border-blue-500/30'
  },
  'core-late': {
    badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    accent: 'border-cyan-500/30'
  },
  'advanced-early': {
    badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    accent: 'border-orange-500/30'
  },
  'advanced-late': {
    badge: 'bg-red-500/20 text-red-400 border-red-500/30',
    accent: 'border-red-500/30'
  },
  frontier: {
    badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    accent: 'border-purple-500/30'
  }
}

const CATEGORY_INFO = {
  math: { label: 'Mathematics', color: 'phthalo' },
  coding: { label: 'Coding', color: 'blue' },
  finance: { label: 'Finance', color: 'emerald' },
  execution: { label: 'Career', color: 'amber' }
}

interface RoadmapNode {
  id: string
  slug: string
  title: string
  category: string
  subcategory: string | null
  description: string | null
  difficulty: string
  tracks: string[]
  is_core: boolean
  order_index: number
  resources: Array<{ name: string; link: string }> | null
}

interface RoadmapData {
  track: string
  phases: any[]
  totalNodes: number
  nodesByCategory: {
    math: number
    coding: number
    finance: number
    execution: number
  }
}

interface PersonalizedRoadmapV2Props {
  roadmap: RoadmapData
  userId: string
}

export function PersonalizedRoadmapV2({ roadmap, userId }: PersonalizedRoadmapV2Props) {
  const router = useRouter()
  const [isResetting, setIsResetting] = useState(false)
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null)
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set())

  const togglePhase = (difficulty: string) => {
    const newExpanded = new Set(expandedPhases)
    if (newExpanded.has(difficulty)) {
      newExpanded.delete(difficulty)
    } else {
      newExpanded.add(difficulty)
    }
    setExpandedPhases(newExpanded)
  }

  if (!roadmap || !roadmap.track) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400 mb-4">No roadmap data available.</p>
        <Button
          onClick={() => router.push('/quantframe/quiz-new')}
          className="bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900"
        >
          Take Quiz
        </Button>
      </div>
    )
  }

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset your roadmap? This will delete your current roadmap and quiz responses.')) {
      return
    }

    setIsResetting(true)

    try {
      const res = await fetch('/api/reset-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (!res.ok) {
        throw new Error('Failed to reset roadmap')
      }

      toast.success('Roadmap reset! Redirecting to quiz...')
      setTimeout(() => {
        router.push('/quantframe/quiz-new')
      }, 1000)

    } catch (error) {
      console.error('Error resetting roadmap:', error)
      toast.error('Failed to reset roadmap')
      setIsResetting(false)
    }
  }

  const trackLabels = {
    trader: 'Quant Trader',
    researcher: 'Quant Researcher',
    dev: 'Quant Developer'
  }

  // Get all nodes and separate by category
  const allNodes = roadmap.phases.flatMap(phase => phase.nodes)
  const mathNodes = allNodes.filter(n => n.category === 'math').sort((a, b) => a.order_index - b.order_index)
  const codingNodes = allNodes.filter(n => n.category === 'coding').sort((a, b) => a.order_index - b.order_index)
  const financeNodes = allNodes.filter(n => n.category === 'finance').sort((a, b) => a.order_index - b.order_index)
  const executionNodes = allNodes.filter(n => n.category === 'execution').sort((a, b) => a.order_index - b.order_index)

  // Group nodes by difficulty
  const groupByDifficulty = (nodes: RoadmapNode[]) => {
    const grouped: Record<string, RoadmapNode[]> = {}
    nodes.forEach(node => {
      if (!grouped[node.difficulty]) {
        grouped[node.difficulty] = []
      }
      grouped[node.difficulty].push(node)
    })
    return grouped
  }

  const mathByDifficulty = groupByDifficulty(mathNodes)
  const codingByDifficulty = groupByDifficulty(codingNodes)
  const financeByDifficulty = groupByDifficulty(financeNodes)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'math':
        return 'bg-phthalo-500/20 text-phthalo-400 border-phthalo-500/30'
      case 'coding':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'finance':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'execution':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
    }
  }

  const RoadmapCard = ({ node }: { node: RoadmapNode }) => {
    const hasDetails = node.description || (node.resources && node.resources.length > 0)

    return (
      <Card
        className={`bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:border-white/20 transition-all group ${hasDetails ? 'cursor-pointer' : ''}`}
        onClick={() => hasDetails && setSelectedNode(node)}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-white text-sm leading-tight">
            {node.title}
          </h4>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge className={`text-xs px-2 py-0.5 border ${getCategoryColor(node.category)}`}>
            {CATEGORY_INFO[node.category as keyof typeof CATEGORY_INFO]?.label || node.category}
          </Badge>
          {node.is_core && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-2 py-0.5">
              Core
            </Badge>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-12">
      {/* Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-gradient-to-br from-phthalo-900/20 to-phthalo-800/10 border border-phthalo-700/30"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-phthalo-500/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-phthalo-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-phthalo-400">
                  {trackLabels[roadmap.track as keyof typeof trackLabels]} Roadmap
                </h3>
                <Badge className="bg-phthalo-500/20 text-phthalo-300 border-phthalo-500/30">
                  {roadmap.totalNodes} nodes
                </Badge>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                Your personalized learning path organized by difficulty level. Click cards to view details and resources.
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                {mathNodes.length > 0 && (
                  <div className="px-3 py-1 rounded-full bg-phthalo-500/10 text-phthalo-400 border border-phthalo-500/20">
                    {mathNodes.length} Math
                  </div>
                )}
                {codingNodes.length > 0 && (
                  <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {codingNodes.length} Coding
                  </div>
                )}
                {financeNodes.length > 0 && (
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {financeNodes.length} Finance
                  </div>
                )}
                {executionNodes.length > 0 && (
                  <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {executionNodes.length} Career
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={handleReset}
            disabled={isResetting}
            variant="outline"
            size="sm"
            className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5"
          >
            {isResetting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Difficulty-Based Phases */}
      {DIFFICULTY_ORDER.map((difficulty, phaseIdx) => {
        const mathNodesForDiff = mathByDifficulty[difficulty] || []
        const codingNodesForDiff = codingByDifficulty[difficulty] || []
        const financeNodesForDiff = financeByDifficulty[difficulty] || []

        // Get max order_index for each category to normalize
        const maxMathOrder = Math.max(...mathNodes.map(n => n.order_index), 0)
        const maxCodingOrder = Math.max(...codingNodes.map(n => n.order_index), 0)
        const maxFinanceOrder = Math.max(...financeNodes.map(n => n.order_index), 0)

        // Calculate normalized progress score for better interleaving
        const getProgressScore = (node: RoadmapNode) => {
          if (node.category === 'math' && maxMathOrder > 0) {
            return node.order_index / maxMathOrder
          } else if (node.category === 'coding' && maxCodingOrder > 0) {
            return node.order_index / maxCodingOrder
          } else if (node.category === 'finance' && maxFinanceOrder > 0) {
            return node.order_index / maxFinanceOrder
          }
          return node.order_index
        }

        // Combine all nodes and sort by normalized progress score
        const allNodesForDiff = [
          ...mathNodesForDiff,
          ...codingNodesForDiff,
          ...financeNodesForDiff
        ].sort((a, b) => getProgressScore(a) - getProgressScore(b))

        if (allNodesForDiff.length === 0) return null

        // Distribute nodes across 3 columns
        const column1: RoadmapNode[] = []
        const column2: RoadmapNode[] = []
        const column3: RoadmapNode[] = []

        allNodesForDiff.forEach((node, idx) => {
          if (idx % 3 === 0) column1.push(node)
          else if (idx % 3 === 1) column2.push(node)
          else column3.push(node)
        })

        const isExpanded = expandedPhases.has(difficulty)

        return (
          <motion.div
            key={difficulty}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: phaseIdx * 0.1 }}
            className="relative"
            layout
          >
            {/* Phase Header - Clickable */}
            <motion.div
              className={`flex items-center gap-4 mb-6 cursor-pointer group transition-all duration-500 ease-in-out ${
                isExpanded ? 'justify-start' : 'justify-center'
              }`}
              onClick={() => togglePhase(difficulty)}
              layout
            >
              <motion.div
                className={`flex items-center gap-3 px-6 py-2 rounded-full border-2 ${DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS].accent} bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800/50 transition-colors`}
                layout
              >
                <motion.div layout className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-white" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-white" />
                  )}
                </motion.div>
                <h2 className="text-lg font-bold text-white whitespace-nowrap">
                  {DIFFICULTY_LABELS[difficulty as keyof typeof DIFFICULTY_LABELS]}
                </h2>
                <Badge className="bg-white/10 text-white text-xs whitespace-nowrap flex-shrink-0">
                  {allNodesForDiff.length} nodes
                </Badge>
              </motion.div>
              <motion.div
                className="h-px bg-gradient-to-r from-zinc-700 to-transparent"
                initial={false}
                animate={{
                  width: isExpanded ? '100%' : '0%',
                  opacity: isExpanded ? 1 : 0,
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Zigzag Snake Pattern - Collapsible */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, overflow: "hidden" }}
                  animate={{
                    height: "auto",
                    overflow: "visible",
                    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
                  }}
                  exit={{
                    height: 0,
                    overflow: "visible",
                    transition: { duration: (allNodesForDiff.length - 1) * 0.05 + 0.3 + 0.3, ease: [0.25, 0.1, 0.25, 1] }
                  }}
                >
                {/* Vertical columns layout */}
                <div className="grid grid-cols-3 gap-6 pt-6">
                  {column1.map((node, idx) => (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.3,
                          delay: idx * 0.05,
                          ease: [0.25, 0.1, 0.25, 1]
                        }
                      }}
                      exit={{
                        opacity: 0,
                        y: 20,
                        transition: {
                          duration: 0.3,
                          delay: (allNodesForDiff.length - 1 - idx) * 0.05,
                          ease: [0.25, 0.1, 0.25, 1]
                        }
                      }}
                      className="relative"
                    >
                      <RoadmapCard node={node} />
                    </motion.div>
                  ))}
                  {column2.map((node, idx) => (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.3,
                          delay: (column1.length + idx) * 0.05,
                          ease: [0.25, 0.1, 0.25, 1]
                        }
                      }}
                      exit={{
                        opacity: 0,
                        y: 20,
                        transition: {
                          duration: 0.3,
                          delay: (allNodesForDiff.length - 1 - (column1.length + idx)) * 0.05,
                          ease: [0.25, 0.1, 0.25, 1]
                        }
                      }}
                      className="relative"
                    >
                      <RoadmapCard node={node} />
                    </motion.div>
                  ))}
                  {column3.map((node, idx) => (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.3,
                          delay: (column1.length + column2.length + idx) * 0.05,
                          ease: [0.25, 0.1, 0.25, 1]
                        }
                      }}
                      exit={{
                        opacity: 0,
                        y: 20,
                        transition: {
                          duration: 0.3,
                          delay: (allNodesForDiff.length - 1 - (column1.length + column2.length + idx)) * 0.05,
                          ease: [0.25, 0.1, 0.25, 1]
                        }
                      }}
                      className="relative"
                    >
                      <RoadmapCard node={node} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              )}
            </AnimatePresence>

            {/* Connector to next phase */}
            {phaseIdx < DIFFICULTY_ORDER.length - 1 && (
              <motion.div
                className="flex justify-center my-8"
                layout
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="w-px h-12 bg-gradient-to-b from-zinc-600 to-zinc-800" />
              </motion.div>
            )}
          </motion.div>
        )
      })}

      {/* Career Execution Section */}
      {executionNodes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
          layout
        >
          {/* Convergence Visual */}
          <motion.div
            className="flex justify-center mb-8"
            layout
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="w-px h-16 bg-gradient-to-b from-zinc-600 to-amber-500/50" />
          </motion.div>

          {/* Execution Header - Clickable */}
          <motion.div
            className={`flex items-center gap-4 mb-8 cursor-pointer group transition-all duration-500 ease-in-out ${
              expandedPhases.has('execution') ? 'justify-start' : 'justify-center'
            }`}
            onClick={() => togglePhase('execution')}
            layout
          >
            <motion.div
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-amber-500/10 border-2 border-amber-500/30 hover:bg-amber-500/20 transition-colors"
              layout
            >
              <motion.div layout className="flex-shrink-0">
                {expandedPhases.has('execution') ? (
                  <ChevronDown className="w-5 h-5 text-amber-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-amber-400" />
                )}
              </motion.div>
              <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
              <h2 className="text-lg font-bold text-amber-400 whitespace-nowrap">Career Execution</h2>
              <Badge className="bg-amber-500/20 text-amber-300 text-xs whitespace-nowrap flex-shrink-0">
                {executionNodes.length} nodes
              </Badge>
            </motion.div>
            <motion.div
              className="h-px bg-gradient-to-r from-amber-600/50 to-transparent"
              initial={false}
              animate={{
                width: expandedPhases.has('execution') ? '100%' : '0%',
                opacity: expandedPhases.has('execution') ? 1 : 0,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </motion.div>

          {/* Execution Nodes - Zigzag Snake Pattern - Collapsible */}
          <AnimatePresence>
            {expandedPhases.has('execution') && (
              <motion.div
                initial={{ height: 0, overflow: "hidden" }}
                animate={{
                  height: "auto",
                  overflow: "visible",
                  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
                }}
                exit={{
                  height: 0,
                  overflow: "visible",
                  transition: { duration: (executionNodes.length - 1) * 0.05 + 0.3 + 0.3, ease: [0.25, 0.1, 0.25, 1] }
                }}
              >
              {/* Vertical columns layout */}
              <div className="grid grid-cols-3 gap-6 pt-6">
                {(() => {
                  const execColumn1: RoadmapNode[] = []
                  const execColumn2: RoadmapNode[] = []
                  const execColumn3: RoadmapNode[] = []

                  executionNodes.forEach((node, idx) => {
                    if (idx % 3 === 0) execColumn1.push(node)
                    else if (idx % 3 === 1) execColumn2.push(node)
                    else execColumn3.push(node)
                  })

                  return (
                    <>
                      {execColumn1.map((node, idx) => (
                        <motion.div
                          key={node.id}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: 0.3,
                              delay: idx * 0.05,
                              ease: [0.25, 0.1, 0.25, 1]
                            }
                          }}
                          exit={{
                            opacity: 0,
                            y: 20,
                            transition: {
                              duration: 0.3,
                              delay: (executionNodes.length - 1 - idx) * 0.05,
                              ease: [0.25, 0.1, 0.25, 1]
                            }
                          }}
                          className="relative"
                        >
                          <RoadmapCard node={node} />
                        </motion.div>
                      ))}
                      {execColumn2.map((node, idx) => (
                        <motion.div
                          key={node.id}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: 0.3,
                              delay: (execColumn1.length + idx) * 0.05,
                              ease: [0.25, 0.1, 0.25, 1]
                            }
                          }}
                          exit={{
                            opacity: 0,
                            y: 20,
                            transition: {
                              duration: 0.3,
                              delay: (executionNodes.length - 1 - (execColumn1.length + idx)) * 0.05,
                              ease: [0.25, 0.1, 0.25, 1]
                            }
                          }}
                          className="relative"
                        >
                          <RoadmapCard node={node} />
                        </motion.div>
                      ))}
                      {execColumn3.map((node, idx) => (
                        <motion.div
                          key={node.id}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: 0.3,
                              delay: (execColumn1.length + execColumn2.length + idx) * 0.05,
                              ease: [0.25, 0.1, 0.25, 1]
                            }
                          }}
                          exit={{
                            opacity: 0,
                            y: 20,
                            transition: {
                              duration: 0.3,
                              delay: (executionNodes.length - 1 - (execColumn1.length + execColumn2.length + idx)) * 0.05,
                              ease: [0.25, 0.1, 0.25, 1]
                            }
                          }}
                          className="relative"
                        >
                          <RoadmapCard node={node} />
                        </motion.div>
                      ))}
                    </>
                  )
                })()}
              </div>
            </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Node Details Dialog */}
      <Dialog open={!!selectedNode} onOpenChange={(open) => !open && setSelectedNode(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white mb-2">
              {selectedNode?.title}
            </DialogTitle>
            <div className="flex items-center gap-2 mb-4">
              <Badge className={`text-xs px-2 py-0.5 border ${getCategoryColor(selectedNode?.category || '')}`}>
                {selectedNode && CATEGORY_INFO[selectedNode.category as keyof typeof CATEGORY_INFO]?.label}
              </Badge>
              {selectedNode?.is_core && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-2 py-0.5">
                  Core
                </Badge>
              )}
            </div>
          </DialogHeader>

          {selectedNode?.description && (
            <DialogDescription className="text-sm text-zinc-300 leading-relaxed mb-4">
              {selectedNode.description}
            </DialogDescription>
          )}

          {selectedNode?.resources && selectedNode.resources.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-zinc-400">Resources:</h4>
              <div className="space-y-2">
                {selectedNode.resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-phthalo-400 hover:text-phthalo-300 transition-colors p-2 rounded-lg hover:bg-white/5"
                  >
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    <span>{resource.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
