// app/academy/actions/quiz.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { compareAnswers } from '@/lib/math-compare'

/**
 * Submit a quiz attempt and validate answers
 * @param lessonId - The lesson ID
 * @param attemptNumber - The attempt number
 * @param answers - User's answers as { questionId: answer }
 * @param solutionViewedQuestions - Question IDs where solution was viewed (auto-fail)
 * @returns Results with score, pass/fail, and individual question results
 */
export async function submitQuiz({
  lessonId,
  attemptNumber,
  answers,
  solutionViewedQuestions = []
}: {
  lessonId: string
  attemptNumber: number
  answers: Record<string, string>
  solutionViewedQuestions?: string[]
}) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'User not authenticated' }
    }

    // Fetch the quiz questions with correct answers
    const { data: quizData, error: fetchError } = await supabase
      .from('lesson_quiz_questions')
      .select(`
        order_index,
        problem_id,
        math_problems (
          id,
          answer
        )
      `)
      .eq('lesson_id', lessonId)
      .order('order_index')

    if (fetchError || !quizData || quizData.length === 0) {
      console.error('Error fetching quiz questions:', fetchError)
      return { error: 'Failed to load quiz questions' }
    }

    // Validate answers
    const results: Record<string, boolean> = {}
    let correctCount = 0

    quizData.forEach((q: any) => {
      const questionId = q.math_problems.id
      const correctAnswer = q.math_problems.answer
      const userAnswer = answers[questionId] || ''

      // Auto-fail if solution was viewed for this question
      if (solutionViewedQuestions.includes(questionId)) {
        results[questionId] = false
        return
      }

      // Compare answers using mathematical equivalence
      const isCorrect = compareAnswers(userAnswer, correctAnswer)
      results[questionId] = isCorrect

      if (isCorrect) {
        correctCount++
      }
    })

    const totalQuestions = quizData.length
    const score = correctCount
    const passingScore = Math.ceil(totalQuestions * 0.8) // 80% to pass
    const passed = score >= passingScore

    // Save attempt to database
    const { error: insertError } = await supabase
      .from('user_lesson_quiz_attempts')
      .insert({
        user_id: user.id,
        lesson_id: lessonId,
        score,
        total_questions: totalQuestions,
        passed,
        attempt_number: attemptNumber
      })

    if (insertError) {
      console.error('Error saving quiz attempt:', insertError)
      return { error: 'Failed to save quiz attempt' }
    }

    // If passed, mark lesson as completed
    if (passed) {
      const { error: completeError } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
          last_viewed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id'
        })

      if (completeError) {
        console.error('Error marking lesson complete:', completeError)
        // Don't return error here - the quiz was still submitted successfully
      }
    }

    // Revalidate relevant paths
    revalidatePath('/academy/programs')

    return {
      success: true,
      score,
      totalQuestions,
      passed,
      results
    }
  } catch (error) {
    console.error('Error in submitQuiz:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Helper function to normalize answers for comparison
 * Removes whitespace and converts to lowercase
 */
function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase().replace(/\s+/g, '')
}
