'use client';

import { CreditCard, Crown, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SubscriptionCardProps {
  membershipTier: 'free' | 'pro';
  userEmail: string;
}

export function SubscriptionCard({
  membershipTier,
  userEmail,
}: SubscriptionCardProps) {
  const isPro = membershipTier === 'pro';

  // Pro tier perks
  const proPerks = [
    'AI-Personalized Roadmap',
    'Full Project Vault Access',
    'Weekly Quant Journal',
    'Trading Strategies',
    'CV Lab & Interview Prep',
    'Priority Support',
  ];

  // Free tier limitations
  const freePerks = [
    'Limited roadmap access',
    '3 free projects',
    'Community support',
  ];

  return (
    <div className="p-6 md:p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-phthalo-500/10 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-phthalo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Subscription</h2>
          <p className="text-sm text-zinc-400">Manage your membership</p>
        </div>
      </div>

      {/* Current Plan */}
      <div
        className={`mb-6 p-6 rounded-lg border-2 ${
          isPro
            ? 'bg-gradient-to-br from-phthalo-500/10 to-phthalo-600/10 border-phthalo-500/30'
            : 'bg-zinc-900/50 border-zinc-800'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isPro && (
              <div className="w-10 h-10 rounded-lg bg-phthalo-500/20 border border-phthalo-500 flex items-center justify-center">
                <Crown className="w-5 h-5 text-phthalo-400" />
              </div>
            )}
            <div>
              <div className="text-sm text-zinc-400 mb-1">Current Plan</div>
              <div className="text-2xl font-bold text-white">
                {isPro ? 'Pro' : 'Free'}
              </div>
            </div>
          </div>
          {isPro && (
            <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
              <span className="text-sm font-semibold text-green-400">
                Active
              </span>
            </div>
          )}
        </div>

        {/* Perks List */}
        <div className="space-y-2">
          {(isPro ? proPerks : freePerks).map((perk, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Check
                className={`w-4 h-4 flex-shrink-0 ${
                  isPro ? 'text-phthalo-400' : 'text-zinc-500'
                }`}
              />
              <span className={isPro ? 'text-zinc-300' : 'text-zinc-500'}>
                {perk}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Email */}
      <div className="mb-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
        <div className="text-sm text-zinc-400 mb-1">Billing Email</div>
        <div className="text-white font-medium">{userEmail}</div>
      </div>

      {/* Action Button */}
      {isPro ? (
        <Link href="/quantframe/subscription">
          <Button className="w-full bg-gradient-to-r from-phthalo-500 to-phthalo-600 hover:from-phthalo-600 hover:to-phthalo-700">
            <span>Manage Subscription</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      ) : (
        <Link href="/quantframe/subscription">
          <Button className="w-full bg-gradient-to-r from-phthalo-500 to-phthalo-600 hover:from-phthalo-600 hover:to-phthalo-700">
            <Crown className="w-4 h-4 mr-2" />
            <span>Upgrade to Pro</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      )}

      {/* Additional Info for Free Users */}
      {!isPro && (
        <div className="mt-4 p-3 bg-phthalo-500/10 border border-phthalo-500/20 rounded-lg">
          <p className="text-xs text-phthalo-300">
            Unlock your full personalized roadmap and access all premium content
            with a Pro membership.
          </p>
        </div>
      )}
    </div>
  );
}
