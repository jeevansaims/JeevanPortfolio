// app/academy/components/roadmap-generator.tsx

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Sparkles } from "lucide-react"

interface RoadmapGeneratorProps {
  userId: string
}

export function RoadmapGenerator({ userId }: RoadmapGeneratorProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Call the API to generate roadmap
    async function generateRoadmap() {
      try {
        console.log('🚀 Triggering roadmap generation for user:', userId)
        
        const response = await fetch('/api/generate-roadmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        })

        const data = await response.json()

        if (!response.ok) {
          console.error('❌ API error:', data)
          setError(data.error || 'Failed to generate roadmap')
          return
        }

        console.log('✅ Roadmap generation response:', data)

        // Wait a moment for database to sync, then refresh
        setTimeout(() => {
          console.log('🔄 Refreshing page to show roadmap...')
          router.refresh()
        }, 2000)
        
      } catch (err: any) {
        console.error('💥 Error calling roadmap API:', err)
        setError(err.message || 'Something went wrong')
      }
    }

    generateRoadmap()
  }, [userId, router])

  // If there's an error, show it
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-6">
          <div className="text-6xl">⚠️</div>
          <h1 className="text-3xl font-bold text-red-400">
            Generation Failed
          </h1>
          <p className="text-zinc-400">{error}</p>
          <button
            onClick={() => router.refresh()}
            className="px-6 py-3 bg-phthalo-600 hover:bg-phthalo-700 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Show loading screen while generating (using your original UI)
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8"
        >
          {/* Loading spinner */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-br from-phthalo-500 to-phthalo-700 rounded-full blur-2xl opacity-40 animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-phthalo-500/20 to-phthalo-700/20 rounded-full flex items-center justify-center border border-phthalo-500/30">
              <Loader2 className="w-12 h-12 text-phthalo-400 animate-spin" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl font-bold"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
                Crafting Your Roadmap
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-zinc-400 max-w-md mx-auto"
            >
              Our AI is analyzing your background and building a personalized learning path just for you...
            </motion.p>
          </div>

          {/* Status indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-3 max-w-sm mx-auto"
          >
            {[
              'Analyzing your quiz responses',
              'Identifying skill gaps',
              'Selecting optimal modules',
              'Building your 4-phase roadmap',
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + idx * 0.2 }}
                className="flex items-center gap-3 text-sm text-zinc-500"
              >
                <Sparkles className="w-4 h-4 text-phthalo-400" />
                <span>{step}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Notice */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-xs text-zinc-600"
          >
            This usually takes 20-30 seconds. Please don't refresh the page.
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}