'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MathBackground } from '../components/math-background'

export default function RegisterPage() {
  // Registration is temporarily disabled

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white overflow-hidden flex items-center justify-center">
      <MathBackground />

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
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-phthalo-500/10 border-2 border-phthalo-500/20 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-phthalo-400" />
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
                    Registration Closed
                  </span>
                </h1>
                <p className="text-zinc-400 mb-6">Registration is temporarily closed while we prepare for launch</p>
              </div>

              {/* Message */}
              <div className="space-y-4 text-center">
                <p className="text-zinc-300">
                  We're currently in private beta. Registration will open soon!
                </p>
                <p className="text-sm text-zinc-500">
                  Stay tuned for updates on our official launch.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <Link href="/quantframe" className="block">
                  <Button className="w-full bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900">
                    Explore quantframe
                  </Button>
                </Link>

                <Link href="/quantframe/login" className="block">
                  <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 bg-transparent">
                    Existing Users: Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}