"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { completeTask } from "@/app/actions/completeTask";

interface XPostSectionProps {
  task?: any;
  isDone: boolean;
}

export function XPostSection({ task, isDone }: XPostSectionProps) {
  const [isDoneOptimistic, setIsDoneOptimistic] = useState(isDone);

  const handleShare = async () => {
    if (!task) return;
    
    // In a real app, this would open X share dialog
    // For now, we just complete the task
    
    if (!isDoneOptimistic) {
        setIsDoneOptimistic(true);
        import('@/lib/confetti').then(m => m.fireTaskConfetti());
        try {
            await completeTask(task.id);
        } catch (err) {
            console.error("Failed to complete X task:", err);
            setIsDoneOptimistic(false);
        }
    }
  };

  return (
    <div className={cn(
        "border rounded-2xl px-6 py-5 transition-all group relative overflow-hidden",
        isDoneOptimistic 
            ? "border-[#2a2a2a] bg-[#141414] opacity-70" 
            : "bg-[#141414] border-[#6366f1]/40 hover:border-[#6366f1]/60 shadow-[0_4px_20px_rgba(99,102,241,0.15)]"
    )}>
      <div className="flex items-center justify-between mb-4 border-b border-[#2a2a2a]/50 pb-2">
        <span className="text-[#6366f1] text-[10px] tracking-[0.2em] font-bold uppercase">
          X GELİŞİM RAPORU
        </span>
        <span className="text-[#666666] text-[9px] border border-[#2a2a2a] rounded px-2 py-0.5 uppercase tracking-wider">
          AKTİF SİSTEM
        </span>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="bg-[#0a0a0a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-[#ababab] text-sm leading-relaxed italic">
            "Sistem, disiplin ve istikrar üzerine kuruludur. Bugünün küçük bir başarısı, yarının büyük bir karakter zaferidir."
          </p>
        </div>
        
        <button 
          onClick={handleShare}
          disabled={isDoneOptimistic}
          className={cn(
            "w-full py-3.5 rounded-xl text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2",
            isDoneOptimistic
                ? "bg-[#1c1c1c] text-[#666666] cursor-default"
                : "bg-[#6366f1] text-white hover:bg-[#4f46e5] hover:scale-[1.01] active:scale-[0.98] shadow-sm shadow-[#6366f1]/30"
          )}
        >
          <span>{isDoneOptimistic ? "PAYLAŞILDI" : "GÜNÜ PAYLAŞ"}</span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
