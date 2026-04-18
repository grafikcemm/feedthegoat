'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import React, { useState } from 'react'
import {
  CalendarDays,
  Rocket,
  Archive,
  BarChart3,
  Dumbbell,
  Wallet
} from 'lucide-react'

const navItems = [
  { href: '/?tab=GUNLUK',  icon: CalendarDays, label: 'Ana Sayfa' },
  { href: '/?tab=KARIYER', icon: Rocket,        label: 'Kariyer'   },
]

function SidebarInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || 'GUNLUK'

  const [isArchiveOpen, setIsArchiveOpen] = useState(false)

  return (
    <aside
      suppressHydrationWarning
      className="fixed left-0 top-0 h-full w-[64px] bg-[var(--bg-primary)]
                      border-r border-[var(--border-subtle)] flex flex-col items-center
                      py-5 gap-1 z-50">

      {/* FG Logo — white bg, black text */}
      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center mb-6">
        <span className="text-black font-bold text-xs">FG</span>
      </div>

      {/* Nav Items */}
      {navItems.map(({ href, icon: Icon, label }) => {
        const itemTab = new URLSearchParams(href.split('?')[1]).get('tab')
        const isActive = pathname === '/' && currentTab === itemTab

        return (
          <Link
            key={href}
            href={href}
            title={label}
            suppressHydrationWarning
            className={`w-10 h-10 rounded-xl flex items-center justify-center
                        transition-all group relative
                        ${isActive
                          ? 'bg-white/10 border-r-2 border-r-white text-white'
                          : 'text-[var(--text-tertiary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                        }`}
          >
            <Icon size={18} strokeWidth={1.5} />
            {/* Tooltip */}
            <span className="absolute left-full ml-2 px-2.5 py-1.5 bg-[var(--bg-card-elevated)]
                            border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs rounded-lg
                            opacity-0 group-hover:opacity-100 transition-opacity
                            whitespace-nowrap pointer-events-none z-50">
              {label}
            </span>
          </Link>
        )
      })}

      {/* Archive Group */}
      <div className="relative group flex flex-col items-center">
        <button
          onClick={() => setIsArchiveOpen(!isArchiveOpen)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center
                      transition-all hover:bg-white/5
                      ${isArchiveOpen
                        ? 'bg-white/10 text-[var(--text-primary)]'
                        : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
        >
          <Archive size={18} strokeWidth={1.5} />
          {!isArchiveOpen && (
            <span className="absolute left-full ml-2 px-2.5 py-1.5 bg-[var(--bg-card-elevated)]
                            border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs rounded-lg
                            opacity-0 group-hover:opacity-100 transition-opacity
                            whitespace-nowrap pointer-events-none z-50">
              Arşiv
            </span>
          )}
        </button>

        {/* Floating Collapsible Menu */}
        {isArchiveOpen && (
          <div suppressHydrationWarning className="absolute left-full top-0 ml-2 w-40 bg-[var(--bg-card-elevated)]
                          border border-[var(--border-subtle)] rounded-xl py-2 z-50
                          flex flex-col animate-slide-in-right"
               style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>

            <Link href="/arsiv/spor" onClick={() => setIsArchiveOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--bg-card)] transition-colors text-sm text-[var(--text-primary)]">
              <Dumbbell size={16} strokeWidth={1.5} />
              Spor
            </Link>

            <Link href="/arsiv/haftalik" onClick={() => setIsArchiveOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--bg-card)] transition-colors text-sm text-[var(--text-primary)]">
              <BarChart3 size={16} strokeWidth={1.5} />
              Haftalık
            </Link>

            <Link href="/arsiv/finans" onClick={() => setIsArchiveOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--bg-card)] transition-colors text-sm text-[var(--text-primary)]">
              <Wallet size={16} strokeWidth={1.5} />
              Finans
            </Link>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Avatar */}
      <div className="w-9 h-9 bg-[var(--bg-card-elevated)] border border-[var(--border-strong)]
                      rounded-xl flex items-center justify-center
                      text-[var(--text-primary)] font-semibold text-xs">
        AC
      </div>
    </aside>
  )
}

export function Sidebar() {
  return (
    <React.Suspense fallback={
      <aside className="fixed left-0 top-0 h-full w-[64px] bg-[var(--bg-primary)] border-r border-[var(--border-subtle)] flex flex-col items-center py-5 gap-1 z-50">
        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center mb-6">
          <span className="text-black font-bold text-xs">FG</span>
        </div>
      </aside>
    }>
      <SidebarInner />
    </React.Suspense>
  )
}
