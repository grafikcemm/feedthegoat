'use client'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function DuaPanel() {
  const [isOpen, setIsOpen] = useState(false)

  const duaMetni = `"Rahman ve Rahim olan Allah'ım,
Günün telaşı ve yorgunluğu biterken, her şeyin asıl sahibi olan Sana sığınıyorum. Verdiklerin için hamdolsun, aldıkların için sabır diliyorum. Bu gece kapına; yorgun bir beden, huzur arayan bir ruh ve bitmeyen bir umutla geldim.

Ya Rabbi; Geçmişin yüklerini, yarının kaygılarını ve kalbimi yoran tüm dertleri Senin sonsuz merhametine emanet ediyorum. Sen ki imkansızı mümkün kılansın; gönlümde saklı tuttuğum, kimselere diyemediğim ama senin en iyi bildiğin dertlerime ferahlık ver.

Rabbim; Kalbime sükûnet, zihnime berraklık, haneme huzur nasip eyle. Geleceğimi rızana uygun eyle, ayaklarımı doğru yolun üzere sabit kıl. Nefsimin şerrinden, dünyanın bitmek bilmeyen hırslarından beni koru.

Ya Şâfî; Ruhumdaki ve bedenimdeki tüm yaralara şifa ver. Yarın uyandığımda, Senin rızanla dolu bir güne huzurla, şükürle ve umutla uyanmayı nasip eyle. Sevdiklerimi koru, onları her türlü kaza ve beladan muhafaza buyur.

Ey her şeyi işiten ve dua edenlerin duasını karşılıksız bırakmayan Allah'ım; Beni affet, beni yolunda daim eyle. Amin."`

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#141414] border border-[#2a2a2a] rounded-2xl hover:border-[#6366f1]/30 transition-all group"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🤲</span>
          <div className="text-left">
            <p className="text-sm font-semibold text-[#ababab] group-hover:text-[#6366f1] transition-colors">
              Gece Duası / Rızık & Huzur
            </p>
            <p className="text-xs text-[#666666] mt-0.5">Günü bitirmeden önce oku</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-[#666666]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#666666]" />
        )}
      </button>

      {isOpen && (
        <div className="bg-[#141414] border-x border-b border-[#6366f1]/30 rounded-b-2xl animate-in duration-500 overflow-hidden">
          <div className="px-6 py-6 font-sans">
            <p className="text-[#ababab] text-sm leading-relaxed whitespace-pre-line">
              {duaMetni}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
