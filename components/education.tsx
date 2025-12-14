"use client"

import { motion } from "framer-motion"
import { GraduationCap, Calendar, MapPin } from "lucide-react"

const education = [
  {
    school: "University at Buffalo",
    degree: "Master's degree, Generative AI",
    period: "Aug 2020 - Dec 2021",
    logo: "/buffalo-logo.png", // We'll use a placeholder or conditional rendering for now
  },
  {
    school: "Anna University Chennai",
    degree: "Bachelor's degree",
    period: "Jun 2015 - May 2019",
    logo: "/anna-logo.png",
  },
]

export function Education() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {education.map((edu, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-xl bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 p-6 hover:border-phthalo-500/50 transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-zinc-700/50 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-6 w-6 text-phthalo-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">{edu.school}</h3>
              <p className="text-phthalo-400 font-medium">{edu.degree}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mt-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{edu.period}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
