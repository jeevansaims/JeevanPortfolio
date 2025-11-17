'use client';

import { useState } from 'react';
import { Clock, TrendingUp, Tag, CheckCircle2, RotateCcw } from 'lucide-react';
import { Difficulty } from '@/lib/projects/types';
import { Button } from '@/components/ui/button';
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
  description: string;
  difficulty: Difficulty;
  estimatedTimeMinutes: number;
  tags: string[];
  isCompleted?: boolean;
  onReset?: () => void;
}

const difficultyColors = {
  beginner: 'text-green-400 bg-green-500/10 border-green-500/20',
  intermediate: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  advanced: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export function ProjectHeader({
  title,
  description,
  difficulty,
  estimatedTimeMinutes,
  tags,
  isCompleted = false,
  onReset,
}: ProjectHeaderProps) {
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
    setShowResetDialog(false);
  };

  return (
    <>
      <div className="mb-12">
        {/* Completion Banner */}
        {isCompleted && (
          <div className="mb-6 p-6 bg-gradient-to-r from-green-500/10 to-green-600/10 border-2 border-green-500/30 rounded-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Project Completed! 🎉
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Great work! You've finished all tasks in this project.
                  </p>
                </div>
              </div>
              {onReset && (
                <Button
                  onClick={() => setShowResetDialog(true)}
                  variant="outline"
                  className="bg-zinc-900/50 border-green-500/30 text-green-400 hover:bg-green-500/10 flex-shrink-0"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Progress
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Title and difficulty */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 via-phthalo-300 to-phthalo-500">
            {title}
          </h1>
          <div
            className={`px-4 py-2 rounded-full border font-semibold text-sm uppercase tracking-wide ${difficultyColors[difficulty]}`}
          >
            {difficulty}
          </div>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-6 max-w-4xl">
          {description}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-6 text-sm">
          {/* Estimated time */}
          <div className="flex items-center gap-2 text-zinc-400">
            <Clock className="w-4 h-4 text-phthalo-400" />
            <span>
              {estimatedTimeMinutes < 60
                ? `${estimatedTimeMinutes} min`
                : `${Math.floor(estimatedTimeMinutes / 60)}h ${estimatedTimeMinutes % 60}m`}
            </span>
          </div>

          {/* Difficulty indicator */}
          <div className="flex items-center gap-2 text-zinc-400">
            <TrendingUp className="w-4 h-4 text-phthalo-400" />
            <span className="capitalize">{difficulty} Level</span>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-phthalo-400" />
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-phthalo-500/10 border border-phthalo-500/20 rounded-full text-phthalo-400 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Reset Project Progress?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This will clear all your progress for this project, including completed tasks and saved code. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reset Progress
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
