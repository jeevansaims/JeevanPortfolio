'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MathBackground } from '../components/math-background'
import { register } from '../actions/auth'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setPasswordError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm_password') as string

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      setLoading(false)
      return
    }

    const result = await register(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      toast.success('Account created! Check your email to verify your account.')
      // Optionally redirect to verify-email page
      window.location.href = '/academy/verify-email'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white overflow-hidden flex items-center justify-center">
      <MathBackground />

      <div className="container relative z-10 px-4 sm:px-6 py-16">
        <div className="max-w-md mx-auto">
          {/* Back to Academy Link */}
          <div className="mb-8">
            <Link href="/academy" className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-2">
              ← Back to Academy
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
                    Create Account
                  </span>
                </h1>
                <p className="text-zinc-400">Join Mirkovic Academy</p>
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

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name (Optional)</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="John Doe"
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
                    minLength={8}
                    className="bg-zinc-800/50 border-zinc-700 focus:border-phthalo-500 focus:ring-phthalo-500"
                  />
                  <p className="text-xs text-zinc-500">Minimum 8 characters</p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="bg-zinc-800/50 border-zinc-700 focus:border-phthalo-500 focus:ring-phthalo-500"
                  />
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-400">
                      {error}
                      {error.includes('already registered') && (
                        <Link href="/academy/login" className="ml-1 underline font-medium">
                          Login instead →
                        </Link>
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
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-phthalo-700 to-phthalo-900 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </Button>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-zinc-400">
                  Already have an account?{' '}
                  <Link href="/academy/login" className="text-phthalo-400 hover:text-phthalo-300 font-medium">
                    Login →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}