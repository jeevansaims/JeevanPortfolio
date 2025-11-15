// app/academy/problems/components/problems-table.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, AlertCircle, ChevronUp, ChevronDown, Code2, Calculator } from 'lucide-react'

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

interface ProblemsTableProps {
  problems: Problem[]
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (items: number) => void
}

type SortField = 'status' | 'number' | 'difficulty' | null
type SortDirection = 'asc' | 'desc'

const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 }
const statusOrder = { completed: 1, attempted: 2, unsolved: 3 }

export function ProblemsTable({ 
  problems, 
  currentPage, 
  itemsPerPage, 
  onPageChange, 
  onItemsPerPageChange 
}: ProblemsTableProps) {
  const router = useRouter()
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Sorting logic
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedProblems = [...problems].sort((a, b) => {
    if (!sortField) return 0

    let comparison = 0
    
    if (sortField === 'status') {
      comparison = statusOrder[a.status] - statusOrder[b.status]
    } else if (sortField === 'number') {
      comparison = (a.problem_number || 0) - (b.problem_number || 0)
    } else if (sortField === 'difficulty') {
      comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
    }

    return sortDirection === 'asc' ? comparison : -comparison
  })

  // Pagination
  const totalPages = Math.ceil(sortedProblems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProblems = sortedProblems.slice(startIndex, endIndex)

  const handleProblemClick = (problem: Problem) => {
    router.push(`/academy/problems/${problem.type}/${problem.id}`)
  }

  // Status icon function - handles completed, attempted, and unsolved
  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-4 h-4 text-green-400" />
    if (status === 'attempted') return <AlertCircle className="w-4 h-4 text-yellow-400" />
    return <Circle className="w-4 h-4 text-zinc-600" />
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 text-zinc-600" />
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-phthalo-400" />
      : <ChevronDown className="w-4 h-4 text-phthalo-400" />
  }

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th 
                className="text-left p-4 text-sm font-medium text-zinc-400 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>
              <th className="text-left p-4 text-sm font-medium text-zinc-400">Type</th>
              <th className="text-left p-4 text-sm font-medium text-zinc-400">Title</th>
              <th className="text-left p-4 text-sm font-medium text-zinc-400">Category</th>
              <th 
                className="text-left p-4 text-sm font-medium text-zinc-400 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('difficulty')}
              >
                <div className="flex items-center gap-2">
                  Difficulty
                  <SortIcon field="difficulty" />
                </div>
              </th>
              <th className="text-left p-4 text-sm font-medium text-zinc-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProblems.map((problem) => (
              <tr 
                key={problem.id}
                className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors cursor-pointer"
                onClick={() => handleProblemClick(problem)}
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(problem.status)}
                    <span className="text-sm text-zinc-400 capitalize">{problem.status}</span>
                  </div>
                </td>
                <td className="p-4">
                  {problem.type === 'math' ? (
                    <Calculator className="w-4 h-4 text-phthalo-400" />
                  ) : (
                    <Code2 className="w-4 h-4 text-phthalo-400" />
                  )}
                </td>
                <td className="p-4 text-sm text-white max-w-md">
                  {problem.title || (
                    <span className="text-zinc-500 italic">
                      {problem.problem.substring(0, 60)}...
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <Badge variant="outline" className="bg-zinc-800/50 text-zinc-400 border-zinc-700 capitalize">
                    {problem.category.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge 
                    variant="outline" 
                    className={`capitalize ${
                      problem.difficulty === 'beginner'
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : problem.difficulty === 'intermediate'
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {problem.difficulty}
                  </Badge>
                </td>
                <td className="p-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-phthalo-400 hover:text-phthalo-300 hover:bg-phthalo-500/10"
                  >
                    Solve
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {paginatedProblems.map((problem) => (
          <div
            key={problem.id}
            onClick={() => handleProblemClick(problem)}
            className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:bg-zinc-800/30 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {getStatusIcon(problem.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white mb-1">
                    {problem.title || (
                      <span className="text-zinc-500 italic">
                        {problem.problem.substring(0, 50)}...
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {problem.type === 'math' ? (
                      <Calculator className="w-3 h-3 text-phthalo-400" />
                    ) : (
                      <Code2 className="w-3 h-3 text-phthalo-400" />
                    )}
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
                      {problem.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-phthalo-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-zinc-400">per page</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            Previous
          </Button>
          
          <span className="text-sm text-zinc-400">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}