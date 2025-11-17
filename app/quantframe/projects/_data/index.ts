import { ProjectDefinition } from '@/lib/projects/types';
import { testAllFeaturesProject } from './test-all-features';
import { meanReversionProject } from './mean-reversion';

/**
 * All available projects
 * To add a new project: import it and add to this array
 */
export const PROJECTS: ProjectDefinition[] = [
  meanReversionProject,
  testAllFeaturesProject,
];

/**
 * Get a project by its slug
 */
export function getProjectBySlug(
  slug: string
): ProjectDefinition | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

/**
 * Get all projects sorted by difficulty and date
 */
export function getAllProjects(): ProjectDefinition[] {
  return PROJECTS;
}

/**
 * Get projects filtered by difficulty
 */
export function getProjectsByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): ProjectDefinition[] {
  return PROJECTS.filter((project) => project.difficulty === difficulty);
}

/**
 * Get projects filtered by tag
 */
export function getProjectsByTag(tag: string): ProjectDefinition[] {
  return PROJECTS.filter((project) =>
    project.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Calculate total number of blocks in a project
 */
export function getTotalBlocks(project: ProjectDefinition): number {
  return project.notebookBlocks.length;
}

/**
 * Calculate number of interactive blocks (exercises + quizzes)
 */
export function getInteractiveBlockCount(project: ProjectDefinition): number {
  return project.notebookBlocks.filter(
    (block) =>
      block.type === 'exerciseCode' ||
      block.type === 'quiz' ||
      block.type === 'conceptCheck'
  ).length;
}
