import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProjectBySlug } from '@/app/quantframe/projects/_data';
import { getProjectProgress } from '@/lib/projects/supabaseProgress';
import { ProjectNotebookClient } from '../_components/ProjectNotebookClient';
import { CvSection } from '../_components/CvSection';
import { InterviewTips } from '../_components/InterviewTips';

// Make page dynamic for auth
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found | QuantFrame',
    };
  }

  return {
    title: `${project.title} | Projects Vault`,
    description: project.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Get current user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Load progress if user is logged in
  const progress = user
    ? await getProjectProgress(user.id, project.slug)
    : null;

  const initialCompletedIds = progress?.completedBlockIds || [];
  const initialBlockAttempts = progress?.blockAttempts || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-phthalo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-5xl mx-auto px-6 py-12">
        {/* Notebook with integrated header */}
        <ProjectNotebookClient
          projectSlug={project.slug}
          projectTitle={project.title}
          projectDescription={project.description}
          projectDifficulty={project.difficulty}
          projectEstimatedTime={project.estimatedTimeMinutes}
          projectTags={project.tags}
          blocks={project.notebookBlocks}
          initialCompletedIds={initialCompletedIds}
          initialBlockAttempts={initialBlockAttempts}
          userId={user?.id}
        />

        {/* Career Sections */}
        <div className="mt-16 space-y-8">
          <CvSection
            cvBullets={project.cvBullets}
            linkedinSummary={project.linkedinSummary}
          />
          <InterviewTips talkingPoints={project.interviewTalkingPoints} />
        </div>
      </div>
    </div>
  );
}
