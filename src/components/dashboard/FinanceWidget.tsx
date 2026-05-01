'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { createBrowserSupabase } from '@/lib/supabaseClient';
import { format } from 'date-fns';
import { computeFinanceSummary } from '@/lib/financeCalc';

export function FinanceWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFinance() {
      const supabase = createBrowserSupabase();
      const currentMonth = format(new Date(), "yyyy-MM");
      const [{ data: transactions = [] }] = await Promise.all([
        supabase
          .from("finance_transactions")
          .select("id, amount, type, title, created_at, month")
          .eq("month", currentMonth)
          .order("created_at", { ascending: false }),
      ]);
      const incomeItems = (transactions || []).filter((t: any) => t.type === "income");
      const expenseItems = (transactions || []).filter((t: any) => t.type === "expense");
      const sumIncome = incomeItems.reduce((acc: number, t: any) => acc + (t.amount || 0), 0);
      const sumExpense = expenseItems.reduce((acc: number, t: any) => acc + (t.amount || 0), 0);
      const summary = computeFinanceSummary(sumIncome, sumExpense, 0);
      setData({ 
        summary, 
        totalIncome: sumIncome, 
        totalExpense: sumExpense,
        netAmount: sumIncome - sumExpense,
        recentTransactions: transactions?.slice(0, 3) || [] 
      });
      setLoading(false);
    }
    fetchFinance();
  }, []);

  const GOAL = 120000;
  const percent = data ? Math.min(Math.round((data.totalIncome / GOAL) * 100), 100) : 0;

  const baseClass = "fixed bottom-6 right-6 w-80 z-50 max-md:w-[calc(100%-48px)]";

  if (!isOpen) {
    const isNegative = data && data.netAmount < 0;
    return (
      <div
        onClick={() => setIsOpen(true)}
        className={`${baseClass} bg-[#111111] border border-[#1E1E1E] rounded-xl p-4 cursor-pointer hover:bg-[#1A1A1A] transition-all flex items-center justify-between shadow-2xl`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <span className="text-lg font-semibold text-[#F5C518]">₺</span>
          </div>
          <span className={cn(
            "font-mono text-sm font-bold tabular-nums",
            isNegative ? "text-[#EF4444]" : "text-[#F5C518]"
          )}>
            {loading ? '...' : `₺${data?.netAmount.toLocaleString('tr-TR')}`}
          </span>
        </div>
        <ChevronUp size={16} className="text-[#888888]" />
      </div>
    );
  }

  return (
    <div
      className={`${baseClass} bg-[#111111] rounded-xl border border-[#1E1E1E] p-5`}
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
    >
      <div className="flex items-center justify-between mb-6">
        <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-[var(--text-tertiary)]">
          FİNANS
        </span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-[var(--bg-primary)] rounded w-1/2" />
          <div className="h-4 bg-[var(--bg-primary)] rounded w-full" />
          <div className="space-y-2 pt-4">
            <div className="h-3 bg-[var(--bg-primary)] rounded w-full" />
            <div className="h-3 bg-[var(--bg-primary)] rounded w-full" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Main Metric */}
          <div>
            <div className="text-[var(--text-tertiary)] text-[11px] uppercase tracking-[0.12em] mb-1">BU AY NET DURUM</div>
            <div className={cn(
               "font-mono text-[28px] font-bold tabular-nums leading-none",
               data && data.netAmount < 0 ? "text-[#EF4444]" : "text-[var(--text-primary)]"
            )}>
              ₺{data?.netAmount.toLocaleString('tr-TR')}
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-[12px] mb-2">
              <span className="text-[var(--text-secondary)]">120k hedefine ilerleme</span>
              <span className="text-[var(--text-primary)] font-bold">%{percent}</span>
            </div>
            <div className="h-1.5 w-full bg-[var(--bg-primary)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
              <div
                className="h-full bg-white transition-all duration-1000 rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Last 3 Transactions */}
          <div className="space-y-2.5">
            <div className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-[0.12em]">SON İŞLEMLER</div>
            {data?.recentTransactions.map((t: any) => (
              <div key={t.id} className="flex justify-between items-center text-[13px]">
                <span className="text-[var(--text-primary)] truncate max-w-[160px]">{t.title}</span>
                <span className={`tabular-nums font-medium ${t.type === 'income' ? 'text-[var(--success)]' : 'text-[var(--text-secondary)]'}`}>
                  {t.type === 'income' ? '+' : '-'}₺{t.amount.toLocaleString('tr-TR')}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Link */}
          <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-end">
            <Link
              href="/arsiv/finans"
              className="text-white text-[13px] font-medium hover:underline flex items-center gap-1 transition-all"
            >
              Detay →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
