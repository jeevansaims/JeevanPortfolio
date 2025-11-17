'use client';

import { useState, useCallback } from 'react';
import { ProjectBlock } from '@/lib/projects/types';
import { MarkdownBlock } from './blocks/MarkdownBlock';
import { CodeBlock } from './blocks/CodeBlock';
import { ExerciseCodeBlock } from './blocks/ExerciseCodeBlock';
import { QuizBlock } from './blocks/QuizBlock';
import { ConceptCheckBlock } from './blocks/ConceptCheckBlock';

interface ProjectNotebookProps {
  projectSlug: string;
  blocks: ProjectBlock[];
  initialCompletedIds: string[];
  initialBlockAttempts: Record<string, string>;
  userId?: string;
  onProgressUpdate: (
    completedIds: string[],
    blockAttempts: Record<string, string>
  ) => void;
}

export function ProjectNotebook({
  projectSlug,
  blocks,
  initialCompletedIds,
  initialBlockAttempts,
  userId,
  onProgressUpdate,
}: ProjectNotebookProps) {
  const [completedBlockIds, setCompletedBlockIds] =
    useState<string[]>(initialCompletedIds);
  const [blockAttempts, setBlockAttempts] =
    useState<Record<string, string>>(initialBlockAttempts);

  const handleBlockComplete = useCallback(
    (blockId: string, userCode?: string) => {
      const newCompletedIds = completedBlockIds.includes(blockId)
        ? completedBlockIds
        : [...completedBlockIds, blockId];

      const newBlockAttempts = userCode
        ? { ...blockAttempts, [blockId]: userCode }
        : blockAttempts;

      setCompletedBlockIds(newCompletedIds);
      setBlockAttempts(newBlockAttempts);

      // Always update parent state (for progress bar and Supabase)
      onProgressUpdate(newCompletedIds, newBlockAttempts);
    },
    [completedBlockIds, blockAttempts, userId, onProgressUpdate]
  );

  return (
    <div className="space-y-8">
      {blocks.map((block, index) => {
        const isCompleted = completedBlockIds.includes(block.id);
        const savedCode = blockAttempts[block.id];

        return (
          <div key={block.id} id={`block-${block.id}`} className="scroll-mt-24">
            {block.type === 'markdown' && <MarkdownBlock block={block} />}

            {block.type === 'code' && <CodeBlock block={block} />}

            {block.type === 'exerciseCode' && (
              <ExerciseCodeBlock
                block={block}
                isCompleted={isCompleted}
                onComplete={(userCode) =>
                  handleBlockComplete(block.id, userCode)
                }
                savedCode={savedCode}
              />
            )}

            {block.type === 'quiz' && (
              <QuizBlock
                block={block}
                isCompleted={isCompleted}
                onComplete={() => handleBlockComplete(block.id)}
              />
            )}

            {block.type === 'conceptCheck' && (
              <ConceptCheckBlock
                block={block}
                isCompleted={isCompleted}
                onComplete={() => handleBlockComplete(block.id)}
              />
            )}

            {/* Add more block types here as needed */}
          </div>
        );
      })}
    </div>
  );
}
