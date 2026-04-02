"use client";

export default function CareerHeader() {
  return (
    <div className="brutalist-card border-2 border-text bg-surface mb-6 p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <span className="text-8xl font-black">🎯</span>
      </div>
      
      <div className="relative z-10 w-full md:w-4/5">
        <h2 className="text-sm md:text-base font-bold uppercase tracking-[0.2em] text-text mb-6 pb-2 border-b border-border w-max">
          KARİYER OMURGASI
        </h2>

        <div className="space-y-3 font-mono text-xs md:text-sm">
          <div className="flex gap-4 items-start">
            <span className="shrink-0 w-6 opacity-70">🎯</span>
            <div><span className="text-text-muted uppercase tracking-widest text-[10px] block lg:inline-block w-36">Ana Yön:</span> <span className="font-bold text-white">B2B AaaS Builder & AI-Native Creative Orchestrator</span></div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="shrink-0 w-6 opacity-70">💰</span>
            <div><span className="text-text-muted uppercase tracking-widest text-[10px] block lg:inline-block w-36">Ana Gelir Motoru:</span> <span className="text-gray-300">Voice Agent çözümleri + AI Workflow Systems + Retainer</span></div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="shrink-0 w-6 opacity-70">🎨</span>
            <div><span className="text-text-muted uppercase tracking-widest text-[10px] block lg:inline-block w-36">Yardımcı Motor:</span> <span className="text-gray-300">Creator-led dijital ürünler, template, prompt, topluluk</span></div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="shrink-0 w-6 opacity-70">🛡️</span>
            <div><span className="text-text-muted uppercase tracking-widest text-[10px] block lg:inline-block w-36">Fiziksel Sigorta:</span> <span className="text-accent-red font-bold">İHA-1 Drone → KNX Akıllı Ev</span></div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="shrink-0 w-6 opacity-70">🧠</span>
            <div><span className="text-text-muted uppercase tracking-widest text-[10px] block lg:inline-block w-36">Karar Filtresi:</span> <span className="italic text-gray-400">"Bu yeni araç B2B ajanlarımı daha iyi yapıyor mu?" <span className="text-accent-green not-italic ml-1">Evet → 2 saat test.</span> <span className="text-accent-red not-italic ml-1">Hayır → 12 ay görmezden gel.</span></span></div>
          </div>
        </div>

        <div className="mt-8 pt-4 flex flex-col sm:flex-row gap-4">
          <div className="bg-surface-hover border border-border p-3 flex-1 flex flex-col gap-2">
             <span className="text-[9px] uppercase tracking-widest text-accent-green font-bold">Şu An Odaklanılacak 3 Konu:</span>
             <span className="text-xs font-bold">Prompt Systems · n8n Pipeline · Voice Agent Prototip</span>
          </div>
          <div className="bg-red-950/20 border border-red-900/30 p-3 flex-1 flex flex-col gap-2 opacity-80">
             <span className="text-[9px] uppercase tracking-widest text-accent-red font-bold">Şimdilik Dokunma:</span>
             <span className="text-xs text-text-muted/80 line-through decoration-accent-red/50">After Effects · Python/JS syntax · UX Sertifikaları</span>
          </div>
        </div>
      </div>
    </div>
  );
}
