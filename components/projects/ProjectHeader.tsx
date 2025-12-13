'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft, CheckCircle2, RotateCcw, Tag, AlertTriangle } from 'lucide-react';
import { Difficulty, PROJECT_CATEGORIES } from '@/lib/projects/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProjectHeaderProps {
  title: string;
  description: string | null;
  difficulty: Difficulty;
  estimatedMinutes: number;
  tags: string[];
  category: string;
  prerequisites: string[];
  isCompleted: boolean;
  onReset?: () => Promise<void>;
}

const difficultyColors = {
  beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function ProjectHeader({
  title,
  description,
  difficulty,
  estimatedMinutes,
  tags,
  category,
  prerequisites,
  isCompleted,
  onReset,
}: ProjectHeaderProps) {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (!onReset) return;
    setIsResetting(true);
    try {
      await onReset();
      // Reload to reset all component internal states
      window.location.reload();
    } catch {
      setIsResetting(false);
      setShowResetDialog(false);
    }
  };

  return (
    <>
    <div className="mb-8">
      {/* Back Link */}
      <Link
        href="/quantframe/projects"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Projects</span>
      </Link>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            <div>
              <p className="font-semibold text-green-400">Project Completed!</p>
              <p className="text-sm text-zinc-400">
                Great job! Scroll down for your career toolkit.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Prerequisites Warning */}
      {prerequisites.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-400">Recommended Prerequisites</p>
            <p className="text-sm text-zinc-400 mt-1">
              For the best experience, consider completing these projects first:{' '}
              {prerequisites.map((slug, i) => (
                <span key={slug}>
                  <Link
                    href={`/quantframe/projects/${slug}`}
                    className="text-phthalo-400 hover:underline"
                  >
                    {slug}
                  </Link>
                  {i < prerequisites.length - 1 && ', '}
                </span>
              ))}
            </p>
          </div>
        </div>
      )}

      {/* Header Content */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Badge variant="outline" className={difficultyColors[difficulty]}>
          {difficulty}
        </Badge>
        <Badge variant="outline" className="bg-zinc-800/50 text-zinc-400 border-zinc-700">
          <Tag className="w-3 h-3 mr-1" />
          {PROJECT_CATEGORIES[category as keyof typeof PROJECT_CATEGORIES]?.name || category}
        </Badge>
        <div className="flex items-center gap-1.5 text-sm text-zinc-500">
          <Clock className="w-4 h-4" />
          <span>
            {estimatedMinutes < 60
              ? `${estimatedMinutes} min`
              : `${Math.floor(estimatedMinutes / 60)}h ${estimatedMinutes % 60}m`}
          </span>
        </div>
        {onReset && (
          <Button
            onClick={() => setShowResetDialog(true)}
            variant="ghost"
            size="sm"
            className="text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Reset
          </Button>
        )}
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>

      {description && <p className="text-xl text-zinc-400 leading-relaxed mb-6">{description}</p>}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-phthalo-500/10 border border-phthalo-500/20 rounded-full text-phthalo-400 text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>

    {/* Reset Confirmation Dialog */}
    <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Reset Project Progress?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Are you sure you want to reset? You will lose all your progress on quizzes, code exercises, and concept checks. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReset}
            disabled={isResetting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isResetting ? 'Resetting...' : 'Reset Progress'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
