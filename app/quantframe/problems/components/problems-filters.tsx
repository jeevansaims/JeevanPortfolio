// app/quantframe/problems/components/problems-filters.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
  type: 'math' | 'coding'
}

interface ProblemsFiltersProps {
  typeFilter: 'all' | 'math' | 'coding'
  onTypeFilterChange: (type: 'all' | 'math' | 'coding') => void

  categories: Category[]
  selectedCategories: string[]
  onCategoryToggle: (category: string) => void

  difficulties: ('beginner' | 'intermediate' | 'advanced')[]
  selectedDifficulties: ('beginner' | 'intermediate' | 'advanced')[]
  onDifficultyToggle: (difficulty: 'beginner' | 'intermediate' | 'advanced') => void

  statusFilter: 'all' | 'completed' | 'unsolved' | 'attempted'
  onStatusFilterChange: (status: 'all' | 'completed' | 'unsolved' | 'attempted') => void

  onClearFilters: () => void
}

export function ProblemsFilters({
  typeFilter,
  onTypeFilterChange,
  categories,
  selectedCategories,
  onCategoryToggle,
  difficulties,
  selectedDifficulties,
  onDifficultyToggle,
  statusFilter,
  onStatusFilterChange,
  onClearFilters
}: ProblemsFiltersProps) {

  const hasActiveFilters =
    typeFilter !== 'all' ||
    selectedCategories.length > 0 ||
    selectedDifficulties.length > 0 ||
    statusFilter !== 'all'

  return (
    <div className="mb-6 p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg backdrop-blur-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-4">
          {/* Type Filter */}
          <div>
            <label className="text-sm font-medium text-zinc-400 mb-2 block">Problem Type</label>
            <div className="flex gap-2">
              <Button
                variant={typeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTypeFilterChange('all')}
                className={typeFilter === 'all' 
                  ? 'bg-phthalo-600 hover:bg-phthalo-700 text-white border-0' 
                  : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }
              >
                All
              </Button>
              <Button
                variant={typeFilter === 'math' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTypeFilterChange('math')}
                className={typeFilter === 'math' 
                  ? 'bg-phthalo-600 hover:bg-phthalo-700 text-white border-0' 
                  : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }
              >
                Mathematics
              </Button>
              <Button
                variant={typeFilter === 'coding' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTypeFilterChange('coding')}
                className={typeFilter === 'coding' 
                  ? 'bg-phthalo-600 hover:bg-phthalo-700 text-white border-0' 
                  : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }
              >
                Coding
              </Button>
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="text-sm font-medium text-zinc-400 mb-2 block">Difficulty</label>
            <div className="flex gap-2">
              {difficulties.map(difficulty => (
                <Badge
                  key={difficulty}
                  variant="outline"
                  className={`cursor-pointer transition-all capitalize px-3 py-1.5 ${
                    selectedDifficulties.includes(difficulty)
                      ? difficulty === 'beginner'
                        ? 'bg-green-500/20 text-green-300 border-green-500/40 hover:bg-green-500/30'
                        : difficulty === 'intermediate'
                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 hover:bg-yellow-500/30'
                        : 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                      : 'bg-zinc-800/50 text-zinc-400 border-zinc-700 hover:bg-zinc-800 hover:text-white'
                  }`}
                  onClick={() => onDifficultyToggle(difficulty)}
                >
                  {difficulty}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium text-zinc-400 mb-2 block">Status</label>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStatusFilterChange('all')}
                className={statusFilter === 'all' 
                  ? 'bg-phthalo-600 hover:bg-phthalo-700 text-white border-0' 
                  : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStatusFilterChange('completed')}
                className={statusFilter === 'completed' 
                  ? 'bg-green-600 hover:bg-green-700 text-white border-0' 
                  : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }
              >
                Completed
              </Button>
              <Button
                variant={statusFilter === 'attempted' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStatusFilterChange('attempted')}
                className={statusFilter === 'attempted' 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white border-0' 
                  : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }
              >
                Attempted
              </Button>
              <Button
                variant={statusFilter === 'unsolved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStatusFilterChange('unsolved')}
                className={statusFilter === 'unsolved' 
                  ? 'bg-zinc-600 hover:bg-zinc-700 text-white border-0' 
                  : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }
              >
                Unsolved
              </Button>
            </div>
          </div>

          {/* Category Filter - Only show when a specific type is selected */}
          {categories.length > 0 && (
            <div>
              <label className="text-sm font-medium text-zinc-400 mb-2 block">Category</label>
              <div className="relative">
                {/* Scrollable horizontal container */}
                <div
                  className="overflow-x-auto pb-2"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#26804a #18181b'
                  }}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      height: 6px;
                    }
                    div::-webkit-scrollbar-track {
                      background: #18181b;
                      border-radius: 3px;
                    }
                    div::-webkit-scrollbar-thumb {
                      background: #26804a;
                      border-radius: 3px;
                    }
                    div::-webkit-scrollbar-thumb:hover {
                      background: #2d9659;
                    }
                  `}</style>
                  <div className="flex gap-2 min-w-max">
                    {categories.map(category => (
                      <Badge
                        key={category.id}
                        variant="outline"
                        title={category.description}
                        className={`cursor-pointer transition-all whitespace-nowrap px-3 py-1.5 ${
                          selectedCategories.includes(category.id)
                            ? 'bg-phthalo-500/20 text-phthalo-300 border-phthalo-500/40 hover:bg-phthalo-500/30'
                            : 'bg-zinc-800/50 text-zinc-400 border-zinc-700 hover:bg-zinc-800 hover:text-white'
                        }`}
                        onClick={() => onCategoryToggle(category.id)}
                      >
                        {category.name}
                        {selectedCategories.includes(category.id) && (
                          <X className="w-3 h-3 ml-1.5 inline" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Scroll hint gradient on right */}
                {categories.length > 5 && (
                  <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-zinc-900/50 via-zinc-900/30 to-transparent pointer-events-none" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800/50"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}