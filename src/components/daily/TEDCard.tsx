import React from "react";

interface TEDCardProps {
  title: string;
  speaker: string;
  description: string;
  url: string | null;
  language: string;
  day?: string;
}

export function TEDCard({ title, speaker, description, url, language }: TEDCardProps) {
  return (
    <div className="border border-[#E5DDD4] bg-white rounded-2xl px-6 py-5 hover:border-[#E8956D]/30 shadow-sm transition-all group overflow-hidden relative">
      <div className="flex items-center justify-between mb-4 border-b border-[#E5DDD4]/50 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[#E05C5C] text-sm font-black">TED</span>
          <span className="text-[#B5A090] text-[10px] tracking-[0.2em] font-bold uppercase">
            HAFTASONU ÖNERİSİ
          </span>
        </div>
        <span className="text-[9px] text-[#B5A090] font-bold uppercase px-2 py-0.5 bg-[#F5F1EB] border border-[#E5DDD4] rounded-lg">
          {language === 'en' ? 'ENGLISH' : 'TÜRKÇE'}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h4 className="text-[#2C2420] text-sm font-bold leading-tight group-hover:text-[#E8956D] transition-colors">
            {title}
          </h4>
          <p className="text-[#8B7355] text-[10px] mt-1 font-bold uppercase tracking-tight">{speaker}</p>
        </div>

        <p className="text-[#B5A090] text-xs leading-relaxed italic font-medium opacity-90 line-clamp-3 group-hover:opacity-100 transition-opacity">
          {description}
        </p>

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-full py-3 bg-[#8B7355] text-white rounded-xl text-center text-xs font-bold tracking-widest uppercase hover:bg-[#2C2420] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            VİDEOYU İZLE
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
