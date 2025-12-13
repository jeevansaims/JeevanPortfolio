'use client';

import { useState, useMemo } from 'react';
import { useProject } from '@/lib/projects/context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Send, MessageSquareText } from 'lucide-react';

interface TextResponseProps {
  id: string;
  question: string;
  /**
   * Keywords for grading in format: "concept1:keyword1,keyword2,keyword3|concept2:keyword1,keyword2"
   * Example: "Maximizing:maximize,max,highest|Minimizing:minimize,min,reduce"
   */
  keywords?: string;
  /** Minimum concepts to match for passing (default: 2) */
  minKeywords?: number;
  /** Reference answer shown after submission */
  referenceAnswer: string;
  /**
   * Self-check items separated by |
   * Example: "Item 1|Item 2|Item 3"
   */
  selfCheck?: string;
  /** Placeholder text for input */
  placeholder?: string;
  /** Max character limit */
  maxLength?: number;
  /** Label shown above component */
  label?: string;
  /** Whether this is a synthesis prompt (longer form, less strict grading) */
  isSynthesis?: boolean;
}

// Parse keywords string into structured format
function parseKeywords(keywordsStr: string | undefined, minRequired: number): ParsedRubric | null {
  if (!keywordsStr) return null;

  const concepts: KeywordMatch[] = [];
  const conceptParts = keywordsStr.split('|');

  for (const part of conceptParts) {
    const [concept, keywordsRaw] = part.split(':');
    if (concept && keywordsRaw) {
      concepts.push({
        concept: concept.trim(),
        keywords: keywordsRaw.split(',').map(k => k.trim().toLowerCase()),
      });
    }
  }

  if (concepts.length === 0) return null;

  return { concepts, minRequired };
}

// Parse self-check string into array
function parseSelfCheck(selfCheckStr: string | undefined): string[] {
  if (!selfCheckStr) return [];
  return selfCheckStr.split('|').map(s => s.trim()).filter(Boolean);
}

export function TextResponse({
  id,
  question,
  keywords,
  minKeywords = 2,
  referenceAnswer,
  selfCheck,
  placeholder = 'Type your answer here...',
  maxLength = 500,
  label = 'Recall',
  isSynthesis = false,
}: TextResponseProps) {
  const { isBlockCompleted, markBlockCompleted, getBlockAttempt } = useProject();
  const isCompleted = isBlockCompleted(id);
  const savedResponse = getBlockAttempt(id);

  const [response, setResponse] = useState(savedResponse || '');
  const [hasSubmitted, setHasSubmitted] = useState(isCompleted);
  const [selfCheckState, setSelfCheckState] = useState<Record<number, boolean>>({});

  // Parse selfCheck once
  const selfCheckRubric = useMemo(() => parseSelfCheck(selfCheck), [selfCheck]);

  const handleSubmit = () => {
    if (!response.trim()) return;

    setHasSubmitted(true);
    // Always mark as completed on submit
    markBlockCompleted(id, response);
  };

  return (
    <div
      className={`my-8 bg-white/5 backdrop-blur-sm border rounded-xl p-6 md:p-8 ${
        isCompleted ? 'border-green-500/30' : 'border-white/10'
      }`}
    >
      {/* Label */}
      <div className="flex items-center gap-2 mb-4">
        <MessageSquareText className="w-5 h-5 text-phthalo-400" />
        <span className="text-sm font-semibold text-phthalo-400 uppercase tracking-wide">
          {isSynthesis ? 'Synthesis' : label}
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

      {/* Text Input */}
      <div className="mb-4">
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder={placeholder}
          disabled={hasSubmitted || isCompleted}
          maxLength={maxLength}
          className={`min-h-[120px] bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 resize-none ${
            isSynthesis ? 'min-h-[200px]' : ''
          }`}
        />
        <div className="flex justify-end mt-2">
          <span className="text-xs text-zinc-500">
            {response.length}/{maxLength}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      {!hasSubmitted && !isCompleted && (
        <Button
          onClick={handleSubmit}
          disabled={!response.trim()}
          className="w-full bg-gradient-to-r from-phthalo-500 to-phthalo-600 hover:from-phthalo-600 hover:to-phthalo-700"
        >
          <Send className="w-4 h-4 mr-2" />
          Submit Response
        </Button>
      )}

      {/* Results after submission */}
      {(hasSubmitted || isCompleted) && (
        <div className="space-y-4">
          {/* Reference Answer */}
          <div className="p-4 bg-phthalo-500/10 border border-phthalo-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-phthalo-400" />
              <span className="font-semibold text-white">Reference Answer</span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">{referenceAnswer}</p>
          </div>

          {/* Self-Check Rubric (optional, for synthesis prompts) */}
          {selfCheckRubric && selfCheckRubric.length > 0 && (
            <div className="p-4 bg-zinc-900/50 border border-zinc-700 rounded-lg">
              <p className="font-semibold text-white mb-3">Self-Assessment Checklist:</p>
              <ul className="space-y-2">
                {selfCheckRubric.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selfCheckState[idx] || false}
                      onChange={(e) =>
                        setSelfCheckState((prev) => ({ ...prev, [idx]: e.target.checked }))
                      }
                      className="mt-1 rounded border-zinc-600 bg-zinc-800 text-phthalo-500 focus:ring-phthalo-500"
                    />
                    <span className="text-sm text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
