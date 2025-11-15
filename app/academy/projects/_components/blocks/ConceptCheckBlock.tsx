'use client';

import { useState } from 'react';
import { ConceptCheckBlock as ConceptCheckBlockType } from '@/lib/projects/types';
import { Button } from '@/components/ui/button';
import { MessageSquare, Eye, CheckCircle2 } from 'lucide-react';

interface ConceptCheckBlockProps {
  block: ConceptCheckBlockType;
  isCompleted: boolean;
  onComplete: () => void;
}

export function ConceptCheckBlock({
  block,
  isCompleted,
  onComplete,
}: ConceptCheckBlockProps) {
  const [showAnswer, setShowAnswer] = useState(isCompleted);

  const handleReveal = () => {
    setShowAnswer(true);
    if (!isCompleted) {
      onComplete();
    }
  };

  return (
    <div className={`bg-white/5 backdrop-blur-sm border rounded-xl p-6 md:p-8 ${
      isCompleted ? 'border-green-500/30' : 'border-white/10'
    }`}>
      {/* Label */}
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-phthalo-400" />
        <span className="text-sm font-semibold text-phthalo-400 uppercase tracking-wide">
          Concept Check
        </span>
        {isCompleted && (
          <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-green-400">
              Completed
            </span>
          </div>
        )}
      </div>

      {/* Question */}
      <div className="text-lg text-white mb-6 leading-relaxed">
        {block.question}
      </div>

      {/* Reveal button */}
      {!showAnswer && !isCompleted && (
        <Button
          onClick={handleReveal}
          className="bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900"
        >
          <Eye className="w-4 h-4 mr-2" />
          Reveal Answer
        </Button>
      )}

      {/* Answer */}
      {(showAnswer || isCompleted) && (
        <div className="mt-6 p-6 rounded-lg bg-phthalo-500/10 border-2 border-phthalo-500/30">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-phthalo-400" />
            <span className="font-semibold text-white">Answer</span>
          </div>
          <p className="text-zinc-300 leading-relaxed">{block.answer}</p>
        </div>
      )}
    </div>
  );
}
