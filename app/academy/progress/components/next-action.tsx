'use client';

import { Lightbulb, ArrowRight, TrendingUp, Target } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface NextActionProps {
  mathCompletions: any[];
  codingCompletions: any[];
  lessonProgress: any[];
}

export function NextAction({
  mathCompletions,
  codingCompletions,
  lessonProgress,
}: NextActionProps) {
  const allCompletions = [...mathCompletions, ...codingCompletions];

  // Calculate difficulty distribution
  const beginnerCount = allCompletions.filter(
    (c) => c.problem?.difficulty === 'beginner'
  ).length;
  const intermediateCount = allCompletions.filter(
    (c) => c.problem?.difficulty === 'intermediate'
  ).length;
  const advancedCount = allCompletions.filter(
    (c) => c.problem?.difficulty === 'advanced'
  ).length;

  const totalProblems = allCompletions.length;

  // Check last activity
  const getLastActivityDate = () => {
    if (allCompletions.length === 0 && lessonProgress.length === 0) {
      return null;
    }

    const dates = [
      ...allCompletions.map((c) => new Date(c.completed_at || c.created_at)),
      ...lessonProgress.map((l) => new Date(l.completed_at)),
    ];

    return new Date(Math.max(...dates.map((d) => d.getTime())));
  };

  const lastActivity = getLastActivityDate();
  const daysSinceLastActivity = lastActivity
    ? Math.floor(
        (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  // Determine recommendation
  let recommendation = {
    title: 'Start Your Journey',
    message:
      "You haven't started yet. Begin with a beginner problem to build momentum!",
    cta: 'Browse Problems',
    href: '/academy/problems',
    icon: Target,
    color: 'from-phthalo-500 to-phthalo-600',
  };

  if (daysSinceLastActivity !== null && daysSinceLastActivity >= 3) {
    recommendation = {
      title: 'Welcome Back!',
      message: `It's been ${daysSinceLastActivity} days since your last activity. Start with a quick warmup problem to get back into it.`,
      cta: 'Solve a Problem',
      href: '/academy/problems',
      icon: Target,
      color: 'from-orange-500 to-red-600',
    };
  } else if (totalProblems > 0) {
    const beginnerRatio = beginnerCount / totalProblems;
    const intermediateRatio = intermediateCount / totalProblems;

    if (beginnerRatio > 0.7) {
      recommendation = {
        title: 'Level Up!',
        message:
          "You're crushing the beginner problems! Time to challenge yourself with intermediate difficulty.",
        cta: 'Try Intermediate',
        href: '/academy/problems',
        icon: TrendingUp,
        color: 'from-yellow-500 to-amber-600',
      };
    } else if (intermediateRatio > 0.6) {
      recommendation = {
        title: 'Ready for Advanced?',
        message:
          "You've mastered intermediate problems. Push yourself with advanced challenges.",
        cta: 'Try Advanced',
        href: '/academy/problems',
        icon: TrendingUp,
        color: 'from-red-500 to-red-600',
      };
    } else if (advancedCount > 5) {
      recommendation = {
        title: 'Keep Pushing!',
        message:
          "You're tackling advanced problems. Keep up the momentum and maintain your streak!",
        cta: 'Continue Learning',
        href: '/academy/problems',
        icon: TrendingUp,
        color: 'from-purple-500 to-purple-600',
      };
    } else {
      recommendation = {
        title: 'Keep Building',
        message:
          "You're making steady progress. Try to solve at least one problem per day to build consistency.",
        cta: 'Solve Today',
        href: '/academy/daily',
        icon: Target,
        color: 'from-phthalo-500 to-phthalo-600',
      };
    }
  }

  const Icon = recommendation.icon;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-phthalo-500 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-phthalo-600 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="relative p-8">
        <div className="flex items-start gap-6">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-r ${recommendation.color} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-phthalo-400" />
              <span className="text-sm font-semibold text-phthalo-400 uppercase tracking-wide">
                Next Best Action
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {recommendation.title}
            </h3>
            <p className="text-lg text-zinc-400 mb-6 max-w-2xl">
              {recommendation.message}
            </p>
            <Link href={recommendation.href}>
              <Button
                className={`bg-gradient-to-r ${recommendation.color} hover:opacity-90 transition-opacity`}
              >
                {recommendation.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
