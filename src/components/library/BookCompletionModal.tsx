'use client'

import { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'
import type { LibraryBook } from '@/data/librarySeed'

interface Props {
  book: LibraryBook
  onClose: () => void
  onComplete: (data: {
    notes: string[]
    feedTheGoatAction: string
    problemSolved: string
    readyForNext: boolean
    lifeImpact: string
  }) => void
}

export function BookCompletionModal({ book, onClose, onComplete }: Props) {
  const [notes, setNotes] = useState(['', '', '', '', ''])
  const [feedTheGoatAction, setFeedTheGoatAction] = useState('')
  const [problemSolved, setProblemSolved] = useState('')
  const [readyForNext, setReadyForNext] = useState<boolean | null>(null)
  const [lifeImpact, setLifeImpact] = useState('')

  const filledNotes = notes.filter(n => n.trim()).length
  const isValid = filledNotes >= 5 && feedTheGoatAction.trim() && problemSolved.trim() && readyForNext !== null && lifeImpact.trim()

  return (
    <div className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#111] border border-[#1f1f1f] rounded-[6px] w-full max-w-lg my-8">
        <div className="flex items-center justify-between p-4 border-b border-[#1f1f1f]">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-[#22c55e]" />
              <p className="text-[9px] uppercase tracking-widest text-[#22c55e]">Kitabı Tamamla</p>
            </div>
            <p className="text-white text-sm font-medium mt-0.5">{book.title}</p>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* 5 Notes */}
          <div>
            <label className="text-[9px] uppercase tracking-widest text-[#555] block mb-2">
              1. Bu kitaptan öğrendiğin 5 not ({filledNotes}/5)
            </label>
            <div className="space-y-2">
              {notes.map((note, i) => (
                <input
                  key={i}
                  value={note}
                  onChange={e => {
                    const next = [...notes]
                    next[i] = e.target.value
                    setNotes(next)
                  }}
                  placeholder={`Not ${i + 1}...`}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-[6px] px-3 py-2 text-white text-xs focus:outline-none focus:border-[#22c55e]/40 placeholder:text-[#444]"
                />
              ))}
            </div>
          </div>

          {/* FTG Action */}
          <div>
            <label className="text-[9px] uppercase tracking-widest text-[#555] block mb-2">
              2. Feed The Goat&apos;a bağlanacak 1 aksiyon
            </label>
            <input
              value={feedTheGoatAction}
              onChange={e => setFeedTheGoatAction(e.target.value)}
              placeholder="Sisteme eklenecek somut aksiyon..."
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-[6px] px-3 py-2 text-white text-xs focus:outline-none focus:border-[#22c55e]/40 placeholder:text-[#444]"
            />
          </div>

          {/* Problem solved */}
          <div>
            <label className="text-[9px] uppercase tracking-widest text-[#555] block mb-2">
              3. Bu kitap hangi problemini çözdü?
            </label>
            <input
              value={problemSolved}
              onChange={e => setProblemSolved(e.target.value)}
              placeholder={`Kitabın çözdüğü problem: ${book.problemItSolves}`}
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-[6px] px-3 py-2 text-white text-xs focus:outline-none focus:border-[#22c55e]/40 placeholder:text-[#444]"
            />
          </div>

          {/* Ready for next */}
          <div>
            <label className="text-[9px] uppercase tracking-widest text-[#555] block mb-2">
              4. Sıradaki kitap için hazır mısın?
            </label>
            <div className="flex gap-2">
              {[true, false].map(val => (
                <button
                  key={String(val)}
                  onClick={() => setReadyForNext(val)}
                  className={`flex-1 py-2 text-xs rounded-[6px] transition-colors ${
                    readyForNext === val
                      ? val
                        ? 'bg-[#22c55e]/20 border border-[#22c55e]/40 text-[#22c55e]'
                        : 'bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444]'
                      : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#888]'
                  }`}
                >
                  {val ? 'Evet, hazırım' : 'Biraz daha zaman lazım'}
                </button>
              ))}
            </div>
          </div>

          {/* Life impact */}
          <div>
            <label className="text-[9px] uppercase tracking-widest text-[#555] block mb-2">
              5. Bu kitabın hayatına etkisi ne oldu?
            </label>
            <textarea
              value={lifeImpact}
              onChange={e => setLifeImpact(e.target.value)}
              placeholder="Bu kitap beni nasıl değiştirdi, neyi farklı yapacağım..."
              rows={3}
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-[6px] px-3 py-2 text-white text-xs resize-none focus:outline-none focus:border-[#22c55e]/40 placeholder:text-[#444]"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#2a2a2a] text-[#888] text-xs rounded-[6px] hover:text-white transition-colors"
            >
              İptal
            </button>
            <button
              onClick={() => {
                if (!isValid) return
                onComplete({
                  notes: notes.filter(n => n.trim()),
                  feedTheGoatAction: feedTheGoatAction.trim(),
                  problemSolved: problemSolved.trim(),
                  readyForNext: readyForNext!,
                  lifeImpact: lifeImpact.trim(),
                })
              }}
              disabled={!isValid}
              className="flex-1 py-2.5 bg-[#22c55e] text-black font-bold text-xs rounded-[6px] disabled:opacity-40 hover:bg-[#22c55e]/90 transition-colors"
            >
              Tamamla
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
