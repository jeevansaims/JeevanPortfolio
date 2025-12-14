"use client"

import { motion } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"

const experiences = [
  {
    title: "Software Engineer II",
    company: "Microsoft",
    period: "Oct 2024 - Present",
    description:
      "Full-time Software Engineer II at Microsoft, based in Redmond, Washington (Hybrid). Contributing to core Microsoft products and services.",
  },
  {
    title: "Software Engineer",
    company: "Apple",
    period: "Jan 2024 - Sep 2024",
    description:
      "Contract role at Apple. Worked on Avalon Core Data Service, leading to a 40% reduction in redundant data processing. Designed user-friendly interfaces increasing adoption by 60%. Developed the Avalon Core Data Service CDK reducing development time by 20% and onboarding time by 50%.",
  },
  {
    title: "Software Development Engineer",
    company: "Amazon",
    period: "Mar 2022 - Jan 2024",
    description:
      "Developed high-performance caching solutions reducing latency from 15s to 1s. Optimized system performance by 25% through improved data management. Enhanced logging systems using AWS CloudWatch and Kinesis, increasing troubleshooting efficiency by 30%. Implemented API Gateways and new analytical tools.",
  },
]

export function Timeline() {
  const isMobile = useMobile()

  return (
    <div
      className={`space-y-12 relative ${
        !isMobile
          ? "before:absolute before:inset-0 before:left-1/2 before:ml-0 before:-translate-x-px before:border-l-2 before:border-zinc-700 before:h-full before:z-0"
          : ""
      }`}
    >
      {experiences.map((experience, index) => (
        <div
          key={index}
          className={`relative z-10 flex items-center ${index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"}`}
        >
          <motion.div
            className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pl-10" : "md:pr-10"}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 p-6 transition-all duration-300 hover:border-phthalo-500/50">
              <div className="absolute -inset-1 bg-gradient-to-r from-phthalo-500/10 to-phthalo-700/10 rounded-xl blur opacity-25 hover:opacity-100 transition duration-1000 hover:duration-200"></div>

              <div className="relative">
                <h3 className="text-xl font-bold">{experience.title}</h3>
                <div className="text-zinc-400 mb-4">
                  {experience.company} | {experience.period}
                </div>
                <p className="text-zinc-300">{experience.description}</p>
              </div>
            </div>
          </motion.div>

          {!isMobile && (
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              <motion.div
                className="w-6 h-6 rounded-full bg-gradient-to-r from-phthalo-600 to-phthalo-800 z-10 flex items-center justify-center"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </motion.div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
