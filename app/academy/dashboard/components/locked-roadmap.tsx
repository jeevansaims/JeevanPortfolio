// app/academy/components/locked-roadmap.tsx

"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Lock, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { RoadmapQuizResponse } from "../../quiz/types/roadmap-quiz"


interface LockedRoadmapProps {
  isLocked: boolean
  quizData: RoadmapQuizResponse
}

export function LockedRoadmap({ isLocked, quizData }: LockedRoadmapProps) {
  const router = useRouter()

  return (
    <div className="relative">
      {/* Roadmap Tree Visualization */}
      <div className={`relative ${isLocked ? 'filter blur-md' : ''}`}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-zinc-900/30 to-zinc-900/50 rounded-2xl"></div>
        
        {/* SVG Tree Structure */}
        <div className="relative p-8 sm:p-12">
          <svg
            viewBox="0 0 800 1000"
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Connection lines */}
            <g stroke="#26804A" strokeWidth="2" fill="none" opacity="0.4">
              {/* Phase 1 to Phase 2 */}
              <path d="M 400 150 L 400 250" />
              
              {/* Phase 2 to Phase 3 branches */}
              <path d="M 400 350 L 250 450" />
              <path d="M 400 350 L 550 450" />
              
              {/* Phase 3 to Phase 4 */}
              <path d="M 250 550 L 300 650" />
              <path d="M 550 550 L 500 650" />
              
              {/* Phase 4 converge */}
              <path d="M 300 750 L 400 850" />
              <path d="M 500 750 L 400 850" />
            </g>

            {/* Node circles with labels */}
            <g>
              {/* Phase 1: Foundation */}
              <circle cx="400" cy="100" r="50" fill="#18181b" stroke="#26804A" strokeWidth="2" opacity="0.8" />
              <text x="400" y="105" textAnchor="middle" fill="#d4d4d8" fontSize="14" fontWeight="600">
                Phase 1
              </text>
              <text x="400" y="180" textAnchor="middle" fill="#71717a" fontSize="12">
                Foundation
              </text>

              {/* Phase 2: Core Skills */}
              <circle cx="400" cy="300" r="50" fill="#18181b" stroke="#26804A" strokeWidth="2" opacity="0.8" />
              <text x="400" y="305" textAnchor="middle" fill="#d4d4d8" fontSize="14" fontWeight="600">
                Phase 2
              </text>
              <text x="400" y="380" textAnchor="middle" fill="#71717a" fontSize="12">
                Core Skills
              </text>

              {/* Phase 3: Specialization (branching) */}
              <circle cx="250" cy="500" r="50" fill="#18181b" stroke="#26804A" strokeWidth="2" opacity="0.8" />
              <text x="250" y="505" textAnchor="middle" fill="#d4d4d8" fontSize="14" fontWeight="600">
                Phase 3A
              </text>
              <text x="250" y="580" textAnchor="middle" fill="#71717a" fontSize="12">
                Math Track
              </text>

              <circle cx="550" cy="500" r="50" fill="#18181b" stroke="#26804A" strokeWidth="2" opacity="0.8" />
              <text x="550" y="505" textAnchor="middle" fill="#d4d4d8" fontSize="14" fontWeight="600">
                Phase 3B
              </text>
              <text x="550" y="580" textAnchor="middle" fill="#71717a" fontSize="12">
                CS Track
              </text>

              {/* Phase 4: Advanced Projects */}
              <circle cx="300" cy="700" r="50" fill="#18181b" stroke="#26804A" strokeWidth="2" opacity="0.8" />
              <text x="300" y="705" textAnchor="middle" fill="#d4d4d8" fontSize="14" fontWeight="600">
                Phase 4A
              </text>
              <text x="300" y="780" textAnchor="middle" fill="#71717a" fontSize="12">
                Research
              </text>

              <circle cx="500" cy="700" r="50" fill="#18181b" stroke="#26804A" strokeWidth="2" opacity="0.8" />
              <text x="500" y="705" textAnchor="middle" fill="#d4d4d8" fontSize="14" fontWeight="600">
                Phase 4B
              </text>
              <text x="500" y="780" textAnchor="middle" fill="#71717a" fontSize="12">
                Trading
              </text>

              {/* Final Phase: Career */}
              <circle cx="400" cy="900" r="60" fill="#18181b" stroke="#26804A" strokeWidth="3" opacity="0.9" />
              <text x="400" y="905" textAnchor="middle" fill="#d4d4d8" fontSize="16" fontWeight="700">
                Career
              </text>
              <text x="400" y="990" textAnchor="middle" fill="#71717a" fontSize="12">
                Quant Professional
              </text>
            </g>

            {/* Decorative elements */}
            <g opacity="0.2">
              {/* Small connecting dots */}
              {[
                [400, 200],
                [325, 400],
                [475, 400],
                [275, 600],
                [525, 600],
                [350, 800],
                [450, 800],
              ].map(([x, y], idx) => (
                <circle key={idx} cx={x} cy={y} r="3" fill="#26804A" />
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* Locked Overlay */}
      {isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative z-10 max-w-lg mx-auto px-6">
            {/* Glow effect */}
            <div className="absolute -inset-8 bg-gradient-to-r from-phthalo-500/20 via-phthalo-600/20 to-phthalo-700/20 rounded-3xl blur-3xl"></div>
            
            {/* Card */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 backdrop-blur-xl border-2 border-phthalo-500/30 rounded-2xl p-8 sm:p-10 shadow-2xl"
            >
              {/* Lock icon */}
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-phthalo-500/20 to-phthalo-700/20 flex items-center justify-center mb-6">
                <Lock className="w-10 h-10 text-phthalo-400" />
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
                  Unlock Your Roadmap
                </span>
              </h3>

              {/* Description */}
              <p className="text-zinc-300 text-center mb-6 leading-relaxed">
                Your personalized learning path is ready. Get instant access to:
              </p>

              {/* Features list */}
              <ul className="space-y-3 mb-8 text-sm text-zinc-400">
                {[
                  "Custom roadmap based on your background",
                  "Step-by-step modules tailored to your goals",
                  "Interactive projects and real-world applications",
                  "Weekly quant journal and progress tracking",
                ].map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-phthalo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-phthalo-400"></div>
                    </div>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                onClick={() => router.push('/academy/subscription')}
                className="w-full bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900 text-white font-semibold py-6 text-lg group"
              >
                Reveal Your Roadmap
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>

              {/* Small text */}
              <p className="text-center text-xs text-zinc-500 mt-4">
                Access all programs • Cancel anytime • Risk-free 30-day guarantee
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Unlocked state - show actual roadmap details */}
      {!isLocked && (
        <div className="mt-8 space-y-6">
          <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <h3 className="text-xl font-bold mb-4 text-phthalo-400">Your Personalized Journey</h3>
            <p className="text-zinc-400">
              Based on your quiz responses, we've crafted a roadmap tailored to your:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-500">
              <li>• Current stage: <span className="text-zinc-300 capitalize">{quizData.current_stage}</span></li>
              <li>• Primary goal: <span className="text-zinc-300 capitalize">{quizData.primary_goal}</span></li>
              <li>• Learning style: <span className="text-zinc-300 capitalize">{quizData.learning_style}</span></li>
              <li>• Available time: <span className="text-zinc-300">{quizData.hours_per_week * 5} hours/week</span></li>
            </ul>
          </div>
          
          {/* Placeholder for actual roadmap modules */}
          <div className="text-center py-8 text-zinc-500">
            Detailed roadmap modules will be displayed here...
          </div>
        </div>
      )}
    </div>
  )
}