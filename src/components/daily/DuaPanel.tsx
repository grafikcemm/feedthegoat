'use client'

import React, { useState } from 'react'
import { cn } from '@/utils/cn'

const DUA_METNI = `Allah'ım,
Kalbimde taşıdığım gelecek kaygılarını Sana bırakıyorum. Görmediğim yarınları Sen görürsün, bilmediğim yolları Sen bilirsin. İçimi daraltan korkuları ferahlığa, zihnimi yoran endişeleri huzura çevir. Bana her şeyin Senin izninle olduğunu unutmayan sakin bir kalp ver.

Özgüvensizlik düştüğünde bana kendi değerimi hatırlat. Beni başkalarıyla kıyaslayan düşüncelerden uzaklaştır. Eksiklerime takılıp kalmak yerine bana verdiğin nimetleri, yetenekleri ve fırsatları görebilmeyi nasip et. Kendime güvenimi kibirden değil, Senin desteğinden alan bir kul olayım.

Rızkımı bereketli, helal ve hayırlı eyle. Emek verdiğim işlerde kolaylık ver. Zihnime açıklık, kararlarıma isabet, çalışmalarımda verimlilik nasip et. Kapalı kapıları hayrımla aç, bana nasip olmayanı kalbimden çıkar, nasibim olanı ise en güzel zamanda bana ulaştır. Borçtan, darlıktan, çaresizlikten Sana sığınırım.

Beni gelecekte başarılı, faydalı, güçlü ve güzel ahlaklı bir insan eyle. Başarıyı sadece sonuçta değil; sabırda, disiplinde, istikrarda ve niyette de görebilmeyi öğret. Bana büyük hayaller ver ama o hayalleri taşıyacak sağlam bir karakter de ver. Ayağımı kaydıracak kibirden, tembellikten, ertelemeden ve korkudan beni koru.

İsteklerimi Sen biliyorsun. Kalbimde kurduğum güzel bir gelecek, huzurlu bir hayat, bereketli bir kazanç, güvenli bir yol ve içime sinen bir başarı istiyorum. Hakkımda hayırlı olanı nasip et. Hakkımda hayırsız olanı benden uzaklaştır. Bana, istediğim şeylerin peşinden giderken Senin rızanı unutmamayı nasip et.

Bugün sahip olduklarım için Sana şükrediyorum. Nefesim için, sağlığım için, aklım için, sevdiklerim için, elimdeki imkanlar için Sana hamd olsun. Henüz sahip olmadıklarıma üzülürken, bana verdiklerini görmezden gelenlerden eyleme. Şu anki halime şükreden, ama daha iyisi için de güzelce çalışan kullarından olayım.

Geçmişin yükünü hafiflet, bugünün kıymetini öğret, yarının korkusunu kalbimden çıkar. Bana teslimiyet ver, ama pasiflik verme. Bana umut ver, ama boş hayal verme. Bana çalışma gücü ver, ama tükenmişlik verme. Bana cesaret ver, ama haddimi aşan bir gurur verme.

Her gece içimdeki kırgınlığı, korkuyu ve yorgunluğu Sana bırakıyorum. Uyurken kalbimi huzurla doldur, sabaha umutla uyandır. Yarınlara korkuyla değil, güvenle; eksiklik duygusuyla değil, şükürle; dağınıklıkla değil, niyet ve disiplinle başlamayı nasip et.

Beni kendi gözümde küçük düşüren düşüncelerden kurtar. Bana kendime inanmayı, emek vermeyi, sabretmeyi ve vazgeçmemeyi öğret. Yol uzun olsa da kalbimi sağlam tut. Sonumu hayırlı, yolumu açık, nasibimi güzel, iç huzurumu daim eyle.

Âmin.`

export function DuaPanel() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={cn(
        'border border-ftg-border-subtle rounded-ftg-card overflow-hidden transition-all duration-300',
        isOpen ? 'bg-ftg-surface/30' : 'bg-transparent'
      )}
    >
      {/* Header — More prominent */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3
                   bg-zinc-900 border border-zinc-700 rounded-lg
                   text-left hover:border-zinc-500 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <span className="text-zinc-300 text-xs tracking-widest font-medium">🤲 DUA</span>
          <span className="text-zinc-600 text-[10px]">— Günü bitirmeden önce oku</span>
        </div>
        <span className="text-zinc-500 text-xs transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>

      {/* İçerik */}
      {isOpen && (
        <div className="px-5 pb-6 pt-1 border-t border-ftg-border-subtle">
          <p className="font-mono text-[13px] text-ftg-text-dim leading-[2] whitespace-pre-line">
            {DUA_METNI}
          </p>
        </div>
      )}
    </div>
  )
}
