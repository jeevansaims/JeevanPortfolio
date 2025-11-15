import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PageHeader } from '../components/page-header';
import { HeroStats } from './components/hero-stats';
import { ProgramProgress } from './components/program-progress';
import { DifficultyBreakdown } from './components/difficulty-breakdown';
import { RecentActivity } from './components/recent-activity';
import { NextAction } from './components/next-action';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Progress | Mirkovic Academy',
  description: 'Track your learning journey and achievements',
};

export default async function ProgressPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/academy/login');
  }

  // Get user profile with total XP
  const { data: profile } = await supabase
    .from('profiles')
    .select('total_xp')
    .eq('id', user.id)
    .single();

  // Get all math problem completions
  const { data: mathCompletions } = await supabase
    .from('user_problem_completions')
    .select(
      `
      *,
      problem:math_problems(
        id,
        title,
        difficulty,
        category,
        xp,
        lesson:lessons(
          id,
          title,
          module:modules(
            id,
            title,
            program:programs(
              id,
              title
            )
          )
        )
      )
    `
    )
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false });

  // Get all coding problem completions
  const { data: codingCompletions } = await supabase
    .from('user_coding_completions')
    .select(
      `
      *,
      problem:coding_problems(
        id,
        title,
        difficulty,
        category,
        xp
      )
    `
    )
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false });

  // Get lesson progress
  const { data: lessonProgress } = await supabase
    .from('user_lesson_progress')
    .select(
      `
      *,
      lesson:lessons(
        id,
        title,
        module:modules(
          id,
          title,
          program:programs(
            id,
            title
          )
        )
      )
    `
    )
    .eq('user_id', user.id)
    .eq('completed', true)
    .order('completed_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black">
      <PageHeader
        title="Your Progress"
        description="Track your learning journey and achievements"
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="space-y-8">
          {/* Hero Stats */}
          <HeroStats
            mathCompletions={mathCompletions || []}
            codingCompletions={codingCompletions || []}
            totalXp={profile?.total_xp || 0}
          />

          {/* Difficulty Breakdown */}
          <DifficultyBreakdown
            mathCompletions={mathCompletions || []}
            codingCompletions={codingCompletions || []}
          />

          {/* Program Progress */}
          <ProgramProgress
            lessonProgress={lessonProgress || []}
            mathCompletions={mathCompletions || []}
          />

          {/* Recent Activity */}
          <RecentActivity
            mathCompletions={mathCompletions || []}
            codingCompletions={codingCompletions || []}
            lessonProgress={lessonProgress || []}
          />

          {/* Next Action */}
          <NextAction
            mathCompletions={mathCompletions || []}
            codingCompletions={codingCompletions || []}
            lessonProgress={lessonProgress || []}
          />
        </div>
      </div>
    </div>
  );
}
