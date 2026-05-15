'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import {
  CalendarDays,
  Wallet,
  GraduationCap,
  Layers,
  Rocket,
} from 'lucide-react'

const navItems = [
  { href: '/?tab=GUNLUK',   icon: CalendarDays, label: 'Günlük'            },
  { href: '/?tab=RITIMLER', icon: Layers,        label: 'Ritimler'          },
  { href: '/?tab=BESLENME', icon: GraduationCap, label: 'Beslenme'          },
  { href: '/?tab=GELISIM',  icon: Rocket,        label: 'Gelişim Merdiveni' },
  { href: '/?tab=FINANS',   icon: Wallet,        label: 'Finans Komuta'     },
]

function SidebarInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || 'GUNLUK'

  return (
    <aside
      suppressHydrationWarning
      className="fixed left-0 top-0 h-full w-[64px] bg-[#0A0A0A]
                      border-r border-[#1E1E1E] flex flex-col items-center
                      py-5 gap-1 z-50">

      {/* FG Logo */}
      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center mb-4">
        <span className="text-black font-bold text-xs">FG</span>
      </div>

      {/* Nav Items */}
      {navItems.map(({ href, icon: Icon, label }) => {
        const hrefTab = href.includes('?') ? new URLSearchParams(href.split('?')[1]).get('tab') : null
        const isActive = hrefTab
          ? pathname === '/' && currentTab === hrefTab
          : pathname.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            title={label}
            suppressHydrationWarning
            className={`w-10 h-10 rounded-xl flex items-center justify-center
                        transition-all group relative
                        ${isActive
                          ? 'bg-[#1A1A1A] border-r-2 border-r-[#F5C518] text-[#F5C518]'
                          : 'text-[#888888] hover:bg-[#1A1A1A] hover:text-white'
                        }`}
          >
            <Icon size={18} strokeWidth={1.5} />
            {/* Tooltip */}
            <span className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#111111]
                            border border-[#1E1E1E] text-white text-xs rounded-lg
                            opacity-0 group-hover:opacity-100 transition-opacity
                            whitespace-nowrap pointer-events-none z-50">
              {label}
            </span>
          </Link>
        )
      })}

      <div className="flex-1" />

      {/* Avatar */}
      <div className="w-9 h-9 bg-[#111111] border border-[#1E1E1E]
                      rounded-xl flex items-center justify-center
                      text-white font-semibold text-xs">
        AC
      </div>
    </aside>
  )
}

export function Sidebar() {
  return (
    <React.Suspense fallback={
      <aside className="fixed left-0 top-0 h-full w-[64px] bg-[#0A0A0A] border-r border-[#1E1E1E] flex flex-col items-center py-5 gap-1 z-50">
        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center mb-4">
          <span className="text-black font-bold text-xs">FG</span>
        </div>
      </aside>
    }>
      <SidebarInner />
    </React.Suspense>
  )
}
