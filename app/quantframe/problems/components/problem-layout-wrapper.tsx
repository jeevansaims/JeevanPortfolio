// app/quantframe/problems/components/problem-layout-wrapper.tsx
'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProblemListSidebar } from './problem-list-sidebar'

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

interface ProblemLayoutContextType {
  refreshProblems: () => Promise<void>
}

const ProblemLayoutContext = createContext<ProblemLayoutContextType | null>(null)

export function useProblemLayout() {
  const context = useContext(ProblemLayoutContext)
  if (!context) {
    throw new Error('useProblemLayout must be used within ProblemLayoutWrapper')
  }
  return context
}

interface ProblemLayoutWrapperProps {
  children: React.ReactNode
  problemType: 'math' | 'coding'
}

export function ProblemLayoutWrapper({ children, problemType }: ProblemLayoutWrapperProps) {
  const params = useParams()
  const supabase = createClient()
  const problemId = params.id as string

  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)

  const loadProblems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Determine which table to query based on problem type
      const table = problemType === 'math' ? 'math_problems' : 'coding_problems'
      const completionTable = problemType === 'math' ? 'user_problem_completions' : 'user_coding_completions'

      // Fetch problems (excluding lesson-specific math problems)
      const query = supabase.from(table).select('*')
      if (problemType === 'math') {
        query.is('lesson_id', null)
      }

      const { data: problemsData } = await query

      // Fetch completions
      const { data: completions } = await supabase
        .from(completionTable)
        .select('problem_id, status')
        .eq('user_id', user.id)

      const completionMap = new Map(
        completions?.map(c => [c.problem_id, c.status]) || []
      )

      const formattedProblems: Problem[] = (problemsData || []).map(p => ({
        id: p.id,
        type: problemType,
        problem_number: p.problem_number,
        title: p.title,
        problem: p.problem,
        category: p.category,
        difficulty: p.difficulty,
        status: completionMap.get(p.id) || 'unsolved'
      }))

      setProblems(formattedProblems)
    } catch (error) {
      console.error('Error loading problems:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProblems()
  }, [problemType])

  const refreshProblems = async () => {
    await loadProblems()
  }

  return (
    <ProblemLayoutContext.Provider value={{ refreshProblems }}>
      <div className="flex min-h-screen">
        {/* Sidebar - ALWAYS visible, persists across problem navigation */}
        <ProblemListSidebar
          problems={problems}
          currentProblemId={problemId}
          problemType={problemType}
        />

        {/* Main Content - changes with each problem */}
        <div className="flex-1 ml-80">
          {children}
        </div>
      </div>
    </ProblemLayoutContext.Provider>
  )
}
