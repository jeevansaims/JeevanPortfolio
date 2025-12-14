import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import {
  getPublishedJournalPosts,
  getFeaturedJournalPost,
} from '@/app/quantframe/actions/journal';
import { JournalPost } from '@/app/quantframe/types/journal';
import { PageHeader } from '../components/page-header';

// Make this page dynamic (auth-required)
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Quant Journal | QuantFrame',
  description:
    'Deep dives into quantitative finance, mathematics, and coding. Weekly insights from Jeevan Sai.',
};

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

// Truncate excerpt helper
function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// Featured Post Hero Component
function FeaturedPost({ post }: { post: JournalPost }) {
  return (
    <Link href={`/quantframe/journal/${post.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/90 via-zinc-900/80 to-zinc-900/90 border border-white/10 backdrop-blur-sm hover:border-phthalo-500/50 transition-all duration-500">
        {/* Background Image */}
        <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          {/* Featured Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-phthalo-500/20 backdrop-blur-md border border-phthalo-400/30 rounded-full text-phthalo-300 text-sm font-semibold">
              Featured Post
            </span>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publish_date)}</span>
            </div>
            {post.week_number && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Week {post.week_number}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>{post.category}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-300 group-hover:from-phthalo-300 group-hover:via-white group-hover:to-phthalo-300 transition-all duration-500">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg md:text-xl text-zinc-300 mb-3 max-w-3xl leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author */}
          <p className="text-sm text-zinc-500 mb-6">
            By {post.author_name}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-2 text-phthalo-400 font-semibold group-hover:gap-4 transition-all duration-300">
            <span>Read Full Article</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// Post Card Component
function PostCard({ post }: { post: JournalPost }) {
  return (
    <Link href={`/quantframe/journal/${post.slug}`} className="group block h-full">
      <div className="h-full flex flex-col overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-phthalo-500/50 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-phthalo-500/20">
        {/* Image */}
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-6">
          {/* Author */}
          <p className="text-xs text-zinc-500 mb-2">
            By {post.author_name}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(post.publish_date)}</span>
            </div>
            {post.week_number && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Week {post.week_number}</span>
              </div>
            )}
          </div>

          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-phthalo-500/10 border border-phthalo-500/20 rounded-full text-phthalo-400 text-xs font-medium">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold mb-3 text-white group-hover:text-phthalo-300 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-zinc-400 mb-4 line-clamp-3 flex-1">
            {truncateText(post.excerpt, 120)}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center gap-2 text-sm text-phthalo-400 font-medium group-hover:gap-3 transition-all">
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function JournalPage() {
  const [featuredPost, allPosts] = await Promise.all([
    getFeaturedJournalPost(),
    getPublishedJournalPosts(),
  ]);

  // Filter out featured post from the grid
  const gridPosts = featuredPost
    ? allPosts.filter((post) => post.id !== featuredPost.id)
    : allPosts;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black">
      <PageHeader
        title="Quant Journal"
        description="Weekly deep dives into quantitative finance, advanced mathematics, and algorithmic trading."
      />

      <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-20">

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16 md:mb-20">
            <FeaturedPost post={featuredPost} />
          </div>
        )}

        {/* All Posts Grid */}
        {gridPosts.length > 0 && (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              Recent Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {gridPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!featuredPost && gridPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-zinc-500">
              No journal posts yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
