'use client';

import { GraduationCap, CheckCircle2 } from 'lucide-react';

interface ProgramProgressProps {
  lessonProgress: any[];
  mathCompletions: any[];
}

export function ProgramProgress({
  lessonProgress,
  mathCompletions,
}: ProgramProgressProps) {
  // Group lessons by program
  const programStats: Record<
    string,
    {
      title: string;
      completedLessons: number;
      totalLessons: number;
      problemsSolved: number;
    }
  > = {};

  lessonProgress.forEach((progress) => {
    const programTitle =
      progress.lesson?.module?.program?.title || 'Uncategorized';
    if (!programStats[programTitle]) {
      programStats[programTitle] = {
        title: programTitle,
        completedLessons: 0,
        totalLessons: 0,
        problemsSolved: 0,
      };
    }
    programStats[programTitle].completedLessons++;
  });

  // Count problems solved per program
  mathCompletions.forEach((completion) => {
    const programTitle =
      completion.problem?.lesson?.module?.program?.title || 'Uncategorized';
    if (programStats[programTitle]) {
      programStats[programTitle].problemsSolved++;
    }
  });

  const programs = Object.values(programStats);

  if (programs.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
        <GraduationCap className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
        <p className="text-zinc-400">
          No program progress yet. Start learning to see your progress here!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-2 mb-6">
        <GraduationCap className="w-5 h-5 text-phthalo-400" />
        <h3 className="text-xl font-bold text-white">Progress by Program</h3>
      </div>

      <div className="space-y-4">
        {programs.map((program) => {
          // For MVP, we don't have total lessons data, so we'll show completed count
          const completionPercentage = 100; // Show as ongoing

          return (
            <div
              key={program.title}
              className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-phthalo-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">
                    {program.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>
                        {program.completedLessons}{' '}
                        {program.completedLessons === 1 ? 'lesson' : 'lessons'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-sm bg-phthalo-500/20 border border-phthalo-500/50 flex items-center justify-center">
                        <span className="text-[10px] text-phthalo-400 font-bold">
                          P
                        </span>
                      </div>
                      <span>
                        {program.problemsSolved}{' '}
                        {program.problemsSolved === 1 ? 'problem' : 'problems'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar - shows activity, not completion */}
              <div className="space-y-2">
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-phthalo-500 to-phthalo-600 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (program.completedLessons / 10) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-zinc-500">In Progress</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
