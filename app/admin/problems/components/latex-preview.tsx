'use client'

import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

interface LatexPreviewProps {
  text: string
}

// Same renderLatex function used in the actual problem cards
const renderLatex = (text: string) => {
  if (!text) return null

  const processedText = text.replace(/\\n/g, '\n')
  const blockParts = processedText.split(/(\$\$[^$]+\$\$)/g)

  return (
    <div className="space-y-4">
      {blockParts.map((part, blockIdx) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const latex = part.slice(2, -2)
          return (
            <div key={blockIdx} className="flex justify-center my-4">
              <BlockMath math={latex} />
            </div>
          )
        }

        const paragraphs = part.split('\n\n').filter(p => p.trim())

        return paragraphs.map((paragraph, paraIdx) => {
          const elements = []
          let remaining = paragraph
          let elementKey = 0

          while (remaining) {
            const mathMatch = remaining.match(/\$([^$]+)\$/)
            const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)

            const mathIndex = mathMatch ? remaining.indexOf(mathMatch[0]) : Infinity
            const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity

            if (mathIndex === Infinity && boldIndex === Infinity) {
              if (remaining.trim()) {
                elements.push(<span key={elementKey++}>{remaining}</span>)
              }
              break
            }

            if (mathIndex < boldIndex) {
              if (mathIndex > 0) {
                elements.push(<span key={elementKey++}>{remaining.slice(0, mathIndex)}</span>)
              }
              elements.push(<InlineMath key={elementKey++} math={mathMatch![1]} />)
              remaining = remaining.slice(mathIndex + mathMatch![0].length)
            } else {
              if (boldIndex > 0) {
                elements.push(<span key={elementKey++}>{remaining.slice(0, boldIndex)}</span>)
              }
              elements.push(
                <strong key={elementKey++} className="font-bold text-white">
                  {boldMatch![1]}
                </strong>
              )
              remaining = remaining.slice(boldIndex + boldMatch![0].length)
            }
          }

          return (
            <p key={`${blockIdx}-${paraIdx}`} className="my-2">
              {elements}
            </p>
          )
        })
      })}
    </div>
  )
}

export function LatexPreview({ text }: LatexPreviewProps) {
  if (!text.trim()) {
    return (
      <div className="mt-2 p-4 bg-zinc-900 border border-zinc-700 rounded-md">
        <p className="text-zinc-500 text-sm italic">Preview will appear here as you type...</p>
      </div>
    )
  }

  return (
    <div className="mt-2 p-4 bg-zinc-900 border border-zinc-700 rounded-md">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-800">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Live Preview</p>
      </div>
      <div className="text-zinc-300 leading-relaxed">
        {renderLatex(text)}
      </div>
    </div>
  )
}
