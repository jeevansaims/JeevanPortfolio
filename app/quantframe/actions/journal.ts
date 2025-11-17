'use server';

import { createClient } from '@/lib/supabase/server';
import { JournalPost } from '@/app/quantframe/types/journal';
import fs from 'fs/promises';
import path from 'path';

/**
 * Fetch all published journal posts, sorted by publish date (newest first)
 */
export async function getPublishedJournalPosts(): Promise<JournalPost[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('journal_posts')
    .select('*')
    .eq('published', true)
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Error fetching journal posts:', error);
    return [];
  }

  return data as JournalPost[];
}

/**
 * Fetch a single journal post by slug
 */
export async function getJournalPostBySlug(
  slug: string
): Promise<JournalPost | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('journal_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    console.error('Error fetching journal post:', error);
    return null;
  }

  return data as JournalPost;
}

/**
 * Fetch the MDX content for a journal post
 */
export async function getJournalPostContent(
  contentPath: string
): Promise<string> {
  try {
    const fullPath = path.join(process.cwd(), 'content', 'journal', contentPath);
    const content = await fs.readFile(fullPath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading journal content:', error);
    return '';
  }
}

/**
 * Fetch featured journal post (always returns the newest post)
 */
export async function getFeaturedJournalPost(): Promise<JournalPost | null> {
  const supabase = await createClient();

  // Always return the latest post by publish_date
  const { data, error } = await supabase
    .from('journal_posts')
    .select('*')
    .eq('published', true)
    .order('publish_date', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching featured journal post:', error);
    return null;
  }

  return data as JournalPost;
}
