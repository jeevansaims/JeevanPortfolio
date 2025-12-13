'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { submitModuleExam, saveExamProgress, resetExamProgress } from '@/app/quantframe/actions/exam'
import { toast } from 'sonner'
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  BookOpen,
  Loader2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  RotateCcw
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

interface ExamQuestion {
  id: string
  problem: string
  hint: string
  solution: string
  answer: string
  order_index: number
  section_name: string
  question_type: 'free_text' | 'multiple_choice'
  options?: string[]
  correct_option_index?: number
}

interface ExamClientProps {
  examId: string
  questions: ExamQuestion[]
  attemptNumber: number
  passingScore: number
  initialAnswers?: Record<string, string>
  initialQuestionIndex?: number
}

// Helper function to render text with LaTeX
const renderLatex = (text: string) => {
  if (!text) return null

  const processedText = text.replace(/\\n/g, '\n')
  const blockParts = processedText.split(/(\$\$[^$]+\$\$)/g)

  return (
    <div className="space-y-4">
      {blockParts.map((part, blockIdx) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const latex = part.slice(2, -2)
          return (
            <div key={blockIdx} className="flex justify-center my-4">
              <BlockMath math={latex} />
            </div>
          )
        }

        const paragraphs = part.split('\n\n').filter(p => p.trim())

        return paragraphs.map((paragraph, paraIdx) => {
          const elements = []
          let remaining = paragraph
          let elementKey = 0

          while (remaining) {
            const mathMatch = remaining.match(/\$([^$]+)\$/)
            const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)

            const mathIndex = mathMatch ? remaining.indexOf(mathMatch[0]) : Infinity
            const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity

            if (mathIndex === Infinity && boldIndex === Infinity) {
              if (remaining.trim()) {
                elements.push(<span key={elementKey++}>{remaining}</span>)
              }
              break
            }

            if (mathIndex < boldIndex) {
              if (mathIndex > 0) {
                elements.push(<span key={elementKey++}>{remaining.slice(0, mathIndex)}</span>)
              }
              elements.push(<InlineMath key={elementKey++} math={mathMatch![1]} />)
              remaining = remaining.slice(mathIndex + mathMatch![0].length)
            } else {
              if (boldIndex > 0) {
                elements.push(<span key={elementKey++}>{remaining.slice(0, boldIndex)}</span>)
              }
              elements.push(
                <strong key={elementKey++} className="font-bold text-white">
                  {boldMatch![1]}
                </strong>
              )
              remaining = remaining.slice(boldIndex + boldMatch![0].length)
            }
          }

          return (
            <p key={`${blockIdx}-${paraIdx}`} className="my-2">
              {elements}
            </p>
          )
        })
      })}
    </div>
  )
}

