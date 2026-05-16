'use client'

import { useState } from 'react'
import { BookOpen, Plus, CheckCircle, Lock, AlertTriangle } from 'lucide-react'
import type { LibraryBook, BookNote } from '@/data/librarySeed'
import { BookCompletionModal } from './BookCompletionModal'
import { AddNoteModal } from './AddNoteModal'

interface Props {
  book: LibraryBook | null
  notes: BookNote[]
  onAddNote: (note: Omit<BookNote, 'id' | 'createdAt'>) => void
  onComplete: (data: {
    notes: string[]
    feedTheGoatAction: string
    problemSolved: string
    readyForNext: boolean
    lifeImpact: string
  }) => void
}

export function ActiveBookCard({ book, notes, onAddNote, onComplete }: Props) {
  const [showCompletion, setShowCompletion] = useState(false)
  const [showNote, setShowNote] = useState(false)

  if (!book) {
    return (
      <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-[6px] p-6 text-center">
        <Lock size={24} className="text-[#333] mx-auto mb-3" />
        <p className="text-[#555] text-sm">Aktif kitap yok</p>
        <p className="text-[#333] text-xs mt-1">Okuma Merdiveni&apos;nden bir kitap başlat</p>
      </div>
    )
  }

  const noteCount = notes.length
  const actionCount = notes.filter(n => n.type === 'action').length
  const canComplete =
    noteCount >= 5 && actionCount >= 1

  return (
    <>
      <div className="bg-[#0f0f0f] border border-[#F5C518]/30 rounded-[6px] p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={12} className="text-[#F5C518] shrink-0" />
              <span className="text-[9px] uppercase tracking-widest text-[#F5C518]">Aktif Kitap</span>
            </div>
            <h2 className="text-white font-bold text-lg leading-tight">{book.title}</h2>
            {book.author && <p className="text-[#555] text-xs mt-0.5">{book.author}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <InfoRow label="Problemi çözüyor" value={book.problemItSolves} />
          <InfoRow label="Neden okuyorum" value={book.whyRead} />
          <InfoRow label="Feed The Goat aksiyonu" value={book.feedTheGoatAction} highlight />
        </div>

        <div className="flex items-center gap-3 text-xs text-[#555]">
          <span className={noteCount >= 5 ? 'text-[#22c55e]' : ''}>
            {noteCount}/5 not
          </span>
          <span className="text-[#333]">•</span>
          <span className={actionCount >= 1 ? 'text-[#22c55e]' : ''}>
            {actionCount}/1 aksiyon
          </span>
          {!canComplete && (
            <span className="flex items-center gap-1 text-[#f59e0b]">
              <AlertTriangle size={10} />
              Tamamlamak için not ve aksiyon gerekli
            </span>
          )}

        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setShowNote(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs rounded-[6px] hover:border-[#F5C518]/40 transition-colors min-h-[36px]"
          >
            <Plus size={12} />
            Not ekle
          </button>

          <button
            onClick={() => setShowNote(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs rounded-[6px] hover:border-[#F5C518]/40 transition-colors min-h-[36px]"
          >
            <Plus size={12} />
            Aksiyon çıkar
          </button>

          <button
            onClick={() => setShowCompletion(true)}
            disabled={!canComplete}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-[6px] min-h-[36px] transition-colors
              ${canComplete
                ? 'bg-[#22c55e]/10 border border-[#22c55e]/40 text-[#22c55e] hover:bg-[#22c55e]/20'
                : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#333] cursor-not-allowed'
              }`}
          >
            <CheckCircle size={12} />
            Kitabı bitir
          </button>
        </div>
      </div>

      {showNote && (
        <AddNoteModal
          book={book}
          onClose={() => setShowNote(false)}
          onSave={(note) => {
            onAddNote(note)
            setShowNote(false)
          }}
        />
      )}

      {showCompletion && (
        <BookCompletionModal
          book={book}
          onClose={() => setShowCompletion(false)}
          onComplete={(data) => {
            onComplete(data)
            setShowCompletion(false)
          }}
        />
      )}
    </>
  )
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <span className="text-[9px] uppercase tracking-widest text-[#444] block mb-0.5">{label}</span>
      <p className={`text-xs leading-relaxed ${highlight ? 'text-[#F5C518]' : 'text-[#888]'}`}>{value}</p>
    </div>
  )
}
