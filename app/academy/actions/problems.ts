'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Complete a math problem and award XP
 * Adds completion record and increments user's total_xp
 */
export async function completeMathProblem(problemId: string) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'User not authenticated' }
    }

    // Check if already completed
    const { data: existingCompletion } = await supabase
      .from('user_problem_completions')
      .select('id')
      .eq('user_id', user.id)
      .eq('problem_id', problemId)
      .eq('status', 'completed')
      .maybeSingle()

    if (existingCompletion) {
      return { success: true, alreadyCompleted: true }
    }

    // Get problem XP value
    const { data: problem, error: problemError } = await supabase
      .from('math_problems')
      .select('xp')
      .eq('id', problemId)
      .single()

    if (problemError || !problem) {
      console.error('Error fetching problem:', problemError)
      return { error: 'Problem not found' }
    }

    // Add completion record
    const { error: completionError } = await supabase
      .from('user_problem_completions')
      .upsert({
        user_id: user.id,
        problem_id: problemId,
        status: 'completed'
      }, {
        onConflict: 'user_id,problem_id'
      })

    if (completionError) {
      console.error('Error saving completion:', completionError)
      return { error: 'Failed to save completion' }
    }

    // Increment user's total XP
    const { error: xpError } = await supabase.rpc('increment_user_xp', {
      user_id: user.id,
      xp_amount: problem.xp
    })

    if (xpError) {
      // If RPC doesn't exist, update directly
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ total_xp: supabase.raw(`total_xp + ${problem.xp}`) })
        .eq('id', user.id)

      if (updateError) {
        console.error('Error updating XP:', updateError)
      }
    }

    revalidatePath('/academy/problems')

    return { success: true, xpEarned: problem.xp }
  } catch (error) {
    console.error('Error in completeMathProblem:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Reset a math problem completion
 * Deletes the completion record and decrements user's total_xp
 */
export async function resetMathProblem(problemId: string) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'User not authenticated' }
    }

    // Get problem XP value before deleting
    const { data: problem, error: problemError } = await supabase
      .from('math_problems')
      .select('xp')
      .eq('id', problemId)
      .single()

    if (problemError || !problem) {
      console.error('Error fetching problem:', problemError)
      return { error: 'Problem not found' }
    }

    // Delete completion record
    const { error } = await supabase
      .from('user_problem_completions')
      .delete()
      .eq('user_id', user.id)
      .eq('problem_id', problemId)

    if (error) {
      console.error('Error resetting math problem:', error)
      return { error: 'Failed to reset problem' }
    }

    // Decrement user's total XP (ensure it doesn't go below 0)
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_xp')
      .eq('id', user.id)
      .single()

    const newXp = Math.max(0, (profile?.total_xp || 0) - problem.xp)

    await supabase
      .from('profiles')
      .update({ total_xp: newXp })
      .eq('id', user.id)

    revalidatePath('/academy/problems')

    return { success: true }
  } catch (error) {
    console.error('Error in resetMathProblem:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Complete a coding problem and award XP
 * Adds completion record and increments user's total_xp
 */
export async function completeCodingProblem(problemId: string) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'User not authenticated' }
    }

    // Check if already completed
    const { data: existingCompletion } = await supabase
      .from('user_coding_completions')
      .select('id')
      .eq('user_id', user.id)
      .eq('problem_id', problemId)
      .eq('status', 'completed')
      .maybeSingle()

    if (existingCompletion) {
      return { success: true, alreadyCompleted: true }
    }

    // Get problem XP value
    const { data: problem, error: problemError } = await supabase
      .from('coding_problems')
      .select('xp')
      .eq('id', problemId)
      .single()

    if (problemError || !problem) {
      console.error('Error fetching problem:', problemError)
      return { error: 'Problem not found' }
    }

    // Add completion record
    const { error: completionError } = await supabase
      .from('user_coding_completions')
      .upsert({
        user_id: user.id,
        problem_id: problemId,
        status: 'completed'
      }, {
        onConflict: 'user_id,problem_id'
      })

    if (completionError) {
      console.error('Error saving completion:', completionError)
      return { error: 'Failed to save completion' }
    }

    // Increment user's total XP
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_xp')
      .eq('id', user.id)
      .single()

    const newXp = (profile?.total_xp || 0) + problem.xp

    await supabase
      .from('profiles')
      .update({ total_xp: newXp })
      .eq('id', user.id)

    revalidatePath('/academy/problems')

    return { success: true, xpEarned: problem.xp }
  } catch (error) {
    console.error('Error in completeCodingProblem:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Reset a coding problem completion
 * Deletes the completion record and decrements user's total_xp
 */
export async function resetCodingProblem(problemId: string) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'User not authenticated' }
    }

    // Get problem XP value before deleting
    const { data: problem, error: problemError } = await supabase
      .from('coding_problems')
      .select('xp')
      .eq('id', problemId)
      .single()

    if (problemError || !problem) {
      console.error('Error fetching problem:', problemError)
      return { error: 'Problem not found' }
    }

    // Delete completion record
    const { error } = await supabase
      .from('user_coding_completions')
      .delete()
      .eq('user_id', user.id)
      .eq('problem_id', problemId)

    if (error) {
      console.error('Error resetting coding problem:', error)
      return { error: 'Failed to reset problem' }
    }

    // Decrement user's total XP (ensure it doesn't go below 0)
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_xp')
      .eq('id', user.id)
      .single()

    const newXp = Math.max(0, (profile?.total_xp || 0) - problem.xp)

    await supabase
      .from('profiles')
      .update({ total_xp: newXp })
      .eq('id', user.id)

    revalidatePath('/academy/problems')

    return { success: true }
  } catch (error) {
    console.error('Error in resetCodingProblem:', error)
    return { error: 'An unexpected error occurred' }
  }
}
