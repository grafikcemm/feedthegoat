'use client'
import { useState } from 'react'
import { fireDayCompleteConfetti } from '@/lib/confetti'

export function EndDayButton() {
  const [isDone, setIsDone] = useState(false)

  function handleEndDay() {
    fireDayCompleteConfetti()
    setIsDone(true)
  }

  if (isDone) {
    return (
      <div className="text-center py-6 text-zinc-400 text-sm tracking-wide animate-in fade-in duration-700">
        ✓ Bugün tamamlandı. İyi geceler.
      </div>
    )
  }

  return (
    <button
      onClick={handleEndDay}
      className="w-full py-3 mt-4 border border-zinc-700 rounded-lg
                 text-zinc-400 text-xs tracking-widest
                 hover:border-zinc-400 hover:text-zinc-200
                 transition-colors cursor-pointer"
    >
      GÜNÜ BİTİR
    </button>
  )
}
