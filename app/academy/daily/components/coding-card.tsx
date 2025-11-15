// app/academy/daily/components/coding-card.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Trophy, Lightbulb, AlertCircle } from 'lucide-react'
import { CodeEditor } from '../../practice/coding/components/code-editor'
import confetti from 'canvas-confetti'

interface CodingProblem {
  id: string
  problem: string
  hint: string
  solution: string
  starter_code: string
  test_cases: any[]
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  xp: number
  problem_number?: number
}

interface CodingCardProps {
  problem: CodingProblem
  completed: boolean
  onComplete: () => void
}

const difficultyColors = {
  beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20'
}

// Helper to format text
const formatText = (text: string) => {
  if (!text) return ''
  return text.replace(/\\n/g, '\n')
}

const renderProblemText = (text: string) => {
  if (!text) return null
  
  const formatted = formatText(text)
  const parts = formatted.split(/(`[^`]+`)/g)
  
  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {parts.map((part, idx) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          const code = part.slice(1, -1)
          return (
            <code key={idx} className="px-2 py-0.5 bg-zinc-800 rounded text-phthalo-300 font-mono text-sm">
              {code}
            </code>
          )
        }
        return <span key={idx}>{part}</span>
      })}
    </div>
  )
}

const renderSolution = (text: string) => {
  if (!text) return null
  
  const formatted = formatText(text)
  const parts = formatted.split(/(```[\s\S]*?```)/g)
  
  return (
    <div className="space-y-4">
      {parts.map((part, idx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.split('\n')
          const code = lines.slice(1, -1).join('\n')
          
          return (
            <pre key={idx} className="bg-zinc-800 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm font-mono text-zinc-300">
                {code}
              </code>
            </pre>
          )
        }
        
        const textParts = part.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
        
        return (
          <div key={idx} className="whitespace-pre-wrap leading-relaxed">
            {textParts.map((textPart, textIdx) => {
              if (textPart.startsWith('`') && textPart.endsWith('`')) {
                const code = textPart.slice(1, -1)
                return (
                  <code key={textIdx} className="px-2 py-0.5 bg-zinc-800 rounded text-phthalo-300 font-mono text-sm">
                    {code}
                  </code>
                )
              }
              if (textPart.startsWith('**') && textPart.endsWith('**')) {
                const bold = textPart.slice(2, -2)
                return (
                  <strong key={textIdx} className="font-bold text-white">
                    {bold}
                  </strong>
                )
              }
              return <span key={textIdx}>{textPart}</span>
            })}
          </div>
        )
      })}
    </div>
  )
}

export function CodingCard({ problem, completed, onComplete }: CodingCardProps) {
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [xpForfeited, setXpForfeited] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const handleSuccess = async () => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#26804a', '#2d9659', '#34ac68']
    })
    
    // Call parent completion handler
    await onComplete()
  }

  const handleShowSolution = () => {
    if (!showSolution && !xpForfeited && !completed) {
      setShowWarning(true)
    } else {
      setShowSolution(!showSolution)
    }
  }

  const handleConfirmSolution = () => {
    setXpForfeited(true)
    setShowSolution(true)
    setShowWarning(false)
  }

  return (
    <>
      <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Coding</h2>
          <div className="flex gap-2">
            <Badge variant="outline" className={difficultyColors[problem.difficulty]}>
              {problem.difficulty}
            </Badge>
            {completed && (
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-zinc-400 mb-6">
          <Trophy className="w-4 h-4" />
          <span className={`text-sm font-medium ${xpForfeited ? 'text-zinc-600 line-through' : ''}`}>
            {xpForfeited ? '0 XP' : `${problem.xp} XP`}
          </span>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-white">Problem</h3>
          <div className="text-zinc-300 text-sm">
            {renderProblemText(problem.problem)}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 text-white">Your Solution</h3>
          <CodeEditor
            starterCode={problem.starter_code}
            testCases={problem.test_cases}
            onSuccess={handleSuccess}
            disabled={false}
            xpValue={problem.xp}
            xpForfeited={xpForfeited}
          />
        </div>

        {problem.hint && (
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => setShowHint(!showHint)}
              size="sm"
              className="bg-zinc-800/50 border-phthalo-500/20 text-phthalo-400 hover:bg-phthalo-500/10 hover:border-phthalo-500/40 hover:text-phthalo-300"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>
            
            {showHint && (
              <div className="mt-3 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                <div className="text-zinc-300 text-sm whitespace-pre-wrap">
                  {formatText(problem.hint)}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-zinc-800 pt-4">
          <Button
            onClick={handleShowSolution}
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white hover:bg-zinc-800/50"
          >
            {showSolution ? 'Hide Solution' : 'Show Solution'}
          </Button>

          {showSolution && (
            <div className="mt-4 p-4 bg-gradient-to-br from-phthalo-900/20 to-zinc-900/20 border border-phthalo-500/20 rounded-lg">
              <h3 className="text-lg font-bold mb-3 text-phthalo-400">Solution</h3>
              <div className="text-zinc-300 text-sm">
                {renderSolution(problem.solution)}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Warning Modal */}
      {showWarning && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={() => setShowWarning(false)}
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
                      Viewing the solution will forfeit all XP for this problem.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowWarning(false)}
                    variant="outline"
                    className="flex-1 bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmSolution}
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
    </>
  )
}