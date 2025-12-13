'use client';

import { useState } from 'react';
import { useProject } from '@/lib/projects/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Hash, Send, XCircle, RotateCcw } from 'lucide-react';

interface NumericInputProps {
  id: string;
  question: string;
  /** The correct answer */
  correctAnswer: number;
  /** Tolerance for floating point comparison (default: 0.001) */
  tolerance?: number;
  /** Units to display (e.g., "%", "shares", "$") */
  units?: string;
  /** Explanation shown after correct answer or max attempts */
  explanation: string;
  /** Hint text (optional) */
  hint?: string;
  /** Maximum attempts before showing answer (default: 3) */
  maxAttempts?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Label shown above component */
  label?: string;
}

export function NumericInput({
  id,
  question,
  correctAnswer,
  tolerance = 0.001,
  units,
  explanation,
  hint,
  maxAttempts = 3,
  placeholder = 'Enter your answer',
  label = 'Trace Exercise',
}: NumericInputProps) {
  const { isBlockCompleted, markBlockCompleted, getBlockAttempt } = useProject();
  const isCompleted = isBlockCompleted(id);
  const savedAnswer = getBlockAttempt(id);

  const [inputValue, setInputValue] = useState(savedAnswer || '');
  const [attempts, setAttempts] = useState(0);
  const [lastResult, setLastResult] = useState<'correct' | 'incorrect' | null>(
    isCompleted ? 'correct' : null
  );
  const [showExplanation, setShowExplanation] = useState(isCompleted);

  const handleSubmit = () => {
    const numValue = parseFloat(inputValue);

    if (isNaN(numValue)) {
      setLastResult('incorrect');
      return;
    }

    const isCorrect = Math.abs(numValue - correctAnswer) <= tolerance;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (isCorrect) {
      setLastResult('correct');
      setShowExplanation(true);
      markBlockCompleted(id, inputValue);
    } else {
      setLastResult('incorrect');
      // Show explanation after max attempts
      if (newAttempts >= maxAttempts) {
        setShowExplanation(true);
      }
    }
  };

  const handleTryAgain = () => {
    setInputValue('');
    setLastResult(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isCompleted && lastResult !== 'correct') {
      handleSubmit();
    }
  };

  const attemptsRemaining = maxAttempts - attempts;

  return (
    <div
      className={`my-8 bg-white/5 backdrop-blur-sm border rounded-xl p-6 md:p-8 ${
        isCompleted ? 'border-green-500/30' : 'border-white/10'
      }`}
    >
      {/* Label */}
      <div className="flex items-center gap-2 mb-4">
        <Hash className="w-5 h-5 text-phthalo-400" />
        <span className="text-sm font-semibold text-phthalo-400 uppercase tracking-wide">
          {label}
        </span>
        {isCompleted && (
          <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-green-400">Completed</span>
          </div>
        )}
      </div>

      {/* Question */}
      <div className="text-lg text-white mb-6 leading-relaxed">{question}</div>

      {/* Hint */}
      {hint && !showExplanation && (
        <div className="mb-4 p-3 bg-phthalo-500/10 border border-phthalo-500/20 rounded-lg">
          <p className="text-sm text-zinc-400">
            <span className="font-semibold text-phthalo-400">Hint:</span> {hint}
          </p>
        </div>
      )}

      {/* Input Field */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Input
            type="number"
            step="any"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isCompleted || lastResult === 'correct'}
            className={`bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 pr-12 ${
              lastResult === 'correct'
                ? 'border-green-500 bg-green-500/10'
                : lastResult === 'incorrect'
                  ? 'border-red-500 bg-red-500/10'
                  : ''
            }`}
          />
          {units && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
              {units}
            </span>
          )}
        </div>

        {!isCompleted && lastResult !== 'correct' && (
          <Button
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-phthalo-500 to-phthalo-600 hover:from-phthalo-600 hover:to-phthalo-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Result Feedback */}
      {lastResult === 'incorrect' && !showExplanation && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-semibold">Not quite right</span>
            </div>
            <span className="text-sm text-zinc-400">
              {attemptsRemaining > 0
                ? `${attemptsRemaining} attempt${attemptsRemaining > 1 ? 's' : ''} remaining`
                : 'No attempts remaining'}
            </span>
          </div>
          {attemptsRemaining > 0 && (
            <Button
              onClick={handleTryAgain}
              variant="ghost"
              size="sm"
              className="mt-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      )}

      {/* Success Feedback */}
      {lastResult === 'correct' && (
        <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-semibold">Correct!</span>
        </div>
      )}

      {/* Explanation */}
      {showExplanation && (
        <div
          className={`p-4 rounded-lg border ${
            lastResult === 'correct'
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-yellow-500/10 border-yellow-500/30'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2
              className={`w-5 h-5 ${lastResult === 'correct' ? 'text-green-400' : 'text-yellow-400'}`}
            />
            <span className="font-semibold text-white">
              {lastResult === 'correct' ? 'Explanation' : 'Answer Revealed'}
            </span>
          </div>
          {lastResult !== 'correct' && (
            <p className="text-sm text-zinc-300 mb-2">
              <span className="font-semibold">Correct answer:</span> {correctAnswer}
              {units ? ` ${units}` : ''}
            </p>
          )}
          <p className="text-sm text-zinc-300 leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  );
}
