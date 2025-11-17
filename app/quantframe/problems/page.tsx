// app/quantframe/problems/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProgressStats } from './components/progress-stats'
import { ProblemsFilters } from './components/problems-filters'
import { ProblemsTable } from './components/problems-table'

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

interface Category {
  id: string
  name: string
  description: string
  type: 'math' | 'coding'
}

export default function ProblemsPage() {
  const supabase = createClient()
  
  // Data state
  const [loading, setLoading] = useState(true)
  const [mathProblems, setMathProblems] = useState<Problem[]>([])
  const [codingProblems, setCodingProblems] = useState<Problem[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [allCategories, setAllCategories] = useState<Category[]>([])

  // Filter state
  const [typeFilter, setTypeFilter] = useState<'all' | 'math' | 'coding'>('all')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<('beginner' | 'intermediate' | 'advanced')[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'unsolved' | 'attempted'>('all')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)

  useEffect(() => {
    loadProblems()
  }, [])

  const loadProblems = async () => {
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }
      setUserId(user.id)

      // Fetch categories from database
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('problem_categories')
        .select('*')
        .order('name', { ascending: true })

      if (categoriesError) throw categoriesError
      setAllCategories(categoriesData || [])

      // Fetch math problems (excluding quiz questions)
      const { data: mathData, error: mathError } = await supabase
        .from('math_problems')
        .select('*')
        .is('lesson_id', null)

      if (mathError) throw mathError

      // Fetch coding problems
      const { data: codingData, error: codingError } = await supabase
        .from('coding_problems')
        .select('*')

      if (codingError) throw codingError

      // Fetch user completions for math
      const { data: mathCompletions } = await supabase
        .from('user_problem_completions')
        .select('problem_id, status')
        .eq('user_id', user.id)

      // Fetch user completions for coding
      const { data: codingCompletions } = await supabase
        .from('user_coding_completions')
        .select('problem_id, status')
        .eq('user_id', user.id)

      // Create maps for quick lookup
      const mathCompletionMap = new Map(
        mathCompletions?.map(c => [c.problem_id, c.status]) || []
      )
      const codingCompletionMap = new Map(
        codingCompletions?.map(c => [c.problem_id, c.status]) || []
      )

      // Combine problems with status
      const mathProblemsWithStatus: Problem[] = (mathData || []).map(p => ({
        id: p.id,
        type: 'math' as const,
        problem_number: p.problem_number,
        title: p.title,
        problem: p.problem,
        category: p.category,
        difficulty: p.difficulty,
        status: mathCompletionMap.get(p.id) || 'unsolved'
      }))

      const codingProblemsWithStatus: Problem[] = (codingData || []).map(p => ({
        id: p.id,
        type: 'coding' as const,
        problem_number: p.problem_number,
        title: p.title,
        problem: p.problem,
        category: p.category,
        difficulty: p.difficulty,
        status: codingCompletionMap.get(p.id) || 'unsolved'
      }))

      setMathProblems(mathProblemsWithStatus)
      setCodingProblems(codingProblemsWithStatus)

    } catch (error) {
      console.error('Error loading problems:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get all problems based on type filter
  const allProblems = useMemo(() => {
    if (typeFilter === 'math') return mathProblems
    if (typeFilter === 'coding') return codingProblems
    return [...mathProblems, ...codingProblems]
  }, [typeFilter, mathProblems, codingProblems])

  // Get available categories based on type filter (from database, not from problems)
  const availableCategories = useMemo(() => {
    // Only show categories when a specific type is selected
    if (typeFilter === 'all') return []

    // Filter categories by type
    return allCategories.filter(cat => cat.type === typeFilter)
  }, [typeFilter, allCategories])

  // Filtered problems
  const filteredProblems = useMemo(() => {
    return allProblems.filter(problem => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(problem.category)) {
        return false
      }
      
      // Difficulty filter
      if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(problem.difficulty)) {
        return false
      }
      
      // Status filter
      if (statusFilter !== 'all' && problem.status !== statusFilter) {
        return false
      }
      
      return true
    })
  }, [allProblems, selectedCategories, selectedDifficulties, statusFilter])

  // Progress calculations - counts 'completed' status from database
  const mathSolved = mathProblems.filter(p => (p.status as string) === 'completed').length
  const codingSolved = codingProblems.filter(p => (p.status as string) === 'completed').length

  // Filter handlers
  const handleTypeFilterChange = (type: 'all' | 'math' | 'coding') => {
    setTypeFilter(type)
    setSelectedCategories([]) // Clear category selections when changing type
    setCurrentPage(1)
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
    setCurrentPage(1)
  }

  const handleDifficultyToggle = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    setSelectedDifficulties(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    )
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (status: 'all' | 'completed' | 'unsolved' | 'attempted') => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setTypeFilter('all')
    setSelectedCategories([])
    setSelectedDifficulties([])
    setStatusFilter('all')
    setCurrentPage(1)
  }

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-phthalo-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading problems...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600 mb-2">
            Problem Set
          </h1>
          <p className="text-zinc-400">Browse and solve all available problems</p>
        </div>

        {/* Progress Stats */}
        <ProgressStats
          mathSolved={mathSolved}
          mathTotal={mathProblems.length}
          codingSolved={codingSolved}
          codingTotal={codingProblems.length}
        />

        {/* Filters */}
        <ProblemsFilters
          typeFilter={typeFilter}
          onTypeFilterChange={handleTypeFilterChange}
          categories={availableCategories}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          difficulties={['beginner', 'intermediate', 'advanced']}
          selectedDifficulties={selectedDifficulties}
          onDifficultyToggle={handleDifficultyToggle}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Results Count */}
        <div className="mb-4 text-sm text-zinc-400">
          Showing {filteredProblems.length} {filteredProblems.length === 1 ? 'problem' : 'problems'}
        </div>

        {/* Table */}
        {filteredProblems.length > 0 ? (
          <ProblemsTable
            problems={filteredProblems}
            categories={allCategories}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        ) : (
          <div className="text-center py-12 bg-zinc-900/50 border border-zinc-800 rounded-lg">
            <p className="text-zinc-400">No problems match your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}