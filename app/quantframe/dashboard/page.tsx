// app/quantframe/dashboard/page.tsx

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LockedRoadmap } from './components/locked-roadmap'
import { RoadmapGenerator } from '../components/roadmap-generator'
import { PersonalizedRoadmap } from '../components/personalized-roadmap'
import { PageHeader } from '../components/page-header'


export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/quantframe/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Check if user has completed the quiz
  const { data: quizResponse } = await supabase
    .from('roadmap_quiz_responses')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // If no quiz response, redirect to quiz
  if (!quizResponse) {
    redirect('/quantframe/quiz')
  }

  // Check if user has paid (membership_tier === 'pro')
  const hasPaid = profile?.membership_tier === 'pro'

  // If not paid, show locked roadmap - CENTERED with no header
  if (!hasPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-4xl my-auto">
          <LockedRoadmap isLocked={true} quizData={quizResponse} />
        </div>
      </div>
    )
  }

  // User is paid - fetch their generated roadmap
  const { data: roadmapData } = await supabase
    .from('generated_roadmaps')
    .select('roadmap_json')
    .eq('user_id', user.id)
    .single()

  // If no roadmap yet (just paid, need to generate)
  // This component will trigger the API call and show loading screen
  if (!roadmapData) {
    return <RoadmapGenerator userId={user.id} />
  }

  // Display the actual personalized roadmap! 🎉
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black">
      <PageHeader
        title="Your Personalized Roadmap"
        description="Your journey to becoming a quantitative professional"
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <PersonalizedRoadmap roadmap={roadmapData.roadmap_json} />
        </div>
      </div>
    </div>
  )
}