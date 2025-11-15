// app/academy/problems/math/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react'
import { ProblemListSidebar } from '../../components/problem-list-sidebar'
import { MathCard } from '@/app/academy/daily/components/math-card'
import { resetMathProblem, completeMathProblem } from '@/app/academy/actions/problems'
import { toast } from 'sonner'

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

export default function MathProblemPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const problemId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [problem, setProblem] = useState<MathProblem | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [allProblems, setAllProblems] = useState<Problem[]>([])

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

      // Fetch problem
      const { data: problemData, error: problemError } = await supabase
        .from('math_problems')
        .select('*')
        .eq('id', problemId)
        .single()

      if (problemError) throw problemError
      setProblem(problemData)

      // Check completion status
      const { data: completion } = await supabase
        .from('user_problem_completions')
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

      // Fetch all math problems (excluding quiz questions)
      const { data: problemsData } = await supabase
        .from('math_problems')
        .select('*')
        .is('lesson_id', null)

      // Fetch completions
      const { data: completions } = await supabase
        .from('user_problem_completions')
        .select('problem_id, status')
        .eq('user_id', user.id)

      const completionMap = new Map(
        completions?.map(c => [c.problem_id, c.status]) || []
      )

      const problems: Problem[] = (problemsData || []).map(p => ({
        id: p.id,
        type: 'math' as const,
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

  const handleComplete = async () => {
    if (!problem || !userId || isCompleted) return

    try {
      const result = await completeMathProblem(problem.id)

      if (result.error) {
        toast.error(result.error)
        return
      }

      if (!result.alreadyCompleted) {
        setIsCompleted(true)
        // Refresh sidebar to show updated status
        await loadAllProblems()
      }
    } catch (error) {
      console.error('Error saving completion:', error)
      toast.error('Failed to save completion')
    }
  }

  const handleReset = async () => {
    if (!problem || !userId) return

    try {
      const result = await resetMathProblem(problem.id)

      if (result.error) {
        toast.error(result.error)
        return
      }

      // Reset local state
      setIsCompleted(false)

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
      {/* Sidebar */}
      <ProblemListSidebar
        problems={allProblems}
        currentProblemId={problemId}
        problemType="math"
      />

      {/* Main Content */}
      <div className="flex-1 ml-80">
        <div className="p-6">
          {/* Back Button - Fixed styling */}
          <Button
            onClick={() => router.push('/academy/problems')}
            variant="ghost"
            size="sm"
            className="mb-6 text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Problems
          </Button>

          {/* Header with completion status */}
          {isCompleted && (
            <div className="mb-4 flex items-center gap-3">
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
            </div>
          )}

          {/* Problem Card - same as daily page */}
          <MathCard
            problem={problem}
            completed={isCompleted}
            onComplete={handleComplete}
          />
        </div>
      </div>
    </div>
  )
}