// Project loader - fetches project metadata from Supabase
// Content is loaded from MDX files based on content_path

import { createClient } from '@/lib/supabase/server';
import { ProjectMetadata, ProjectRow, rowToMetadata, Difficulty } from './types';

/**
 * Get all published projects
 */
export async function getAllProjects(): Promise<ProjectMetadata[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return (data as ProjectRow[]).map(rowToMetadata);
}

/**
 * Get a project by slug
 */
export async function getProjectBySlug(slug: string): Promise<ProjectMetadata | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching project:', error);
    return null;
  }

  return rowToMetadata(data as ProjectRow);
}

/**
 * Get projects by category
 */
export async function getProjectsByCategory(category: string): Promise<ProjectMetadata[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('category', category)
    .eq('is_published', true)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching projects by category:', error);
    return [];
  }

  return (data as ProjectRow[]).map(rowToMetadata);
}

/**
 * Get projects by difficulty
 */
export async function getProjectsByDifficulty(difficulty: Difficulty): Promise<ProjectMetadata[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('difficulty', difficulty)
    .eq('is_published', true)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching projects by difficulty:', error);
    return [];
  }

  return (data as ProjectRow[]).map(rowToMetadata);
}

/**
 * Get project linked to a specific module
 */
export async function getProjectByModuleId(moduleId: string): Promise<ProjectMetadata | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('module_id', moduleId)
    .eq('is_published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No project linked to this module
      return null;
    }
    console.error('Error fetching project by module:', error);
    return null;
  }

  return rowToMetadata(data as ProjectRow);
}

/**
 * Get prerequisite projects for a given project
 */
export async function getPrerequisiteProjects(projectSlug: string): Promise<ProjectMetadata[]> {
  const project = await getProjectBySlug(projectSlug);
  if (!project || !project.prerequisites.length) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .in('slug', project.prerequisites)
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching prerequisite projects:', error);
    return [];
  }

  return (data as ProjectRow[]).map(rowToMetadata);
}

/**
 * Get all unique categories from published projects
 */
export async function getProjectCategories(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('category')
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching project categories:', error);
    return [];
  }

  // Get unique categories
  const categories = [...new Set(data.map((p) => p.category))];
  return categories;
}

/**
 * Get all unique tags from published projects
 */
export async function getProjectTags(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('tags')
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching project tags:', error);
    return [];
  }

  // Flatten and get unique tags
  const allTags = data.flatMap((p) => p.tags || []);
  const uniqueTags = [...new Set(allTags)];
  return uniqueTags.sort();
}
