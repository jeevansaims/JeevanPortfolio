'use client';

import { Trophy, Target, Zap, Flame } from 'lucide-react';

interface HeroStatsProps {
  mathCompletions: any[];
  codingCompletions: any[];
  totalXp: number;
}

export function HeroStats({
  mathCompletions,
  codingCompletions,
  totalXp,
}: HeroStatsProps) {
  // Calculate total problems by difficulty
  const allCompletions = [...mathCompletions, ...codingCompletions];
  const totalProblems = allCompletions.length;

  const byDifficulty = {
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

  // Calculate streak (simplified for MVP - days with at least one completion)
  const calculateStreak = () => {
    if (allCompletions.length === 0) return 0;

    const dates = allCompletions
      .map((c) => {
        const date = new Date(c.completed_at || c.created_at);
        return date.toDateString();
      })
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date().toDateString();
    let checkDate = new Date();

    for (let i = 0; i < dates.length; i++) {
      const dateStr = checkDate.toDateString();
      if (dates.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const currentStreak = calculateStreak();

  const stats = [
    {
      label: 'Total Problems',
      value: totalProblems,
      icon: Target,
      color: 'from-phthalo-500 to-phthalo-600',
      bgColor: 'bg-phthalo-500/10',
      borderColor: 'border-phthalo-500/30',
    },
    {
      label: 'Current Streak',
      value: currentStreak,
      suffix: currentStreak === 1 ? 'day' : 'days',
      icon: Flame,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
    },
    {
      label: 'Total XP',
      value: totalXp.toLocaleString(),
      icon: Zap,
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`p-6 rounded-xl bg-white/5 backdrop-blur-sm border ${stat.borderColor}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-lg text-zinc-400 ml-2">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-sm text-zinc-400">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Difficulty Breakdown Compact */}
      <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-phthalo-400" />
          <h3 className="text-lg font-semibold text-white">
            Problems by Difficulty
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {byDifficulty.beginner}
            </div>
            <div className="text-sm text-zinc-500">Beginner</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {byDifficulty.intermediate}
            </div>
            <div className="text-sm text-zinc-500">Intermediate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {byDifficulty.advanced}
            </div>
            <div className="text-sm text-zinc-500">Advanced</div>
          </div>
        </div>
      </div>
    </div>
  );
}
