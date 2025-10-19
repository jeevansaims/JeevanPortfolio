import { createClient } from '@/lib/supabase/server'
import { BookOpen, TrendingUp, Code } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="container mx-auto px-4 sm:px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
              Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!
            </span>
          </h1>
          <p className="text-xl text-zinc-400">
            Ready to continue your journey?
          </p>
        </div>

        {/* Membership Status */}
        <div className="mb-12">
          <div className="relative">
            <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-phthalo-500/20 to-phthalo-700/20 blur-xl opacity-70"></div>
            <div className="relative bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Membership Status</h3>
                  <p className="text-zinc-400 capitalize">
                    {profile?.membership_tier} Plan
                  </p>
                </div>
                <div className="px-4 py-2 rounded-full bg-phthalo-500/20 text-phthalo-400 font-medium">
                  {profile?.membership_tier === 'free' ? 'Free' : 'Pro'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Your Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quant Math */}
            <div className="relative group">
              <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-phthalo-500/20 to-phthalo-700/20 blur-xl opacity-0 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:border-phthalo-500/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-phthalo-500/20 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-phthalo-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Quant Math</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Master the mathematical foundations
                </p>
                <div className="text-sm text-zinc-500">
                  Coming Soon
                </div>
              </div>
            </div>

            {/* Python for Quants */}
            <div className="relative group">
              <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-700/20 blur-xl opacity-0 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Python for Quants</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Build production-grade systems
                </p>
                <div className="text-sm text-zinc-500">
                  Coming Soon
                </div>
              </div>
            </div>

            {/* ML for Finance */}
            <div className="relative group">
              <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-purple-700/20 blur-xl opacity-0 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">ML for Finance</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Apply modern ML techniques
                </p>
                <div className="text-sm text-zinc-500">
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder Message */}
        <div className="text-center py-12">
          <div className="inline-block p-8 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <BookOpen className="w-16 h-16 text-phthalo-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Dashboard Under Construction</h3>
            <p className="text-zinc-400 max-w-md">
              We're building something amazing. Programs, progress tracking, and interactive lessons are coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}