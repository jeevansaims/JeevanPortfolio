// app/quantframe/daily/components/countdown-timer.tsx
'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setUTCHours(24, 0, 0, 0)
      
      const diff = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm text-zinc-400">
      <Clock className="w-4 h-4" />
      <span>Next challenge in: <span className="text-phthalo-400 font-medium">{timeLeft}</span></span>
    </div>
  )
}