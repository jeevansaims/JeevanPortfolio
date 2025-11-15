'use client';

import { useEffect, useState } from 'react';

interface ProjectProgressProps {
  totalBlocks: number;
  completedBlockIds: string[];
}

export function ProjectProgress({
  totalBlocks,
  completedBlockIds,
}: ProjectProgressProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const completedCount = completedBlockIds.length;
  const progressPercent =
    totalBlocks > 0 ? (completedCount / totalBlocks) * 100 : 0;

  if (!mounted) return null;

  return (
    <div className="fixed left-4 top-24 bottom-24 flex flex-col items-center justify-center gap-3 z-20 pointer-events-none">
      {/* Percentage badge above progress bar */}
      <div className="bg-zinc-900/90 backdrop-blur-sm border border-phthalo-500/30 rounded-lg px-3 py-1.5 shadow-lg pointer-events-auto">
        <div className="text-sm font-bold text-phthalo-400 whitespace-nowrap">
          {Math.round(progressPercent)}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative flex-1 w-1 bg-zinc-800/50 rounded-full overflow-hidden backdrop-blur-sm pointer-events-auto">
        {/* Progress fill - fills from top to bottom */}
        <div
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-phthalo-500 to-phthalo-600 transition-all duration-700 ease-out rounded-full overflow-hidden"
          style={{ height: `${progressPercent}%` }}
        >
          {/* Shimmer effect - continuous sliding animation */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent"
            style={{
              animation: 'shimmer-vertical 2s ease-in-out infinite',
              height: '100%',
            }}
          />
        </div>
      </div>

      {/* Completion count below progress bar */}
      <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-lg px-3 py-1.5 shadow-lg pointer-events-auto">
        <div className="text-xs text-zinc-400 whitespace-nowrap">
          {completedCount}/{totalBlocks}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer-vertical {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  );
}
