'use client'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface DuaPanelProps {
  quote?: string;
  author?: string;
}

export function DuaPanel({ quote, author }: DuaPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const defaultQuote = "Hayat, fırtınanın dinmesini beklemek değil; yağmurda dans etmeyi öğrenmektir.";
  const defaultAuthor = "SENECA";

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
        className="w-full flex items-center justify-between px-5 py-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[20px] hover:bg-[var(--bg-card-elevated)] hover:border-[var(--border-strong)] transition-all group"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🤲</span>
          <div className="text-left">
            <p className="text-sm font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
              Gece Duası / Rızık & Huzur
            </p>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Günü bitirmeden önce oku</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-[var(--text-tertiary)]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[var(--text-tertiary)]" />
        )}
      </button>

      {isOpen && (
        <div className="bg-[var(--bg-card)] border-x border-b border-[var(--border-subtle)] rounded-b-[20px] animate-in duration-300 overflow-hidden">
          <div className="px-8 py-8 font-sans">
            
            {/* GÜNLÜK SÖZ - EL YAZISI STILI */}
            <div className="mb-8">
              <p style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "15px",
                fontStyle: "italic",
                color: "var(--text-secondary)",
                lineHeight: "1.6"
              }}>
                "{quote || defaultQuote}"
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-px w-6 bg-[var(--border-strong)]" />
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                  {author || defaultAuthor}
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-[#242428] mb-8" />

            <p className="text-[var(--text-secondary)] text-sm leading-relaxed whitespace-pre-line opacity-90">
              {duaMetni}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
