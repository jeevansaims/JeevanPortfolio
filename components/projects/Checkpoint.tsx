'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useProject } from '@/lib/projects/context';
import { ShieldCheck, Lock, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckpointProps {
  id: string;
  title: string;
  /** IDs of all blocks that must be completed to pass this checkpoint */
  requiredBlockIds: string[];
  /** Minimum number of blocks that must be completed (default: all) */
  minRequired?: number;
  /** Content shown when checkpoint is not yet passed */
  lockedMessage?: string;
  children: ReactNode;
}

export function Checkpoint({
  id,
  title,
  requiredBlockIds,
  minRequired,
  lockedMessage = 'Complete all checkpoint tasks to unlock the next section.',
  children,
}: CheckpointProps) {
  const { completedBlockIds, markBlockCompleted, isBlockCompleted } = useProject();
  const isCheckpointCompleted = isBlockCompleted(id);

  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate completion status
  const completedCount = requiredBlockIds.filter((blockId) =>
    completedBlockIds.includes(blockId)
  ).length;

  const threshold = minRequired ?? requiredBlockIds.length;
  const isPassed = completedCount >= threshold;
  const progressPercent = Math.round((completedCount / requiredBlockIds.length) * 100);

  // Mark checkpoint as completed when threshold is reached
  useEffect(() => {
    if (isPassed && !isCheckpointCompleted) {
      markBlockCompleted(id);
    }
  }, [isPassed, isCheckpointCompleted, id, markBlockCompleted]);

  return (
    <div className="my-10">
      {/* Checkpoint Header */}
      <div
        className={`border-2 rounded-xl overflow-hidden ${
          isPassed
            ? 'border-green-500/30 bg-green-500/5'
            : 'border-yellow-500/30 bg-yellow-500/5'
        }`}
      >
        {/* Header Bar */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            {isPassed ? (
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-green-400" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
            )}
            <div className="text-left">
              <h3 className="font-bold text-white">{title}</h3>
              <p className="text-sm text-zinc-400">
                {isPassed
                  ? 'Checkpoint passed!'
                  : `${completedCount}/${requiredBlockIds.length} tasks completed`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress indicator */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isPassed ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-sm text-zinc-400">{progressPercent}%</span>
            </div>

            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-zinc-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-zinc-400" />
            )}
          </div>
        </button>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="border-t border-white/10 p-6">
            {children}
          </div>
        )}
      </div>

      {/* Lock indicator for next section (shown below checkpoint if not passed) */}
      {!isPassed && (
        <div className="mt-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center gap-3">
          <Lock className="w-5 h-5 text-zinc-500" />
          <p className="text-sm text-zinc-500">{lockedMessage}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Section that is gated behind a checkpoint
 * Shows blurred/locked state until checkpoint is passed
 */
interface GatedSectionProps {
  /** ID of the checkpoint that must be passed */
  checkpointId: string;
  /** Title shown in locked state */
  lockedTitle?: string;
  children: ReactNode;
}

export function GatedSection({
  checkpointId,
  lockedTitle = 'Next Section',
  children,
}: GatedSectionProps) {
  const { isBlockCompleted } = useProject();
  const isUnlocked = isBlockCompleted(checkpointId);

  if (!isUnlocked) {
    return (
      <div className="my-10 relative">
        {/* Locked overlay */}
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm rounded-xl z-10 flex flex-col items-center justify-center p-8">
          <Lock className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-xl font-bold text-zinc-400 mb-2">{lockedTitle}</h3>
          <p className="text-sm text-zinc-500 text-center">
            Complete the checkpoint above to unlock this section.
          </p>
        </div>

        {/* Blurred content preview */}
        <div className="blur-sm pointer-events-none select-none opacity-30 min-h-[200px]">
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
