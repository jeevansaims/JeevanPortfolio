// lib/mdx/loader.ts
import fs from 'fs/promises'
import path from 'path'
import { serialize } from 'next-mdx-remote/serialize'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

/**
 * Load and serialize an MDX file for rendering
 * @param contentPath - Path relative to content/programs/ (e.g., "math-for-quant/calculus-for-quants/limits-and-continuity")
 * @returns Serialized MDX content ready for rendering
 */
export async function loadMDXContent(contentPath: string) {
  const filePath = path.join(process.cwd(), 'content', 'programs', `${contentPath}.mdx`)

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8')

    // Serialize MDX with LaTeX support
    const mdxSource = await serialize(fileContent, {
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    })

    return mdxSource
  } catch (error) {
    console.error(`Failed to load MDX file: ${filePath}`, error)
    throw new Error(`Content not found: ${contentPath}`)
  }
}
