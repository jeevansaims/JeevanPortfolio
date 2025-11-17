'use client';

import { MessageCircle, Lightbulb } from 'lucide-react';

interface InterviewTipsProps {
  talkingPoints?: string[];
}

export function InterviewTips({ talkingPoints }: InterviewTipsProps) {
  if (!talkingPoints || talkingPoints.length === 0) return null;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-phthalo-400" />
        <h2 className="text-2xl font-bold text-white">Interview Talking Points</h2>
      </div>

      <p className="text-sm text-zinc-400 mb-6">
        Use these points when discussing this project in interviews:
      </p>

      <div className="space-y-4">
        {talkingPoints.map((point, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-gradient-to-r from-phthalo-500/5 to-phthalo-600/5 border border-phthalo-500/20 rounded-lg"
          >
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-phthalo-500/10 border border-phthalo-500/30 rounded-full">
              <Lightbulb className="w-4 h-4 text-phthalo-400" />
            </div>
            <p className="text-zinc-300 leading-relaxed flex-1">{point}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
        <p className="text-sm text-zinc-400">
          <strong className="text-white">Pro tip:</strong> Practice explaining
          each point out loud. The best interviews feel like conversations, not
          rehearsed speeches.
        </p>
      </div>
    </div>
  );
}
