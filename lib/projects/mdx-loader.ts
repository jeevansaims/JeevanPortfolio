// MDX loader for project content
// Loads and serializes project MDX files

import fs from 'fs/promises';
import path from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/**
 * Load and serialize a project MDX file for rendering
 * @param contentPath - Path relative to content/projects/ (e.g., "trading-strategies/mean-reversion")
 * @returns Serialized MDX content ready for rendering
 */
export async function loadProjectMDX(contentPath: string) {
  // Handle both with and without .mdx extension
  const normalizedPath = contentPath.endsWith('.mdx')
    ? contentPath.slice(0, -4)
    : contentPath;

  const filePath = path.join(process.cwd(), 'content', 'projects', `${normalizedPath}.mdx`);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Serialize MDX with LaTeX support
    const mdxSource = await serialize(fileContent, {
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    });

    return mdxSource;
  } catch (error) {
    console.error(`Failed to load project MDX file: ${filePath}`, error);
    throw new Error(`Project content not found: ${contentPath}`);
  }
}

/**
 * Check if a project MDX file exists
 * @param contentPath - Path relative to content/projects/
 */
export async function projectMDXExists(contentPath: string): Promise<boolean> {
  const normalizedPath = contentPath.endsWith('.mdx')
    ? contentPath.slice(0, -4)
    : contentPath;

  const filePath = path.join(process.cwd(), 'content', 'projects', `${normalizedPath}.mdx`);

  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
