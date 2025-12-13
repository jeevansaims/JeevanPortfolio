'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { compareAnswers } from '@/lib/math-compare'

// Save exam progress (auto-save)
export async function saveExamProgress({
  examId,
  answers,
  currentQuestionIndex
}: {
  examId: string
  answers: Record<string, string>
  currentQuestionIndex: number
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const { error } = await supabase
      .from('user_exam_progress')
      .upsert({
        user_id: user.id,
        exam_id: examId,
        answers,
        current_question_index: currentQuestionIndex,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,exam_id'
      })

    if (error) {
      console.error('Error saving exam progress:', error)
      return { error: 'Failed to save progress' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error saving exam progress:', error)
    return { error: 'An unexpected error occurred' }
  }
}

// Reset exam progress (clear saved answers)
export async function resetExamProgress({
  examId
}: {
  examId: string
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    // Delete saved progress
    const { error: progressError } = await supabase
      .from('user_exam_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('exam_id', examId)

    if (progressError) {
      console.error('Error deleting exam progress:', progressError)
      return { error: 'Failed to reset progress' }
    }

    revalidatePath('/quantframe/programs')

    return { success: true }
  } catch (error) {
    console.error('Error resetting exam progress:', error)
    return { error: 'An unexpected error occurred' }
  }
}

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
    // Fetch exam questions with correct answers including question_type and correct_option_index
    const { data: examData, error: fetchError } = await supabase
      .from('module_exam_questions')
      .select(`
        problem_id,
        math_problems (
          id,
          answer,
          question_type,
          correct_option_index
        )
      `)
      .eq('exam_id', examId)

    if (fetchError || !examData) {
      console.error('Error fetching exam questions:', fetchError)
      return { error: 'Failed to fetch exam questions' }
    }

    // Grade the exam
    const results: Record<string, boolean> = {}
    let score = 0

    examData.forEach((q: any) => {
      const questionId = q.math_problems.id
      const questionType = q.math_problems.question_type || 'free_text'
      const correctAnswer = q.math_problems.answer
      const correctOptionIndex = q.math_problems.correct_option_index
      const userAnswer = answers[questionId] || ''

      let isCorrect = false

      if (questionType === 'multiple_choice' && correctOptionIndex !== null && correctOptionIndex !== undefined) {
        // For multiple choice, compare the selected index
        isCorrect = parseInt(userAnswer) === correctOptionIndex
      } else {
        // For free text, use mathematical comparison
        isCorrect = compareAnswers(userAnswer, correctAnswer)
      }

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

    // Clear saved progress after successful submission
    await supabase
      .from('user_exam_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('exam_id', examId)

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
