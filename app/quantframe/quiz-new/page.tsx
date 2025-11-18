"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { createClient } from '@/lib/supabase/client'
import {
  MATH_MILESTONES,
  CODING_MILESTONES,
  FINANCE_MILESTONES,
  EXECUTION_CATEGORIES
} from '../lib/roadmap-milestones'

type Track = 'trader' | 'researcher' | 'dev'
type Level = 'beginner' | 'intermediate' | 'advanced'

interface QuizResponses {
  track: Track | null
  math: {
    level: Level | null
    subcategories: string[]
    milestones: string[]
  }
  coding: {
    level: Level | null
    subcategories: string[]
    milestones: string[]
  }
  finance: {
    level: Level | null
    subcategories: string[]
    milestones: string[]
  }
  execution: string[]
}

export default function SimplifiedQuizPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [responses, setResponses] = useState<QuizResponses>({
    track: null,
    math: { level: null, subcategories: [], milestones: [] },
    coding: { level: null, subcategories: [], milestones: [] },
    finance: { level: null, subcategories: [], milestones: [] },
    execution: []
  })

  const totalSteps = 5 // Track, Math, Coding, Finance, Execution

  const handleTrackSelect = (track: Track) => {
    setResponses({ ...responses, track })
  }

  const handleLevelSelect = (category: 'math' | 'coding' | 'finance', level: Level) => {
    setResponses({
      ...responses,
      [category]: { ...responses[category], level, subcategories: [], milestones: [] }
    })
  }

  const handleSubcategoryToggle = (category: 'math' | 'coding' | 'finance', subcategory: string) => {
    const current = responses[category].subcategories
    const updated = current.includes(subcategory)
      ? current.filter(s => s !== subcategory)
      : [...current, subcategory]

    setResponses({
      ...responses,
      [category]: { ...responses[category], subcategories: updated }
    })
  }

  const handleMilestoneToggle = (category: 'math' | 'coding' | 'finance', milestoneId: string) => {
    const current = responses[category].milestones
    const updated = current.includes(milestoneId)
      ? current.filter(m => m !== milestoneId)
      : [...current, milestoneId]

    setResponses({
      ...responses,
      [category]: { ...responses[category], milestones: updated }
    })
  }

  const handleExecutionToggle = (categoryId: string) => {
    const updated = responses.execution.includes(categoryId)
      ? responses.execution.filter(c => c !== categoryId)
      : [...responses.execution, categoryId]

    setResponses({ ...responses, execution: updated })
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return responses.track !== null
      case 2:
        return responses.math.level !== null
      case 3:
        return responses.coding.level !== null
      case 4:
        return responses.finance.level !== null
      case 5:
        return true // Execution is optional
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!responses.track) {
      toast.error('Please complete all required questions')
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      // Get user
      console.log('🔐 Getting user...')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.error('❌ Auth error:', userError)
        toast.error('Please log in to continue')
        router.push('/quantframe/login')
        return
      }

      console.log('✅ User authenticated:', user.id)
      console.log('📤 Sending quiz responses:', responses)

      // Call API to generate filtered roadmap
      const res = await fetch('/api/generate-roadmap-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          responses
        })
      })

      console.log('📡 API Response status:', res.status)

      if (!res.ok) {
        const error = await res.json()
        console.error('❌ API Error:', error)
        throw new Error(error.details || error.error || 'Failed to generate roadmap')
      }

      const result = await res.json()
      console.log('✅ Success! Result:', result)

      toast.success('Your personalized roadmap is ready!')
      router.push('/quantframe/dashboard')

    } catch (error) {
      console.error('💥 Client error generating roadmap:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to generate roadmap')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMilestonesForCategory = (category: 'math' | 'coding' | 'finance') => {
    const milestoneMap = {
      math: MATH_MILESTONES,
      coding: CODING_MILESTONES,
      finance: FINANCE_MILESTONES
    }
    return milestoneMap[category]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-zinc-400">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-phthalo-600 to-phthalo-400"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Track Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-zinc-900/50 border-zinc-800 p-8">
                <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
                  Which path interests you?
                </h2>
                <p className="text-zinc-400 mb-8">Choose the quantitative finance role you're targeting</p>

                <div className="space-y-4">
                  {[
                    { value: 'trader' as Track, label: 'Quant Trader', desc: 'Develop and execute systematic trading strategies' },
                    { value: 'researcher' as Track, label: 'Quant Researcher', desc: 'Design models and discover alpha through research' },
                    { value: 'dev' as Track, label: 'Quant Developer', desc: 'Build high-performance trading systems and infrastructure' }
                  ].map((track) => (
                    <button
                      key={track.value}
                      onClick={() => handleTrackSelect(track.value)}
                      className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                        responses.track === track.value
                          ? 'border-phthalo-500 bg-phthalo-500/10'
                          : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">{track.label}</h3>
                          <p className="text-sm text-zinc-400">{track.desc}</p>
                        </div>
                        {responses.track === track.value && (
                          <Check className="w-6 h-6 text-phthalo-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Steps 2-4: Math, Coding, Finance */}
          {[2, 3, 4].includes(currentStep) && (
            <motion.div
              key={`step${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {(() => {
                const categoryMap = { 2: 'math', 3: 'coding', 4: 'finance' } as const
                const category = categoryMap[currentStep as 2 | 3 | 4]
                const categoryLabels = { math: 'Math', coding: 'Coding', finance: 'Finance' }
                const categoryLabel = categoryLabels[category]
                const categoryData = responses[category]
                const milestones = getMilestonesForCategory(category)

                return (
                  <Card className="bg-zinc-900/50 border-zinc-800 p-8">
                    <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
                      What's your {categoryLabel} background?
                    </h2>
                    <p className="text-zinc-400 mb-8">Help us understand your current level</p>

                    {/* Level Selection */}
                    <div className="mb-8">
                      <label className="block text-white font-medium mb-4">Current Level</label>
                      <div className="grid grid-cols-3 gap-4">
                        {(['beginner', 'intermediate', 'advanced'] as Level[]).map((level) => (
                          <button
                            key={level}
                            onClick={() => handleLevelSelect(category, level)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              categoryData.level === level
                                ? 'border-phthalo-500 bg-phthalo-500/10'
                                : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                            }`}
                          >
                            <span className="text-white font-medium capitalize">{level}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Subcategory Selection - Show if Intermediate or Advanced */}
                    {categoryData.level && categoryData.level !== 'beginner' && (
                      <div className="mb-8">
                        <label className="block text-white font-medium mb-4">
                          Which areas are you comfortable with?
                        </label>
                        <div className="space-y-3">
                          {milestones.map((subcat) => (
                            <label
                              key={subcat.subcategory}
                              className="flex items-center gap-3 p-4 rounded-lg border border-zinc-700 bg-zinc-800/30 hover:bg-zinc-800/50 cursor-pointer transition-all"
                            >
                              <input
                                type="checkbox"
                                checked={categoryData.subcategories.includes(subcat.subcategory)}
                                onChange={() => handleSubcategoryToggle(category, subcat.subcategory)}
                                className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-phthalo-600 focus:ring-phthalo-500 focus:ring-offset-zinc-900"
                              />
                              <div className="flex-1">
                                <div className="text-white font-medium">{subcat.label}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Milestone Drill-Down - Show for each selected subcategory */}
                    {categoryData.subcategories.length > 0 && (
                      <div className="space-y-6">
                        {categoryData.subcategories.map((selectedSubcat) => {
                          const subcatData = milestones.find(m => m.subcategory === selectedSubcat)
                          if (!subcatData) return null

                          return (
                            <div key={selectedSubcat} className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700">
                              <h4 className="text-white font-semibold mb-4">
                                Within {subcatData.label}, what have you covered?
                              </h4>
                              <div className="space-y-2">
                                {subcatData.milestones.map((milestone) => (
                                  <label
                                    key={milestone.id}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-700/30 cursor-pointer transition-all"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={categoryData.milestones.includes(milestone.id)}
                                      onChange={() => handleMilestoneToggle(category, milestone.id)}
                                      className="w-4 h-4 mt-0.5 rounded border-zinc-600 bg-zinc-800 text-phthalo-600 focus:ring-phthalo-500 focus:ring-offset-zinc-900"
                                    />
                                    <div className="flex-1">
                                      <div className="text-white text-sm font-medium">{milestone.label}</div>
                                      <div className="text-zinc-400 text-xs mt-0.5">{milestone.description}</div>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </Card>
                )
              })()}
            </motion.div>
          )}

          {/* Step 5: Execution */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-zinc-900/50 border-zinc-800 p-8">
                <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
                  What career help do you need?
                </h2>
                <p className="text-zinc-400 mb-8">Select the areas where you'd like guidance (optional)</p>

                <div className="space-y-3">
                  {EXECUTION_CATEGORIES.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-start gap-3 p-4 rounded-lg border border-zinc-700 bg-zinc-800/30 hover:bg-zinc-800/50 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={responses.execution.includes(cat.id)}
                        onChange={() => handleExecutionToggle(cat.id)}
                        className="w-5 h-5 mt-0.5 rounded border-zinc-600 bg-zinc-800 text-phthalo-600 focus:ring-phthalo-500 focus:ring-offset-zinc-900"
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium">{cat.label}</div>
                        <div className="text-zinc-400 text-sm mt-1">{cat.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900 disabled:opacity-50"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !canProceed()}
              className="bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Roadmap
                  <Check className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
