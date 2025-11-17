'use client';

import { CheckCircle2, Circle, Lock, BookOpen, Code, FileCheck } from 'lucide-react';

const modules = [
  {
    id: 1,
    title: 'Calculus Fundamentals',
    status: 'completed' as const,
    lessons: ['Limits & Continuity', 'Derivatives', 'Integrals', 'Optimization'],
    project: 'Gradient Descent on Sharpe Ratio',
    duration: '3-4 weeks',
  },
  {
    id: 2,
    title: 'Linear Algebra',
    status: 'in-progress' as const,
    lessons: ['Vectors & Norms', 'Matrices & Factorizations', 'Eigenvalues & PCA', 'Quadratic Forms'],
    project: 'Covariance & Portfolio Variance',
    duration: '3-4 weeks',
  },
  {
    id: 3,
    title: 'Probability Theory',
    status: 'locked' as const,
    lessons: ['Random Variables', 'Variance & Correlation', 'CLT & Confidence', 'Hypothesis Testing'],
    project: 'Monte Carlo Simulation',
    duration: '4-5 weeks',
  },
  {
    id: 4,
    title: 'Optimization',
    status: 'locked' as const,
    lessons: ['Lagrange Multipliers', 'Convex Optimization', 'Quadratic Programming', 'Regularization'],
    project: 'Mean-Variance with Regularization',
    duration: '3-4 weeks',
  },
];

export function RoadmapClean() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
            Your Learning Roadmap
          </span>
        </h2>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          A structured path from fundamentals to advanced quantitative finance
        </p>
      </div>

      {/* Roadmap Container */}
      <div className="relative">
        {/* Timeline - Left Side */}
        <div className="absolute left-0 md:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-phthalo-500 via-phthalo-500/50 to-zinc-800" />

        {/* Modules */}
        <div className="space-y-8">
          {modules.map((module, index) => {
            const isLocked = module.status === 'locked';
            const isInProgress = module.status === 'in-progress';
            const isCompleted = module.status === 'completed';

            return (
              <div
                key={module.id}
                className="relative pl-8 md:pl-24"
              >
                {/* Timeline Node */}
                <div className="absolute left-0 md:left-12 top-6 -translate-x-1/2 z-10">
                  {isCompleted && (
                    <div className="w-6 h-6 rounded-full bg-green-500 border-4 border-zinc-900 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {isInProgress && (
                    <div className="w-6 h-6 rounded-full bg-phthalo-500 border-4 border-zinc-900 flex items-center justify-center animate-pulse">
                      <Circle className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}
                  {isLocked && (
                    <div className="w-6 h-6 rounded-full bg-zinc-700 border-4 border-zinc-900 flex items-center justify-center">
                      <Lock className="w-3 h-3 text-zinc-500" />
                    </div>
                  )}
                </div>

                {/* Module Card */}
                <div
                  className={`p-6 rounded-xl border transition-all ${
                    isLocked
                      ? 'bg-zinc-900/30 border-zinc-800/50 opacity-60'
                      : isInProgress
                      ? 'bg-white/5 border-phthalo-500/30 shadow-lg shadow-phthalo-500/10'
                      : 'bg-white/5 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {/* Module Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-zinc-500">
                          Module {module.id}
                        </span>
                        {isInProgress && (
                          <span className="px-2 py-0.5 rounded-full bg-phthalo-500/20 border border-phthalo-500/30 text-xs font-medium text-phthalo-400">
                            In Progress
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-xs font-medium text-green-400">
                            Completed
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {module.title}
                      </h3>
                      <p className="text-sm text-zinc-500">{module.duration}</p>
                    </div>
                  </div>

                  {/* Module Content - Only show if not locked */}
                  {!isLocked && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Lessons */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-semibold text-zinc-300">
                            4 Lessons
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {module.lessons.map((lesson, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-zinc-400"
                            >
                              <span className="text-zinc-600 mt-1">•</span>
                              {lesson}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Project & Exam */}
                      <div className="space-y-4">
                        {/* Project */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="w-4 h-4 text-phthalo-400" />
                            <span className="text-sm font-semibold text-zinc-300">
                              Project
                            </span>
                          </div>
                          <p className="text-sm text-zinc-400 pl-6">
                            {module.project}
                          </p>
                        </div>

                        {/* Exam */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <FileCheck className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-semibold text-zinc-300">
                              Module Exam
                            </span>
                          </div>
                          <p className="text-sm text-zinc-400 pl-6">
                            20-25 points
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Locked Message */}
                  {isLocked && (
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm">Complete previous modules to unlock</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-zinc-400">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-phthalo-500" />
            <span className="text-zinc-400">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <span className="text-zinc-400">Locked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
