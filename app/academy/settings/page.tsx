import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PageHeader } from '../components/page-header';
import { PasswordResetCard } from './components/password-reset-card';
import { EmailPreferencesCard } from './components/email-preferences-card';
import { SubscriptionCard } from './components/subscription-card';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Settings | Mirkovic Academy',
  description: 'Manage your account settings and preferences',
};

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/academy/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-6">
          {/* Password Reset Card */}
          <PasswordResetCard />

          {/* Email Preferences Card */}
          <EmailPreferencesCard
            userId={user.id}
            currentEmail={user.email || ''}
          />

          {/* Subscription Card */}
          <SubscriptionCard
            membershipTier={profile?.membership_tier || 'free'}
            userEmail={user.email || ''}
          />
        </div>
      </div>
    </div>
  );
}
