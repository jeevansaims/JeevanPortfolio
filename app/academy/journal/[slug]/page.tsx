import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Tag, ArrowLeft, User } from 'lucide-react';
import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {
  getJournalPostBySlug,
  getJournalPostContent,
} from '@/app/academy/actions/journal';
import { JournalContent } from '@/components/academy/journal-content';

// Make this page dynamic (auth-required)
export const dynamic = 'force-dynamic';

// Format date helper
function formatDate(dateString: string | null): string {
  if (!dateString) return 'Recent';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | Mirkovic Academy',
    };
  }

  return {
    title: `${post.title} | Quant Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image_url],
    },
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Read and serialize MDX content
  const mdxContent = await getJournalPostContent(post.content_path);
  const mdxSource = await serialize(mdxContent, {
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-phthalo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          href="/academy/journal"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-phthalo-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Journal</span>
        </Link>

        {/* Hero Image */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8 border border-white/10">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent" />
        </div>

        {/* Article Header */}
        <article className="mb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-phthalo-500/10 border border-phthalo-500/20 rounded-full text-phthalo-400 text-sm font-medium">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-300">
            {post.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400">
              <User className="w-5 h-5" />
              <span className="font-medium text-white">
                {post.author_name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(post.publish_date)}</span>
            </div>
            {post.week_number && (
              <div className="flex items-center gap-2 text-zinc-400">
                <Clock className="w-5 h-5" />
                <span>Week {post.week_number}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-300 text-sm"
                >
                  <Tag className="w-3.5 h-3.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Article Content */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
            <JournalContent source={mdxSource} />
          </div>
        </article>

        {/* Back to Journal CTA */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <Link
            href="/academy/journal"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-phthalo-500 to-phthalo-600 hover:from-phthalo-600 hover:to-phthalo-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-phthalo-500/50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View All Posts</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