export function ExamClient({
  examId,
  questions,
  attemptNumber,
  passingScore,
  initialAnswers = {},
  initialQuestionIndex = 0
}: ExamClientProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialQuestionIndex)
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [showSolutionWarning, setShowSolutionWarning] = useState(false)
  const [solutionViewedForQuestions, setSolutionViewedForQuestions] = useState<Set<string>>(new Set())
  const [showSubmitWarning, setShowSubmitWarning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [examComplete, setExamComplete] = useState(false)
  const [finalResults, setFinalResults] = useState<{
    score: number
    total: number
    passed: boolean
    details: Record<string, boolean>
  } | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const hasSolutionBeenViewed = solutionViewedForQuestions.has(currentQuestion?.id)
  const hasAnyAnswers = Object.keys(answers).length > 0

  // Reset exam handler
  const handleResetExam = async () => {
    setIsResetting(true)
    try {
      await resetExamProgress({ examId })
      // Reset all client state
      setAnswers({})
      setCurrentQuestionIndex(0)
      setCurrentAnswer('')
      setSelectedOptionIndex(null)
      setSolutionViewedForQuestions(new Set())
      toast.success('Exam progress reset')
    } catch (error) {
      console.error('Failed to reset exam:', error)
      toast.error('Failed to reset exam')
    } finally {
      setIsResetting(false)
    }
  }

  // Auto-save progress function
  const saveProgress = useCallback(async (answersToSave: Record<string, string>, questionIndex: number) => {
    if (examComplete) return

    setIsSaving(true)
    try {
      await saveExamProgress({
        examId,
        answers: answersToSave,
        currentQuestionIndex: questionIndex
      })
    } catch (error) {
      console.error('Failed to save progress:', error)
    } finally {
      setIsSaving(false)
    }
  }, [examId, examComplete])

  // Debounced auto-save when answers change
  useEffect(() => {
    if (Object.keys(answers).length === 0) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveProgress(answers, currentQuestionIndex)
    }, 1000) // Save 1 second after last change

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [answers, currentQuestionIndex, saveProgress])

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (Object.keys(answers).length > 0 && !examComplete) {
        // Use sendBeacon for reliable save on page close
        const data = JSON.stringify({
          examId,
          answers,
          currentQuestionIndex
        })
        navigator.sendBeacon('/api/exam-progress', data)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [answers, currentQuestionIndex, examId, examComplete])

  // Load saved answer when switching questions
  useEffect(() => {
    const savedAnswer = answers[currentQuestion?.id] || ''
    setCurrentAnswer(savedAnswer)

    // For multiple choice, restore the selected option index
    if (currentQuestion?.question_type === 'multiple_choice' && savedAnswer) {
      setSelectedOptionIndex(parseInt(savedAnswer))
    } else {
      setSelectedOptionIndex(null)
    }

    setShowHint(false)
    setShowSolution(false)
  }, [currentQuestionIndex, currentQuestion?.id, currentQuestion?.question_type, answers])

  const handleSaveAnswer = () => {
    let answerToSave = ''

    // Handle multiple choice questions
    if (currentQuestion.question_type === 'multiple_choice') {
      if (selectedOptionIndex === null) {
        toast.error('Please select an answer')
        return
      }
      answerToSave = selectedOptionIndex.toString()
    }
    // Handle free text questions
    else {
      if (!currentAnswer.trim()) {
        toast.error('Please enter an answer')
        return
      }
      answerToSave = currentAnswer
    }

    // Save answer
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answerToSave }))
    toast.success('Answer saved')
  }

  const handleNextQuestion = () => {
    // Auto-save current answer if entered
    if (!answers[currentQuestion.id]) {
      if (currentQuestion.question_type === 'multiple_choice' && selectedOptionIndex !== null) {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: selectedOptionIndex.toString() }))
      } else if (currentAnswer.trim()) {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: currentAnswer }))
      }
    }

    if (isLastQuestion) {
      // Show submit confirmation
      setShowSubmitWarning(true)
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handleSubmitExam = () => {
    // Auto-save current answer if entered
    const allAnswers = { ...answers }
    if (!allAnswers[currentQuestion.id]) {
      if (currentQuestion.question_type === 'multiple_choice' && selectedOptionIndex !== null) {
        allAnswers[currentQuestion.id] = selectedOptionIndex.toString()
      } else if (currentAnswer.trim()) {
        allAnswers[currentQuestion.id] = currentAnswer
      }
    }

    // Show submit confirmation
    setShowSubmitWarning(true)
  }

  const handlePreviousQuestion = () => {
    // Auto-save current answer
    if (!answers[currentQuestion.id]) {
      if (currentQuestion.question_type === 'multiple_choice' && selectedOptionIndex !== null) {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: selectedOptionIndex.toString() }))
      } else if (currentAnswer.trim()) {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: currentAnswer }))
      }
    }

    setCurrentQuestionIndex(prev => prev - 1)
  }

  const handleConfirmSubmit = async () => {
    setShowSubmitWarning(false)
    setSubmitting(true)

    // Get all answers including current unsaved answer
    const allAnswers = { ...answers }
    if (!allAnswers[currentQuestion.id]) {
      if (currentQuestion.question_type === 'multiple_choice' && selectedOptionIndex !== null) {
        allAnswers[currentQuestion.id] = selectedOptionIndex.toString()
      } else if (currentAnswer.trim()) {
        allAnswers[currentQuestion.id] = currentAnswer
      }
    }

    try {
      const result = await submitModuleExam({
        examId,
        attemptNumber,
        answers: allAnswers
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      setFinalResults({
        score: result.score!,
        total: result.total!,
        passed: result.passed!,
        details: result.details!
      })
      setExamComplete(true)

      if (result.passed) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#26804a', '#2d9659', '#34ac68']
        })
      }
    } catch (error) {
      console.error('Error submitting exam:', error)
      toast.error('Failed to submit exam')
    } finally {
      setSubmitting(false)
    }
  }

  const handleShowSolution = () => {
    if (!showSolution && !hasSolutionBeenViewed) {
      setShowSolutionWarning(true)
    } else {
      setShowSolution(!showSolution)
    }
  }

  const handleConfirmViewSolution = () => {
    setSolutionViewedForQuestions(prev => new Set(prev).add(currentQuestion.id))
    setShowSolution(true)
    setShowSolutionWarning(false)
    toast.info('Note: Solution viewing is for learning purposes')
  }

  // Results page
  if (examComplete && finalResults) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-2xl w-full bg-zinc-900/50 border-zinc-800 backdrop-blur-sm p-8">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              finalResults.passed
                ? 'bg-gradient-to-br from-green-500 to-green-700'
                : 'bg-gradient-to-br from-red-500 to-red-700'
            }`}>
              {finalResults.passed ? (
                <Trophy className="w-10 h-10 text-white" />
              ) : (
                <XCircle className="w-10 h-10 text-white" />
              )}
            </div>

            <h2 className="text-4xl font-bold mb-3 text-white">
              {finalResults.passed ? 'Exam Passed!' : 'Not Quite There Yet'}
            </h2>

            <div className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
              {finalResults.score}/{finalResults.total}
            </div>

            <p className="text-lg text-zinc-400">
              {finalResults.passed
                ? `Great work! You scored ${finalResults.score} out of ${finalResults.total} (${Math.round((finalResults.score / finalResults.total) * 100)}%).`
                : `You need ${passingScore}% to pass. You scored ${Math.round((finalResults.score / finalResults.total) * 100)}%. Review the material and try again!`
              }
            </p>
          </div>

          {/* Question Results */}
          <div className="mb-8 space-y-3">
            {questions.map((q, idx) => {
              const correct = finalResults.details[q.id]
              return (
                <div
                  key={q.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    correct
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-red-500/10 border-red-500/20'
                  }`}
                >
                  <span className="text-zinc-300">
                    Question {idx + 1} {q.section_name && <span className="text-zinc-500 text-sm">• {q.section_name}</span>}
                  </span>
                  {correct ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Correct
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
                      <XCircle className="w-3 h-3 mr-1" />
                      Incorrect
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => window.location.reload()}
              size="lg"
              variant="outline"
              className="flex-1"
            >
              {finalResults.passed ? 'Retake Exam' : 'Try Again'}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const answeredCount = Object.keys(answers).filter(k => answers[k]).length +
    ((currentQuestion?.question_type === 'multiple_choice' ? selectedOptionIndex !== null : currentAnswer.trim()) && !answers[currentQuestion?.id] ? 1 : 0)

  // Exam question page
  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">
              Exam Progress
            </span>
            {isSaving && (
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving...
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-phthalo-400">
              {answeredCount}/{questions.length} answered
            </span>
            {hasAnyAnswers && (
              <button
                onClick={handleResetExam}
                disabled={isResetting}
                className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                {isResetting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RotateCcw className="w-3 h-3" />
                )}
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="relative h-2 bg-zinc-800 rounded-full mb-4">
          <div
            className="h-full bg-gradient-to-r from-phthalo-600 to-phthalo-500 rounded-full transition-all duration-500 overflow-hidden relative"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          >
            <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-slide"></div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex gap-1.5 flex-1">
            {questions.map((q, idx) => {
            const isAnswered = answers[q.id]
            const isCurrent = idx === currentQuestionIndex

            // Determine section color based on section name
            let sectionColor = 'border-zinc-700'
            if (q.section_name?.includes('Section A')) {
              sectionColor = 'border-blue-500/50'
            } else if (q.section_name?.includes('Section B')) {
              sectionColor = 'border-green-500/50'
            } else if (q.section_name?.includes('Section C')) {
              sectionColor = 'border-yellow-500/50'
            } else if (q.section_name?.includes('Section D')) {
              sectionColor = 'border-purple-500/50'
            }

            return (
              <div key={q.id} className="flex flex-col items-center gap-0.5">
                <button
                  onClick={() => {
                    // Auto-save current answer before switching
                    if (!answers[currentQuestion.id]) {
                      if (currentQuestion.question_type === 'multiple_choice' && selectedOptionIndex !== null) {
                        setAnswers(prev => ({ ...prev, [currentQuestion.id]: selectedOptionIndex.toString() }))
                      } else if (currentAnswer.trim()) {
                        setAnswers(prev => ({ ...prev, [currentQuestion.id]: currentAnswer }))
                      }
                    }
                    setCurrentQuestionIndex(idx)
                  }}
                  className={`
                    w-7 h-7 rounded border-2 transition-all flex-shrink-0
                    flex items-center justify-center text-xs font-semibold
                    ${isCurrent
                      ? 'bg-phthalo-500 border-phthalo-400 text-white scale-110'
                      : isAnswered
                      ? `bg-zinc-800 ${sectionColor} text-zinc-300 hover:bg-zinc-700`
                      : `bg-zinc-900/50 ${sectionColor} text-zinc-500 hover:bg-zinc-800/50`
                    }
                  `}
                  title={q.section_name}
                >
                  {idx + 1}
                </button>
                {isAnswered && (
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                )}
              </div>
            )
          })}
          </div>

          <Button
            onClick={handleSubmitExam}
            size="sm"
            className="bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900 px-6"
          >
            Submit Exam
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {(() => {
              // Extract unique sections in order they appear
              const uniqueSections: string[] = []
              questions.forEach(q => {
                if (q.section_name && !uniqueSections.includes(q.section_name)) {
                  uniqueSections.push(q.section_name)
                }
              })

              const sectionColors = [
                'border-blue-500/50',
                'border-green-500/50',
                'border-yellow-500/50',
                'border-purple-500/50'
              ]

              return uniqueSections.map((section, idx) => {
                // Extract short label from section name (e.g., "Section A - Vectors & Matrices" -> "Vectors & Matrices")
                const label = section.includes(' - ') ? section.split(' - ')[1] : section
                return (
                  <div key={section} className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded border-2 ${sectionColors[idx % sectionColors.length]} bg-zinc-800`}></div>
                    <span className="text-zinc-500">{label}</span>
                  </div>
                )
              })
            })()}
          </div>
          <div className="flex items-center gap-3 text-zinc-500">
            <span>Question {currentQuestionIndex + 1}/{questions.length}</span>
            <span>•</span>
            <span>Passing: {passingScore}%</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm p-8">
        {/* Top badges */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-phthalo-500/10 text-phthalo-400 border-phthalo-500/20">
              Question {currentQuestionIndex + 1}
            </Badge>
            {currentQuestion.section_name && (
              <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700">
                {currentQuestion.section_name}
              </Badge>
            )}
            {hasSolutionBeenViewed && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                <BookOpen className="w-3 h-3 mr-1" />
                Solution Viewed
              </Badge>
            )}
          </div>
        </div>

        {/* Problem Statement */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Problem</h2>
          <div className="text-lg text-zinc-300 leading-relaxed">
            {renderLatex(currentQuestion.problem)}
          </div>
        </div>

        {/* Answer Input Section */}
        <div className="mb-8 p-6 bg-zinc-800/30 border border-zinc-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-white">Your Answer</h3>

          {/* Multiple Choice Options */}
          {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOptionIndex === index

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedOptionIndex(index)}
                    className={`w-full p-4 rounded-lg text-left transition-all border-2 ${
                      isSelected
                        ? 'border-phthalo-500 bg-phthalo-500/10 cursor-pointer'
                        : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900/70 cursor-pointer'
                    }`}
                  >
                    <span className="text-zinc-300">{option}</span>
                  </button>
                )
              })}

              <Button
                onClick={handleSaveAnswer}
                disabled={selectedOptionIndex === null || answers[currentQuestion.id] === selectedOptionIndex?.toString()}
                className="w-full bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900 disabled:opacity-50"
              >
                {answers[currentQuestion.id] ? 'Update' : 'Save'} Answer
              </Button>
            </div>
          )}

          {/* Free Text Input */}
          {currentQuestion.question_type === 'free_text' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveAnswer()}
                placeholder="Enter your answer..."
                className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-phthalo-500 focus:border-transparent"
              />
              <Button
                onClick={handleSaveAnswer}
                disabled={!currentAnswer.trim() || answers[currentQuestion.id] === currentAnswer}
                className="bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900 disabled:opacity-50 px-8"
              >
                {answers[currentQuestion.id] ? 'Update' : 'Save'} Answer
              </Button>
            </div>
          )}
        </div>

        {/* Hint Section */}
        {currentQuestion.hint && (
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowHint(!showHint)}
              className="bg-zinc-800/50 border-phthalo-500/20 text-phthalo-400 hover:bg-phthalo-500/10 hover:border-phthalo-500/40 hover:text-phthalo-300"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>

            {showHint && (
              <div className="mt-4 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                <div className="text-zinc-300">
                  {renderLatex(currentQuestion.hint)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Solution Section */}
        <div className="border-t border-zinc-800 pt-6">
          <Button
            onClick={handleShowSolution}
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white hover:bg-zinc-800/50"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {showSolution ? 'Hide Solution' : 'Show Solution'}
          </Button>

          {showSolution && (
            <div className="mt-6 p-6 bg-gradient-to-br from-phthalo-900/20 to-zinc-900/20 border border-phthalo-500/20 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-phthalo-400">Solution</h3>
              <div className="text-zinc-300 leading-relaxed mb-4">
                {renderLatex(currentQuestion.solution)}
              </div>
              <div className="text-sm font-semibold text-phthalo-300">
                Answer: {currentQuestion.answer}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        {currentQuestionIndex > 0 && (
          <Button
            onClick={handlePreviousQuestion}
            variant="outline"
            size="lg"
            className="flex-1 bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-500"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>
        )}
        <Button
          onClick={handleNextQuestion}
          disabled={submitting}
          size="lg"
          className="flex-1 bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting Exam...
            </>
          ) : (
            <>
              {isLastQuestion ? 'Submit Exam' : 'Next Question'}
              {!isLastQuestion && <ArrowRight className="w-5 h-5 ml-2" />}
            </>
          )}
        </Button>
      </div>

      {/* Solution Warning Modal */}
      {showSolutionWarning && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
            onClick={() => setShowSolutionWarning(false)}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-200">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">View Solution?</h3>
                    <p className="text-zinc-400 text-sm">
                      This will show you the complete solution. Use this to learn, but make sure you understand the concepts!
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowSolutionWarning(false)}
                    variant="outline"
                    className="flex-1 bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmViewSolution}
                    className="flex-1 bg-phthalo-600 hover:bg-phthalo-700 text-white"
                  >
                    View Solution
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitWarning && (() => {
        // Calculate unanswered count
        const allAnswers = { ...answers }
        if (!allAnswers[currentQuestion.id]) {
          if (currentQuestion.question_type === 'multiple_choice' && selectedOptionIndex !== null) {
            allAnswers[currentQuestion.id] = selectedOptionIndex.toString()
          } else if (currentAnswer.trim()) {
            allAnswers[currentQuestion.id] = currentAnswer
          }
        }
        const unansweredCount = questions.filter(q => !allAnswers[q.id]).length

        return (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
              onClick={() => setShowSubmitWarning(false)}
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-200">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center flex-shrink-0 ${
                      unansweredCount > 0
                        ? 'bg-yellow-500/10 border-yellow-500/20'
                        : 'bg-green-500/10 border-green-500/20'
                    }`}>
                      {unansweredCount > 0 ? (
                        <AlertTriangle className="w-6 h-6 text-yellow-400" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Submit Exam?</h3>
                      <p className="text-zinc-400 text-sm">
                        {unansweredCount > 0 ? (
                          <>
                            You have <span className="font-semibold text-yellow-400">{unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}</span>.
                            Are you sure you want to submit?
                          </>
                        ) : (
                          'Are you sure you want to submit your exam?'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowSubmitWarning(false)}
                      variant="outline"
                      className="flex-1 bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-500"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleConfirmSubmit}
                      disabled={submitting}
                      className="flex-1 bg-phthalo-600 hover:bg-phthalo-700 text-white"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Exam'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      })()}
    </div>
  )
}

