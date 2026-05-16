'use client'

import { useLibrary } from '@/hooks/useLibrary'
import { LibraryCommandCenter } from './LibraryCommandCenter'
import { ActiveBookCard } from './ActiveBookCard'
import { ReadingLadder } from './ReadingLadder'
import { ProblemBasedShelves } from './ProblemBasedShelves'
import { LibraryAssistantPanel } from './LibraryAssistantPanel'
import type { BookCompletion } from '@/data/librarySeed'

export function LibraryShell() {
  const {
    activeBook,
    completedCount,
    notesThisMonth,
    actionsThisMonth,
    totalBooks,
    canActivateNew,
    state,
    activateBook,
    archiveBookById,
    completeBookById,
    addNoteToBook,
    getBookNotes,
    getMainReadingLadder,
  } = useLibrary()

  const ladderBooks = getMainReadingLadder()
  const nextBook = ladderBooks.find(b => b.status === 'not_started' && b.priority === 'next')

  const handleComplete = (data: {
    notes: string[]
    feedTheGoatAction: string
    problemSolved: string
    readyForNext: boolean
    lifeImpact: string
  }) => {
    if (!activeBook) return
    const completion: BookCompletion = {
      bookId: activeBook.id,
      ...data,
      completedAt: new Date().toISOString(),
    }
    completeBookById(completion)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16 space-y-8">
      {/* Section 1: Command Center */}
      <section>
        <LibraryCommandCenter
          totalBooks={totalBooks}
          completedCount={completedCount}
          notesThisMonth={notesThisMonth}
          actionsThisMonth={actionsThisMonth}
          weeklyGoalPages={state.weeklyReadingGoalPages}
          activeBookTitle={activeBook?.title}
          nextBookTitle={nextBook?.title}
        />
      </section>

      {/* Section 2: Active Book */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] uppercase tracking-widest text-[#555] font-bold">Aktif Kitap</span>
        </div>
        <ActiveBookCard
          book={activeBook}
          notes={activeBook ? getBookNotes(activeBook.id) : []}
          onAddNote={addNoteToBook}
          onComplete={handleComplete}
        />
      </section>

      {/* Section 3: Reading Ladder */}
      <section>
        <ReadingLadder
          books={ladderBooks}
          onActivate={activateBook}
          canActivateNew={canActivateNew}
        />
      </section>

      {/* Section 4: Problem-based shelves */}
      <section>
        <ProblemBasedShelves
          books={state.books}
          getNotes={getBookNotes}
          onAddNote={addNoteToBook}
          onArchive={archiveBookById}
          onActivate={activateBook}
          canActivateNew={canActivateNew}
        />
      </section>

      {/* Section 5: AI Assistant */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] uppercase tracking-widest text-[#555] font-bold">Kitap Koçu</span>
        </div>
        <LibraryAssistantPanel
          activeBook={activeBook}
          completedCount={completedCount}
          totalBooks={totalBooks}
        />
      </section>
    </div>
  )
}
