import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProjectBySlug } from '@/lib/projects/loader';
import { loadProjectMDX } from '@/lib/projects/mdx-loader';
import { getProjectProgress } from '@/lib/projects/supabaseProgress';
import { ProjectPageClient } from '@/components/projects';
import { CvSection } from '../_components/CvSection';
import { InterviewTips } from '../_components/InterviewTips';

// Make page dynamic for auth
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

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

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Get project metadata from database
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Load MDX content from file
  let mdxSource;
  try {
    mdxSource = await loadProjectMDX(project.contentPath);
  } catch (error) {
    console.error('Failed to load project MDX:', error);
    notFound();
  }

  // Get current user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Load progress if user is logged in
  const progress = user ? await getProjectProgress(user.id, project.slug) : null;

  const initialCompletedIds = progress?.completedBlockIds || [];
  const initialBlockAttempts = progress?.blockAttempts || {};
  const isCompleted = progress?.completed || false;

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
        {/* Project Content with MDX, Career Sections, and Mark Complete */}
        <ProjectPageClient
          project={project}
          mdxSource={mdxSource}
          initialCompletedIds={initialCompletedIds}
          initialBlockAttempts={initialBlockAttempts}
          isCompleted={isCompleted}
          userId={user?.id || null}
        >
          {/* Career Sections - rendered inside provider context */}
          <CvSection cvBullets={project.cvBullets} />
          <InterviewTips talkingPoints={project.interviewPoints} />
        </ProjectPageClient>
      </div>
    </div>
  );
}
