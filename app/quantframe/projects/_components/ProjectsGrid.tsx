'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, TrendingUp, CheckCircle2, PlayCircle } from 'lucide-react';
import { Project, Difficulty } from '@/lib/projects/types';

interface ProjectWithProgress extends Project {
  completedBlocks: number;
  totalBlocks: number;
  interactiveBlocks: number;
}

interface ProjectsGridProps {
  projects: ProjectWithProgress[];
  isLoggedIn: boolean;
}

const difficultyColors = {
  beginner: 'text-green-400 bg-green-500/10 border-green-500/20',
  intermediate: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  advanced: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const filterButtons: { label: string; value: Difficulty | 'all' }[] = [
  { label: 'All Projects', value: 'all' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
];

export function ProjectsGrid({ projects, isLoggedIn }: ProjectsGridProps) {
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>(
    'all'
  );

  // Filter projects by difficulty
  const filteredProjects =
    difficultyFilter === 'all'
      ? projects
      : projects.filter((p) => p.difficulty === difficultyFilter);

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setDifficultyFilter(btn.value)}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
              difficultyFilter === btn.value
                ? 'bg-phthalo-500/20 border-2 border-phthalo-500 text-phthalo-300'
                : 'bg-white/5 border-2 border-white/10 text-zinc-400 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-zinc-400">
            No projects found for this difficulty level.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            // Calculate percentage based on interactive blocks only
            const completionPercentage =
              project.interactiveBlocks > 0
                ? Math.round((project.completedBlocks / project.interactiveBlocks) * 100)
                : 0;
            const isStarted = project.completedBlocks > 0;

            return (
              <Link
                key={project.slug}
                href={`/quantframe/projects/${project.slug}`}
                className="group block"
              >
                <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-phthalo-500/40 transition-all duration-300">
                  {/* Difficulty Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wide ${difficultyColors[project.difficulty]}`}
                    >
                      {project.difficulty}
                    </span>
                    {isLoggedIn && isStarted && (
                      <span className="text-xs font-medium text-phthalo-400">
                        {completionPercentage}% Complete
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-phthalo-300 transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Progress Bar */}
                  {isLoggedIn && isStarted && (
                    <div className="mb-4">
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-phthalo-500 to-phthalo-400 transition-all duration-500"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {project.estimatedTimeMinutes < 60
                          ? `${project.estimatedTimeMinutes}min`
                          : `${Math.floor(project.estimatedTimeMinutes / 60)}h ${project.estimatedTimeMinutes % 60}m`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{project.interactiveBlocks} Tasks</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-phthalo-500/10 border border-phthalo-500/20 rounded text-phthalo-400 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="flex items-center gap-2 text-phthalo-400 font-medium text-sm group-hover:text-phthalo-300 transition-colors">
                    {isStarted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Continue Project</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4" />
                        <span>Start Project</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
