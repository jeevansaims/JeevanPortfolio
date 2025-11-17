'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MathBackground } from '../components/math-background'
import { login } from '../actions/auth'
import { toast } from 'sonner'

function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/quantframe/dashboard'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await login(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      
      // If needs verification, redirect to verify-email page
      if (result.needsVerification) {
        setTimeout(() => {
          window.location.href = '/quantframe/verify-email'
        }, 2000)
      }
    } else {
      toast.success('Login successful! Redirecting...')
      window.location.href = next
    }
  }

  return (
    <div className="container relative z-10 px-4 sm:px-6 py-16">
      <div className="max-w-md mx-auto">
        {/* Back to quantframe Link */}
        <div className="mb-8">
          <Link href="/quantframe" className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-2">
            ← Back to quantframe
          </Link>
        </div>

        {/* Card */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-phthalo-500/20 to-phthalo-700/20 blur-xl opacity-70"></div>
          <div className="relative bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
                  Welcome Back
                </span>
              </h1>
              <p className="text-zinc-400">Login to continue learning</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="bg-zinc-800/50 border-zinc-700 focus:border-phthalo-500 focus:ring-phthalo-500"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="bg-zinc-800/50 border-zinc-700 focus:border-phthalo-500 focus:ring-phthalo-500"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">
                    {error}
                    {error.includes('No account found') && (
                      <Link href="/quantframe/register" className="ml-1 underline font-medium">
                        Register instead →
                      </Link>
                    )}
                    {error.includes('verify your email') && (
                      <span className="block mt-2 text-zinc-400">
                        Redirecting to verification page...
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden group bg-gradient-to-r from-phthalo-600 to-phthalo-800 border-0"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-phthalo-700 to-phthalo-900 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-zinc-400">
                Don't have an account?{' '}
                <Link href="/quantframe/register" className="text-phthalo-400 hover:text-phthalo-300 font-medium">
                  Register →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white overflow-hidden flex items-center justify-center">
      <MathBackground />
      <Suspense fallback={
        <div className="container relative z-10 px-4 sm:px-6 py-16">
          <div className="max-w-md mx-auto text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-phthalo-400" />
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}