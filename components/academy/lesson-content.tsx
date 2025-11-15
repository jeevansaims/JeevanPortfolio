// components/academy/lesson-content.tsx
'use client'

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import 'katex/dist/katex.min.css'

// Custom components for MDX
const components = {
  h1: (props: any) => (
    <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-3xl font-bold mt-12 mb-4 text-white" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-2xl font-semibold mt-8 mb-3 text-zinc-200" {...props} />
  ),
  p: (props: any) => (
    <p className="text-zinc-300 leading-relaxed mb-4" {...props} />
  ),
  ul: (props: any) => (
    <ul className="list-disc list-inside space-y-2 text-zinc-300 mb-4 ml-4" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-inside space-y-2 text-zinc-300 mb-4 ml-4" {...props} />
  ),
  li: (props: any) => (
    <li className="text-zinc-300" {...props} />
  ),
  code: (props: any) => (
    <code className="px-2 py-0.5 bg-zinc-800 rounded text-phthalo-300 font-mono text-sm" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-zinc-800 rounded-lg p-4 overflow-x-auto mb-6" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-phthalo-500 pl-4 italic text-zinc-400 my-6" {...props} />
  ),
  strong: (props: any) => (
    <strong className="font-bold text-white" {...props} />
  ),
}

interface LessonContentProps {
  source: MDXRemoteSerializeResult
}

export function LessonContent({ source }: LessonContentProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <MDXRemote {...source} components={components} />
    </div>
  )
}
