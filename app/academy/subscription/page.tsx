// app/academy/subscription/page.tsx

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Check, Brain, Code2, LineChart, Briefcase, BookOpen, TrendingUp } from 'lucide-react'
import { ScrollToPricingButton } from './components/scroll-to-pricing-button'
import { ProSubscriptionView } from './components/pro-subscription-view'


export default async function SubscriptionPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/academy/login')
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
    redirect('/academy/quiz')
  }

  // Check if already paid
  const hasPaid = profile?.membership_tier === 'pro'

  // If pro user, show subscription management view
  if (hasPaid) {
    return <ProSubscriptionView userEmail={user.email || ''} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-phthalo-500/10 border border-phthalo-500/20 text-phthalo-400">
              Your personalized roadmap is ready
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
                Become a Quant
              </span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Join the program built for your exact background and goals. From zero to hired.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mb-20" id="pricing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Monthly Plan */}
              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-phthalo-600 to-phthalo-800 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                <div className="relative h-full p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">Monthly</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">$30</span>
                      <span className="text-zinc-500">/month</span>
                    </div>
                    <p className="text-zinc-400 mt-2">Flexible month-to-month access</p>
                  </div>

                  <button className="w-full py-3 px-6 rounded-lg bg-phthalo-600 hover:bg-phthalo-700 text-white font-semibold transition-colors mb-6">
                    Start Monthly
                  </button>

                  <div className="space-y-3 text-sm flex-grow">
                    <div className="flex items-center gap-3 text-zinc-300">
                      <Check className="h-5 w-5 text-phthalo-400 flex-shrink-0" />
                      <span>Cancel anytime</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-300">
                      <Check className="h-5 w-5 text-phthalo-400 flex-shrink-0" />
                      <span>Full access to all features</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-300">
                      <Check className="h-5 w-5 text-phthalo-400 flex-shrink-0" />
                      <span>New content every month</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Annual Plan - HIGHLIGHTED */}
              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-phthalo-500 to-phthalo-700 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative h-full p-8 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-phthalo-500/50 flex flex-col">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-phthalo-500 text-white text-xs font-bold rounded-full">
                    SAVE 33%
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold">Annual</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-500 line-through">$360</span>
                        <span className="text-sm text-phthalo-400 font-semibold">Save $120</span>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">$240</span>
                      <span className="text-zinc-500">/year</span>
                    </div>
                    <p className="text-zinc-400 mt-2">Best value • Most popular</p>
                  </div>

                  <button className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-phthalo-500 to-phthalo-700 hover:from-phthalo-600 hover:to-phthalo-800 text-white font-semibold shadow-lg shadow-phthalo-500/25 transition-all mb-6">
                    Start Annual
                  </button>

                  <div className="space-y-3 text-sm flex-grow">
                    <div className="flex items-center gap-3 text-zinc-300">
                      <Check className="h-5 w-5 text-phthalo-400 flex-shrink-0" />
                      <span>Full access to all features</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-300">
                      <Check className="h-5 w-5 text-phthalo-400 flex-shrink-0" />
                      <span>New content every month</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-300">
                      <Check className="h-5 w-5 text-phthalo-400 flex-shrink-0" />
                      <span>Priority support</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-300">
                      <Check className="h-5 w-5 text-phthalo-400 flex-shrink-0" />
                      <span>Early access to new features</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What's Included Section */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              Everything you need to break into quant
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dashboard / Roadmap */}
              <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-phthalo-500/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-phthalo-500/10 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-phthalo-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI-Personalized Roadmap</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  4-phase learning path tailored to your background, goals, and learning style
                </p>
                <div className="flex items-center gap-2 text-sm text-phthalo-400">
                  <span className="font-semibold">16-24 modules</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-500">Custom for you</span>
                </div>
              </div>

              {/* Project Vault */}
              <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-phthalo-500/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-phthalo-500/10 flex items-center justify-center mb-4">
                  <Code2 className="h-6 w-6 text-phthalo-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Project Vault</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Build real quantitative projects that get you hired. New projects monthly.
                </p>
                <div className="flex items-center gap-2 text-sm text-phthalo-400">
                  <span className="font-semibold">12+ projects</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-500">Production code</span>
                </div>
              </div>

              {/* Math Fundamentals */}
              <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-phthalo-500/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-phthalo-500/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-phthalo-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Math Fundamentals</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Core quant math explained with practical context and real applications
                </p>
                <div className="flex items-center gap-2 text-sm text-phthalo-400">
                  <span className="font-semibold">45+ lessons</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-500">100+ problems</span>
                </div>
              </div>

              {/* Quant Journal */}
              <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-phthalo-500/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-phthalo-500/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-phthalo-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Weekly Quant Journal</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Stay sharp with weekly deep-dives, market insights, and strategy breakdowns
                </p>
                <div className="flex items-center gap-2 text-sm text-phthalo-400">
                  <span className="font-semibold">52 posts/year</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-500">Every Monday</span>
                </div>
              </div>

              {/* Trading Strategies */}
              <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-phthalo-500/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-phthalo-500/10 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-phthalo-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Trading Strategies</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Learn to build, backtest, and deploy quantitative trading strategies
                </p>
                <div className="flex items-center gap-2 text-sm text-phthalo-400">
                  <span className="font-semibold">8+ strategies</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-500">Full code included</span>
                </div>
              </div>

              {/* CV Lab */}
              <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-phthalo-500/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-phthalo-500/10 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-phthalo-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">CV Lab</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Professional templates and frameworks to land quant interviews
                </p>
                <div className="flex items-center gap-2 text-sm text-phthalo-400">
                  <span className="font-semibold">3 templates</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-500">Interview prep</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof / Stats */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="text-center">
                <div className="text-3xl font-bold text-phthalo-400 mb-1">500+</div>
                <div className="text-sm text-zinc-500">Active learners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-phthalo-400 mb-1">120+</div>
                <div className="text-sm text-zinc-500">Hours of content</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-phthalo-400 mb-1">85+</div>
                <div className="text-sm text-zinc-500">Projects & exercises</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-phthalo-400 mb-1">4.9/5</div>
                <div className="text-sm text-zinc-500">Student rating</div>
              </div>
            </div>
          </div>

          {/* FAQ / Additional Info */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
                <p className="text-zinc-400 text-sm">
                  Yes. Monthly subscribers can cancel at any time. Annual subscribers get full access for 12 months.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <h3 className="font-semibold text-lg mb-2">Is this suitable for beginners?</h3>
                <p className="text-zinc-400 text-sm">
                  Absolutely. Your roadmap adapts to your current level. Whether you're starting from scratch or have experience, the content meets you where you are.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <h3 className="font-semibold text-lg mb-2">What if I don't get value?</h3>
                <p className="text-zinc-400 text-sm">
                  We offer a 30-day money-back guarantee. If you're not satisfied within the first month, we'll refund you in full—no questions asked.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <h3 className="font-semibold text-lg mb-2">Do I get updates for free?</h3>
                <p className="text-zinc-400 text-sm">
                  Yes. All new content, projects, and features are included in your membership at no additional cost.
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-20 text-center">
            <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-phthalo-900/20 to-phthalo-950/20 border border-phthalo-700/30">
              <h2 className="text-3xl font-bold mb-4">Ready to start your quant journey?</h2>
              <p className="text-zinc-400 mb-6">
                Join hundreds of aspiring quants building the skills that matter
              </p>
              <ScrollToPricingButton
                className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-phthalo-500 to-phthalo-700 hover:from-phthalo-600 hover:to-phthalo-800 text-white font-semibold shadow-lg shadow-phthalo-500/25 transition-all"
              >
                Get Started Today
              </ScrollToPricingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}