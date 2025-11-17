'use client';

import { useState } from 'react';
import { Mail, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface EmailPreferencesCardProps {
  userId: string;
  currentEmail: string;
}

export function EmailPreferencesCard({
  userId,
  currentEmail,
}: EmailPreferencesCardProps) {
  // TODO: Fetch this from database when newsletter is implemented
  const [newsletterEnabled, setNewsletterEnabled] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleNewsletter = async () => {
    setIsUpdating(true);

    try {
      // TODO: Implement API call to update newsletter preferences
      // For now, just toggle the state
      await new Promise((resolve) => setTimeout(resolve, 500));

      setNewsletterEnabled(!newsletterEnabled);
      toast.success(
        newsletterEnabled
          ? 'Unsubscribed from newsletter'
          : 'Subscribed to newsletter'
      );
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 md:p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-phthalo-500/10 flex items-center justify-center">
          <Mail className="w-5 h-5 text-phthalo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Email Preferences</h2>
          <p className="text-sm text-zinc-400">
            Manage your email notifications
          </p>
        </div>
      </div>

      {/* Current Email */}
      <div className="mb-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
        <div className="text-sm text-zinc-400 mb-1">Email Address</div>
        <div className="text-white font-medium">{currentEmail}</div>
      </div>

      {/* Newsletter Toggle */}
      <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-phthalo-500/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-phthalo-400" />
          </div>
          <div>
            <div className="text-white font-medium">Weekly Newsletter</div>
            <div className="text-sm text-zinc-400">
              Get weekly insights on quant finance and trading
            </div>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={handleToggleNewsletter}
          disabled={isUpdating}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-phthalo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
            newsletterEnabled ? 'bg-phthalo-500' : 'bg-zinc-700'
          } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              newsletterEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Info Message */}
      <div className="mt-4 p-3 bg-phthalo-500/10 border border-phthalo-500/20 rounded-lg">
        <p className="text-xs text-phthalo-300">
          You can unsubscribe from our newsletter at any time. We respect your
          privacy and will never share your email with third parties.
        </p>
      </div>
    </div>
  );
}
