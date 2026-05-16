'use client'

import { BookOpen, CheckCircle, StickyNote, Zap, Target } from 'lucide-react'

interface Props {
  totalBooks: number
  completedCount: number
  notesThisMonth: number
  actionsThisMonth: number
  weeklyGoalPages: number
  activeBookTitle?: string
  nextBookTitle?: string
}

export function LibraryCommandCenter({
  totalBooks,
  completedCount,
  notesThisMonth,
  actionsThisMonth,
  weeklyGoalPages,
  activeBookTitle,
  nextBookTitle,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen size={14} className="text-[#F5C518]" strokeWidth={1.5} />
        <span className="text-[10px] uppercase tracking-widest text-[#555] font-bold">Kütüphane Komuta Merkezi</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<BookOpen size={14} />} label="Toplam Kitap" value={totalBooks} />
        <StatCard icon={<CheckCircle size={14} />} label="Tamamlanan" value={completedCount} accent />
        <StatCard icon={<StickyNote size={14} />} label="Bu Ay Not" value={notesThisMonth} />
        <StatCard icon={<Zap size={14} />} label="Bu Ay Aksiyon" value={actionsThisMonth} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-[6px] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target size={12} className="text-[#F5C518]" />
            <span className="text-[10px] uppercase tracking-widest text-[#555]">Aktif Kitap</span>
          </div>
          <p className="text-white text-sm font-medium">
            {activeBookTitle ?? <span className="text-[#555]">Aktif kitap yok</span>}
          </p>
        </div>

        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-[6px] p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={12} className="text-[#404040]" />
            <span className="text-[10px] uppercase tracking-widest text-[#555]">Sıradaki</span>
          </div>
          <p className="text-[#888] text-sm">
            {nextBookTitle ?? <span className="text-[#555]">—</span>}
          </p>
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-[6px] p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest text-[#555]">Haftalık Okuma Hedefi</span>
          <span className="text-[#F5C518] text-xs font-mono">{weeklyGoalPages} sayfa</span>
        </div>
        <p className="text-[#555] text-xs">Aynı anda sadece 1 aktif ana kitap. Bitmeden sıradakine geçme.</p>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-[6px] p-3">
      <div className={`flex items-center gap-1.5 mb-2 ${accent ? 'text-[#22c55e]' : 'text-[#555]'}`}>
        {icon}
        <span className="text-[9px] uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-2xl font-mono font-bold ${accent ? 'text-[#22c55e]' : 'text-white'}`}>{value}</p>
    </div>
  )
}
