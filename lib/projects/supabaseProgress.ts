'use server';

import { createClient } from '@/lib/supabase/server';
import { ProjectProgress } from './types';

/**
 * Get project progress for a user
 */
export async function getProjectProgress(
  userId: string,
  projectSlug: string
): Promise<ProjectProgress | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('project_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('project_slug', projectSlug)
    .single();

  if (error) {
    // No progress yet - return empty progress
    if (error.code === 'PGRST116') {
      return {
        userId,
        projectSlug,
        completedBlockIds: [],
        blockAttempts: {},
        updatedAt: new Date().toISOString(),
      };
    }
    console.error('Error fetching project progress:', error);
    return null;
  }

  return {
    userId: data.user_id,
    projectSlug: data.project_slug,
    completedBlockIds: data.completed_block_ids || [],
    blockAttempts: data.block_attempts || {},
    updatedAt: data.updated_at,
  };
}

/**
 * Save/update project progress for a user
 */
export async function setProjectProgress(
  userId: string,
  projectSlug: string,
  completedBlockIds: string[],
  blockAttempts: Record<string, string> = {}
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('project_progress')
    .upsert(
      {
        user_id: userId,
        project_slug: projectSlug,
        completed_block_ids: completedBlockIds,
        block_attempts: blockAttempts,
      },
      {
        onConflict: 'user_id,project_slug',
      }
    );

  if (error) {
    console.error('Error saving project progress:', error);
    return false;
  }

  return true;
}

/**
 * Mark a specific block as completed
 */
export async function markBlockCompleted(
  userId: string,
  projectSlug: string,
  blockId: string,
  userCode?: string
): Promise<boolean> {
  // Get current progress
  const progress = await getProjectProgress(userId, projectSlug);
  if (!progress) return false;

  // Add block to completed list if not already there
  const updatedCompletedIds = progress.completedBlockIds.includes(blockId)
    ? progress.completedBlockIds
    : [...progress.completedBlockIds, blockId];

  // Save user code if provided
  const updatedAttempts = userCode
    ? { ...progress.blockAttempts, [blockId]: userCode }
    : progress.blockAttempts;

  return setProjectProgress(
    userId,
    projectSlug,
    updatedCompletedIds,
    updatedAttempts
  );
}

/**
 * Get all user's project progress (for showing completion on projects list)
 */
export async function getAllUserProgress(
  userId: string
): Promise<Record<string, number>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('project_progress')
    .select('project_slug, completed_block_ids')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching all user progress:', error);
    return {};
  }

  // Convert to { projectSlug: completedCount }
  return data.reduce(
    (acc, item) => {
      acc[item.project_slug] =
        (item.completed_block_ids as string[])?.length || 0;
      return acc;
    },
    {} as Record<string, number>
  );
}
