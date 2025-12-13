// app/quantframe/problems/math/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react'
import { MathCard } from '@/app/quantframe/daily/components/math-card'
import { resetMathProblem, completeMathProblem } from '@/app/quantframe/actions/problems'
import { useProblemLayout } from '../../components/problem-layout-wrapper'
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

export default function MathProblemPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const { refreshProblems } = useProblemLayout()

  const problemId = params.id as string

  const [loading, setLoading] = useState(true)
  const [problem, setProblem] = useState<MathProblem | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    loadProblem()
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
        await refreshProblems()
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

      // Refresh sidebar to show updated status
      await refreshProblems()

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
    <div className="p-6">
      {/* Back Button */}
      <Button
        onClick={() => router.push('/quantframe/problems')}
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

      {/* Problem Card */}
      <MathCard
        problem={problem}
        completed={isCompleted}
        onComplete={handleComplete}
      />
    </div>
  )
}
