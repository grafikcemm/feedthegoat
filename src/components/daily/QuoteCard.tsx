import React from "react";

interface QuoteCardProps {
  quote?: string;
  author?: string;
}

export function QuoteCard({ quote, author }: QuoteCardProps) {
  const defaultQuote = "Hayat, fırtınanın dinmesini beklemek değil; yağmurda dans etmeyi öğrenmektir.";
  const defaultAuthor = "SENECA";

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl px-4 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
         <span className="text-8xl font-black text-[#6366f1]">"</span>
      </div>

      <div className="flex items-center gap-2 mb-6 border-b border-[#2a2a2a]/60 pb-3">
        <span className="text-[#6366f1] text-sm font-black italic">"</span>
        <span className="text-[10px] font-semibold tracking-widest uppercase text-[#555555] mb-3">
          GÜNLÜK SÖZ
        </span>
      </div>
      
      <p className="text-sm italic text-[#888888] leading-relaxed relative z-10">
        “{quote || defaultQuote}”
      </p>
      
      <div className="mt-8 flex justify-end">
        <div className="flex flex-col items-end">
          <div className="h-px w-8 bg-[#2a2a2a] mb-2" />
          <span className="text-[#666666] text-[10px] font-black uppercase tracking-[0.2em]">
            {author || defaultAuthor}
          </span>
        </div>
      </div>
    </div>
  );
}
