'use client';

import { PieChart } from 'lucide-react';

interface DifficultyBreakdownProps {
  mathCompletions: any[];
  codingCompletions: any[];
}

export function DifficultyBreakdown({
  mathCompletions,
  codingCompletions,
}: DifficultyBreakdownProps) {
  const allCompletions = [...mathCompletions, ...codingCompletions];
  const total = allCompletions.length;

  if (total === 0) {
    return null;
  }

  const counts = {
    beginner: allCompletions.filter(
      (c) => c.problem?.difficulty === 'beginner'
    ).length,
    intermediate: allCompletions.filter(
      (c) => c.problem?.difficulty === 'intermediate'
    ).length,
    advanced: allCompletions.filter(
      (c) => c.problem?.difficulty === 'advanced'
    ).length,
  };

  const percentages = {
    beginner: Math.round((counts.beginner / total) * 100),
    intermediate: Math.round((counts.intermediate / total) * 100),
    advanced: Math.round((counts.advanced / total) * 100),
  };

  const difficulties = [
    {
      label: 'Beginner',
      count: counts.beginner,
      percentage: percentages.beginner,
      color: 'bg-green-500',
      lightColor: 'bg-green-500/20',
      textColor: 'text-green-400',
    },
    {
      label: 'Intermediate',
      count: counts.intermediate,
      percentage: percentages.intermediate,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-400',
    },
    {
      label: 'Advanced',
      count: counts.advanced,
      percentage: percentages.advanced,
      color: 'bg-red-500',
      lightColor: 'bg-red-500/20',
      textColor: 'text-red-400',
    },
  ];

  return (
    <div className="p-6 md:p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="w-5 h-5 text-phthalo-400" />
        <h3 className="text-xl font-bold text-white">Difficulty Distribution</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {difficulties.map((diff) => (
          <div key={diff.label} className="space-y-3">
            {/* Stat */}
            <div className="flex items-baseline gap-2">
              <div className={`text-3xl font-bold ${diff.textColor}`}>
                {diff.count}
              </div>
              <div className="text-sm text-zinc-500">
                ({diff.percentage}%)
              </div>
            </div>

            {/* Label */}
            <div className="text-sm font-medium text-zinc-300">
              {diff.label}
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${diff.color} transition-all duration-500`}
                style={{ width: `${diff.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Visual Stacked Bar */}
      <div className="mt-8">
        <div className="h-6 bg-zinc-800 rounded-full overflow-hidden flex">
          {counts.beginner > 0 && (
            <div
              className="bg-green-500 h-full transition-all duration-500"
              style={{ width: `${percentages.beginner}%` }}
            />
          )}
          {counts.intermediate > 0 && (
            <div
              className="bg-yellow-500 h-full transition-all duration-500"
              style={{ width: `${percentages.intermediate}%` }}
            />
          )}
          {counts.advanced > 0 && (
            <div
              className="bg-red-500 h-full transition-all duration-500"
              style={{ width: `${percentages.advanced}%` }}
            />
          )}
        </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          <span>Easier</span>
          <span>Harder</span>
        </div>
      </div>
    </div>
  );
}
