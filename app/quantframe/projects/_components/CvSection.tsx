'use client';

import { Briefcase, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface CvSectionProps {
  cvBullets?: string[];
}

export function CvSection({ cvBullets }: CvSectionProps) {
  const [copiedBullet, setCopiedBullet] = useState<number | null>(null);

  if (!cvBullets || cvBullets.length === 0) return null;

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedBullet(index);
    setTimeout(() => setCopiedBullet(null), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="w-5 h-5 text-phthalo-400" />
        <h2 className="text-2xl font-bold text-white">Career Toolkit</h2>
      </div>

      {/* CV Bullets */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Resume/CV Bullets
        </h3>
        <p className="text-sm text-zinc-400 mb-4">
          Copy these to your resume to showcase this project:
        </p>
        <div className="space-y-3">
          {cvBullets.map((bullet, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg group hover:border-phthalo-500/30 transition-colors"
            >
              <span className="text-phthalo-400 font-mono text-sm mt-1">
                •
              </span>
              <p className="flex-1 text-zinc-300 leading-relaxed">{bullet}</p>
              <Button
                onClick={() => copyToClipboard(bullet, index)}
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copiedBullet === index ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-zinc-400" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
