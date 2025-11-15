// app/academy/problems/components/problems-filters.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface ProblemsFiltersProps {
  typeFilter: 'all' | 'math' | 'coding'
  onTypeFilterChange: (type: 'all' | 'math' | 'coding') => void
  
  categories: string[]
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

          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium text-zinc-400 mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant="outline"
                  className={`cursor-pointer transition-all capitalize px-3 py-1.5 ${
                    selectedCategories.includes(category)
                      ? 'bg-phthalo-500/20 text-phthalo-300 border-phthalo-500/40 hover:bg-phthalo-500/30'
                      : 'bg-zinc-800/50 text-zinc-400 border-zinc-700 hover:bg-zinc-800 hover:text-white'
                  }`}
                  onClick={() => onCategoryToggle(category)}
                >
                  {category.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
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