'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { compareAnswers } from '@/lib/math-compare'

export async function submitModuleExam({
  examId,
  attemptNumber,
  answers
}: {
  examId: string
  attemptNumber: number
  answers: Record<string, string>
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    // Fetch exam questions with correct answers
    const { data: examData, error: fetchError } = await supabase
      .from('module_exam_questions')
      .select(`
        problem_id,
        math_problems (
          id,
          answer
        )
      `)
      .eq('exam_id', examId)

    if (fetchError || !examData) {
      console.error('Error fetching exam questions:', fetchError)
      return { error: 'Failed to fetch exam questions' }
    }

    // Grade the exam using mathematical comparison
    const results: Record<string, boolean> = {}
    let score = 0

    examData.forEach((q: any) => {
      const questionId = q.math_problems.id
      const correctAnswer = q.math_problems.answer
      const userAnswer = answers[questionId] || ''

      const isCorrect = compareAnswers(userAnswer, correctAnswer)
      results[questionId] = isCorrect

      if (isCorrect) {
        score++
      }
    })

    const totalQuestions = examData.length
    const percentageScore = Math.round((score / totalQuestions) * 100)

    // Fetch exam to get passing score
    const { data: exam } = await supabase
      .from('module_exams')
      .select('passing_score')
      .eq('id', examId)
      .single()

    const passingScore = exam?.passing_score || 70
    const passed = percentageScore >= passingScore

    // Save attempt to database
    const { error: insertError } = await supabase
      .from('user_module_exam_attempts')
      .insert({
        user_id: user.id,
        exam_id: examId,
        score,
        total_questions: totalQuestions,
        passed,
        attempt_number: attemptNumber
      })

    if (insertError) {
      console.error('Error saving exam attempt:', insertError)
      return { error: 'Failed to save exam attempt' }
    }

    revalidatePath('/quantframe/programs')

    return {
      score,
      total: totalQuestions,
      passed,
      details: results
    }
  } catch (error) {
    console.error('Error submitting exam:', error)
    return { error: 'An unexpected error occurred' }
  }
}
