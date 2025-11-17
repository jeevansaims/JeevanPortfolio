// app/quantframe/actions/lessons.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Mark a lesson as completed for the current user
 * @param lessonId - The ID of the lesson to complete
 * @returns Success or error message
 */
export async function completeLesson(lessonId: string) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'User not authenticated' }
    }

    // Check if progress already exists
    const { data: existingProgress } = await supabase
      .from('user_lesson_progress')
      .select('id, completed')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .maybeSingle()

    if (existingProgress?.completed) {
      return { success: true, alreadyCompleted: true }
    }

    // Upsert progress record
    const { error: upsertError } = await supabase
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

    if (upsertError) {
      console.error('Error marking lesson complete:', upsertError)
      return { error: 'Failed to mark lesson as complete' }
    }

    // Revalidate relevant paths
    revalidatePath('/quantframe/programs')

    return { success: true }
  } catch (error) {
    console.error('Error in completeLesson:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Update last viewed timestamp for a lesson
 * @param lessonId - The ID of the lesson viewed
 */
export async function updateLastViewed(lessonId: string) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'User not authenticated' }
    }

    // Upsert progress record with updated last_viewed_at
    const { error } = await supabase
      .from('user_lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        last_viewed_at: new Date().toISOString(),
        completed: false // Don't change completion status
      }, {
        onConflict: 'user_id,lesson_id',
        ignoreDuplicates: false
      })

    if (error) {
      console.error('Error updating last viewed:', error)
    }

    return { success: true }
  } catch (error) {
    console.error('Error in updateLastViewed:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Reset a lesson completion (removes progress and quiz attempts)
 * @param lessonId - The ID of the lesson to reset
 * @returns Success or error message
 */
export async function resetLesson(lessonId: string) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'User not authenticated' }
    }

    // Delete lesson progress
    const { error: progressError } = await supabase
      .from('user_lesson_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)

    if (progressError) {
      console.error('Error deleting lesson progress:', progressError)
      return { error: 'Failed to reset lesson progress' }
    }

    // Delete all quiz attempts for this lesson
    const { error: quizError } = await supabase
      .from('user_lesson_quiz_attempts')
      .delete()
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)

    if (quizError) {
      console.error('Error deleting quiz attempts:', quizError)
      return { error: 'Failed to reset quiz attempts' }
    }

    // Revalidate relevant paths
    revalidatePath('/quantframe/programs')

    return { success: true }
  } catch (error) {
    console.error('Error in resetLesson:', error)
    return { error: 'An unexpected error occurred' }
  }
}
