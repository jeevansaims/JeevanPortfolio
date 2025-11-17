// app/quantframe/programs/[program]/modules/[module]/lessons/[lesson]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Clock, BookCheck } from 'lucide-react'
import { loadMDXContent } from '@/lib/mdx/loader'
import { LessonContent } from '@/components/quantframe/lesson-content'
import { CompleteLessonButton } from './complete-lesson-button'

export default async function LessonPage({
  params
}: {
  params: { program: string; module: string; lesson: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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

  // Fetch current lesson
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

  // Check if user has completed this lesson
  let isCompleted = false
  if (user) {
    const { data: progress } = await supabase
      .from('user_lesson_progress')
      .select('completed')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson.id)
      .maybeSingle()

    isCompleted = progress?.completed || false
  }

  // Check if this lesson has a quiz
  const { data: quizQuestions, count: quizCount } = await supabase
    .from('lesson_quiz_questions')
    .select('id', { count: 'exact', head: true })
    .eq('lesson_id', lesson.id)

  const hasQuiz = (quizCount ?? 0) > 0

  // If there's a quiz, check if user has passed it
  let hasPassedQuiz = false
  if (user && hasQuiz) {
    const { data: bestAttempt } = await supabase
      .from('user_lesson_quiz_attempts')
      .select('passed')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson.id)
      .eq('passed', true)
      .maybeSingle()

    hasPassedQuiz = !!bestAttempt
  }

  // Load MDX content
  const mdxSource = await loadMDXContent(lesson.content_path)

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/quantframe/programs/${params.program}/modules/${params.module}`}>
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Module
              </Button>
            </Link>

            {isCompleted && (
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Lesson Header */}
      <div className="bg-gradient-to-b from-zinc-900 to-black border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <Link href="/quantframe/programs" className="hover:text-white transition-colors">
              Programs
            </Link>
            <span>/</span>
            <Link href={`/quantframe/programs/${params.program}`} className="hover:text-white transition-colors">
              {program.title}
            </Link>
            <span>/</span>
            <Link href={`/quantframe/programs/${params.program}/modules/${params.module}`} className="hover:text-white transition-colors">
              {module.short_title || module.title}
            </Link>
            <span>/</span>
            <span className="text-zinc-400">{lesson.title}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">
            {lesson.title}
          </h1>

          {lesson.subtitle && (
            <p className="text-xl text-phthalo-400 mb-4">
              {lesson.subtitle}
            </p>
          )}

          {lesson.estimated_minutes && (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Clock className="w-4 h-4" />
              <span>{lesson.estimated_minutes} minutes</span>
            </div>
          )}
        </div>
      </div>

      {/* Lesson Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <LessonContent source={mdxSource} />

        {/* Completion Button or Quiz Button */}
        {user && (
          <div className="mt-12 pt-8 border-t border-zinc-800">
            {hasQuiz ? (
              <Link href={`/quantframe/programs/${params.program}/modules/${params.module}/lessons/${params.lesson}/quiz`}>
                <Button
                  size="lg"
                  className={`w-full ${
                    isCompleted
                      ? 'bg-green-500/20 border-2 border-green-500/40 text-green-400 hover:bg-green-500/30'
                      : 'bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Lesson Completed - Retake Quiz
                    </>
                  ) : (
                    <>
                      <BookCheck className="w-5 h-5 mr-2" />
                      Take Quiz to Complete Lesson
                    </>
                  )}
                </Button>
              </Link>
            ) : (
              <>
                {isCompleted ? (
                  <Button
                    size="lg"
                    disabled
                    className="w-full bg-green-500/20 border-2 border-green-500/40 text-green-400 cursor-default"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Lesson Completed
                  </Button>
                ) : (
                  <CompleteLessonButton lessonId={lesson.id} />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
