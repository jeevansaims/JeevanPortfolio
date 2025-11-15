// app/api/generate-roadmap/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { ROADMAP_SYSTEM_PROMPT } from '@/app/academy/lib/roadmap-prompt'
import { RoadmapQuizResponse } from '@/app/academy/quiz/types/roadmap-quiz'


// Use service role key for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// Helper to map hours_per_week number to label
function getHoursLabel(value: number): string {
  const labels = ['0-5 hours', '5-10 hours', '10-20 hours', '20+ hours']
  return labels[value - 1] || '5-10 hours'
}

// Build user prompt from quiz data
function buildUserPrompt(quizData: RoadmapQuizResponse): string {
  return `
Current Status: ${quizData.current_stage}
Goal: ${quizData.primary_goal}
Math Background: ${quizData.math_background.join(', ') || 'none'}
CS Skills: ${quizData.cs_skills.join(', ') || 'none'}
Market Knowledge: ${quizData.market_knowledge.join(', ') || 'none'}
Hours/Week: ${getHoursLabel(quizData.hours_per_week)}
Learning Style: ${quizData.learning_style}
Motivation: ${quizData.motivation_level}/10
Challenges: ${quizData.current_challenge.join(', ')}

Generate a detailed 4-phase roadmap following all rules. Return ONLY valid JSON with no additional text.
  `.trim()
}

export async function POST(req: Request) {
  console.log('\n==========================================')
  console.log('🚀 [ROADMAP API] Request received')
  console.log('==========================================\n')

  try {
    // Parse request body
    console.log('📥 [STEP 1] Parsing request body...')
    const { userId } = await req.json()
    console.log('   ✅ User ID:', userId)

    if (!userId) {
      console.log('   ❌ ERROR: No user ID provided')
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check environment variables
    console.log('\n🔑 [STEP 2] Checking environment variables...')
    console.log('   NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
    console.log('   SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing')
    console.log('   OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing')

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('   ❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is missing!')
      return NextResponse.json(
        { error: 'Server configuration error: Missing Supabase service role key' },
        { status: 500 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      console.log('   ❌ ERROR: OPENAI_API_KEY is missing!')
      return NextResponse.json(
        { error: 'Server configuration error: Missing OpenAI API key' },
        { status: 500 }
      )
    }

    // Check if roadmap already exists
    console.log('\n🔍 [STEP 3] Checking if roadmap already exists...')
    const { data: existingRoadmap, error: existingError } = await supabaseAdmin
      .from('generated_roadmaps')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existingError && existingError.code !== 'PGRST116') {
      console.log('   ⚠️  Error checking existing roadmap:', existingError)
    }

    if (existingRoadmap) {
      console.log('   ✅ Roadmap already exists for this user')
      console.log('   📊 Roadmap ID:', existingRoadmap.id)
      return NextResponse.json({ 
        success: true, 
        message: 'Roadmap already exists',
        roadmapId: existingRoadmap.id
      })
    }
    console.log('   ✅ No existing roadmap found, will generate new one')

    // Fetch quiz data
    console.log('\n📋 [STEP 4] Fetching quiz data...')
    const { data: quizData, error: quizError } = await supabaseAdmin
      .from('roadmap_quiz_responses')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (quizError) {
      console.log('   ❌ ERROR fetching quiz data:', quizError)
      return NextResponse.json(
        { error: 'Quiz data not found', details: quizError.message },
        { status: 404 }
      )
    }

    if (!quizData) {
      console.log('   ❌ ERROR: Quiz data is null')
      return NextResponse.json(
        { error: 'Quiz data not found' },
        { status: 404 }
      )
    }

    console.log('   ✅ Quiz data fetched successfully')
    console.log('   📊 Current stage:', quizData.current_stage)
    console.log('   📊 Primary goal:', quizData.primary_goal)
    console.log('   📊 Math background:', quizData.math_background)
    console.log('   📊 CS skills:', quizData.cs_skills)
    console.log('   📊 Motivation level:', quizData.motivation_level)

    // Build prompt
    console.log('\n✍️  [STEP 5] Building user prompt...')
    const userPrompt = buildUserPrompt(quizData)
    console.log('   ✅ User prompt built')
    console.log('   📝 Prompt length:', userPrompt.length, 'characters')
    console.log('   📝 First 200 chars:', userPrompt.substring(0, 200) + '...')

    // Call OpenAI
    console.log('\n🤖 [STEP 6] Calling OpenAI API...')
    console.log('   Model: gpt-4o')
    console.log('   Temperature: 0.7')
    console.log('   Response format: JSON')
    
    const startTime = Date.now()
    
    let completion
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: ROADMAP_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      })
    } catch (openaiError: any) {
      console.log('   ❌ ERROR calling OpenAI:', openaiError)
      console.log('   Error details:', openaiError.message)
      return NextResponse.json(
        { error: 'OpenAI API error', details: openaiError.message },
        { status: 500 }
      )
    }

    const endTime = Date.now()
    console.log('   ✅ OpenAI response received in', (endTime - startTime) / 1000, 'seconds')

    const responseContent = completion.choices[0].message.content

    if (!responseContent) {
      console.log('   ❌ ERROR: Empty response from OpenAI')
      return NextResponse.json(
        { error: 'Empty response from AI' },
        { status: 500 }
      )
    }

    console.log('   ✅ Response content length:', responseContent.length, 'characters')
    console.log('   📝 First 200 chars:', responseContent.substring(0, 200) + '...')

    // Parse JSON
    console.log('\n🔄 [STEP 7] Parsing JSON response...')
    let roadmapJSON
    try {
      roadmapJSON = JSON.parse(responseContent)
    } catch (parseError: any) {
      console.log('   ❌ ERROR parsing JSON:', parseError)
      console.log('   Response that failed to parse:', responseContent)
      return NextResponse.json(
        { error: 'Failed to parse AI response', details: parseError.message },
        { status: 500 }
      )
    }

    console.log('   ✅ JSON parsed successfully')
    console.log('   📊 Number of phases:', roadmapJSON.phases?.length)
    if (roadmapJSON.phases) {
      roadmapJSON.phases.forEach((phase: any, idx: number) => {
        console.log(`   📊 Phase ${idx + 1}: ${phase.title} (${phase.nodes?.length} nodes)`)
      })
    }

    // Save to database
    console.log('\n💾 [STEP 8] Saving to database...')
    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from('generated_roadmaps')
      .insert({
        user_id: userId,
        roadmap_json: roadmapJSON,
      })
      .select()
      .single()

    if (insertError) {
      console.log('   ❌ ERROR saving to database:', insertError)
      console.log('   Error details:', insertError.message)
      console.log('   Error code:', insertError.code)
      return NextResponse.json(
        { error: 'Failed to save roadmap', details: insertError.message },
        { status: 500 }
      )
    }

    console.log('   ✅ Roadmap saved successfully!')
    console.log('   📊 Database ID:', insertedData?.id)

    console.log('\n==========================================')
    console.log('🎉 [SUCCESS] Roadmap generation complete!')
    console.log('==========================================\n')

    return NextResponse.json({
      success: true,
      message: 'Roadmap generated and saved successfully',
      roadmapId: insertedData?.id,
      userId: userId,
      phasesCount: roadmapJSON.phases?.length,
    })
  } catch (error: any) {
    console.log('\n==========================================')
    console.log('💥 [FATAL ERROR] Unexpected error occurred')
    console.log('==========================================')
    console.error('Error:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.log('==========================================\n')
    
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}