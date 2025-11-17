// app/quantframe/problems/components/problem-list-sidebar.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react'

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

interface ProblemListSidebarProps {
  problems: Problem[]
  currentProblemId: string
  problemType: 'math' | 'coding'
}

export function ProblemListSidebar({ problems, currentProblemId, problemType }: ProblemListSidebarProps) {
  const router = useRouter()

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-3 h-3 text-green-400" />
    if (status === 'attempted') return <AlertCircle className="w-3 h-3 text-yellow-400" />
    return <Circle className="w-3 h-3 text-zinc-600" />
  }

  const handleProblemClick = (problemId: string) => {
    router.push(`/quantframe/problems/${problemType}/${problemId}`)
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-80 bg-zinc-950 border-r border-zinc-800 overflow-y-auto z-40 custom-scrollbar-phthalo">
      <div className="p-4 border-b border-zinc-800 sticky top-0 bg-zinc-950 z-10">
        <h3 className="text-sm font-semibold text-white capitalize">{problemType} Problems</h3>
      </div>

      <div className="p-2">
        {problems.map((problem) => (
          <button
            key={problem.id}
            onClick={() => handleProblemClick(problem.id)}
            className={`w-full p-3 mb-1 rounded-lg text-left transition-all ${
              problem.id === currentProblemId
                ? 'bg-phthalo-600/20 border border-phthalo-500/40'
                : 'hover:bg-zinc-800/50'
            }`}
          >
            <div className="flex items-start gap-2">
              {getStatusIcon(problem.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs capitalize ${
                      problem.difficulty === 'beginner'
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : problem.difficulty === 'intermediate'
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {problem.difficulty.charAt(0)}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-300 line-clamp-2">
                  {problem.title || problem.problem.substring(0, 60) + '...'}
                </p>
                <p className="text-xs text-zinc-500 mt-1 capitalize">
                  {problem.category.replace('_', ' ')}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}