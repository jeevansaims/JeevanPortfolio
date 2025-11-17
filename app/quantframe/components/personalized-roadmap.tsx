// app/quantframe/components/personalized-roadmap.tsx

"use client"

import { motion } from "framer-motion"
import { Check, Clock, BookOpen, ChevronRight } from "lucide-react"
import type { GeneratedRoadmap } from "@/app/quantframe/types/roadmap"

interface PersonalizedRoadmapProps {
  roadmap: GeneratedRoadmap
}

export function PersonalizedRoadmap({ roadmap }: PersonalizedRoadmapProps) {
  return (
    <div className="space-y-12">
      {/* Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-gradient-to-br from-phthalo-900/20 to-phthalo-800/10 border border-phthalo-700/30"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-phthalo-500/20 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-phthalo-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 text-phthalo-400">Your Personalized Journey</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              This roadmap has been custom-built based on your background, goals, and learning style. 
              Each phase builds on the previous one, taking you from your current skill level to your target role.
            </p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2 text-zinc-500">
                <Clock className="w-4 h-4" />
                <span>{roadmap.phases.length} Phases</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <BookOpen className="w-4 h-4" />
                <span>
                  {roadmap.phases.reduce((sum, phase) => sum + phase.nodes.length, 0)} Modules
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <Clock className="w-4 h-4" />
                <span>
                  {roadmap.phases.reduce(
                    (sum, phase) => sum + phase.nodes.reduce((s, n) => s + n.estimated_hours, 0),
                    0
                  )}{' '}
                  Total Hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Phases */}
      <div className="space-y-8">
        {roadmap.phases.map((phase, phaseIdx) => (
          <motion.div
            key={phase.phase}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: phaseIdx * 0.1 }}
          >
            {/* Phase Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-phthalo-600 to-phthalo-800 flex items-center justify-center text-xl font-bold">
                  {phase.phase}
                </div>
                {phaseIdx < roadmap.phases.length - 1 && (
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-phthalo-600 to-transparent"></div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{phase.title}</h2>
                <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
                  <span>{phase.nodes.length} modules</span>
                  <span>•</span>
                  <span>
                    {phase.nodes.reduce((sum, node) => sum + node.estimated_hours, 0)} hours
                  </span>
                </div>
              </div>
            </div>

            {/* Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-16">
              {phase.nodes.map((node, nodeIdx) => (
                <motion.div
                  key={nodeIdx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: phaseIdx * 0.1 + nodeIdx * 0.05 }}
                  className="group relative"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-phthalo-500/0 via-phthalo-500/10 to-phthalo-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>

                  {/* Node Card */}
                  <div className="relative h-full p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-phthalo-700/50 transition-colors">
                    {/* Title */}
                    <h4 className="font-semibold text-base mb-2 pr-8 leading-tight">
                      {node.title}
                    </h4>

                    {/* Why Included */}
                    <p className="text-sm text-zinc-400 mb-3 leading-relaxed">
                      {node.why_included}
                    </p>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{node.estimated_hours}h</span>
                      </div>

                      {node.prerequisites.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-zinc-600">
                          <ChevronRight className="w-3 h-3" />
                          <span>{node.prerequisites.length} prereq{node.prerequisites.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>

                    {/* Prerequisites (expandable on hover) */}
                    {node.prerequisites.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-xs text-zinc-600 mb-1">Prerequisites:</div>
                        <ul className="space-y-1">
                          {node.prerequisites.map((prereq, idx) => (
                            <li key={idx} className="text-xs text-zinc-500 flex items-start gap-2">
                              <Check className="w-3 h-3 text-phthalo-500 flex-shrink-0 mt-0.5" />
                              <span>{prereq}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center"
      >
        <h3 className="text-xl font-bold mb-2">Ready to Start?</h3>
        <p className="text-zinc-400 mb-4">
          Your roadmap is live. Begin with Phase 1 and work through each module at your own pace.
        </p>
        <div className="inline-block px-4 py-2 rounded-lg bg-phthalo-900/20 text-phthalo-400 text-sm">
          Course modules coming soon! Check back regularly for updates.
        </div>
      </motion.div>
    </div>
  )
}