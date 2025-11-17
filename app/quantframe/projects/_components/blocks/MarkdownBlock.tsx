'use client';

import { MarkdownBlock as MarkdownBlockType } from '@/lib/projects/types';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface MarkdownBlockProps {
  block: MarkdownBlockType;
}

// Helper to render text with LaTeX (adapted from quiz-client.tsx)
const renderLatex = (text: string) => {
  if (!text) return null;

  const processedText = text.replace(/\\n/g, '\n');
  const blockParts = processedText.split(/(\$\$[^$]+\$\$)/g);

  return (
    <div className="space-y-4">
      {blockParts.map((part, blockIdx) => {
        // Block math ($$...$$)
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const latex = part.slice(2, -2);
          return (
            <div key={blockIdx} className="flex justify-center my-6">
              <BlockMath math={latex} />
            </div>
          );
        }

        // Split into paragraphs
        const paragraphs = part.split('\n\n').filter((p) => p.trim());

        return paragraphs.map((paragraph, paraIdx) => {
          // Check if this is a heading
          if (paragraph.startsWith('# ')) {
            const content = paragraph.slice(2);
            return (
              <h1
                key={`${blockIdx}-${paraIdx}`}
                className="text-4xl font-bold mt-8 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600"
              >
                {content}
              </h1>
            );
          }
          if (paragraph.startsWith('## ')) {
            const content = paragraph.slice(3);
            return (
              <h2
                key={`${blockIdx}-${paraIdx}`}
                className="text-3xl font-bold mt-6 mb-3 text-white"
              >
                {content}
              </h2>
            );
          }
          if (paragraph.startsWith('### ')) {
            const content = paragraph.slice(4);
            return (
              <h3
                key={`${blockIdx}-${paraIdx}`}
                className="text-2xl font-semibold mt-5 mb-2 text-zinc-200"
              >
                {content}
              </h3>
            );
          }

          // Parse inline LaTeX and bold text
          const elements = [];
          let remaining = paragraph;
          let elementKey = 0;

          while (remaining) {
            const mathMatch = remaining.match(/\$([^$]+)\$/);
            const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);

            const mathIndex = mathMatch
              ? remaining.indexOf(mathMatch[0])
              : Infinity;
            const boldIndex = boldMatch
              ? remaining.indexOf(boldMatch[0])
              : Infinity;

            if (mathIndex === Infinity && boldIndex === Infinity) {
              if (remaining.trim()) {
                elements.push(<span key={elementKey++}>{remaining}</span>);
              }
              break;
            }

            if (mathIndex < boldIndex) {
              if (mathIndex > 0) {
                elements.push(
                  <span key={elementKey++}>
                    {remaining.slice(0, mathIndex)}
                  </span>
                );
              }
              elements.push(
                <InlineMath key={elementKey++} math={mathMatch![1]} />
              );
              remaining = remaining.slice(mathIndex + mathMatch![0].length);
            } else {
              if (boldIndex > 0) {
                elements.push(
                  <span key={elementKey++}>
                    {remaining.slice(0, boldIndex)}
                  </span>
                );
              }
              elements.push(
                <strong key={elementKey++} className="font-bold text-white">
                  {boldMatch![1]}
                </strong>
              );
              remaining = remaining.slice(boldIndex + boldMatch![0].length);
            }
          }

          return (
            <p
              key={`${blockIdx}-${paraIdx}`}
              className="text-zinc-300 leading-relaxed"
            >
              {elements}
            </p>
          );
        });
      })}
    </div>
  );
};

export function MarkdownBlock({ block }: MarkdownBlockProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
      <div className="prose prose-invert max-w-none">
        {renderLatex(block.content)}
      </div>
    </div>
  );
}
