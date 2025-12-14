// app/api/exam-progress/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { examId, answers, currentQuestionIndex } = body

    if (!examId) {
      return NextResponse.json({ error: 'Missing examId' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { error } = await supabase
      .from('user_exam_progress')
      .upsert({
        user_id: user.id,
        exam_id: examId,
        answers: answers || {},
        current_question_index: currentQuestionIndex || 0,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,exam_id'
      })

    if (error) {
      console.error('Error saving exam progress:', error)
      return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in exam-progress API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
