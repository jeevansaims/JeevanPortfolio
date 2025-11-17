
import { GamificationCard } from "./gamification-card";
import { InteractiveProblemCard } from "./interactive-problem-card";


export function LearningExperience() {
  return (
    <section className="py-32 relative">
      <div className="container relative z-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
                Learn by Doing
              </span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Interactive problems and gamified progress tracking that keeps you engaged
            </p>
          </div>

          {/* Two Feature Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GamificationCard />
            <InteractiveProblemCard />
          </div>
        </div>
      </div>
    </section>
  )
}