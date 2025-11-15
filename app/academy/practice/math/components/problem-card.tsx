///app/academy/practice/math/components/problem-card.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, CheckCircle2, Trophy, RefreshCw, Settings, ChevronRight, AlertCircle } from 'lucide-react'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { ProgressBar } from './progress-bar'
import confetti from 'canvas-confetti'

interface MathProblem {
  id: string
  problem: string
  hint: string
  solution: string
  answer: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  xp: number
  problem_number?: number
}

interface ProblemCardProps {
  problem: MathProblem
  isCompleted: boolean
  isAttempted: boolean
  answerStatus: 'idle' | 'correct' | 'incorrect'
  userAnswer: string
  submitting: boolean
  showHint: boolean
  showSolution: boolean
  showProgress: boolean
  progressSolved?: number
  progressTotal?: number
  selectedCategory?: string
  selectedDifficulty?: string
  xpForfeited: boolean
  onAnswerChange: (value: string) => void
  onSubmit: () => void
  onShowHint: () => void
  onShowSolution: () => void
  onNextProblem: () => void
  onEditFilters: () => void
  onForfeitXP: () => void
}

// Helper function to render text with LaTeX
const renderLatex = (text: string) => {
  if (!text) return null
  
  const processedText = text.replace(/\\n/g, '\n')
  const blockParts = processedText.split(/(\$\$[^$]+\$\$)/g)
  
  return (
    <div className="space-y-4">
      {blockParts.map((part, blockIdx) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const latex = part.slice(2, -2)
          return (
            <div key={blockIdx} className="flex justify-center my-4">
              <BlockMath math={latex} />
            </div>
          )
        }
        
        const paragraphs = part.split('\n\n').filter(p => p.trim())
        
        return paragraphs.map((paragraph, paraIdx) => {
          const elements = []
          let remaining = paragraph
          let elementKey = 0
          
          while (remaining) {
            const mathMatch = remaining.match(/\$([^$]+)\$/)
            const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)
            
            const mathIndex = mathMatch ? remaining.indexOf(mathMatch[0]) : Infinity
            const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity
            
            if (mathIndex === Infinity && boldIndex === Infinity) {
              if (remaining.trim()) {
                elements.push(<span key={elementKey++}>{remaining}</span>)
              }
              break
            }
            
            if (mathIndex < boldIndex) {
              if (mathIndex > 0) {
                elements.push(<span key={elementKey++}>{remaining.slice(0, mathIndex)}</span>)
              }
              elements.push(<InlineMath key={elementKey++} math={mathMatch![1]} />)
              remaining = remaining.slice(mathIndex + mathMatch![0].length)
            } else {
              if (boldIndex > 0) {
                elements.push(<span key={elementKey++}>{remaining.slice(0, boldIndex)}</span>)
              }
              elements.push(
                <strong key={elementKey++} className="font-bold text-white">
                  {boldMatch![1]}
                </strong>
              )
              remaining = remaining.slice(boldIndex + boldMatch![0].length)
            }
          }
          
          return (
            <p key={`${blockIdx}-${paraIdx}`} className="my-2">
              {elements}
            </p>
          )
        })
      })}
    </div>
  )
}

const difficultyColors = {
  beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20'
}

