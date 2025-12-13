'use client';

import { createContext, useContext, useState, useCallback, useTransition, ReactNode } from 'react';
import { setProjectProgress, resetProjectProgress, markProjectCompleted } from './supabaseProgress';

interface ProjectContextType {
  projectSlug: string;
  userId: string | null;
  completedBlockIds: string[];
  blockAttempts: Record<string, string>;
  isBlockCompleted: (blockId: string) => boolean;
  markBlockCompleted: (blockId: string, userCode?: string) => void;
  getBlockAttempt: (blockId: string) => string | undefined;
  requiredBlockIds: string[];
  setRequiredBlockIds: (ids: string[]) => void;
  allBlocksCompleted: boolean;
  isProjectMarkedComplete: boolean;
  markProjectAsComplete: () => Promise<boolean>;
  resetProgress: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

interface ProjectProviderProps {
  children: ReactNode;
  projectSlug: string;
  userId: string | null;
  initialCompletedIds: string[];
  initialBlockAttempts: Record<string, string>;
  initialProjectCompleted: boolean;
}

export function ProjectProvider({
  children,
  projectSlug,
  userId,
  initialCompletedIds,
  initialBlockAttempts,
  initialProjectCompleted,
}: ProjectProviderProps) {
  const [isPending, startTransition] = useTransition();
  const [completedBlockIds, setCompletedBlockIds] = useState<string[]>(initialCompletedIds);
  const [blockAttempts, setBlockAttempts] = useState<Record<string, string>>(initialBlockAttempts);
  const [requiredBlockIds, setRequiredBlockIds] = useState<string[]>([]);
  const [isProjectMarkedComplete, setIsProjectMarkedComplete] = useState(initialProjectCompleted);

  const isBlockCompleted = useCallback(
    (blockId: string) => completedBlockIds.includes(blockId),
    [completedBlockIds]
  );

  const getBlockAttempt = useCallback(
    (blockId: string) => blockAttempts[blockId],
    [blockAttempts]
  );

  const markBlockCompleted = useCallback(
    (blockId: string, userCode?: string) => {
      // Update local state immediately
      const newCompletedIds = completedBlockIds.includes(blockId)
        ? completedBlockIds
        : [...completedBlockIds, blockId];

      const newBlockAttempts = userCode
        ? { ...blockAttempts, [blockId]: userCode }
        : blockAttempts;

      setCompletedBlockIds(newCompletedIds);
      setBlockAttempts(newBlockAttempts);

      // Persist to Supabase in background
      if (userId) {
        startTransition(async () => {
          await setProjectProgress(userId, projectSlug, newCompletedIds, newBlockAttempts);
        });
      }
    },
    [completedBlockIds, blockAttempts, userId, projectSlug]
  );

  // Check if all required blocks are completed
  const allBlocksCompleted = requiredBlockIds.length > 0 &&
    requiredBlockIds.every(id => completedBlockIds.includes(id));

  const markProjectAsComplete = useCallback(async () => {
    if (!userId || !allBlocksCompleted) return false;

    const success = await markProjectCompleted(userId, projectSlug);
    if (success) {
      setIsProjectMarkedComplete(true);
    }
    return success;
  }, [userId, projectSlug, allBlocksCompleted]);

  const resetProgress = useCallback(async () => {
    // Clear local state immediately for instant feedback
    setCompletedBlockIds([]);
    setBlockAttempts({});
    setIsProjectMarkedComplete(false);

    // Persist reset to Supabase
    if (userId) {
      await resetProjectProgress(userId, projectSlug);
    }
  }, [userId, projectSlug]);

  return (
    <ProjectContext.Provider
      value={{
        projectSlug,
        userId,
        completedBlockIds,
        blockAttempts,
        isBlockCompleted,
        markBlockCompleted,
        getBlockAttempt,
        requiredBlockIds,
        setRequiredBlockIds,
        allBlocksCompleted,
        isProjectMarkedComplete,
        markProjectAsComplete,
        resetProgress,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
