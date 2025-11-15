import { NextResponse } from 'next/server'
import { getSession } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { problemType, ...problemData } = body

    // Use service role key for admin operations (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    if (problemType === 'math') {
      // Insert math problem
      const { data, error } = await supabase
        .from('math_problems')
        .insert({
          title: problemData.title || null,
          problem: problemData.problem,
          hint: problemData.hint,
          solution: problemData.solution,
          answer: problemData.answer,
          category: problemData.category,
          difficulty: problemData.difficulty,
          xp: parseInt(problemData.xp),
          lesson_id: problemData.lesson_id || null
        })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ data, success: true })

    } else if (problemType === 'coding') {
      // Parse test cases if they're a string
      let testCases = problemData.test_cases
      if (typeof testCases === 'string') {
        testCases = JSON.parse(testCases)
      }

      // Insert coding problem
      const { data, error } = await supabase
        .from('coding_problems')
        .insert({
          problem: problemData.problem,
          hint: problemData.hint,
          solution: problemData.solution,
          starter_code: problemData.starter_code,
          test_cases: testCases,
          category: problemData.category,
          difficulty: problemData.difficulty,
          xp: parseInt(problemData.xp),
          problem_number: problemData.problem_number ? parseInt(problemData.problem_number) : null
        })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ data, success: true })

    } else {
      return NextResponse.json(
        { error: 'Invalid problem type' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error creating problem:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create problem' },
      { status: 500 }
    )
  }
}
