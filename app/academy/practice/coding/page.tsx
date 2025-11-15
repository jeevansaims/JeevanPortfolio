// app/academy/practice/coding/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Settings, ChevronRight, Lightbulb, AlertCircle } from 'lucide-react'
import { CodeEditor } from './components/code-editor'
import { ProgressBar } from '../math/components/progress-bar'

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

const difficultyColors = {
  beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20'
}

// Helper to format text with newlines and code blocks
const formatText = (text: string) => {
  if (!text) return ''
  return text.replace(/\\n/g, '\n')
}

// Helper to render problem text with inline code formatting
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

// Helper to render solution with code blocks and formatting
const renderSolution = (text: string) => {
  if (!text) return null
  
  const formatted = formatText(text)
  
  // Split by code blocks (```language...```)
  const parts = formatted.split(/(```[\s\S]*?```)/g)
  
  return (
    <div className="space-y-4">
      {parts.map((part, idx) => {
        // Code block
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.split('\n')
          const language = lines[0].replace('```', '').trim()
          const code = lines.slice(1, -1).join('\n')
          
          return (
            <pre key={idx} className="bg-zinc-800 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm font-mono text-zinc-300">
                {code}
              </code>
            </pre>
          )
        }
        
        // Regular text with inline code and bold
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

function CodingPracticeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Parse URL params
  const categories = searchParams.get('categories')?.split(',') || []
  const difficulties = searchParams.get('difficulties')?.split(',') || []

  // State
  const [problem, setProblem] = useState<CodingProblem | null>(null)
  const [loading, setLoading] = useState(true)
  const [noProblemsAvailable, setNoProblemsAvailable] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set())
  const [completionsLoaded, setCompletionsLoaded] = useState(false)
  const [recentProblems, setRecentProblems] = useState<string[]>([])
  
  // Progress State (for single category + difficulty)
  const [progressSolved, setProgressSolved] = useState(0)
  const [progressTotal, setProgressTotal] = useState(0)
  
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [xpForfeited, setXpForfeited] = useState(false)
  const [showSolutionWarning, setShowSolutionWarning] = useState(false)
  const [solved, setSolved] = useState(false)

  // Load user
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        
        const { data: completions } = await supabase
          .from('user_coding_completions')
          .select('problem_id, status')
          .eq('user_id', user.id)
        
        if (completions) {
          const completed = new Set<string>()
          completions.forEach(c => {
            if (c.status === 'completed') {
              completed.add(c.problem_id)
            }
          })
          setCompletedProblems(completed)
        }
      }
      setCompletionsLoaded(true)
    }
    loadUser()
  }, [])

  // Fetch problem (wait for completions to load first)
  useEffect(() => {
    if (completionsLoaded && categories.length > 0 && difficulties.length > 0) {
      fetchProblem()
    }
  }, [completionsLoaded])

  const fetchProblem = async () => {
    setLoading(true)
    setSolved(false)
    setShowHint(false)
    setShowSolution(false)
    setXpForfeited(false)

    try {
      const { data: problems, error } = await supabase
        .from('coding_problems')
        .select('*')
        .in('category', categories)
        .in('difficulty', difficulties)

      if (error) throw error
      if (!problems || problems.length === 0) {
        setNoProblemsAvailable(true)
        setProblem(null) // Clear current problem
        return
      }

      // Calculate progress (only if single category AND single difficulty)
      if (categories.length === 1 && difficulties.length === 1) {
        const totalInCategory = problems.length
        const solvedInCategory = problems.filter(p => completedProblems.has(p.id)).length
        setProgressSolved(solvedInCategory)
        setProgressTotal(totalInCategory)
      } else {
        setProgressSolved(0)
        setProgressTotal(0)
      }

      // Filter out completed problems
      const unsolvedProblems = problems.filter(p => !completedProblems.has(p.id))

      if (unsolvedProblems.length === 0) {
        setNoProblemsAvailable(true)
        setProblem(null) // Clear current problem
        return
      }

      // Filter out recent problems to avoid immediate repeats
      const availableProblems = unsolvedProblems.filter(p => !recentProblems.includes(p.id))
      const problemPool = availableProblems.length > 0 ? availableProblems : unsolvedProblems

      // Pick random problem
      const randomIdx = Math.floor(Math.random() * problemPool.length)
      setProblem(problemPool[randomIdx])
      
      // Track recent problems (keep last 5)
      setRecentProblems(prev => [problemPool[randomIdx].id, ...prev].slice(0, 5))
      
    } catch (error) {
      console.error('Error fetching problem:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = async () => {
    if (!problem || !userId || solved) return

    setSolved(true)

    try {
      await supabase
        .from('user_coding_completions')
        .upsert({
          user_id: userId,
          problem_id: problem.id,
          status: 'completed'
        }, {
          onConflict: 'user_id,problem_id'
        })
      
      setCompletedProblems(prev => new Set([...prev, problem.id]))
      
      // Update progress if single category + difficulty
      if (categories.length === 1 && difficulties.length === 1) {
        const newSolved = progressSolved + 1
        setProgressSolved(newSolved)
      }
    } catch (error) {
      console.error('Error saving completion:', error)
    }
  }

  const handleShowSolution = () => {
    if (!showSolution && !xpForfeited && !solved) {
      setShowSolutionWarning(true)
    } else {
      setShowSolution(!showSolution)
    }
  }

  const handleConfirmViewSolution = () => {
    setXpForfeited(true)
    setShowSolution(true)
    setShowSolutionWarning(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-400">Loading problem...</div>
      </div>
    )
  }

  if (!problem) {
    if (noProblemsAvailable) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <Card className="w-full max-w-2xl bg-zinc-900/50 border-zinc-800 backdrop-blur-sm p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                All Problems Completed! 🎉
              </h2>
              <p className="text-zinc-400">
                You've solved all problems for:
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                {categories.map(cat => (
                  <Badge key={cat} variant="outline" className="bg-phthalo-500/10 text-phthalo-400 border-phthalo-500/20 capitalize">
                    {cat.replace('_', ' ')}
                  </Badge>
                ))}
                <span className="text-zinc-500">•</span>
                {difficulties.map(diff => (
                  <Badge key={diff} variant="outline" className="bg-zinc-700/50 text-zinc-300 border-zinc-600 capitalize">
                    {diff}
                  </Badge>
                ))}
              </div>
              <p className="text-zinc-500 text-sm mt-3">
                Try a different difficulty or category to continue practicing!
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={() => router.push('/academy/practice')}
                className="bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900"
              >
                Choose New Filters
              </Button>
            </div>
          </Card>
        </div>
      )
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl bg-zinc-900/50 border-zinc-800 backdrop-blur-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Problems Available</h2>
          <p className="text-zinc-400 mb-6">Try different categories or difficulties</p>
          <Button onClick={() => router.push('/academy/practice')}>
            Back to Generator
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
              {problem.category.charAt(0).toUpperCase() + problem.category.slice(1).replace('_', ' ')}
              {problem.problem_number && ` #${problem.problem_number}`}
            </h1>
            <p className="text-zinc-400 text-sm mt-1">Write your solution and run the tests!</p>
          </div>
          
          <Button
            onClick={() => router.push('/academy/practice')}
            variant="outline"
            size="sm"
            className="bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
          >
            <Settings className="w-4 h-4 mr-2" />
            Change Filters
          </Button>
        </div>

        {/* Progress Bar (only show for single category + single difficulty) */}
        {categories.length === 1 && difficulties.length === 1 && progressTotal > 0 && (
          <ProgressBar 
            solved={progressSolved}
            total={progressTotal}
            category={categories[0]}
            difficulty={difficulties[0]}
          />
        )}

        {/* Problem Card */}
        <div className="relative">
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm p-8 mb-6">
            {/* Badges */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <Badge variant="outline" className={difficultyColors[problem.difficulty]}>
                  {problem.difficulty}
                </Badge>
                <Badge variant="outline" className="bg-phthalo-500/10 text-phthalo-400 border-phthalo-500/20">
                  {problem.category.replace('_', ' ')}
                </Badge>
                {solved && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <span className={`text-sm font-medium ${xpForfeited ? 'text-zinc-600 line-through' : 'text-zinc-400'}`}>
                {xpForfeited ? '0 XP' : `${problem.xp} XP`}
              </span>
            </div>

            {/* Problem Statement */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Problem</h2>
              <div className="text-zinc-300">
                {renderProblemText(problem.problem)}
              </div>
            </div>

            {/* Code Editor */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-white">Your Solution</h3>
              <CodeEditor
                starterCode={problem.starter_code}
                testCases={problem.test_cases}
                onSuccess={handleSuccess}
                disabled={false}
                xpValue={problem.xp}
                xpForfeited={xpForfeited}
              />
            </div>

            {/* Hint */}
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

            {/* Solution */}
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

          {/* Next Problem Arrow */}
          <button
            onClick={fetchProblem}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 group hidden lg:block"
            title="Next Problem"
          >
            <div className="w-12 h-12 rounded-full bg-zinc-800/50 border-2 border-zinc-700 flex items-center justify-center hover:border-phthalo-500 hover:bg-phthalo-500/10 transition-all duration-300 group-hover:scale-110">
              <ChevronRight className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
            </div>
          </button>
        </div>

        {/* Mobile Next Button */}
        <div className="flex justify-center lg:hidden">
          <Button
            onClick={fetchProblem}
            size="lg"
            variant="outline"
            className="bg-zinc-800/50 border-phthalo-500/20 text-phthalo-400 hover:bg-phthalo-500/10"
          >
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
                      Viewing the solution will forfeit all XP for this problem.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowSolutionWarning(false)}
                    variant="outline"
                    className="flex-1 bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-800"
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

export default function CodingPracticePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CodingPracticeContent />
    </Suspense>
  )
}