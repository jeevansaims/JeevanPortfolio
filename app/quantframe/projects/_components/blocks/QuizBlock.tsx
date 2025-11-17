'use client';

import { useState } from 'react';
import { QuizBlock as QuizBlockType } from '@/lib/projects/types';
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
import { CheckCircle2, XCircle, Lightbulb, RotateCcw, Eye } from 'lucide-react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface QuizBlockProps {
  block: QuizBlockType;
  isCompleted: boolean;
  onComplete: () => void;
}

// Render text with inline LaTeX
const renderLatexText = (text: string) => {
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining) {
    const match = remaining.match(/\$([^$]+)\$/);
    if (!match) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    const index = remaining.indexOf(match[0]);
    if (index > 0) {
      parts.push(<span key={key++}>{remaining.slice(0, index)}</span>);
    }
    parts.push(<InlineMath key={key++} math={match[1]} />);
    remaining = remaining.slice(index + match[0].length);
  }

  return <>{parts}</>;
};

export function QuizBlock({ block, isCompleted, onComplete }: QuizBlockProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(isCompleted);
  const [showExplanationDialog, setShowExplanationDialog] = useState(false);
  const [showExplanation, setShowExplanation] = useState(isCompleted);

  const handleSubmit = () => {
    if (selectedOption === null) return;

    setHasSubmitted(true);

    // If correct, mark as complete immediately and show explanation
    if (selectedOption === block.correctOptionIndex) {
      setShowExplanation(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }
    // If wrong, just show the Try Again and Show Explanation buttons
    // Don't automatically open the dialog
  };

  const handleTryAgain = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
    setShowExplanation(false);
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
    setShowExplanationDialog(false);
  };

  const isCorrect =
    hasSubmitted && selectedOption === block.correctOptionIndex;
  const isIncorrect =
    hasSubmitted && selectedOption !== block.correctOptionIndex;

  return (
    <>
      <div className={`bg-white/5 backdrop-blur-sm border rounded-xl p-6 md:p-8 ${
        isCompleted ? 'border-green-500/30' : 'border-white/10'
      }`}>
        {/* Label */}
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-phthalo-400" />
          <span className="text-sm font-semibold text-phthalo-400 uppercase tracking-wide">
            Quiz
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
          {renderLatexText(block.question)}
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {block.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isThisCorrect = index === block.correctOptionIndex;

            let optionStyle = '';
            if (isCompleted) {
              optionStyle = isThisCorrect
                ? 'border-green-500/50 bg-green-500/10 cursor-not-allowed'
                : 'border-zinc-800 bg-zinc-900/30 opacity-40 cursor-not-allowed';
            } else if (!hasSubmitted) {
              optionStyle = isSelected
                ? 'border-phthalo-500 bg-phthalo-500/10 cursor-pointer'
                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900/70 cursor-pointer';
            } else {
              if (isThisCorrect) {
                optionStyle = 'border-green-500 bg-green-500/10 cursor-not-allowed';
              } else if (isSelected && isIncorrect) {
                optionStyle = 'border-red-500 bg-red-500/10 cursor-not-allowed';
              } else {
                optionStyle = 'border-zinc-800 bg-zinc-900/50 opacity-50 cursor-not-allowed';
              }
            }

            return (
              <button
                key={index}
                onClick={() => !hasSubmitted && !isCompleted && setSelectedOption(index)}
                disabled={hasSubmitted || isCompleted}
                className={`w-full p-4 rounded-lg text-left transition-all border-2 ${optionStyle}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className={isCompleted && !isThisCorrect ? 'text-zinc-500' : 'text-zinc-300'}>
                    {option}
                  </span>
                  {(hasSubmitted || isCompleted) && isThisCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  {hasSubmitted && isSelected && isIncorrect && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit button */}
        {!hasSubmitted && !isCompleted && (
          <Button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="w-full bg-gradient-to-r from-phthalo-500 to-phthalo-600 hover:from-phthalo-600 hover:to-phthalo-700"
          >
            Submit Answer
          </Button>
        )}

        {/* Try Again / Show Explanation buttons (when wrong and not completed) */}
        {hasSubmitted && isIncorrect && !isCompleted && !showExplanation && (
          <div className="flex gap-3">
            <Button
              onClick={handleTryAgain}
              className="flex-1 bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => setShowExplanationDialog(true)}
              variant="outline"
              className="flex-1 bg-zinc-900/50 border-phthalo-500/30 text-phthalo-400 hover:bg-phthalo-500/10 hover:border-phthalo-500/50"
            >
              <Eye className="w-4 h-4 mr-2" />
              Show Explanation
            </Button>
          </div>
        )}

        {/* Explanation */}
        {showExplanation && (
          <div
            className={`mt-6 p-4 rounded-lg border-2 ${
              isCorrect || isCompleted
                ? 'border-green-500/30 bg-green-500/10'
                : 'border-yellow-500/30 bg-yellow-500/10'
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              {isCorrect || isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
              ) : (
                <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
              )}
              <span className="font-semibold text-white">
                {isCorrect || isCompleted ? 'Correct!' : 'Explanation'}
              </span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {block.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Dialog for showing explanation */}
      <AlertDialog open={showExplanationDialog} onOpenChange={setShowExplanationDialog}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Show Explanation?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Viewing the explanation will reveal the correct answer. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleShowExplanation}
              className="bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900"
            >
              Show Explanation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