export function ProblemCard({
  problem,
  isCompleted,
  isAttempted,
  answerStatus,
  userAnswer,
  submitting,
  showHint,
  showSolution,
  showProgress,
  progressSolved,
  progressTotal,
  selectedCategory,
  selectedDifficulty,
  xpForfeited,
  onAnswerChange,
  onSubmit,
  onShowHint,
  onShowSolution,
  onNextProblem,
  onEditFilters,
  onForfeitXP,
}: ProblemCardProps) {
  const [showSolutionWarning, setShowSolutionWarning] = useState(false)
  const [isSliding, setIsSliding] = useState(false)

  // Confetti when answering correctly
  useEffect(() => {
    if (answerStatus === 'correct') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#26804a', '#2d9659', '#34ac68']
      })
    }
  }, [answerStatus])

  const handleShowSolution = () => {
    if (!showSolution && !xpForfeited && !isCompleted) {
      // Show warning if trying to view solution for first time
      setShowSolutionWarning(true)
    } else {
      // Already forfeited or completed, just toggle
      onShowSolution()
    }
  }

  const handleConfirmViewSolution = () => {
    onForfeitXP()
    onShowSolution()
    setShowSolutionWarning(false)
  }

  const handleNextProblem = () => {
    setIsSliding(true)
    setTimeout(() => {
      onNextProblem()
      setIsSliding(false)
    }, 300)
  }
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Top Bar with Edit Filters */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
              {problem.category.charAt(0).toUpperCase() + problem.category.slice(1).replace('_', ' ')}
              {problem.problem_number && ` #${problem.problem_number}`}
            </h1>
            <p className="text-zinc-400 text-sm mt-1">Keep grinding, you got this!</p>
          </div>
          
          <Button
            onClick={onEditFilters}
            variant="outline"
            size="sm"
            className="bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
          >
            <Settings className="w-4 h-4 mr-2" />
            Edit Filters
          </Button>
        </div>

        {/* Progress Bar (only show for single category + single difficulty) */}
        {showProgress && progressSolved !== undefined && progressTotal !== undefined && selectedCategory && selectedDifficulty && (
          <ProgressBar 
            solved={progressSolved}
            total={progressTotal}
            category={selectedCategory}
            difficulty={selectedDifficulty}
          />
        )}

        {/* Problem Card with slide animation and Next arrow */}
        <div className="relative">
          <Card className={`bg-zinc-900/50 border-zinc-800 backdrop-blur-sm p-8 mb-6 transition-all duration-300 ${isSliding ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}>
            {/* Top badges */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <Badge variant="outline" className={difficultyColors[problem.difficulty]}>
                  {problem.difficulty}
                </Badge>
                <Badge variant="outline" className="bg-phthalo-500/10 text-phthalo-400 border-phthalo-500/20">
                  {problem.category.replace('_', ' ')}
                </Badge>
                {isCompleted && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
                {!isCompleted && isAttempted && (
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Attempted
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Trophy className="w-4 h-4" />
                <span className={`text-sm font-medium transition-all ${xpForfeited ? 'text-zinc-600 line-through' : ''}`}>
                  {xpForfeited ? '0 XP' : `${problem.xp} XP`}
                </span>
              </div>
            </div>

            {/* Problem Statement */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Problem</h2>
              <div className="text-lg text-zinc-300 leading-relaxed">
                {renderLatex(problem.problem)}
              </div>
            </div>

            {/* Answer Input Section */}
            <div className="mb-8 p-6 bg-zinc-800/30 border border-zinc-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-white">Your Answer</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
                  placeholder="Enter your answer (e.g., 2/3 or 0.667)"
                  disabled={isCompleted || answerStatus === 'correct'}
                  className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-phthalo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <Button
                  onClick={onSubmit}
                  disabled={!userAnswer.trim() || submitting || isCompleted || answerStatus === 'correct'}
                  className="bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900 disabled:opacity-50 disabled:cursor-not-allowed px-8"
                >
                  {submitting ? 'Checking...' : 'Submit'}
                </Button>
              </div>
              
              {/* Feedback Message */}
              {answerStatus === 'correct' && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-400">Correct!</p>
                    <p className="text-sm text-zinc-400">
                      {xpForfeited ? 'No XP earned (solution was viewed)' : `Great job! You earned ${problem.xp} XP.`}
                    </p>
                  </div>
                </div>
              )}
              
              {answerStatus === 'incorrect' && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="font-semibold text-red-400">Not quite right. Try again!</p>
                  <p className="text-sm text-zinc-400 mt-1">Hint: Check your calculations or try a different form (fraction/decimal)</p>
                </div>
              )}
            </div>

            {/* Hint Section (Collapsible) */}
            {problem.hint && (
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={onShowHint}
                  className="bg-zinc-800/50 border-phthalo-500/20 text-phthalo-400 hover:bg-phthalo-500/10 hover:border-phthalo-500/40 hover:text-phthalo-300"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </Button>
                
                {showHint && (
                  <div className="mt-4 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                    <div className="text-zinc-300">
                      {renderLatex(problem.hint)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Solution Toggle with Warning */}
            <div className="border-t border-zinc-800 pt-6">
              <Button
                onClick={handleShowSolution}
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </Button>

              {showSolution && (
                <div className="mt-6 p-6 bg-gradient-to-br from-phthalo-900/20 to-zinc-900/20 border border-phthalo-500/20 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-phthalo-400">Solution</h3>
                  <div className="text-zinc-300 leading-relaxed">
                    {renderLatex(problem.solution)}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Next Problem Arrow Button (floating on right) */}
          <button
            onClick={handleNextProblem}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 group"
            title="Next Problem"
          >
            <div className="w-12 h-12 rounded-full bg-zinc-800/50 border-2 border-zinc-700 flex items-center justify-center hover:border-phthalo-500 hover:bg-phthalo-500/10 transition-all duration-300 group-hover:scale-110">
              <ChevronRight className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
            </div>
          </button>
        </div>

        {/* Bottom Next Problem Button (kept for mobile) */}
        <div className="flex justify-center lg:hidden">
          <Button
            onClick={handleNextProblem}
            size="lg"
            variant="outline"
            className="bg-zinc-800/50 border-phthalo-500/20 text-phthalo-400 hover:bg-phthalo-500/10 hover:border-phthalo-500/40 hover:text-phthalo-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Next Problem
          </Button>
        </div>
      </div>

      {/* Solution Warning Modal */}
      {showSolutionWarning && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={() => setShowSolutionWarning(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-200">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">View Solution?</h3>
                    <p className="text-zinc-400 text-sm">
                      Viewing the solution will forfeit all XP for this problem. You won't earn any points even if you solve it afterwards.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowSolutionWarning(false)}
                    variant="outline"
                    className="flex-1 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmViewSolution}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    View Anyway
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}