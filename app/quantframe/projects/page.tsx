import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PROJECTS, getTotalBlocks, getInteractiveBlockCount } from './_data';
import { getAllUserProgress } from '@/lib/projects/supabaseProgress';
import { ProjectsGrid } from './_components/ProjectsGrid';
import { FolderKanban } from 'lucide-react';
import { PageHeader } from '../components/page-header';

// Make page dynamic for auth
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects Vault | QuantFrame',
  description:
    'Build real quantitative finance projects from scratch. Learn through hands-on coding, quizzes, and practical exercises.',
};

export default async function ProjectsPage() {
  // Get current user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Load all user progress if logged in
  const userProgress = user ? await getAllUserProgress(user.id) : {};

  // Add completion data to projects
  const projectsWithProgress = PROJECTS.map((project) => ({
    ...project,
    completedBlocks: userProgress[project.slug] || 0,
    totalBlocks: getTotalBlocks(project),
    interactiveBlocks: getInteractiveBlockCount(project),
  }));

  return (
    <>
      <PageHeader
        title="Projects Vault"
        description="Build real quantitative finance projects from scratch. Learn through hands-on coding, quizzes, and practical exercises."
      />

      <div className="py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Projects Grid with client-side filtering */}
          <ProjectsGrid
            projects={projectsWithProgress}
            isLoggedIn={!!user}
          />
        </div>
      </div>
    </>
  );
}
