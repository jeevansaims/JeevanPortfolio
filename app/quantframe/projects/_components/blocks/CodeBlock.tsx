'use client';

import { CodeBlock as CodeBlockType } from '@/lib/projects/types';
import { Code } from 'lucide-react';

interface CodeBlockProps {
  block: CodeBlockType;
}

export function CodeBlock({ block }: CodeBlockProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900/50 border-b border-white/10">
        <Code className="w-4 h-4 text-phthalo-400" />
        <span className="text-sm font-medium text-zinc-400">
          {block.language === 'python' ? 'Python' : block.language.toUpperCase()}
        </span>
        <span className="text-xs text-zinc-500 ml-auto">Read-only</span>
      </div>

      {/* Code content */}
      <pre className="p-6 overflow-x-auto">
        <code className="text-sm text-zinc-300 font-mono leading-relaxed">
          {block.code}
        </code>
      </pre>
    </div>
  );
}
