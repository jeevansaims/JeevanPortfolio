'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { submitModuleExam } from '@/app/quantframe/actions/exam'
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
  Trophy
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
}

interface ExamClientProps {
  examId: string
  questions: ExamQuestion[]
  attemptNumber: number
  passingScore: number
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

export function ExamClient({ examId, questions, attemptNumber, passingScore }: ExamClientProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [showSolutionWarning, setShowSolutionWarning] = useState(false)
  const [solutionViewedForQuestions, setSolutionViewedForQuestions] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [examComplete, setExamComplete] = useState(false)
  const [finalResults, setFinalResults] = useState<{
    score: number
    total: number
    passed: boolean
    details: Record<string, boolean>
  } | null>(null)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const hasSolutionBeenViewed = solutionViewedForQuestions.has(currentQuestion?.id)

  // Load saved answer when switching questions
  useEffect(() => {
    setCurrentAnswer(answers[currentQuestion?.id] || '')
    setShowHint(false)
    setShowSolution(false)
  }, [currentQuestionIndex, currentQuestion?.id, answers])

  const handleSaveAnswer = () => {
    if (!currentAnswer.trim()) {
      toast.error('Please enter an answer')
      return
    }

    // Save answer
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: currentAnswer }))
    toast.success('Answer saved')
  }

  const handleNextQuestion = () => {
    // Auto-save current answer if entered
    if (currentAnswer.trim() && !answers[currentQuestion.id]) {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: currentAnswer }))
    }

    if (isLastQuestion) {
      // Check if all questions answered
      const allAnswers = { ...answers }
      if (currentAnswer.trim()) {
        allAnswers[currentQuestion.id] = currentAnswer
      }

      const unanswered = questions.filter(q => !allAnswers[q.id]?.trim())
      if (unanswered.length > 0) {
        toast.error(`Please answer all questions. ${unanswered.length} remaining.`)
        return
      }

      // Submit exam
      handleExamSubmit(allAnswers)
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    // Auto-save current answer
    if (currentAnswer.trim()) {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: currentAnswer }))
    }

    setCurrentQuestionIndex(prev => prev - 1)
  }

  const handleExamSubmit = async (finalAnswers: Record<string, string>) => {
    setSubmitting(true)

    try {
      const result = await submitModuleExam({
        examId,
        attemptNumber,
        answers: finalAnswers
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
              onClick={() => router.refresh()}
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

  const answeredCount = Object.keys(answers).filter(k => answers[k]?.trim()).length + (currentAnswer.trim() && !answers[currentQuestion?.id] ? 1 : 0)

  // Exam question page
  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">
            Exam Progress
          </span>
          <span className="text-sm font-semibold text-phthalo-400">
            Question {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>

        <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-phthalo-600 to-phthalo-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          >
            <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-slide"></div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-zinc-500">
            {answeredCount}/{questions.length} answered
          </span>
          <span className="text-xs text-zinc-500">
            Passing: {passingScore}%
          </span>
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
            className="flex-1"
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
    </div>
  )
}
