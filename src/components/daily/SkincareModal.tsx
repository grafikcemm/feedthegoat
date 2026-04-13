'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { getSkincarePackages, takeSkincarePackage } from '@/app/actions/skincareActions';
import { toggleTemplateTask } from '@/app/actions/taskActions';
import { fireTaskConfetti } from '@/lib/confetti';
import { cn } from '@/utils/cn';

interface SkincarePackage {
  id: string;
  title: string;
  items: string[];
  sort_order: number;
}

interface SkincareModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedPackageIds: string[];
  onPackageTaken: (packageId: string) => void;
  parentTaskId: string;
}

export function SkincareModal({ 
  isOpen, 
  onClose, 
  completedPackageIds, 
  onPackageTaken,
  parentTaskId 
}: SkincareModalProps) {
  const [packages, setPackages] = useState<SkincarePackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isOpen) {
      const fetchPackages = async () => {
        setIsLoading(true);
        const data = await getSkincarePackages();
        setPackages(data);
        setIsLoading(false);
      };
      fetchPackages();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTake = (packageId: string) => {
    // 1. Optimistic UI update
    onPackageTaken(packageId);

    // 2. Server Action
    startTransition(async () => {
      const result = await takeSkincarePackage(packageId, parentTaskId);
      if (!result.success) {
        console.error('[SkincareModal] Failed to take package:', result.error);
      }
    });
  };

  const handleFinalize = async () => {
    startTransition(async () => {
      // Mark parent task as done in daily_completions
      await toggleTemplateTask(parentTaskId, false);
      // Dopamine hit
      fireTaskConfetti();
      // Close modal
      onClose();
    });
  };

  const allTaken = packages.length > 0 && packages.every(p => completedPackageIds.includes(p.id));

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300 px-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#0a0a0a] border border-ftg-border-strong rounded-ftg-shell shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ftg-border-subtle bg-ftg-surface/50">
          <div>
            <h2 className="font-display text-2xl text-ftg-success tracking-tight">KİŞİSEL BAKIM</h2>
            <p className="font-mono text-[10px] text-ftg-text-dim uppercase tracking-[0.2em] mt-1">Günün Rutini</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ftg-danger/10 text-ftg-text-mute hover:text-ftg-danger transition-colors font-mono text-xl"
          >
            ×
          </button>
        </div>

        {/* Banner */}
        {allTaken && (
          <div className="bg-ftg-success/10 border-b border-ftg-success/20 py-2 px-6 flex items-center justify-center gap-2 animate-in slide-in-from-top duration-500">
            <span className="text-ftg-success text-xs">✓</span>
            <span className="font-mono text-[10px] text-ftg-success font-bold tracking-widest uppercase">TÜM BAKIMLAR TAMAMLANDI</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar flex flex-col gap-4">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-2 border-ftg-success/20 border-t-ftg-success rounded-full animate-spin" />
              <span className="font-mono text-[10px] text-ftg-text-mute animate-pulse">VERİLER ÇEKİLİYOR...</span>
            </div>
          ) : (
            <>
              {packages.map(pkg => {
                const isTaken = completedPackageIds.includes(pkg.id);
                return (
                  <div 
                    key={pkg.id}
                    className={cn(
                      "relative group p-4 rounded-ftg-card border transition-all duration-300",
                      isTaken 
                        ? "bg-ftg-success/5 border-ftg-success/30 shadow-[inset_0_0_24px_rgba(34,197,94,0.05)]" 
                        : "bg-ftg-surface border-ftg-border-subtle hover:border-ftg-success/30"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className={cn(
                          "font-mono text-sm font-bold tracking-tight transition-colors",
                          isTaken ? "text-ftg-success" : "text-ftg-text"
                        )}>
                          {pkg.title}
                        </h3>
                        
                        <ul className="mt-3 space-y-1">
                          {pkg.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 font-mono text-xs text-ftg-text-dim">
                              <span className="mt-1.5 shrink-0 w-1 h-1 rounded-sm bg-ftg-success/60 rotate-45" />
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => handleTake(pkg.id)}
                        disabled={isTaken || isPending}
                        className={cn(
                          "shrink-0 px-4 py-2 rounded-ftg-card border font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-300",
                          isTaken 
                            ? "bg-ftg-success text-white border-ftg-success cursor-default" 
                            : "bg-transparent text-ftg-success border-ftg-success hover:bg-ftg-success hover:text-black active:translate-y-0.5"
                        )}
                      >
                        {isTaken ? '✓ TAMAM' : 'TAMAMLA'}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Completion Action */}
              {allTaken && (
                <button
                  onClick={handleFinalize}
                  disabled={isPending}
                  className="w-full mt-4 py-4 bg-ftg-success hover:bg-green-500 text-white font-mono text-xs font-bold tracking-[0.2em] rounded-ftg-card transition-all shadow-xl shadow-green-900/10 active:scale-95 disabled:opacity-50"
                >
                  ✓ TAMAMLANDI — KAPAT
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-ftg-border-subtle bg-ftg-surface/30 flex justify-center">
            <p className="font-mono text-[9px] text-ftg-text-mute italic">Antigravity Skincare Tracking System v1.0</p>
        </div>
      </div>
    </div>
  );
}
