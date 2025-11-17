'use client';

import { Code, TrendingUp, BarChart3, Zap, ArrowRight, Terminal } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const projects = [
  {
    title: 'Mean Reversion Strategy',
    description: 'Build a complete mean reversion trading system with statistical analysis and backtesting',
    tech: ['Python', 'NumPy', 'Statistics'],
    icon: TrendingUp,
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-500/5 to-emerald-600/5',
    difficulty: 'Intermediate',
    codeSnippet: '# Calculate z-score\nz = (price - ma) / std',
  },
  {
    title: 'Portfolio Optimization',
    description: 'Implement modern portfolio theory with Markowitz optimization and risk analysis',
    tech: ['Linear Algebra', 'Optimization', 'Risk Metrics'],
    icon: BarChart3,
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-500/5 to-cyan-600/5',
    difficulty: 'Advanced',
    codeSnippet: '# Minimize portfolio risk\nweights = optimize(cov_matrix)',
  },
  {
    title: 'Option Pricing Models',
    description: 'Code Black-Scholes and Monte Carlo simulations for derivative pricing',
    tech: ['Calculus', 'Probability', 'Monte Carlo'],
    icon: Zap,
    gradient: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-500/5 to-pink-600/5',
    difficulty: 'Advanced',
    codeSnippet: '# Black-Scholes formula\nprice = S * N(d1) - K * N(d2)',
  },
];

export function ProjectsShowcase() {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-phthalo-500/10 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
                Learn by Building
              </span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Master quantitative finance through real-world projects. Code actual trading strategies,
              risk models, and optimization algorithms that firms use in production.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {projects.map((project, index) => {
              const Icon = project.icon;
              return (
                <div
                  key={index}
                  className="group relative"
                >
                  {/* Card */}
                  <div className="relative h-full overflow-hidden rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all duration-300">
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.bgGradient} opacity-50`} />

                    <div className="relative p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${project.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>

                        {/* Difficulty Badge */}
                        <div className="px-3 py-1 rounded-full bg-zinc-900/80 border border-white/10">
                          <span className="text-xs font-medium text-zinc-300">
                            {project.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-phthalo-300 transition-colors">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Code Snippet */}
                      <div className="mb-4 p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-xs">
                        <div className="flex items-center gap-2 mb-2">
                          <Terminal className="w-3 h-3 text-phthalo-400" />
                          <span className="text-phthalo-400">Python</span>
                        </div>
                        <pre className="text-zinc-400 leading-relaxed">
                          {project.codeSnippet}
                        </pre>
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, i) => (
                          <span
                            key={i}
                            className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/quantframe/projects">
              <Button className="bg-gradient-to-r from-phthalo-500 to-phthalo-600 hover:from-phthalo-600 hover:to-phthalo-700 text-lg px-8 py-6">
                Explore All Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
