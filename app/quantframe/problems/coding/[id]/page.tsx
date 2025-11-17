// app/quantframe/problems/coding/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ArrowLeft, CheckCircle2, Lightbulb, AlertCircle, Trophy, RotateCcw } from 'lucide-react'
import { CodeEditor } from '@/app/quantframe/practice/coding/components/code-editor'
import { ProblemListSidebar } from '../../components/problem-list-sidebar'
import { resetCodingProblem, completeCodingProblem } from '@/app/quantframe/actions/problems'
import { toast } from 'sonner'

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

interface Problem {
  id: string
  type: 'math' | 'coding'
  problem_number?: number
  title?: string
  problem: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  status: 'completed' | 'attempted' | 'unsolved'
}

const difficultyColors = {
  beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20'
}

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

export default function CodingProblemPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const problemId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [problem, setProblem] = useState<CodingProblem | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [allProblems, setAllProblems] = useState<Problem[]>([])
  
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [xpForfeited, setXpForfeited] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    loadProblem()
    loadAllProblems()
  }, [problemId])

  const loadProblem = async () => {
    setLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }
      setUserId(user.id)

      const { data: problemData, error: problemError } = await supabase
        .from('coding_problems')
        .select('*')
        .eq('id', problemId)
        .single()

      if (problemError) throw problemError
      setProblem(problemData)

      const { data: completion } = await supabase
        .from('user_coding_completions')
        .select('status')
        .eq('user_id', user.id)
        .eq('problem_id', problemId)
        .maybeSingle()

      if (completion?.status === 'completed') {
        setIsCompleted(true)
      }

    } catch (error) {
      console.error('Error loading problem:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAllProblems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: problemsData } = await supabase
        .from('coding_problems')
        .select('*')

      const { data: completions } = await supabase
        .from('user_coding_completions')
        .select('problem_id, status')
        .eq('user_id', user.id)

      const completionMap = new Map(
        completions?.map(c => [c.problem_id, c.status]) || []
      )

      const problems: Problem[] = (problemsData || []).map(p => ({
        id: p.id,
        type: 'coding' as const,
        problem_number: p.problem_number,
        title: p.title,
        problem: p.problem,
        category: p.category,
        difficulty: p.difficulty,
        status: completionMap.get(p.id) || 'unsolved'
      }))

      setAllProblems(problems)
    } catch (error) {
      console.error('Error loading all problems:', error)
    }
  }

  const handleSuccess = async () => {
    if (!problem || !userId || isCompleted) return

    try {
      const result = await completeCodingProblem(problem.id)

      if (result.error) {
        toast.error(result.error)
        return
      }

      if (!result.alreadyCompleted) {
        setIsCompleted(true)
        await loadAllProblems()
      }
    } catch (error) {
      console.error('Error saving completion:', error)
      toast.error('Failed to save completion')
    }
  }

  const handleShowSolution = () => {
    if (!showSolution && !xpForfeited && !isCompleted) {
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

  const handleReset = async () => {
    if (!problem || !userId) return

    try {
      const result = await resetCodingProblem(problem.id)

      if (result.error) {
        toast.error(result.error)
        return
      }

      // Reset local state
      setIsCompleted(false)
      setShowHint(false)
      setShowSolution(false)
      setXpForfeited(false)

      // Reload problems list
      await loadAllProblems()

      toast.success('Problem reset! You can solve it again.')
    } catch (error) {
      console.error('Error resetting problem:', error)
      toast.error('Failed to reset problem')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-phthalo-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading problem...</p>
        </div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-400">Problem not found</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <ProblemListSidebar
        problems={allProblems}
        currentProblemId={problemId}
        problemType="coding"
      />

      <div className="flex-1 ml-80">
        <div className="p-6">
          {/* Back Button - Fixed styling */}
          <Button
            onClick={() => router.push('/quantframe/problems')}
            variant="ghost"
            size="sm"
            className="mb-6 text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Problems
          </Button>

          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
                  {problem.category.charAt(0).toUpperCase() + problem.category.slice(1).replace('_', ' ')}
                  {problem.problem_number && ` #${problem.problem_number}`}
                </h1>
                {isCompleted && (
                  <>
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="sm"
                      className="bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-phthalo-500/10 hover:border-phthalo-500/40 hover:text-phthalo-300"
                    >
                      <RotateCcw className="w-3 h-3 mr-1.5" />
                      Reset
                    </Button>
                  </>
                )}
              </div>
              <Badge variant="outline" className={difficultyColors[problem.difficulty]}>
                {problem.difficulty}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-zinc-400 mb-6">
              <Trophy className="w-4 h-4" />
              <span className={`text-sm font-medium ${xpForfeited ? 'text-zinc-600 line-through' : ''}`}>
                {xpForfeited ? '0 XP' : `${problem.xp} XP`}
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Problem</h2>
              <div className="text-zinc-300">
                {renderProblemText(problem.problem)}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-white">Your Solution</h3>
              <CodeEditor
                starterCode={problem.starter_code}
                testCases={problem.test_cases}
                onSuccess={handleSuccess}
                disabled={false}
                xpValue={problem.xp}
                xpForfeited={xpForfeited}
                isCompleted={isCompleted}
              />
            </div>

            {problem.hint && (
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={() => setShowHint(!showHint)}
                  className="bg-zinc-800/50 border-phthalo-500/20 text-phthalo-400 hover:bg-phthalo-500/10 hover:border-phthalo-500/40 hover:text-phthalo-300"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </Button>
                
                {showHint && (
                  <div className="mt-4 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                    <div className="text-zinc-300 whitespace-pre-wrap">{formatText(problem.hint)}</div>
                  </div>
                )}
              </div>
            )}

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
                  <div className="text-zinc-300">
                    {renderSolution(problem.solution)}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

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
    </div>
  )
}