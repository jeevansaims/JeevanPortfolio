// app/quantframe/quiz/page.tsx

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
  QUIZ_STEPS,
  TOTAL_QUIZ_STEPS,
  CURRENT_STAGE_OPTIONS,
  PRIMARY_GOAL_OPTIONS,
  MATH_BACKGROUND_OPTIONS,
  CS_SKILLS_OPTIONS,
  MARKET_KNOWLEDGE_OPTIONS,
  HOURS_LABELS,
  LEARNING_STYLE_OPTIONS,
  MOTIVATION_LABELS,
  CURRENT_CHALLENGE_OPTIONS,
  type RoadmapQuizData,
} from "./types/roadmap-quiz"
import { QuizOption } from "./components/quiz-option"
import { QuizMultiOption } from "./components/quiz-multi-option"
import { QuizSlider } from "./components/quiz-slider"
import { QuizProgress } from "./components/quiz-progress"

export default function RoadmapQuizPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Quiz state
  const [quizData, setQuizData] = useState<RoadmapQuizData>({
    current_stage: "",
    primary_goal: "",
    math_background: [],
    cs_skills: [],
    market_knowledge: [],
    hours_per_week: 2, // default to 5-10 hours
    learning_style: "",
    motivation_level: 5, // default to middle
    current_challenge: [],
  })

  const canProceed = () => {
    switch (currentStep) {
      case QUIZ_STEPS.CURRENT_STAGE:
        return quizData.current_stage !== ""
      case QUIZ_STEPS.PRIMARY_GOAL:
        return quizData.primary_goal !== ""
      case QUIZ_STEPS.MATH_BACKGROUND:
        return quizData.math_background.length > 0
      case QUIZ_STEPS.CS_SKILLS:
        return quizData.cs_skills.length > 0
      case QUIZ_STEPS.MARKET_KNOWLEDGE:
        return quizData.market_knowledge.length > 0
      case QUIZ_STEPS.HOURS_PER_WEEK:
        return true // slider always has a value
      case QUIZ_STEPS.LEARNING_STYLE:
        return quizData.learning_style !== ""
      case QUIZ_STEPS.MOTIVATION_LEVEL:
        return true // slider always has a value
      case QUIZ_STEPS.CURRENT_CHALLENGE:
        return quizData.current_challenge.length > 0
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed() && currentStep < TOTAL_QUIZ_STEPS - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleMultiSelect = (field: keyof Pick<RoadmapQuizData, 'math_background' | 'cs_skills' | 'market_knowledge' | 'current_challenge'>, value: string) => {
    const currentValues = quizData[field]
    
    // If selecting "none", clear all other selections
    if (value === 'none') {
      setQuizData({ ...quizData, [field]: ['none'] })
      return
    }
    
    // If "none" is selected and user selects something else, remove "none"
    const filtered = currentValues.filter(v => v !== 'none')
    
    if (currentValues.includes(value)) {
      // Remove if already selected
      setQuizData({ ...quizData, [field]: filtered.filter(v => v !== value) })
    } else {
      // Add to selection
      setQuizData({ ...quizData, [field]: [...filtered, value] })
    }
  }

  const handleSubmit = async () => {
    if (!canProceed()) return

    setIsSubmitting(true)
    try {
      // Create Supabase client
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        toast.error("Authentication error. Please log in again.")
        router.push("/quantframe/login")
        return
      }

      // Save quiz response to Supabase
      const { error: insertError } = await supabase
        .from("roadmap_quiz_responses")
        .upsert({
          user_id: user.id,
          ...quizData,
        })

      if (insertError) {
        console.error("Error saving quiz:", insertError)
        toast.error("Failed to save your responses. Please try again.")
        return
      }

      toast.success("Quiz completed successfully!")
      
      // Redirect to dashboard
      router.push("/quantframe/dashboard")
    } catch (error) {
      console.error("Unexpected error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderQuestion = () => {
    switch (currentStep) {
      case QUIZ_STEPS.CURRENT_STAGE:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">What's your current status?</h2>
              <p className="text-zinc-400">Help us understand where you're coming from</p>
            </div>
            <div className="space-y-3">
              {CURRENT_STAGE_OPTIONS.map((option, idx) => (
                <QuizOption
                  key={option.value}
                  label={option.label}
                  emoji={option.emoji}
                  selected={quizData.current_stage === option.value}
                  onClick={() => setQuizData({ ...quizData, current_stage: option.value })}
                  index={idx}
                />
              ))}
            </div>
          </div>
        )

      case QUIZ_STEPS.PRIMARY_GOAL:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">What's your primary goal?</h2>
              <p className="text-zinc-400">What do you want to achieve?</p>
            </div>
            <div className="space-y-3">
              {PRIMARY_GOAL_OPTIONS.map((option, idx) => (
                <QuizOption
                  key={option.value}
                  label={option.label}
                  emoji={option.emoji}
                  selected={quizData.primary_goal === option.value}
                  onClick={() => setQuizData({ ...quizData, primary_goal: option.value })}
                  index={idx}
                />
              ))}
            </div>
          </div>
        )

      case QUIZ_STEPS.MATH_BACKGROUND:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">What math do you know?</h2>
              <p className="text-zinc-400">Select all that apply</p>
            </div>
            <div className="space-y-3">
              {MATH_BACKGROUND_OPTIONS.map((option, idx) => (
                <QuizMultiOption
                  key={option.value}
                  label={option.label}
                  emoji={option.emoji}
                  selected={quizData.math_background.includes(option.value)}
                  onClick={() => handleMultiSelect('math_background', option.value)}
                  index={idx}
                />
              ))}
            </div>
          </div>
        )

      case QUIZ_STEPS.CS_SKILLS:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">What programming skills do you have?</h2>
              <p className="text-zinc-400">Select all that apply</p>
            </div>
            <div className="space-y-3">
              {CS_SKILLS_OPTIONS.map((option, idx) => (
                <QuizMultiOption
                  key={option.value}
                  label={option.label}
                  emoji={option.emoji}
                  selected={quizData.cs_skills.includes(option.value)}
                  onClick={() => handleMultiSelect('cs_skills', option.value)}
                  index={idx}
                />
              ))}
            </div>
          </div>
        )

      case QUIZ_STEPS.MARKET_KNOWLEDGE:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">What do you know about finance?</h2>
              <p className="text-zinc-400">Select all that apply</p>
            </div>
            <div className="space-y-3">
              {MARKET_KNOWLEDGE_OPTIONS.map((option, idx) => (
                <QuizMultiOption
                  key={option.value}
                  label={option.label}
                  emoji={option.emoji}
                  selected={quizData.market_knowledge.includes(option.value)}
                  onClick={() => handleMultiSelect('market_knowledge', option.value)}
                  index={idx}
                />
              ))}
            </div>
          </div>
        )

      case QUIZ_STEPS.HOURS_PER_WEEK:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">How much time can you commit?</h2>
              <p className="text-zinc-400">Hours per week you can dedicate</p>
            </div>
            <QuizSlider
              value={quizData.hours_per_week}
              onChange={(val) => setQuizData({ ...quizData, hours_per_week: val })}
              labels={HOURS_LABELS}
              emoji="⏰"
            />
          </div>
        )

      case QUIZ_STEPS.LEARNING_STYLE:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">How do you prefer to learn?</h2>
              <p className="text-zinc-400">Choose your learning style</p>
            </div>
            <div className="space-y-3">
              {LEARNING_STYLE_OPTIONS.map((option, idx) => (
                <QuizOption
                  key={option.value}
                  label={option.label}
                  emoji={option.emoji}
                  selected={quizData.learning_style === option.value}
                  onClick={() => setQuizData({ ...quizData, learning_style: option.value })}
                  index={idx}
                />
              ))}
            </div>
          </div>
        )

      case QUIZ_STEPS.MOTIVATION_LEVEL:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">How committed are you?</h2>
              <p className="text-zinc-400">Rate your motivation to become a quant</p>
            </div>
            <QuizSlider
              value={quizData.motivation_level}
              onChange={(val) => setQuizData({ ...quizData, motivation_level: val })}
              labels={MOTIVATION_LABELS}
              emoji="🔥"
            />
          </div>
        )

      case QUIZ_STEPS.CURRENT_CHALLENGE:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">What are your biggest challenges?</h2>
              <p className="text-zinc-400">Select all that apply</p>
            </div>
            <div className="space-y-3">
              {CURRENT_CHALLENGE_OPTIONS.map((option, idx) => (
                <QuizMultiOption
                  key={option.value}
                  label={option.label}
                  emoji={option.emoji}
                  selected={quizData.current_challenge.includes(option.value)}
                  onClick={() => handleMultiSelect('current_challenge', option.value)}
                  index={idx}
                />
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8 sm:mb-12">
            <QuizProgress currentStep={currentStep + 1} totalSteps={TOTAL_QUIZ_STEPS} />
          </div>

          {/* Question Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderQuestion()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 sm:mt-12">
            <Button
              onClick={handleBack}
              disabled={currentStep === 0}
              variant="outline"
              className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < TOTAL_QUIZ_STEPS - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="flex-1 bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Complete Quiz
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}