// app/quantframe/programs/[program]/modules/[module]/lessons/[lesson]/reset-lesson-button.tsx
'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RefreshCw, Loader2, AlertTriangle } from 'lucide-react'
import { resetLesson } from '@/app/quantframe/actions/lessons'
import { toast } from 'sonner'

interface ResetLessonButtonProps {
  lessonId: string
}

export function ResetLessonButton({ lessonId }: ResetLessonButtonProps) {
  const router = useRouter()
  const [resetting, setResetting] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleReset = async () => {
    setResetting(true)
    setShowWarning(false)

    try {
      const result = await resetLesson(lessonId)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success('Lesson reset! You can now retake the quiz.')

      // Refresh the page to show updated completion status
      router.refresh()
    } catch (error) {
      console.error('Error resetting lesson:', error)
      toast.error('Failed to reset lesson')
    } finally {
      setResetting(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setShowWarning(true)}
        disabled={resetting}
        variant="ghost"
        size="sm"
        className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
      >
        {resetting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Resetting...
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Lesson
          </>
        )}
      </Button>

      {/* Render modal via portal to document.body */}
      {mounted && showWarning && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
            onClick={() => setShowWarning(false)}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-200">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Reset Lesson?</h3>
                    <p className="text-zinc-400 text-sm">
                      This will remove your completion status and delete all quiz attempts for this lesson. You'll need to retake the quiz to complete it again.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowWarning(false)}
                    variant="outline"
                    className="flex-1 bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReset}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Reset Anyway
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  )
}
