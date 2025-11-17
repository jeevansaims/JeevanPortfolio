'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Code, Calculator, ChevronRight } from 'lucide-react'

interface GeneratorCardProps {
  onGenerate: (type: 'math' | 'coding', categories: string[], difficulties: string[]) => void
}

const mathCategories = [
  { id: 'probability', label: 'Probability', icon: '🎲' },
  { id: 'calculus', label: 'Calculus', icon: '∫' },
  { id: 'linear_algebra', label: 'Linear Algebra', icon: '⊗' },
  { id: 'statistics', label: 'Statistics', icon: '📊' },
]

const difficulties = ['beginner', 'intermediate', 'advanced']

export function GeneratorCard({ onGenerate }: GeneratorCardProps) {
  const [selectedType, setSelectedType] = useState<'math' | 'coding' | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])

  const handleGenerate = () => {
    if (selectedType && selectedCategories.length > 0 && selectedDifficulties.length > 0) {
      onGenerate(selectedType, selectedCategories, selectedDifficulties)
    }
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

  const canGenerate = selectedType && selectedCategories.length > 0 && selectedDifficulties.length > 0

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-2xl bg-zinc-900/50 border-zinc-800 backdrop-blur-sm p-8 relative overflow-hidden">
        {/* Decorative gradient blob */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-phthalo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-phthalo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-phthalo-400" />
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
                Generate Problem
              </h2>
            </div>
            <p className="text-zinc-400">Select your preferences and start practicing</p>
          </div>

          {/* Step 1: Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-zinc-300 mb-3">Problem Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setSelectedType('math')
                  setSelectedCategories([])
                }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedType === 'math'
                    ? 'border-phthalo-500 bg-phthalo-500/10'
                    : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                }`}
              >
                <Calculator className="w-8 h-8 mx-auto mb-2 text-phthalo-400" />
                <div className="font-semibold text-white">Math</div>
                <div className="text-xs text-zinc-400 mt-1">Quant fundamentals</div>
              </button>

              <button
                disabled
                className="p-6 rounded-xl border-2 border-zinc-700 bg-zinc-800/30 opacity-50 cursor-not-allowed"
              >
                <Code className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
                <div className="font-semibold text-zinc-500">Coding</div>
                <div className="text-xs text-zinc-500 mt-1">Coming soon</div>
              </button>
            </div>
          </div>

          {/* Step 2: Category Selection (only if Math selected) */}
          {selectedType === 'math' && (
            <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Category {selectedCategories.length > 0 && (
                  <span className="text-phthalo-400 ml-2">
                    - Selected {selectedCategories.length}/{mathCategories.length}
                  </span>
                )}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {mathCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-4 rounded-lg border transition-all text-left ${
                      selectedCategories.includes(cat.id)
                        ? 'border-phthalo-500 bg-phthalo-500/10'
                        : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="font-medium text-white text-sm">{cat.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Difficulty Selection (only if category selected) */}
          {selectedCategories.length > 0 && (
            <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Difficulty {selectedDifficulties.length > 0 && (
                  <span className="text-phthalo-400 ml-2">
                    - Selected {selectedDifficulties.length}/{difficulties.length}
                  </span>
                )}
              </label>
              <div className="flex gap-3">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => toggleDifficulty(diff)}
                    className={`flex-1 py-3 px-4 rounded-lg border transition-all capitalize ${
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

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="w-full bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900 disabled:opacity-50 disabled:cursor-not-allowed h-12 text-base font-semibold"
          >
            {canGenerate ? (
              <>
                Generate Problem <ChevronRight className="ml-2 w-5 h-5" />
              </>
            ) : (
              'Select all options to continue'
            )}
          </Button>

          {/* Selected Summary (if all selected) */}
          {canGenerate && (
            <div className="mt-4 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-400">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span>Generating:</span>
                {selectedCategories.map(cat => (
                  <Badge key={cat} variant="outline" className="bg-phthalo-500/10 text-phthalo-400 border-phthalo-500/20 capitalize">
                    {cat.replace('_', ' ')}
                  </Badge>
                ))}
                <span>•</span>
                {selectedDifficulties.map(diff => (
                  <Badge key={diff} variant="outline" className="bg-zinc-700/50 text-zinc-300 border-zinc-600 capitalize">
                    {diff}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}