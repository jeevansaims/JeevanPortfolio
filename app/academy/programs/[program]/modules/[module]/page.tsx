// app/academy/programs/[program]/modules/[module]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Trophy, Lock } from 'lucide-react'

interface Lesson {
  id: string
  slug: string
  title: string
  subtitle: string | null
  order_index: number
  estimated_minutes: number | null
  completed: boolean
}

interface ModuleExam {
  id: string
  title: string
  description: string
  passing_score: number
  total_questions: number
  user_passed: boolean | null
  best_score: number | null
}

export default async function ModulePage({
  params
}: {
  params: { program: string; module: string }
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

  // Fetch lessons
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', module.id)
    .eq('is_published', true)
    .order('order_index')

  // Get user progress for each lesson
  let lessonsWithProgress: Lesson[] = []
  if (lessons) {
    lessonsWithProgress = await Promise.all(
      lessons.map(async (lesson) => {
        let completed = false
        if (user) {
          const { data: progress } = await supabase
            .from('user_lesson_progress')
            .select('completed')
            .eq('user_id', user.id)
            .eq('lesson_id', lesson.id)
            .maybeSingle()

          completed = progress?.completed || false
        }

        return {
          ...lesson,
          completed
        }
      })
    )
  }

  const completedCount = lessonsWithProgress.filter(l => l.completed).length
  const totalCount = lessonsWithProgress.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const allLessonsCompleted = totalCount > 0 && completedCount === totalCount

  // Fetch module exam
  const { data: exam } = await supabase
    .from('module_exams')
    .select('*')
    .eq('module_id', module.id)
    .eq('is_published', true)
    .maybeSingle()

  // Get exam question count and user's best attempt
  let examData: ModuleExam | null = null
  if (exam) {
    const { count: questionCount } = await supabase
      .from('module_exam_questions')
      .select('*', { count: 'exact', head: true })
      .eq('exam_id', exam.id)

    let userPassed: boolean | null = null
    let bestScore: number | null = null

    if (user) {
      const { data: attempts } = await supabase
        .from('user_module_exam_attempts')
        .select('*')
        .eq('user_id', user.id)
        .eq('exam_id', exam.id)
        .order('score', { ascending: false })
        .limit(1)

      if (attempts && attempts.length > 0) {
        userPassed = attempts[0].passed
        bestScore = attempts[0].score
      }
    }

    examData = {
      id: exam.id,
      title: exam.title,
      description: exam.description,
      passing_score: exam.passing_score,
      total_questions: questionCount || 0,
      user_passed: userPassed,
      best_score: bestScore
    }
  }

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href={`/academy/programs/${params.program}`}>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Program
            </Button>
          </Link>
        </div>
      </div>

      {/* Module Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-black border-b border-zinc-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-phthalo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <Link href="/academy/programs" className="hover:text-white transition-colors">
              Programs
            </Link>
            <span>/</span>
            <Link href={`/academy/programs/${params.program}`} className="hover:text-white transition-colors">
              {program.title}
            </Link>
            <span>/</span>
            <span className="text-zinc-400">{module.short_title || module.title}</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
            {module.title}
          </h1>

          {module.description && (
            <p className="text-lg text-zinc-400 max-w-3xl mb-6">
              {module.description}
            </p>
          )}

          {/* Progress */}
          {user && totalCount > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between text-sm text-zinc-400 mb-2">
                  <span>Progress</span>
                  <span>{completedCount} / {totalCount} lessons</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-phthalo-500 to-phthalo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <Badge variant="outline" className="bg-phthalo-500/10 text-phthalo-400 border-phthalo-500/20">
                {progressPercent}%
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Lessons List */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Lessons</h2>

        {lessonsWithProgress && lessonsWithProgress.length > 0 ? (
          <div className="space-y-4">
            {lessonsWithProgress.map((lesson, index) => (
              <Link
                key={lesson.id}
                href={`/academy/programs/${params.program}/modules/${params.module}/lessons/${lesson.slug}`}
              >
                <Card className="group bg-zinc-900/50 border-zinc-800 backdrop-blur-sm hover:border-phthalo-500/50 transition-all duration-300 cursor-pointer">
                  <div className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Completion Icon */}
                      <div className="flex-shrink-0">
                        {lesson.completed ? (
                          <div className="w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center group-hover:border-phthalo-500 transition-colors">
                            <Circle className="w-6 h-6 text-zinc-600 group-hover:text-phthalo-500 transition-colors" />
                          </div>
                        )}
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-medium text-zinc-500">
                            Lesson {index + 1}
                          </span>
                          {lesson.estimated_minutes && (
                            <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700">
                              {lesson.estimated_minutes} min
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-white transition-colors">
                          {lesson.title}
                        </h3>
                        {lesson.subtitle && (
                          <p className="text-sm text-zinc-400">
                            {lesson.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-phthalo-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-zinc-400 text-lg">No lessons available yet.</p>
          </div>
        )}

        {/* Module Exam */}
        {examData && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-white mb-8">Module Exam</h2>

            {allLessonsCompleted ? (
              <Link href={`/academy/programs/${params.program}/modules/${params.module}/exam`}>
                <Card className="group bg-zinc-900/50 border-zinc-800 backdrop-blur-sm hover:border-phthalo-500/50 transition-all duration-300 cursor-pointer">
                  <div className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {examData.user_passed ? (
                          <div className="w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-green-400" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center group-hover:border-phthalo-500 transition-colors">
                            <Trophy className="w-6 h-6 text-zinc-600 group-hover:text-phthalo-500 transition-colors" />
                          </div>
                        )}
                      </div>

                      {/* Exam Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-medium text-zinc-500">
                            Module Exam
                          </span>
                          <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700">
                            {examData.total_questions} Questions
                          </Badge>
                          <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700">
                            {examData.passing_score}% to pass
                          </Badge>
                          {examData.user_passed !== null && (
                            <Badge
                              variant="outline"
                              className={examData.user_passed
                                ? "bg-green-500/10 text-green-400 border-green-500/30"
                                : "bg-red-500/10 text-red-400 border-red-500/30"
                              }
                            >
                              {examData.user_passed ? 'Passed' : 'Failed'}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-white transition-colors">
                          {examData.title}
                        </h3>
                        {examData.description && (
                          <p className="text-sm text-zinc-400">
                            {examData.description}
                          </p>
                        )}
                        {examData.best_score !== null && (
                          <p className="text-sm text-zinc-500 mt-1">
                            Best: {examData.best_score}/{examData.total_questions} ({Math.round((examData.best_score / examData.total_questions) * 100)}%)
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-phthalo-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ) : (
              <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm opacity-60">
                <div className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Locked Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
                        <Lock className="w-7 h-7 text-zinc-600" />
                      </div>
                    </div>

                    {/* Exam Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="bg-zinc-800 text-zinc-500 border-zinc-700">
                          {examData.total_questions} Questions
                        </Badge>
                        <Badge variant="outline" className="bg-zinc-800 text-zinc-500 border-zinc-700">
                          Locked
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold text-zinc-500 mb-2">
                        {examData.title}
                      </h3>
                      <p className="text-sm text-zinc-600">
                        Complete all lessons to unlock the exam
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
