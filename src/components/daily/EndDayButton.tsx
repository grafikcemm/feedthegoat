'use client'

import React, { useState } from 'react'
import { finalizeDay } from '@/app/actions/endDayActions'
import { fireDayCompleteConfetti } from '@/lib/confetti'
import { cn } from '@/utils/cn'

interface EndDayButtonProps {
  score: number
  isAlreadyFinalized: boolean
}

export function EndDayButton({ score, isAlreadyFinalized }: EndDayButtonProps) {
  const [isDone, setIsDone] = useState(isAlreadyFinalized)
  const [result, setResult] = useState<{
    newStreak: number
    streakBroken: boolean
  } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleEndDay() {
    setLoading(true)
    try {
      const res = await finalizeDay(score)
      setResult(res)
      setIsDone(true)

      if (!res.streakBroken) {
        fireDayCompleteConfetti()
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  if (isDone && result?.streakBroken) {
    return (
      <div className="w-full py-4 bg-[#ff453a] border border-[#ff453a]/30 rounded-2xl text-center animate-in fade-in duration-500">
        <p className="text-[#ff453a] text-sm font-semibold mb-1 uppercase tracking-tight">
          ⚠️ Seri kırıldı
        </p>
        <p className="text-[#ababab] text-[10px] font-bold tracking-widest uppercase">
          YENİ SERİ BAŞLIYOR. YARIN DEVAM ET.
        </p>
      </div>
    )
  }

  if (isDone) {
    return (
      <div className="w-full py-4 bg-[#30d158] border border-[#30d158]/30 rounded-2xl text-center animate-in fade-in duration-500">
        <p className="text-[#30d158] text-sm font-semibold uppercase tracking-tight">✓ GÜN TAMAMLANDI</p>
        {result && (
          <p className="text-[#30d158]/70 text-[10px] mt-1 font-bold tracking-widest uppercase">
            {result.newStreak} GÜNLÜK SERİ 🔥
          </p>
        )}
        {isAlreadyFinalized && !result && (
          <p className="text-[#666666] text-[10px] mt-1 font-bold uppercase tracking-widest">
            BUGÜN ZATEN KAYDEDİLDİ
          </p>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={handleEndDay}
      disabled={loading}
      className={cn(
        "w-full py-4 bg-[#141414] border border-[#2a2a2a] rounded-2xl text-[#555555] text-sm font-semibold tracking-wide hover:border-[#6366f1] hover:text-[#6366f1] hover:shadow-lg hover:shadow-[#6366f1]/20 transition-all cursor-pointer active:scale-[0.98] uppercase",
        loading && "opacity-50 cursor-wait"
      )}
    >
      {loading ? 'KAYDEDİLİYOR...' : 'GÜNÜ BİTİR'}
    </button>
  )
}
