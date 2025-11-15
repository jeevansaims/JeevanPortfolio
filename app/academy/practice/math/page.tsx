// app/academy/practice/math/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProblemCard } from './components/problem-card'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

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

function MathPracticeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Parse URL params
  const categories = searchParams.get('categories')?.split(',') || []
  const difficulties = searchParams.get('difficulties')?.split(',') || []

  // UI State
  const [loading, setLoading] = useState(true)
  const [noProblemsAvailable, setNoProblemsAvailable] = useState(false)

  // Problem State
  const [problem, setProblem] = useState<MathProblem | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [recentProblems, setRecentProblems] = useState<string[]>([])

  // Progress State
  const [progressSolved, setProgressSolved] = useState(0)
  const [progressTotal, setProgressTotal] = useState(0)

  // Answer State
  const [userAnswer, setUserAnswer] = useState('')
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle')
  const [submitting, setSubmitting] = useState(false)
  const [xpForfeited, setXpForfeited] = useState(false)

  // User State
  const [userId, setUserId] = useState<string | null>(null)
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set())
  const [attemptedProblems, setAttemptedProblems] = useState<Set<string>>(new Set())

  // Load user data on mount
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        
        const { data: completions } = await supabase
          .from('user_problem_completions')
          .select('problem_id, status')
          .eq('user_id', user.id)
        
        if (completions) {
          const completed = new Set<string>()
          const attempted = new Set<string>()
          
          completions.forEach(c => {
            if (c.status === 'completed') {
              completed.add(c.problem_id)
            } else if (c.status === 'attempted') {
              attempted.add(c.problem_id)
            }
          })
          
          setCompletedProblems(completed)
          setAttemptedProblems(attempted)
        }
      }
    }
    loadUser()
  }, [])

  // Fetch problem on mount
  useEffect(() => {
    if (categories.length > 0 && difficulties.length > 0) {
      fetchProblem()
    }
  }, [])

  // Fetch random problem based on filters
  const fetchProblem = async () => {
    setLoading(true)
    setShowHint(false)
    setShowSolution(false)
    setUserAnswer('')
    setAnswerStatus('idle')
    setNoProblemsAvailable(false)
    setXpForfeited(false)

    try {
      const { data: problems, error } = await supabase
        .from('math_problems')
        .select('*')
        .in('category', categories)
        .in('difficulty', difficulties)
        .is('lesson_id', null) // Only get practice problems, not quiz questions

      if (error) throw error

      if (!problems || problems.length === 0) {
        setNoProblemsAvailable(true)
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
        return
      }

      // Filter out recent problems
      const availableProblems = unsolvedProblems.filter(p => !recentProblems.includes(p.id))
      const problemPool = availableProblems.length > 0 ? availableProblems : unsolvedProblems

      // Pick random problem
      const randomIndex = Math.floor(Math.random() * problemPool.length)
      const selectedProblem = problemPool[randomIndex]
      
      setProblem(selectedProblem)

      // Track recent problems
      setRecentProblems(prev => [selectedProblem.id, ...prev].slice(0, 5))

    } catch (error) {
      console.error('Error fetching problem:', error)
    } finally {
      setLoading(false)
    }
  }

  // Answer checking logic
  const checkAnswerMatch = (userInput: string, correctAnswer: string): boolean => {
    const gcd = (a: number, b: number): number => {
      a = Math.abs(a)
      b = Math.abs(b)
      while (b !== 0) {
        const temp = b
        b = a % b
        a = temp
      }
      return a
    }

    const simplifyFraction = (numerator: number, denominator: number): string => {
      if (denominator === 0) return 'invalid'
      const divisor = gcd(numerator, denominator)
      const simpNum = numerator / divisor
      const simpDenom = denominator / divisor
      if (simpDenom === 1) return simpNum.toString()
      return `${simpNum}/${simpDenom}`
    }

    const decimalToFraction = (decimal: number, tolerance: number = 0.0001): string => {
      if (Number.isInteger(decimal)) return decimal.toString()
      for (let d = 1; d <= 10000; d++) {
        const n = Math.round(decimal * d)
        if (Math.abs((n / d) - decimal) < tolerance) {
          return simplifyFraction(n, d)
        }
      }
      return decimal.toString()
    }

    const parseAnswer = (input: string): string => {
      const trimmed = input.trim()
      if (trimmed.includes('/')) {
        const parts = trimmed.split('/')
        if (parts.length !== 2) return 'invalid'
        const num = parseFloat(parts[0].trim())
        const denom = parseFloat(parts[1].trim())
        if (isNaN(num) || isNaN(denom)) return 'invalid'
        return simplifyFraction(num, denom)
      }
      const value = parseFloat(trimmed)
      if (isNaN(value)) return 'invalid'
      if (Number.isInteger(value)) return value.toString()
      return decimalToFraction(value)
    }

    const userParsed = parseAnswer(userInput)
    const correctParsed = parseAnswer(correctAnswer)
    
    if (userParsed === 'invalid' || correctParsed === 'invalid') return false
    return userParsed === correctParsed
  }

  // Submit answer
  const handleSubmitAnswer = async () => {
    if (!problem || !userId || !userAnswer.trim()) return
    
    setSubmitting(true)
    
    try {
      const isCorrect = checkAnswerMatch(userAnswer, problem.answer)
      
      if (isCorrect) {
        setAnswerStatus('correct')
        
        await supabase
          .from('user_problem_completions')
          .upsert({
            user_id: userId,
            problem_id: problem.id,
            status: 'completed'
          }, {
            onConflict: 'user_id,problem_id'
          })
        
        setCompletedProblems(prev => new Set([...prev, problem.id]))
        setAttemptedProblems(prev => {
          const newSet = new Set(prev)
          newSet.delete(problem.id)
          return newSet
        })

        // Update progress
        if (categories.length === 1 && difficulties.length === 1) {
          const newSolved = progressSolved + 1
          setProgressSolved(newSolved)
        }
      } else {
        setAnswerStatus('incorrect')
        
        if (!completedProblems.has(problem.id)) {
          await supabase
            .from('user_problem_completions')
            .upsert({
              user_id: userId,
              problem_id: problem.id,
              status: 'attempted'
            }, {
              onConflict: 'user_id,problem_id'
            })
          
          setAttemptedProblems(prev => new Set([...prev, problem.id]))
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleForfeitXP = () => {
    setXpForfeited(true)
  }

  const isCompleted = problem ? completedProblems.has(problem.id) : false
  const isAttempted = problem ? attemptedProblems.has(problem.id) : false

  // Loading state
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

  // No problems available
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

  // Show problem
  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl bg-zinc-900/50 border-zinc-800 backdrop-blur-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Problem Found</h2>
          <p className="text-zinc-400 mb-6">Unable to load a problem with the selected filters.</p>
          <Button onClick={() => router.push('/academy/practice')}>
            Back to Generator
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <ProblemCard
      problem={problem}
      isCompleted={isCompleted}
      isAttempted={isAttempted}
      answerStatus={answerStatus}
      userAnswer={userAnswer}
      submitting={submitting}
      showHint={showHint}
      showSolution={showSolution}
      showProgress={categories.length === 1 && difficulties.length === 1}
      progressSolved={progressSolved}
      progressTotal={progressTotal}
      selectedCategory={categories[0]}
      selectedDifficulty={difficulties[0]}
      xpForfeited={xpForfeited}
      onAnswerChange={setUserAnswer}
      onSubmit={handleSubmitAnswer}
      onShowHint={() => setShowHint(!showHint)}
      onShowSolution={() => setShowSolution(!showSolution)}
      onNextProblem={fetchProblem}
      onEditFilters={() => router.push('/academy/practice')}
      onForfeitXP={handleForfeitXP}
    />
  )
}

export default function MathPracticePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-phthalo-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    }>
      <MathPracticeContent />
    </Suspense>
  )
}