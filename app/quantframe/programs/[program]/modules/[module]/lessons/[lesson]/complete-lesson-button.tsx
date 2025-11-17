// app/quantframe/programs/[program]/modules/[module]/lessons/[lesson]/complete-lesson-button.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { completeLesson } from '@/app/quantframe/actions/lessons'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'

interface CompleteLessonButtonProps {
  lessonId: string
}

export function CompleteLessonButton({ lessonId }: CompleteLessonButtonProps) {
  const router = useRouter()
  const [completing, setCompleting] = useState(false)

  const handleComplete = async () => {
    setCompleting(true)

    try {
      const result = await completeLesson(lessonId)

      if (result.error) {
        toast.error(result.error)
        return
      }

      if (result.alreadyCompleted) {
        toast.info('Lesson already completed')
      } else {
        // Success! Show confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#26804a', '#2d9659', '#34ac68']
        })

        toast.success('Lesson completed! Great work!')
      }

      // Refresh the page to show updated completion status
      router.refresh()
    } catch (error) {
      console.error('Error completing lesson:', error)
      toast.error('Failed to mark lesson as complete')
    } finally {
      setCompleting(false)
    }
  }

  return (
    <Button
      onClick={handleComplete}
      disabled={completing}
      className="bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900 disabled:opacity-50"
      size="lg"
    >
      {completing ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Completing...
        </>
      ) : (
        <>
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Mark as Complete
        </>
      )}
    </Button>
  )
}
