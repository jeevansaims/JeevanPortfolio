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
        projectId: null,
        completedBlockIds: [],
        blockAttempts: {},
        completed: false,
        completedAt: null,
        updatedAt: new Date().toISOString(),
      };
    }
    console.error('Error fetching project progress:', error);
    return null;
  }

  return {
    userId: data.user_id,
    projectSlug: data.project_slug,
    projectId: data.project_id || null,
    completedBlockIds: data.completed_block_ids || [],
    blockAttempts: data.block_attempts || {},
    completed: data.completed || false,
    completedAt: data.completed_at || null,
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
  blockAttempts: Record<string, string> = {},
  projectId?: string
): Promise<boolean> {
  const supabase = await createClient();

  const upsertData: any = {
    user_id: userId,
    project_slug: projectSlug,
    completed_block_ids: completedBlockIds,
    block_attempts: blockAttempts,
    updated_at: new Date().toISOString(),
  };

  // Add project_id if provided
  if (projectId) {
    upsertData.project_id = projectId;
  }

  const { error } = await supabase.from('project_progress').upsert(upsertData, {
    onConflict: 'user_id,project_slug',
  });

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

  return setProjectProgress(userId, projectSlug, updatedCompletedIds, updatedAttempts);
}

/**
 * Mark a project as fully completed
 */
export async function markProjectCompleted(
  userId: string,
  projectSlug: string,
  projectId?: string
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('project_progress')
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('project_slug', projectSlug);

  if (error) {
    console.error('Error marking project completed:', error);
    return false;
  }

  return true;
}

/**
 * Get all user's project progress (for showing completion on projects list)
 */
export async function getAllUserProgress(userId: string): Promise<
  Record<
    string,
    {
      completedCount: number;
      completed: boolean;
    }
  >
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('project_progress')
    .select('project_slug, completed_block_ids, completed')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching all user progress:', error);
    return {};
  }

  // Convert to { projectSlug: { completedCount, completed } }
  return data.reduce(
    (acc, item) => {
      acc[item.project_slug] = {
        completedCount: (item.completed_block_ids as string[])?.length || 0,
        completed: item.completed || false,
      };
      return acc;
    },
    {} as Record<string, { completedCount: number; completed: boolean }>
  );
}

/**
 * Get completed project count for a user
 */
export async function getCompletedProjectCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('project_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completed', true);

  if (error) {
    console.error('Error fetching completed project count:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Reset all progress for a project (clears completed blocks and attempts)
 */
export async function resetProjectProgress(
  userId: string,
  projectSlug: string
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('project_progress')
    .update({
      completed_block_ids: [],
      block_attempts: {},
      completed: false,
      completed_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('project_slug', projectSlug);

  if (error) {
    console.error('Error resetting project progress:', error);
    return false;
  }

  return true;
}
