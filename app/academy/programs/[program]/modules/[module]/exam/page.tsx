// app/academy/programs/[program]/modules/[module]/exam/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ExamClient } from './exam-client'

interface ExamQuestion {
  id: string
  problem: string
  hint: string
  solution: string
  answer: string
  order_index: number
  section_name: string
}

export default async function ModuleExamPage({
  params
}: {
  params: { program: string; module: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/academy/login')
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

  // Check if all lessons are completed
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id')
    .eq('module_id', module.id)
    .eq('is_published', true)

  let allLessonsCompleted = false
  if (lessons && lessons.length > 0 && user) {
    const { data: completedLessons } = await supabase
      .from('user_lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('completed', true)

    const completedLessonIds = new Set(completedLessons?.map(l => l.lesson_id) || [])
    allLessonsCompleted = lessons.every(l => completedLessonIds.has(l.id))
  }

  // Redirect if lessons not completed
  if (!allLessonsCompleted) {
    redirect(`/academy/programs/${params.program}/modules/${params.module}`)
  }

  // Fetch exam for this module
  const { data: exam } = await supabase
    .from('module_exams')
    .select('*')
    .eq('module_id', module.id)
    .eq('is_published', true)
    .single()

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">No Exam Available</h2>
          <p className="text-zinc-400 mb-6">This module doesn't have an exam yet.</p>
          <Link href={`/academy/programs/${params.program}/modules/${params.module}`}>
            <Button>Back to Module</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Fetch exam questions
  const { data: examData } = await supabase
    .from('module_exam_questions')
    .select(`
      order_index,
      section_name,
      problem_id,
      math_problems (
        id,
        problem,
        hint,
        solution,
        answer
      )
    `)
    .eq('exam_id', exam.id)
    .order('order_index')

  if (!examData || examData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">Exam Not Ready</h2>
          <p className="text-zinc-400 mb-6">This exam is being prepared. Please check back later.</p>
          <Link href={`/academy/programs/${params.program}/modules/${params.module}`}>
            <Button>Back to Module</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Transform data
  const questions: ExamQuestion[] = examData.map((q: any) => ({
    id: q.math_problems.id,
    problem: q.math_problems.problem,
    hint: q.math_problems.hint,
    solution: q.math_problems.solution,
    answer: q.math_problems.answer,
    order_index: q.order_index,
    section_name: q.section_name
  }))

  // Fetch user's previous attempts
  const { data: attempts } = await supabase
    .from('user_module_exam_attempts')
    .select('*')
    .eq('user_id', user.id)
    .eq('exam_id', exam.id)
    .order('created_at', { ascending: false })

  const latestAttempt = attempts && attempts.length > 0 ? attempts[0] : null
  const attemptNumber = latestAttempt ? latestAttempt.attempt_number + 1 : 1

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/academy/programs/${params.program}/modules/${params.module}`}>
            <Button variant="ghost" size="sm" className="mb-4 text-zinc-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Module
            </Button>
          </Link>

          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600 mb-2">
            {exam.title}
          </h1>
          <p className="text-zinc-400 mb-4">{exam.description}</p>

          {latestAttempt && (
            <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <div>
                <p className="text-sm text-zinc-400">Previous Attempt</p>
                <p className="text-xl font-bold text-white">
                  {latestAttempt.score}/{latestAttempt.total_questions}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Status</p>
                <p className={`text-sm font-semibold ${latestAttempt.passed ? 'text-green-400' : 'text-red-400'}`}>
                  {latestAttempt.passed ? 'Passed' : 'Failed'}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Passing Score</p>
                <p className="text-sm text-white">{exam.passing_score}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Exam Client Component */}
        <ExamClient
          examId={exam.id}
          questions={questions}
          attemptNumber={attemptNumber}
          passingScore={exam.passing_score}
        />
      </div>
    </div>
  )
}
