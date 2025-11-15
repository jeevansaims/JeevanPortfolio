'use client';

import { useState } from 'react';
import { Crown, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CancellationQuiz } from './cancellation-quiz';

interface ProSubscriptionViewProps {
  userEmail: string;
}

export function ProSubscriptionView({ userEmail }: ProSubscriptionViewProps) {
  const [showCancellationQuiz, setShowCancellationQuiz] = useState(false);

  const proPerks = [
    'AI-Personalized Roadmap',
    'Full Project Vault Access',
    'Weekly Quant Journal',
    'Trading Strategies',
    'CV Lab & Interview Prep',
    'Math Fundamentals Program',
    'Priority Support',
    'Early access to new features',
    'New content every month',
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white">
        <div className="container mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                <Crown className="w-4 h-4" />
                Active Pro Member
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
                  Your Subscription
                </span>
              </h1>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Manage your Pro membership and billing
              </p>
            </div>

            {/* Subscription Card */}
            <div className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-phthalo-500/10 to-phthalo-600/10 border-2 border-phthalo-500/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-phthalo-500/20 border-2 border-phthalo-500 flex items-center justify-center">
                    <Crown className="w-8 h-8 text-phthalo-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Pro Plan</h2>
                    <p className="text-zinc-400">Full access to all features</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
                  <span className="text-sm font-semibold text-green-400">Active</span>
                </div>
              </div>

              {/* Billing Info */}
              <div className="mb-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <div className="text-sm text-zinc-400 mb-1">Billing Email</div>
                <div className="text-white font-medium">{userEmail}</div>
              </div>

              {/* Perks List */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">What you get:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {proPerks.map((perk, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-phthalo-400 flex-shrink-0" />
                      <span className="text-zinc-300">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Placeholder for Stripe Management */}
              <div className="pt-6 border-t border-zinc-800">
                <p className="text-sm text-zinc-400 mb-4">
                  Need to update your payment method or billing information?
                </p>
                <Button
                  disabled
                  className="bg-zinc-800 text-zinc-400 cursor-not-allowed hover:bg-zinc-800"
                >
                  Manage Billing (Coming Soon)
                </Button>
              </div>
            </div>

            {/* Cancel Section */}
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Need to cancel?
                  </h3>
                  <p className="text-sm text-zinc-400 mb-4">
                    We're sorry to see you go. Before you cancel, we'd love to hear your
                    feedback to help us improve.
                  </p>
                  <Button
                    onClick={() => setShowCancellationQuiz(true)}
                    variant="outline"
                    className="bg-zinc-900/50 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                  >
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Quiz Modal */}
      {showCancellationQuiz && (
        <CancellationQuiz
          onClose={() => setShowCancellationQuiz(false)}
          userEmail={userEmail}
        />
      )}
    </>
  );
}
