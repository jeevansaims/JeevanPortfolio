import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Delete generated roadmap
    const { error: roadmapError } = await supabase
      .from('generated_roadmaps')
      .delete()
      .eq('user_id', userId)

    if (roadmapError) {
      console.error('Error deleting roadmap:', roadmapError)
    }

    // Delete quiz responses
    const { error: quizError } = await supabase
      .from('roadmap_quiz_responses')
      .delete()
      .eq('user_id', userId)

    if (quizError) {
      console.error('Error deleting quiz responses:', quizError)
    }

    return NextResponse.json({
      success: true,
      message: 'Roadmap reset successfully'
    })

  } catch (error) {
    console.error('Error resetting roadmap:', error)
    return NextResponse.json(
      { error: 'Failed to reset roadmap' },
      { status: 500 }
    )
  }
}
