// app/quantframe/programs/[program]/modules/[module]/lessons/[lesson]/quiz/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, BookCheck } from 'lucide-react'
import { QuizClient } from './quiz-client'

interface QuizQuestion {
  id: string
  problem: string
  hint: string
  solution: string
  answer: string
  order_index: number
}

export default async function LessonQuizPage({
  params
}: {
  params: { program: string; module: string; lesson: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/quantframe/login')
  }

  // Fetch program
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', params.program)
    .eq('is_published', true)
    .single()

  if (!program) {
    notFound()
  }

  // Fetch module
  const { data: module } = await supabase
    .from('modules')
    .select('*')
    .eq('program_id', program.id)
    .eq('slug', params.module)
    .eq('is_published', true)
    .single()

  if (!module) {
    notFound()
  }

  // Fetch lesson
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', module.id)
    .eq('slug', params.lesson)
    .eq('is_published', true)
    .single()

  if (!lesson) {
    notFound()
  }

  // Fetch quiz questions for this lesson
  const { data: quizData } = await supabase
    .from('lesson_quiz_questions')
    .select(`
      order_index,
      problem_id,
      math_problems (
        id,
        problem,
        hint,
        solution,
        answer
      )
    `)
    .eq('lesson_id', lesson.id)
    .order('order_index')

  if (!quizData || quizData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">No quiz available for this lesson yet.</p>
          <Link href={`/quantframe/programs/${params.program}/modules/${params.module}/lessons/${params.lesson}`}>
            <Button>Back to Lesson</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Transform data
  const questions: QuizQuestion[] = quizData.map((q: any) => ({
    id: q.math_problems.id,
    problem: q.math_problems.problem,
    hint: q.math_problems.hint,
    solution: q.math_problems.solution,
    answer: q.math_problems.answer,
    order_index: q.order_index
  }))

  // Check if user has already passed this quiz
  const { data: bestAttempt } = await supabase
    .from('user_lesson_quiz_attempts')
    .select('*')
    .eq('user_id', user.id)
    .eq('lesson_id', lesson.id)
    .eq('passed', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const hasPassedBefore = !!bestAttempt

  // Get attempt number
  const { count: attemptCount } = await supabase
    .from('user_lesson_quiz_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('lesson_id', lesson.id)

  const nextAttemptNumber = (attemptCount || 0) + 1

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      {/* Top Navigation */}
      <div className="border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href={`/quantframe/programs/${params.program}/modules/${params.module}/lessons/${params.lesson}`}>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lesson
            </Button>
          </Link>
        </div>
      </div>

      {/* Quiz Header */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-phthalo-500 to-phthalo-700 mb-4">
            <BookCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3 text-white">
            Lesson Quiz
          </h1>
          <p className="text-xl text-zinc-400 mb-2">
            {lesson.title}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Badge variant="outline" className="bg-zinc-800 text-zinc-300 border-zinc-700">
              {questions.length} Questions
            </Badge>
            <Badge variant="outline" className="bg-phthalo-500/10 text-phthalo-400 border-phthalo-500/20">
              Pass: {Math.ceil(questions.length * 0.8)}/{questions.length}
            </Badge>
            {hasPassedBefore && (
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                Previously Passed
              </Badge>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Instructions</h3>
          <ul className="text-zinc-400 space-y-2 text-sm">
            <li>• Answer all {questions.length} questions about the lesson content</li>
            <li>• You must score at least {Math.ceil(questions.length * 0.8)}/{questions.length} to pass</li>
            <li>• Your answers are saved when you click "Submit Quiz"</li>
            <li>• You can retake the quiz if needed</li>
          </ul>
        </div>

        {/* Quiz Client Component */}
        <QuizClient
          questions={questions}
          lessonId={lesson.id}
          attemptNumber={nextAttemptNumber}
          programSlug={params.program}
          moduleSlug={params.module}
          lessonSlug={params.lesson}
        />
      </div>
    </div>
  )
}
