'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Calculator, Code } from 'lucide-react'

interface FilterModalProps {
  isOpen: boolean
  currentType: 'math' | 'coding'
  currentCategories: string[]
  currentDifficulties: string[]
  onClose: () => void
  onApply: (type: 'math' | 'coding', categories: string[], difficulties: string[]) => void
}

const mathCategories = [
  { id: 'probability', label: 'Probability', icon: '🎲' },
  { id: 'calculus', label: 'Calculus', icon: '∫' },
  { id: 'linear_algebra', label: 'Linear Algebra', icon: '⊗' },
  { id: 'statistics', label: 'Statistics', icon: '📊' },
]

const difficulties = ['beginner', 'intermediate', 'advanced']

export function FilterModal({
  isOpen,
  currentType,
  currentCategories,
  currentDifficulties,
  onClose,
  onApply,
}: FilterModalProps) {
  const [selectedType, setSelectedType] = useState(currentType)
  const [selectedCategories, setSelectedCategories] = useState(currentCategories)
  const [selectedDifficulties, setSelectedDifficulties] = useState(currentDifficulties)

  useEffect(() => {
    setSelectedType(currentType)
    setSelectedCategories(currentCategories)
    setSelectedDifficulties(currentDifficulties)
  }, [currentType, currentCategories, currentDifficulties, isOpen])

  if (!isOpen) return null

  const handleApply = () => {
    onApply(selectedType, selectedCategories, selectedDifficulties)
    onClose()
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl pointer-events-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <h3 className="text-xl font-bold text-white">Edit Filters</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">Problem Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedType('math')
                    setSelectedCategories([])
                  }}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedType === 'math'
                      ? 'border-phthalo-500 bg-phthalo-500/10'
                      : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                  }`}
                >
                  <Calculator className="w-6 h-6 mx-auto mb-1 text-phthalo-400" />
                  <div className="font-medium text-white text-sm">Math</div>
                </button>

                <button
                  disabled
                  className="p-4 rounded-lg border border-zinc-700 bg-zinc-800/30 opacity-50 cursor-not-allowed"
                >
                  <Code className="w-6 h-6 mx-auto mb-1 text-zinc-500" />
                  <div className="font-medium text-zinc-500 text-sm">Coding</div>
                </button>
              </div>
            </div>

            {/* Category Selection */}
            {selectedType === 'math' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  Category {selectedCategories.length > 0 && (
                    <span className="text-phthalo-400 ml-2">
                      - Selected {selectedCategories.length}/{mathCategories.length}
                    </span>
                  )}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {mathCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        selectedCategories.includes(cat.id)
                          ? 'border-phthalo-500 bg-phthalo-500/10'
                          : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-medium text-white text-xs">{cat.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty Selection */}
            {selectedCategories.length > 0 && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  Difficulty {selectedDifficulties.length > 0 && (
                    <span className="text-phthalo-400 ml-2">
                      - Selected {selectedDifficulties.length}/{difficulties.length}
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => toggleDifficulty(diff)}
                      className={`flex-1 py-2 px-3 rounded-lg border transition-all capitalize text-sm ${
                        selectedDifficulties.includes(diff)
                          ? 'border-phthalo-500 bg-phthalo-500/10 text-white'
                          : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 text-zinc-400'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-zinc-800">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              disabled={!selectedType || selectedCategories.length === 0 || selectedDifficulties.length === 0}
              className="bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900 disabled:opacity-50"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}