'use client';

import { ProjectBlock } from '@/lib/projects/types';
import { ProjectNotebook } from './ProjectNotebook';
import { ProjectProgress } from './ProjectProgress';
import { ProjectHeader } from './ProjectHeader';
import { Difficulty } from '@/lib/projects/types';
import { setProjectProgress } from '@/lib/projects/supabaseProgress';
import { useState, useCallback, useTransition, useMemo } from 'react';

interface ProjectNotebookClientProps {
  projectSlug: string;
  projectTitle: string;
  projectDescription: string;
  projectDifficulty: Difficulty;
  projectEstimatedTime: number;
  projectTags: string[];
  blocks: ProjectBlock[];
  initialCompletedIds: string[];
  initialBlockAttempts: Record<string, string>;
  userId?: string;
}

export function ProjectNotebookClient({
  projectSlug,
  projectTitle,
  projectDescription,
  projectDifficulty,
  projectEstimatedTime,
  projectTags,
  blocks,
  initialCompletedIds,
  initialBlockAttempts,
  userId,
}: ProjectNotebookClientProps) {
  const [isPending, startTransition] = useTransition();
  const [completedIds, setCompletedIds] = useState(initialCompletedIds);

  // Calculate interactive block count (only blocks that need completion)
  const interactiveBlockCount = useMemo(() => {
    return blocks.filter(
      (block) =>
        block.type === 'exerciseCode' ||
        block.type === 'quiz' ||
        block.type === 'conceptCheck'
    ).length;
  }, [blocks]);

  // Check if project is completed
  const isProjectCompleted = completedIds.length === interactiveBlockCount;

  const handleProgressUpdate = useCallback(
    async (newCompletedIds: string[], newBlockAttempts: Record<string, string>) => {
      // Update local state immediately
      setCompletedIds(newCompletedIds);

      // Update Supabase in background if user is logged in
      if (userId) {
        startTransition(async () => {
          await setProjectProgress(
            userId,
            projectSlug,
            newCompletedIds,
            newBlockAttempts
          );
        });
      }
    },
    [userId, projectSlug]
  );

  const handleReset = useCallback(async () => {
    // Clear local state
    setCompletedIds([]);

    // Clear Supabase if user is logged in
    if (userId) {
      startTransition(async () => {
        await setProjectProgress(userId, projectSlug, [], {});
      });
    }

    // Reload the page to reset all block states
    window.location.reload();
  }, [userId, projectSlug]);

  return (
    <>
      {/* Vertical progress bar on the left - only count interactive blocks */}
      <ProjectProgress totalBlocks={interactiveBlockCount} completedBlockIds={completedIds} />

      <div>
        {/* Project Header with completion banner */}
        <ProjectHeader
          title={projectTitle}
          description={projectDescription}
          difficulty={projectDifficulty}
          estimatedTimeMinutes={projectEstimatedTime}
          tags={projectTags}
          isCompleted={isProjectCompleted}
          onReset={userId ? handleReset : undefined}
        />

        <ProjectNotebook
          projectSlug={projectSlug}
          blocks={blocks}
          initialCompletedIds={initialCompletedIds}
          initialBlockAttempts={initialBlockAttempts}
          userId={userId}
          onProgressUpdate={handleProgressUpdate}
        />
      </div>
    </>
  );
}
