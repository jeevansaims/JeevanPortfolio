// app/quantframe/programs/[program]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookOpen, Clock, CheckCircle2, Lock, Award, AlertCircle } from 'lucide-react'

interface Module {
  id: string
  slug: string
  title: string
  short_title: string | null
  description: string | null
  order_index: number
  estimated_hours: number | null
}

const difficultyColors = {
  beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20'
}

export default async function ProgramPage({ params }: { params: Promise<{ program: string }> }) {
  const { program: programSlug } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch program
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', programSlug)
    .eq('is_published', true)
    .single()

  if (!program) {
    notFound()
  }

  // Fetch modules for this program
  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .eq('program_id', program.id)
    .eq('is_published', true)
    .order('order_index')

  // For each module, get lesson count, user progress, and exam status
  const modulesWithProgress = await Promise.all(
    (modules || []).map(async (module) => {
      // Get total lessons
      const { count: totalLessons } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('module_id', module.id)
        .eq('is_published', true)

      // Get completed lessons for this user
      let completedLessons = 0
      if (user) {
        const { data: lessons } = await supabase
          .from('lessons')
          .select('id')
          .eq('module_id', module.id)
          .eq('is_published', true)

        if (lessons) {
          const lessonIds = lessons.map(l => l.id)
          const { count } = await supabase
            .from('user_lesson_progress')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .in('lesson_id', lessonIds)
            .eq('completed', true)

          completedLessons = count || 0
        }
      }

      // Check if module has an exam
      const { data: exam } = await supabase
        .from('module_exams')
        .select('id')
        .eq('module_id', module.id)
        .eq('is_published', true)
        .single()

      // Check if user passed the exam
      let examPassed = false
      if (user && exam) {
        const { data: attempts } = await supabase
          .from('user_module_exam_attempts')
          .select('passed')
          .eq('user_id', user.id)
          .eq('exam_id', exam.id)
          .eq('passed', true)
          .limit(1)

        examPassed = (attempts && attempts.length > 0) || false
      }

      return {
        ...module,
        totalLessons: totalLessons || 0,
        completedLessons,
        hasExam: !!exam,
        examPassed
      }
    })
  )

  return (
    <div className="min-h-screen">
      {/* Program Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-black border-b border-zinc-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-phthalo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-phthalo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <Link href="/quantframe/programs" className="hover:text-white transition-colors">
              Programs
            </Link>
            <span>/</span>
            <span className="text-zinc-400">{program.title}</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className={difficultyColors[program.level as keyof typeof difficultyColors]}>
              {program.level}
            </Badge>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
            {program.title}
          </h1>

          {program.subtitle && (
            <p className="text-2xl text-phthalo-400 mb-6">
              {program.subtitle}
            </p>
          )}

          {program.description && (
            <p className="text-lg text-zinc-400 max-w-3xl">
              {program.description}
            </p>
          )}
        </div>
      </div>

      {/* Modules Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Modules</h2>

        {modulesWithProgress && modulesWithProgress.length > 0 ? (
          <div className="space-y-6">
            {modulesWithProgress.map((module, index) => {
              const progressPercent = module.totalLessons > 0
                ? Math.round((module.completedLessons / module.totalLessons) * 100)
                : 0

              // Check if module is locked (need to pass previous module's exam)
              const isLocked = index > 0 && !modulesWithProgress[index - 1].examPassed
              const allLessonsCompleted = module.completedLessons === module.totalLessons && module.totalLessons > 0

              return (
                <Card key={module.id} className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm hover:border-phthalo-500/50 transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Module Number */}
                      <div className={`flex-shrink-0 w-16 h-16 rounded-lg ${isLocked ? 'bg-zinc-800' : 'bg-gradient-to-br from-phthalo-500 to-phthalo-700'} flex items-center justify-center`}>
                        {isLocked ? (
                          <Lock className="w-6 h-6 text-zinc-600" />
                        ) : (
                          <span className="text-2xl font-bold text-white">{index + 1}</span>
                        )}
                      </div>

                      {/* Module Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-1">
                              {module.title}
                            </h3>
                            {module.description && (
                              <p className="text-zinc-400 text-sm">
                                {module.description}
                              </p>
                            )}
                          </div>

                          {isLocked ? (
                            <div className="flex flex-col items-end gap-1">
                              <Button disabled className="bg-zinc-800 text-zinc-500 cursor-not-allowed">
                                <Lock className="w-4 h-4 mr-2" />
                                Locked
                              </Button>
                              <p className="text-xs text-zinc-600 text-right">Complete previous exam</p>
                            </div>
                          ) : (
                            <Link href={`/quantframe/programs/${programSlug}/modules/${module.slug}`}>
                              <Button className="bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900">
                                View Module
                              </Button>
                            </Link>
                          )}
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-6 text-sm text-zinc-500 mb-4 flex-wrap">
                          {module.estimated_hours && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {module.estimated_hours} hours
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {module.totalLessons} lessons
                          </span>
                          {user && module.completedLessons > 0 && (
                            <span className="flex items-center gap-1 text-green-400">
                              <CheckCircle2 className="w-4 h-4" />
                              {module.completedLessons}/{module.totalLessons} completed
                            </span>
                          )}

                          {/* Exam Status */}
                          {user && module.hasExam && (
                            <>
                              {module.examPassed ? (
                                <span className="flex items-center gap-1 text-phthalo-400">
                                  <Award className="w-4 h-4" />
                                  Exam Passed
                                </span>
                              ) : allLessonsCompleted ? (
                                <span className="flex items-center gap-1 text-yellow-400">
                                  <AlertCircle className="w-4 h-4" />
                                  Exam Available
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-zinc-600">
                                  <AlertCircle className="w-4 h-4" />
                                  Exam Locked
                                </span>
                              )}
                            </>
                          )}
                        </div>

                        {/* Progress Bar */}
                        {user && module.totalLessons > 0 && (
                          <div className="w-full bg-zinc-800 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-phthalo-500 to-phthalo-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-zinc-400 text-lg">No modules available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
