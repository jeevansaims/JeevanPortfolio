// app/quantframe/programs/[program]/modules/[module]/lessons/[lesson]/quiz/quiz-client.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  BookOpen,
  Loader2,
  AlertTriangle,
  ArrowRight,
  Trophy
} from 'lucide-react'
import { submitQuiz } from '@/app/quantframe/actions/quiz'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { compareAnswers } from '@/lib/math-compare'

interface QuizQuestion {
  id: string
  problem: string
  hint: string
  solution: string
  answer: string
  order_index: number
  question_type: 'free_text' | 'multiple_choice'
  options?: string[]
  correct_option_index?: number
}

interface QuizClientProps {
  questions: QuizQuestion[]
  lessonId: string
  attemptNumber: number
  programSlug: string
  moduleSlug: string
  lessonSlug: string
}

// Helper function to render text with LaTeX (copied from problem-card.tsx)
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

export function QuizClient({
  questions,
  lessonId,
  attemptNumber,
  programSlug,
  moduleSlug,
  lessonSlug
}: QuizClientProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [showSolutionWarning, setShowSolutionWarning] = useState(false)
  const [solutionViewedForQuestions, setSolutionViewedForQuestions] = useState<Set<string>>(new Set())
  const [hasAnswered, setHasAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [finalResults, setFinalResults] = useState<{
    score: number
    passed: boolean
    results: Record<string, boolean>
  } | null>(null)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const passingScore = Math.ceil(questions.length * 0.8)
  const hasSolutionBeenViewed = solutionViewedForQuestions.has(currentQuestion?.id)

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
    setHasAnswered(false)
    setIsCorrect(null)
  }, [currentQuestionIndex])

  const handleAnswerSubmit = () => {
    let correct = false
    let answerToSave = ''

    // Handle multiple choice questions
    if (currentQuestion.question_type === 'multiple_choice') {
      if (selectedOptionIndex === null) {
        toast.error('Please select an answer')
        return
      }
      correct = selectedOptionIndex === currentQuestion.correct_option_index
      answerToSave = selectedOptionIndex.toString()
    }
    // Handle free text questions
    else {
      if (!currentAnswer.trim()) {
        toast.error('Please enter an answer')
        return
      }
      correct = compareAnswers(currentAnswer, currentQuestion.answer)
      answerToSave = currentAnswer
    }

    // If solution was viewed, still mark as failed (but acknowledge correct answer)
    if (hasSolutionBeenViewed) {
      setIsCorrect(false) // Will fail the question
      setHasAnswered(true)
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: answerToSave }))

      // Show appropriate message
      if (correct) {
        toast.info('Correct answer, but question failed due to viewing solution')
      }
      return
    }

    // Normal flow - not viewed solution
    setIsCorrect(correct)
    setHasAnswered(true)

    // Save answer
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answerToSave }))

    if (correct) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#26804a', '#2d9659', '#34ac68']
      })
    }
  }

  const handleNextQuestion = () => {
    if (!hasAnswered) {
      toast.error('Please answer the question first')
      return
    }

    if (isLastQuestion) {
      // Submit quiz
      handleQuizSubmit()
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handleQuizSubmit = async () => {
    setSubmitting(true)

    try {
      const result = await submitQuiz({
        lessonId,
        attemptNumber,
        answers,
        solutionViewedQuestions: Array.from(solutionViewedForQuestions)
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      setFinalResults({
        score: result.score!,
        passed: result.passed!,
        results: result.results!
      })
      setQuizComplete(true)

      if (result.passed) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#26804a', '#2d9659', '#34ac68']
        })
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Failed to submit quiz')
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
    // Mark this question as having solution viewed (will auto-fail)
    setSolutionViewedForQuestions(prev => new Set(prev).add(currentQuestion.id))
    setShowSolution(true)
    setShowSolutionWarning(false)
    toast.error('This question will be marked incorrect')
  }

  const handleContinueToLesson = () => {
    router.push(`/quantframe/programs/${programSlug}/modules/${moduleSlug}/lessons/${lessonSlug}`)
  }

  const handleRetryQuiz = () => {
    router.push(`/quantframe/programs/${programSlug}/modules/${moduleSlug}/lessons/${lessonSlug}`)
  }

  // Results page
  if (quizComplete && finalResults) {
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
                <CheckCircle2 className="w-10 h-10 text-white" />
              ) : (
                <XCircle className="w-10 h-10 text-white" />
              )}
            </div>

            <h2 className="text-4xl font-bold mb-3 text-white">
              {finalResults.passed ? 'Quiz Passed!' : 'Not Quite There Yet'}
            </h2>

            <div className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
              {finalResults.score}/{questions.length}
            </div>

            <p className="text-lg text-zinc-400">
              {finalResults.passed
                ? `Great work! You scored ${finalResults.score} out of ${questions.length}.`
                : `You need ${passingScore}/${questions.length} to pass. You can review the lesson and try again!`
              }
            </p>
          </div>

          {/* Question Results */}
          <div className="mb-8 space-y-3">
            {questions.map((q, idx) => {
              const correct = finalResults.results[q.id]
              return (
                <div
                  key={q.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    correct
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-red-500/10 border-red-500/20'
                  }`}
                >
                  <span className="text-zinc-300">Question {idx + 1}</span>
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
            {finalResults.passed ? (
              <Button
                onClick={handleContinueToLesson}
                size="lg"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Continue to Lesson
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleRetryQuiz}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900"
                >
                  Back to Lesson
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    )
  }

  // Quiz question page
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">
              Quiz Progress
            </span>
            <span className="text-sm font-semibold text-phthalo-400">
              Question {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>

          <div className="relative h-2 bg-zinc-800 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-phthalo-600 to-phthalo-500 rounded-full transition-all duration-500 overflow-hidden relative"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            >
              <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-slide"></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm p-8 mb-6">
          {/* Top badges */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-phthalo-500/10 text-phthalo-400 border-phthalo-500/20">
                Question {currentQuestionIndex + 1}
              </Badge>
              {hasSolutionBeenViewed && !hasAnswered && (
                <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
                  <XCircle className="w-3 h-3 mr-1" />
                  Solution Viewed - Will Fail
                </Badge>
              )}
            </div>
            {hasAnswered && (
              <Badge
                variant="outline"
                className={
                  isCorrect
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : hasSolutionBeenViewed && compareAnswers(currentAnswer, currentQuestion.answer)
                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }
              >
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Correct
                  </>
                ) : hasSolutionBeenViewed && compareAnswers(currentAnswer, currentQuestion.answer) ? (
                  <>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Failed (Solution Viewed)
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Incorrect
                  </>
                )}
              </Badge>
            )}
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
              <div className="space-y-3 mb-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedOptionIndex === index
                  const isThisCorrect = index === currentQuestion.correct_option_index

                  let optionStyle = ''
                  if (!hasAnswered) {
                    optionStyle = isSelected
                      ? 'border-phthalo-500 bg-phthalo-500/10 cursor-pointer'
                      : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900/70 cursor-pointer'
                  } else {
                    if (isThisCorrect) {
                      optionStyle = 'border-green-500 bg-green-500/10 cursor-not-allowed'
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'border-red-500 bg-red-500/10 cursor-not-allowed'
                    } else {
                      optionStyle = 'border-zinc-800 bg-zinc-900/50 opacity-50 cursor-not-allowed'
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => !hasAnswered && setSelectedOptionIndex(index)}
                      disabled={hasAnswered}
                      className={`w-full p-4 rounded-lg text-left transition-all border-2 ${optionStyle}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-zinc-300">{option}</span>
                        {hasAnswered && isThisCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                        {hasAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Free Text Input */}
            {currentQuestion.question_type === 'free_text' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !hasAnswered && handleAnswerSubmit()}
                  placeholder="Enter your answer..."
                  disabled={hasAnswered}
                  className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-phthalo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {!hasAnswered && (
                  <Button
                    onClick={handleAnswerSubmit}
                    disabled={!currentAnswer.trim()}
                    className="bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900 disabled:opacity-50 px-8"
                  >
                    Submit Answer
                  </Button>
                )}
              </div>
            )}

            {/* Submit Button for Multiple Choice */}
            {currentQuestion.question_type === 'multiple_choice' && !hasAnswered && (
              <Button
                onClick={handleAnswerSubmit}
                disabled={selectedOptionIndex === null}
                className="w-full bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900 disabled:opacity-50"
              >
                Submit Answer
              </Button>
            )}

            {/* Feedback Message */}
            {hasAnswered && isCorrect && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-400">Correct!</p>
                  <p className="text-sm text-zinc-400">Great job! Click next to continue.</p>
                </div>
              </div>
            )}

            {hasAnswered && !isCorrect && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                {hasSolutionBeenViewed && compareAnswers(currentAnswer, currentQuestion.answer) ? (
                  <>
                    <p className="font-semibold text-yellow-400">Correct answer, but question failed.</p>
                    <p className="text-sm text-zinc-400 mt-1">
                      You got the right answer (<span className="font-semibold text-white">{currentQuestion.answer}</span>), but this question is marked incorrect because you viewed the solution.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-red-400">
                      {hasSolutionBeenViewed ? 'Incorrect.' : 'Not quite right.'}
                    </p>
                    <p className="text-sm text-zinc-400 mt-1">
                      The correct answer was: <span className="font-semibold text-white">{currentQuestion.answer}</span>
                    </p>
                  </>
                )}
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

          {/* Next Question Button */}
          {hasAnswered && (
            <div className="mt-8 pt-6 border-t border-zinc-800">
              <Button
                onClick={handleNextQuestion}
                disabled={submitting}
                size="lg"
                className="w-full bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting Quiz...
                  </>
                ) : (
                  <>
                    {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>
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
                  <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">View Solution?</h3>
                    <p className="text-zinc-400 text-sm">
                      Viewing the solution will automatically mark this question as <span className="font-semibold text-red-400">incorrect</span>. You won't get points for this question even if you answer correctly afterwards.
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
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    View Anyway
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
