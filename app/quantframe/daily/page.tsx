// app/quantframe/daily/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, Calendar } from 'lucide-react'
import { CountdownTimer } from './components/countdown-timer'
import { MathCard } from './components/math-card'
import { CodingCard } from './components/coding-card'

interface MathProblem {
  id: string
  problem: string
  hint: string
  solution: string
  answer: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  xp: number
  problem_number?: number
}

interface CodingProblem {
  id: string
  problem: string
  hint: string
  solution: string
  starter_code: string
  test_cases: any[]
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  xp: number
  problem_number?: number
}

interface DailyChallenge {
  challenge_date: string
  math_problem_id: string
  coding_problem_id: string
}

export default function DailyChallengePage() {
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [mathProblem, setMathProblem] = useState<MathProblem | null>(null)
  const [codingProblem, setCodingProblem] = useState<CodingProblem | null>(null)
  const [currentTab, setCurrentTab] = useState<'math' | 'coding'>('math')
  const [mathCompleted, setMathCompleted] = useState(false)
  const [codingCompleted, setCodingCompleted] = useState(false)

  useEffect(() => {
    loadDailyChallenge()
  }, [])

  const loadDailyChallenge = async () => {
    setLoading(true)
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.error('Error getting user:', userError)
        setLoading(false)
        return
      }
      setUserId(user.id)

      const today = new Date().toISOString().split('T')[0]

      const { data: existingChallenge, error: challengeError } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('challenge_date', today)
        .single()

      if (challengeError && challengeError.code !== 'PGRST116') {
        console.error('Error fetching challenge:', challengeError)
        throw challengeError
      }

      let challenge: DailyChallenge

      if (existingChallenge) {
        challenge = existingChallenge
      } else {
        challenge = await createNewDailyChallenge(today)
      }

      const [mathResult, codingResult] = await Promise.all([
        supabase.from('math_problems').select('*').eq('id', challenge.math_problem_id).single(),
        supabase.from('coding_problems').select('*').eq('id', challenge.coding_problem_id).single()
      ])

      if (mathResult.error) throw mathResult.error
      if (codingResult.error) throw codingResult.error

      if (mathResult.data) setMathProblem(mathResult.data)
      if (codingResult.data) setCodingProblem(codingResult.data)

      const [mathCompletionResult, codingCompletionResult] = await Promise.all([
        supabase
          .from('user_problem_completions')
          .select('status')
          .eq('user_id', user.id)
          .eq('problem_id', challenge.math_problem_id)
          .maybeSingle(),
        supabase
          .from('user_coding_completions')
          .select('status')
          .eq('user_id', user.id)
          .eq('problem_id', challenge.coding_problem_id)
          .maybeSingle()
      ])

      if (mathCompletionResult.data?.status === 'completed') setMathCompleted(true)
      if (codingCompletionResult.data?.status === 'completed') setCodingCompleted(true)

    } catch (error) {
      console.error('Error loading daily challenge:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewDailyChallenge = async (date: string): Promise<DailyChallenge> => {
    const { data: allMathProblems, error: mathError } = await supabase
      .from('math_problems')
      .select('id')
      .is('lesson_id', null) // Only use practice problems, not quiz questions

    if (mathError) throw mathError

    const { data: allCodingProblems, error: codingError } = await supabase
      .from('coding_problems')
      .select('id')

    if (codingError) throw codingError

    if (!allMathProblems?.length || !allCodingProblems?.length) {
      throw new Error('No problems available')
    }

    const { data: previousChallenges } = await supabase
      .from('daily_challenges')
      .select('math_problem_id, coding_problem_id')
      .order('challenge_date', { ascending: false })
      .limit(Math.max(allMathProblems.length, allCodingProblems.length))

    const usedMathIds = new Set(previousChallenges?.map(c => c.math_problem_id) || [])
    const usedCodingIds = new Set(previousChallenges?.map(c => c.coding_problem_id) || [])

    const unusedMathProblems = allMathProblems.filter(p => !usedMathIds.has(p.id))
    const unusedCodingProblems = allCodingProblems.filter(p => !usedCodingIds.has(p.id))

    const mathPool = unusedMathProblems.length > 0 ? unusedMathProblems : allMathProblems
    const codingPool = unusedCodingProblems.length > 0 ? unusedCodingProblems : allCodingProblems

    const selectedMath = mathPool[Math.floor(Math.random() * mathPool.length)]
    const selectedCoding = codingPool[Math.floor(Math.random() * codingPool.length)]

    const { data: newChallenge, error } = await supabase
      .from('daily_challenges')
      .insert({
        challenge_date: date,
        math_problem_id: selectedMath.id,
        coding_problem_id: selectedCoding.id
      })
      .select()
      .single()

    if (error) throw error

    return newChallenge
  }

  const handleMathComplete = async () => {
    if (!mathProblem || !userId || mathCompleted) return

    setMathCompleted(true)

    try {
      await supabase
        .from('user_problem_completions')
        .upsert({
          user_id: userId,
          problem_id: mathProblem.id,
          status: 'completed'
        }, {
          onConflict: 'user_id,problem_id'
        })
    } catch (error) {
      console.error('Error saving math completion:', error)
    }
  }

  const handleCodingComplete = async () => {
    if (!codingProblem || !userId || codingCompleted) return

    setCodingCompleted(true)

    try {
      await supabase
        .from('user_coding_completions')
        .upsert({
          user_id: userId,
          problem_id: codingProblem.id,
          status: 'completed'
        }, {
          onConflict: 'user_id,problem_id'
        })
    } catch (error) {
      console.error('Error saving coding completion:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-phthalo-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading daily challenge...</p>
        </div>
      </div>
    )
  }

  if (!mathProblem || !codingProblem) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl bg-zinc-900/50 border-zinc-800 backdrop-blur-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Challenge Available</h2>
          <p className="text-zinc-400">Please try again later.</p>
        </Card>
      </div>
    )
  }

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-phthalo-400" />
              <span className="text-zinc-400 text-sm">{today}</span>
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600 mb-2">
              Daily Challenge
            </h1>
            <p className="text-zinc-400">Complete both challenges to master your skills!</p>
            <div className="mt-4 flex justify-center">
              <CountdownTimer />
            </div>
          </div>

          {/* Desktop: Side by Side */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6">
            <MathCard 
              problem={mathProblem} 
              completed={mathCompleted}
              onComplete={handleMathComplete}
            />
            <CodingCard 
              problem={codingProblem}
              completed={codingCompleted}
              onComplete={handleCodingComplete}
            />
          </div>

          {/* Mobile: Tabs */}
          <div className="lg:hidden">
            <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as 'math' | 'coding')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-800/50 mb-6">
                <TabsTrigger 
                  value="math" 
                  className="data-[state=active]:bg-phthalo-600 data-[state=active]:text-white"
                >
                  Mathematics
                  {mathCompleted && <CheckCircle2 className="w-4 h-4 ml-2 text-green-400" />}
                </TabsTrigger>
                <TabsTrigger 
                  value="coding"
                  className="data-[state=active]:bg-phthalo-600 data-[state=active]:text-white"
                >
                  Coding
                  {codingCompleted && <CheckCircle2 className="w-4 h-4 ml-2 text-green-400" />}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="math">
                <MathCard 
                  problem={mathProblem} 
                  completed={mathCompleted}
                  onComplete={handleMathComplete}
                />
              </TabsContent>

              <TabsContent value="coding">
                <CodingCard 
                  problem={codingProblem}
                  completed={codingCompleted}
                  onComplete={handleCodingComplete}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
  )
}