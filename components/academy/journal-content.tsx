// components/quantframe/journal-content.tsx
'use client'

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import 'katex/dist/katex.min.css'

// Custom components for journal MDX with enhanced styling
const components = {
  h1: (props: any) => (
    <h1 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 via-phthalo-500 to-phthalo-600" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-4xl font-bold mt-16 mb-6 text-white border-b border-phthalo-500/30 pb-3" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-2xl font-semibold mt-10 mb-4 text-zinc-200" {...props} />
  ),
  h4: (props: any) => (
    <h4 className="text-xl font-semibold mt-6 mb-3 text-zinc-300" {...props} />
  ),
  p: (props: any) => (
    <p className="text-zinc-300 leading-relaxed mb-6 text-lg" {...props} />
  ),
  ul: (props: any) => (
    <ul className="list-disc list-outside space-y-3 text-zinc-300 mb-6 ml-6" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-outside space-y-3 text-zinc-300 mb-6 ml-6" {...props} />
  ),
  li: (props: any) => (
    <li className="text-zinc-300 leading-relaxed" {...props} />
  ),
  code: (props: any) => (
    <code className="px-2 py-1 bg-zinc-800/80 rounded text-phthalo-300 font-mono text-sm border border-phthalo-500/20" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-zinc-900/80 backdrop-blur-sm rounded-lg p-6 overflow-x-auto mb-8 border border-phthalo-500/20 shadow-lg shadow-phthalo-500/10" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-phthalo-500 pl-6 pr-4 py-4 italic text-zinc-300 my-8 bg-phthalo-500/5 rounded-r-lg" {...props} />
  ),
  strong: (props: any) => (
    <strong className="font-bold text-white" {...props} />
  ),
  em: (props: any) => (
    <em className="italic text-phthalo-300" {...props} />
  ),
  a: (props: any) => (
    <a className="text-phthalo-400 hover:text-phthalo-300 underline underline-offset-4 transition-colors" {...props} />
  ),
  hr: (props: any) => (
    <hr className="border-0 h-px bg-gradient-to-r from-transparent via-phthalo-500/50 to-transparent my-12" {...props} />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto mb-8">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th className="border border-phthalo-500/30 bg-phthalo-500/10 px-4 py-3 text-left font-semibold text-white" {...props} />
  ),
  td: (props: any) => (
    <td className="border border-phthalo-500/20 px-4 py-3 text-zinc-300" {...props} />
  ),
}

interface JournalContentProps {
  source: MDXRemoteSerializeResult
}

export function JournalContent({ source }: JournalContentProps) {
  return (
    <div className="prose prose-invert prose-lg max-w-none">
      <MDXRemote {...source} components={components} />
    </div>
  )
}
