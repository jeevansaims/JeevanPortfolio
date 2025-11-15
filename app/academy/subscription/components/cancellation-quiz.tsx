'use client';

import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CancellationQuizProps {
  onClose: () => void;
  userEmail: string;
}

interface QuizAnswers {
  mainReason: string;
  mainReasonOther?: string;
  missingFeatures: string[];
  missingFeaturesOther?: string;
  satisfaction: number;
  convinceToStay: string;
  likelyToReturn: number;
  bugs?: string;
  newFeature?: string;
}

export function CancellationQuiz({ onClose, userEmail }: CancellationQuizProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    mainReason: '',
    missingFeatures: [],
    satisfaction: 0,
    convinceToStay: '',
    likelyToReturn: 5,
  });

  const totalSteps = 7;

  const mainReasonOptions = [
    'The content is too hard',
    'The content is too easy',
    "I didn't have enough time to use the platform",
    "I couldn't see my progress clearly",
    "The lessons weren't what I expected",
    'Too expensive',
    'I found a different resource',
    'Technical issues / bugs',
    'I just wanted to try it out',
    'Other',
  ];

  const missingFeaturesOptions = [
    'More beginner-friendly explanations',
    'More advanced quant/math topics',
    'More coding projects',
    'More real-world finance examples',
    'More structure (roadmaps, guidance)',
    'More practice problems',
    'Better UI / UX',
    'Community / Discord / mentorship',
    'Mobile app',
    'Other',
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return answers.mainReason !== '';
      case 2:
        return true; // Optional
      case 3:
        return answers.satisfaction > 0;
      case 4:
        return answers.convinceToStay.trim() !== '';
      case 5:
        return true; // Always valid (has default)
      case 6:
        return true; // Optional
      case 7:
        return true; // Optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast.error('Please answer the required question');
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) {
      toast.error('Please answer the required question');
      return;
    }

    try {
      // Submit survey to API
      const response = await fetch('/api/cancellation-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mainReason: answers.mainReason,
          mainReasonOther: answers.mainReasonOther,
          missingFeatures: answers.missingFeatures,
          missingFeaturesOther: answers.missingFeaturesOther,
          satisfaction: answers.satisfaction,
          convinceToStay: answers.convinceToStay,
          likelyToReturn: answers.likelyToReturn,
          bugs: answers.bugs,
          newFeature: answers.newFeature,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }

      // Show success message
      toast.success('Thank you for your feedback');

      // TODO: Redirect to Stripe cancellation flow
      // For now, show placeholder
      window.alert(
        'Stripe Cancellation Placeholder\n\nIn production, this would redirect to Stripe portal for cancellation.\n\nYour feedback has been recorded.'
      );

      onClose();
    } catch (error) {
      console.error('Survey submission error:', error);
      toast.error('Failed to submit feedback');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Before you go...</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-zinc-400">
            Help us improve by answering a few quick questions
          </p>
          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-phthalo-500 to-phthalo-600 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            Question {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6 min-h-[400px]">
          {/* Question 1: Main Reason */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                What's the main reason you're leaving?
              </h3>
              <p className="text-sm text-red-400 mb-6">* Required</p>
              <div className="space-y-3">
                {mainReasonOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers.mainReason === option
                        ? 'border-phthalo-500 bg-phthalo-500/10'
                        : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="mainReason"
                      value={option}
                      checked={answers.mainReason === option}
                      onChange={(e) =>
                        setAnswers({ ...answers, mainReason: e.target.value })
                      }
                      className="mt-1 w-4 h-4 text-phthalo-500 focus:ring-phthalo-500"
                    />
                    <span className="text-zinc-300">{option}</span>
                  </label>
                ))}
              </div>
              {answers.mainReason === 'Other' && (
                <textarea
                  value={answers.mainReasonOther || ''}
                  onChange={(e) =>
                    setAnswers({ ...answers, mainReasonOther: e.target.value })
                  }
                  placeholder="Please specify..."
                  className="mt-4 w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-phthalo-500/50"
                  rows={3}
                />
              )}
            </div>
          )}

          {/* Question 2: Missing Features */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                What was the biggest thing missing for you?
              </h3>
              <p className="text-sm text-zinc-400 mb-6">Optional - Select all that apply</p>
              <div className="space-y-3">
                {missingFeaturesOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers.missingFeatures.includes(option)
                        ? 'border-phthalo-500 bg-phthalo-500/10'
                        : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={answers.missingFeatures.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAnswers({
                            ...answers,
                            missingFeatures: [...answers.missingFeatures, option],
                          });
                        } else {
                          setAnswers({
                            ...answers,
                            missingFeatures: answers.missingFeatures.filter(
                              (f) => f !== option
                            ),
                          });
                        }
                      }}
                      className="mt-1 w-4 h-4 text-phthalo-500 focus:ring-phthalo-500 rounded"
                    />
                    <span className="text-zinc-300">{option}</span>
                  </label>
                ))}
              </div>
              {answers.missingFeatures.includes('Other') && (
                <textarea
                  value={answers.missingFeaturesOther || ''}
                  onChange={(e) =>
                    setAnswers({ ...answers, missingFeaturesOther: e.target.value })
                  }
                  placeholder="Please specify..."
                  className="mt-4 w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-phthalo-500/50"
                  rows={3}
                />
              )}
            </div>
          )}

          {/* Question 3: Satisfaction Rating */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                How satisfied were you with the platform overall?
              </h3>
              <p className="text-sm text-red-400 mb-8">* Required</p>
              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setAnswers({ ...answers, satisfaction: rating })}
                      className="group transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-12 h-12 transition-all ${
                          answers.satisfaction >= rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-zinc-600 hover:text-zinc-500'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex justify-between w-full text-sm text-zinc-500">
                  <span>Very dissatisfied</span>
                  <span>Neutral</span>
                  <span>Very satisfied</span>
                </div>
              </div>
            </div>
          )}

          {/* Question 4: What would convince you to stay */}
          {currentStep === 4 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                What would have convinced you to stay?
              </h3>
              <p className="text-sm text-zinc-400 mb-2">
                Be brutally honest — we want to improve Mirkovic Academy.
              </p>
              <p className="text-sm text-red-400 mb-6">* Required</p>
              <textarea
                value={answers.convinceToStay}
                onChange={(e) =>
                  setAnswers({ ...answers, convinceToStay: e.target.value })
                }
                placeholder="Your honest feedback..."
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-phthalo-500/50"
                rows={5}
              />
            </div>
          )}

          {/* Question 5: Likelihood to return */}
          {currentStep === 5 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                How likely are you to come back in the future?
              </h3>
              <p className="text-sm text-zinc-400 mb-8">1 = Not likely, 10 = Very likely</p>
              <div className="px-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={answers.likelyToReturn}
                  onChange={(e) =>
                    setAnswers({ ...answers, likelyToReturn: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-phthalo-500"
                />
                <div className="flex justify-between mt-2 text-sm text-zinc-500">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                  <span>9</span>
                  <span>10</span>
                </div>
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-phthalo-500/20 border-2 border-phthalo-500">
                    <span className="text-3xl font-bold text-phthalo-400">
                      {answers.likelyToReturn}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Question 6: Bugs/Technical Issues */}
          {currentStep === 6 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Were there any bugs or technical issues we should fix?
              </h3>
              <p className="text-sm text-zinc-400 mb-6">Optional</p>
              <textarea
                value={answers.bugs || ''}
                onChange={(e) => setAnswers({ ...answers, bugs: e.target.value })}
                placeholder="Describe any technical issues you encountered..."
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-phthalo-500/50"
                rows={5}
              />
            </div>
          )}

          {/* Question 7: New Feature Request */}
          {currentStep === 7 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                If we added one new feature for you, what should it be?
              </h3>
              <p className="text-sm text-zinc-400 mb-6">Optional</p>
              <textarea
                value={answers.newFeature || ''}
                onChange={(e) => setAnswers({ ...answers, newFeature: e.target.value })}
                placeholder="Your feature request..."
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-phthalo-500/50"
                rows={5}
              />
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 p-6 flex justify-between gap-4">
          <Button
            onClick={handleBack}
            disabled={currentStep === 1}
            variant="outline"
            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-phthalo-500 to-phthalo-600 hover:from-phthalo-600 hover:to-phthalo-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              Complete Cancellation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
