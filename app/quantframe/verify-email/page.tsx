'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MathBackground } from '../components/math-background'
import { resendVerificationEmail } from '../actions/auth'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Listen for auth state changes (when user clicks email link)
  useEffect(() => {
    const checkVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user && user.email_confirmed_at) {
        setIsVerified(true)
        toast.success('Email verified! Redirecting to dashboard...')
        setTimeout(() => {
          router.push('/quantframe/dashboard')
        }, 1500)
      }
    }

    // Check immediately on mount
    checkVerification()

    // Set up real-time listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
          setIsVerified(true)
          toast.success('Email verified! Redirecting to dashboard...')
          setTimeout(() => {
            router.push('/quantframe/dashboard')
          }, 1500)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  async function handleResend() {
    setLoading(true)
    const result = await resendVerificationEmail()

    if (result.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Verification email sent! Check your inbox.')
      setEmailSent(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white overflow-hidden flex items-center justify-center">
      <MathBackground />

      <div className="container relative z-10 px-4 sm:px-6 py-16">
        <div className="max-w-md mx-auto">
          {/* Card */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-phthalo-500/20 to-phthalo-700/20 blur-xl opacity-70"></div>
            <div className="relative bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 shadow-2xl">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-phthalo-500/20 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-phthalo-400" />
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
                    Verify Your Email
                  </span>
                </h1>
                <p className="text-zinc-400">
                  We've sent a verification link to your email address. Click the link to activate your account.
                </p>
              </div>

              {/* Instructions */}
              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                  <h3 className="font-medium mb-2 text-phthalo-400">Next Steps:</h3>
                  <ol className="space-y-2 text-sm text-zinc-300">
                    <li>1. Check your email inbox</li>
                    <li>2. Click the verification link</li>
                    <li>3. Return here and login</li>
                  </ol>
                </div>

                <p className="text-sm text-zinc-500 text-center">
                  Don't see the email? Check your spam folder.
                </p>
              </div>

              {/* Resend Button */}
              <div className="space-y-4">
                <Button
                  onClick={handleResend}
                  disabled={loading || emailSent}
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-phthalo-600 to-phthalo-800 border-0"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : emailSent ? (
                      'Email Sent!'
                    ) : (
                      'Resend Verification Email'
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-phthalo-700 to-phthalo-900 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </Button>

                <div className="pt-2">
                  <Link href="/quantframe/login">
                    <Button
                      variant="outline"
                      className="w-full border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 bg-transparent"
                    >
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}