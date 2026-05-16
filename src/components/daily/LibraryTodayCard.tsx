'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Plus } from 'lucide-react'
import Link from 'next/link'
import { loadLibraryState, getActiveBook } from '@/lib/libraryStorage'
import { AddNoteModal } from '@/components/library/AddNoteModal'
import type { LibraryBook, BookNote } from '@/data/librarySeed'
import { addNote, saveLibraryState } from '@/lib/libraryStorage'

export function LibraryTodayCard() {
  const [activeBook, setActiveBook] = useState<LibraryBook | null | undefined>(undefined)
  const [showNote, setShowNote] = useState(false)

  useEffect(() => {
    const state = loadLibraryState()
    const book = getActiveBook(state)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveBook(book)
  }, [])

  if (activeBook === undefined) return null
  if (!activeBook) return null

  const handleAddNote = (note: Omit<BookNote, 'id' | 'createdAt'>) => {
    const state = loadLibraryState()
    const updated = addNote(state, note)
    saveLibraryState(updated)
    setShowNote(false)
  }

  return (
    <>
      <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-[6px] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen size={12} className="text-[#F5C518]" />
            <span className="text-[9px] uppercase tracking-widest text-[#555]">Bugünkü Okuma</span>
          </div>
          <Link
            href="/?tab=KUTUPHANE"
            className="text-[9px] uppercase tracking-widest text-[#444] hover:text-[#F5C518] transition-colors"
          >
            Kütüphane →
          </Link>
        </div>

        <p className="text-white text-sm font-medium leading-tight mb-1">{activeBook.title}</p>
        <p className="text-[#555] text-[11px] mb-3">{activeBook.problemItSolves}</p>

        <div className="flex items-center justify-between">
          <span className="text-[#F5C518] text-[11px] font-mono">Hedef: 10 sayfa / 20 dk</span>
          <button
            onClick={() => setShowNote(true)}
            className="flex items-center gap-1 text-[10px] text-[#555] hover:text-white transition-colors"
          >
            <Plus size={10} />
            Not
          </button>
        </div>
      </div>

      {showNote && (
        <AddNoteModal
          book={activeBook}
          onClose={() => setShowNote(false)}
          onSave={handleAddNote}
        />
      )}
    </>
  )
}
