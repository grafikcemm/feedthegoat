'use client'

import { useState } from 'react'
import { CheckCircle, Lock, BookOpen, ChevronRight, AlertCircle } from 'lucide-react'
import type { LibraryBook } from '@/data/librarySeed'

interface Props {
  books: LibraryBook[]
  onActivate: (bookId: string) => void
  canActivateNew: boolean
}

export function ReadingLadder({ books, onActivate, canActivateNew }: Props) {
  const [activateWarning, setActivateWarning] = useState<string | null>(null)

  const handleActivate = (book: LibraryBook) => {
    if (!canActivateNew) {
      setActivateWarning('Önce aktif kitabı bitir veya arşive al. Aynı anda her şeyi okumaya çalışma.')
      setTimeout(() => setActivateWarning(null), 4000)
      return
    }
    onActivate(book.id)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] uppercase tracking-widest text-[#555] font-bold">Okuma Merdiveni</span>
        <span className="text-[#333] text-[10px]">— Sırayla ilerle</span>
      </div>

      {activateWarning && (
        <div className="mb-4 flex items-start gap-2 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-[6px] p-3">
          <AlertCircle size={14} className="text-[#f59e0b] shrink-0 mt-0.5" />
          <p className="text-[#f59e0b] text-xs">{activateWarning}</p>
        </div>
      )}

      <div className="space-y-2">
        {books.map((book, idx) => (
          <LadderStep
            key={book.id}
            book={book}
            stepNumber={idx + 1}
            onActivate={() => handleActivate(book)}
          />
        ))}
      </div>
    </div>
  )
}

function LadderStep({
  book,
  stepNumber,
  onActivate,
}: {
  book: LibraryBook
  stepNumber: number
  onActivate: () => void
}) {
  const isActive = book.status === 'active'
  const isCompleted = book.status === 'completed'
  const isPaused = book.status === 'paused'
  const isNext = book.priority === 'next' && book.status === 'not_started'

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-[6px] border transition-colors
        ${isActive ? 'border-[#F5C518]/40 bg-[#F5C518]/5' : ''}
        ${isCompleted ? 'border-[#22c55e]/20 bg-[#22c55e]/5' : ''}
        ${!isActive && !isCompleted ? 'border-[#1f1f1f] bg-[#0f0f0f]' : ''}
      `}
    >
      {/* Step indicator */}
      <div className="shrink-0 w-6 h-6 flex items-center justify-center">
        {isCompleted ? (
          <CheckCircle size={16} className="text-[#22c55e]" />
        ) : isActive ? (
          <BookOpen size={16} className="text-[#F5C518]" />
        ) : (
          <span className={`text-[10px] font-mono ${isPaused ? 'text-[#f59e0b]' : 'text-[#444]'}`}>
            {stepNumber}
          </span>
        )}
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium truncate
          ${isActive ? 'text-white' : ''}
          ${isCompleted ? 'text-[#22c55e] line-through' : ''}
          ${!isActive && !isCompleted ? 'text-[#666]' : ''}
        `}>
          {book.title}
        </p>
        {book.author && (
          <p className="text-[#444] text-[10px] truncate">{book.author}</p>
        )}
      </div>

      {/* Status / action */}
      <div className="shrink-0">
        {isActive && (
          <span className="text-[9px] uppercase tracking-widest text-[#F5C518] bg-[#F5C518]/10 px-2 py-1 rounded">
            Aktif
          </span>
        )}
        {isCompleted && (
          <span className="text-[9px] uppercase tracking-widest text-[#22c55e]">Bitti</span>
        )}
        {isPaused && (
          <span className="text-[9px] uppercase tracking-widest text-[#f59e0b]">Duraklatıldı</span>
        )}
        {!isActive && !isCompleted && !isPaused && (
          <button
            onClick={onActivate}
            className={`flex items-center gap-1 text-[9px] uppercase tracking-widest px-2 py-1 rounded transition-colors
              ${isNext
                ? 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'
                : 'text-[#444] hover:text-[#666]'
              }`}
          >
            {isNext ? 'Başlat' : <Lock size={10} />}
            {!isNext && <span className="ml-1">Sıra Bekliyor</span>}
            {isNext && <ChevronRight size={10} />}
          </button>
        )}
      </div>
    </div>
  )
}
