// app/quantframe/components/generating-roadmap.tsx

"use client"

import { motion } from "framer-motion"
import { Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function GeneratingRoadmap() {
  const router = useRouter()

  // Auto-refresh after 5 seconds to check if roadmap is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      router.refresh()
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

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

          {/* Auto-refresh notice */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-xs text-zinc-600"
          >
            This usually takes 5-10 seconds. The page will refresh automatically.
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}