'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import {
  CalendarDays,
  Dumbbell,
  BarChart3,
  Rocket,
  Wallet,
} from 'lucide-react'

// Using ?tab search params because paths are all managed inside page.tsx
const navItems = [
  { href: '/?tab=GUNLUK',   icon: CalendarDays, label: 'Günlük'   },
  { href: '/?tab=SPOR',     icon: Dumbbell,     label: 'Spor'     },
  { href: '/?tab=HAFTALIK', icon: BarChart3,    label: 'Haftalık' },
  { href: '/?tab=KARIYER',  icon: Rocket,       label: 'Kariyer'  },
  { href: '/?tab=FINANS',   icon: Wallet,       label: 'Finans'   },
]

function SidebarInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || 'GUNLUK'

  return (
    <aside className="fixed left-0 top-0 h-full w-[64px] bg-[#0a0a0a]
                      border-r border-[#1a1a1a] flex flex-col items-center
                      py-5 gap-1 z-50">
      
      {/* FG Logo */}
      <div className="w-9 h-9 bg-[#6366f1] rounded-xl flex items-center
                      justify-center mb-6">
        <span className="text-white font-bold text-xs">FG</span>
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
            className={`w-10 h-10 rounded-xl flex items-center justify-center
                        transition-all group relative
                        ${isActive
                          ? 'bg-[#6366f1] text-white'
                          : 'text-[#555555] hover:bg-[#1c1c1c] hover:text-[#aaaaaa]'
                        }`}
          >
            <Icon size={18} strokeWidth={1.8} />
            {/* Tooltip */}
            <span className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#1c1c1c]
                            border border-[#2a2a2a] text-white text-xs rounded-lg
                            opacity-0 group-hover:opacity-100 transition-opacity
                            whitespace-nowrap pointer-events-none shadow-xl z-50">
              {label}
            </span>
          </Link>
        )
      })}

      <div className="flex-1" />

      {/* Avatar */}
      <div className="w-9 h-9 bg-[#1c1c1c] border border-[#6366f1]/50
                      rounded-xl flex items-center justify-center
                      text-[#6366f1] font-semibold text-xs">
        AC
      </div>
    </aside>
  )
}

export function Sidebar() {
  return (
    <React.Suspense fallback={
      <aside className="fixed left-0 top-0 h-full w-[64px] bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col items-center py-5 gap-1 z-50">
        <div className="w-9 h-9 bg-[#6366f1] rounded-xl flex items-center justify-center mb-6">
          <span className="text-white font-bold text-xs">FG</span>
        </div>
      </aside>
    }>
      <SidebarInner />
    </React.Suspense>
  )
}
