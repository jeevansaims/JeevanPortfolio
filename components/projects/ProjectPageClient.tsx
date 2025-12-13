'use client';

import { ReactNode } from 'react';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { ProjectProvider, useProject } from '@/lib/projects/context';
import { ProjectContent } from './ProjectContent';
import { ProjectHeader } from './ProjectHeader';
import { MarkCompleteSection } from './MarkCompleteSection';
import { ProjectMetadata } from '@/lib/projects/types';

interface ProjectPageClientProps {
  project: ProjectMetadata;
  mdxSource: MDXRemoteSerializeResult;
  initialCompletedIds: string[];
  initialBlockAttempts: Record<string, string>;
  isCompleted: boolean;
  userId: string | null;
  children?: ReactNode;
}

// Inner component that can use the context
function ProjectPageInner({
  project,
  mdxSource,
  userId,
  children,
}: {
  project: ProjectMetadata;
  mdxSource: MDXRemoteSerializeResult;
  userId: string | null;
  children?: ReactNode;
}) {
  const { resetProgress, isProjectMarkedComplete, completedBlockIds } = useProject();

  // Only show reset button if user is logged in AND has some progress
  const hasProgress = completedBlockIds.length > 0;

  return (
    <>
      {/* Project Header */}
      <ProjectHeader
        title={project.title}
        description={project.description}
        difficulty={project.difficulty}
        estimatedMinutes={project.estimatedMinutes}
        tags={project.tags}
        category={project.category}
        prerequisites={project.prerequisites}
        isCompleted={isProjectMarkedComplete}
        onReset={userId && hasProgress ? resetProgress : undefined}
      />

      {/* MDX Content with interactive components */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-10">
        <ProjectContent source={mdxSource} />
      </div>

      {/* Career Sections (passed as children) */}
      {children && (
        <div className="mt-16 space-y-8">
          {children}
        </div>
      )}

      {/* Mark Complete Section - at the very bottom */}
      {project.requiredBlockIds && project.requiredBlockIds.length > 0 && (
        <div className="mt-8">
          <MarkCompleteSection requiredBlockIds={project.requiredBlockIds} />
        </div>
      )}
    </>
  );
}

export function ProjectPageClient({
  project,
  mdxSource,
  initialCompletedIds,
  initialBlockAttempts,
  isCompleted,
  userId,
  children,
}: ProjectPageClientProps) {
  return (
    <ProjectProvider
      projectSlug={project.slug}
      userId={userId}
      initialCompletedIds={initialCompletedIds}
      initialBlockAttempts={initialBlockAttempts}
      initialProjectCompleted={isCompleted}
    >
      <ProjectPageInner
        project={project}
        mdxSource={mdxSource}
        userId={userId}
      >
        {children}
      </ProjectPageInner>
    </ProjectProvider>
  );
}
