'use client';

import { Clock, CheckCircle2, Code, BookOpen } from 'lucide-react';

interface RecentActivityProps {
  mathCompletions: any[];
  codingCompletions: any[];
  lessonProgress: any[];
}

interface Activity {
  type: 'problem' | 'coding' | 'lesson';
  title: string;
  difficulty?: string;
  category?: string;
  timestamp: Date;
}

// Simple relative time formatter
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;

  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

export function RecentActivity({
  mathCompletions,
  codingCompletions,
  lessonProgress,
}: RecentActivityProps) {
  // Combine all activities
  const activities: Activity[] = [];

  // Add math problems
  mathCompletions.slice(0, 10).forEach((completion) => {
    activities.push({
      type: 'problem',
      title: completion.problem?.title || 'Math Problem',
      difficulty: completion.problem?.difficulty,
      category: completion.problem?.category,
      timestamp: new Date(completion.completed_at),
    });
  });

  // Add coding problems
  codingCompletions.slice(0, 10).forEach((completion) => {
    activities.push({
      type: 'coding',
      title: completion.problem?.title || 'Coding Problem',
      difficulty: completion.problem?.difficulty,
      category: completion.problem?.category,
      timestamp: new Date(completion.created_at),
    });
  });

  // Add lessons
  lessonProgress.slice(0, 10).forEach((progress) => {
    activities.push({
      type: 'lesson',
      title: progress.lesson?.title || 'Lesson',
      timestamp: new Date(progress.completed_at),
    });
  });

  // Sort by timestamp and take top 10
  const sortedActivities = activities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  if (sortedActivities.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
        <Clock className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
        <p className="text-zinc-400">
          No activity yet. Start solving problems to build your history!
        </p>
      </div>
    );
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'intermediate':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'advanced':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30';
    }
  };

  return (
    <div className="p-6 md:p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-phthalo-400" />
        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        {sortedActivities.map((activity, index) => {
          const Icon =
            activity.type === 'lesson'
              ? BookOpen
              : activity.type === 'coding'
              ? Code
              : CheckCircle2;

          return (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-phthalo-500/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-phthalo-400" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-white font-medium mb-1">
                      {activity.type === 'lesson'
                        ? 'Completed Lesson:'
                        : activity.type === 'coding'
                        ? 'Solved Coding Problem:'
                        : 'Solved Problem:'}{' '}
                      {activity.title}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {activity.difficulty && (
                        <span
                          className={`px-2 py-0.5 rounded-full border text-xs font-medium ${getDifficultyColor(
                            activity.difficulty
                          )}`}
                        >
                          {activity.difficulty}
                        </span>
                      )}
                      {activity.category && (
                        <span className="text-zinc-500">{activity.category}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-zinc-500 whitespace-nowrap">
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
