'use client';

import React, { useState } from 'react';
import {
  AlertTriangle, Loader2, Plus, Pencil, Trash2, X, Check,
  BookOpen, Dumbbell, Wallet,
} from 'lucide-react';
import {
  HAZIRAN_TOTAL_INCOME,
  HAZIRAN_TOTAL_EXPENSE,
  HAZIRAN_NET,
  HAZIRAN_MODE,
  HAZIRAN_RULE,
} from '@/data/financeSeed';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useDebtService } from '@/hooks/useDebtService';
import { usePlannedExpenses, calcMonthlyExpense, type PlannedExpense, type NewExpenseInput, type ExpenseCategory, type ExpenseFrequency, type ExpenseStatus } from '@/hooks/usePlannedExpenses';
import { SubscriptionManager } from './SubscriptionManager';
import { DebtServiceCompact } from './DebtServiceCompact';
import { BleedingCategoriesPanel } from './BleedingCategoriesPanel';
import { FinancePeakCard } from './FinancePeakCard';
import { CashFlowSimulator } from './CashFlowSimulator';
import { PurchaseCheckCard } from './PurchaseCheckCard';
import { AddTransactionForm } from './AddTransactionForm';

// ── Planned Expense helpers ───────────────────────────────────────────────────

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  education: 'Eğitim',
  sport: 'Spor',
  subscription: 'Abonelik',
  debt: 'Borç',
  personal: 'Kişisel',
  other: 'Diğer',
};
const FREQUENCY_LABELS: Record<ExpenseFrequency, string> = {
  monthly: 'Aylık',
  one_time: 'Tek seferlik',
  quarterly: '3 Aylık',
  unknown: 'Bilinmiyor',
};
const STATUS_LABELS: Record<ExpenseStatus, string> = {
  planned: 'Planlanan',
  active: 'Aktif',
  paid: 'Ödendi',
  archived: 'Arşiv',
};

const categoryIcon = (cat: ExpenseCategory) => {
  if (cat === 'education') return <BookOpen size={14} className="text-[#3b82f6]" />;
  if (cat === 'sport') return <Dumbbell size={14} className="text-[#22c55e]" />;
  return <Wallet size={14} className="text-[#888]" />;
};

const statusChip = (status: ExpenseStatus) => {
  const map: Record<ExpenseStatus, React.ReactElement> = {
    planned: <span className="text-[9px] bg-[#3b82f6]/10 text-[#3b82f6] px-1.5 py-px rounded font-bold tracking-wide uppercase">Planlanan</span>,
    active: <span className="text-[9px] bg-[#22c55e]/10 text-[#22c55e] px-1.5 py-px rounded font-bold tracking-wide uppercase">Aktif</span>,
    paid: <span className="text-[9px] bg-[#888]/10 text-[#888] px-1.5 py-px rounded font-bold tracking-wide uppercase">Ödendi</span>,
    archived: <span className="text-[9px] bg-[#444]/10 text-[#444] px-1.5 py-px rounded font-bold tracking-wide uppercase">Arşiv</span>,
  };
  return map[status] ?? null;
};

const EMPTY_EXPENSE: Omit<NewExpenseInput, 'currency'> = {
  title: '',
  amount: 0,
  category: 'other',
  frequency: 'monthly',
  status: 'planned',
  note: '',
};

interface ExpenseFormProps {
  initial?: Omit<NewExpenseInput, 'currency'>;
  onSave: (data: NewExpenseInput) => void;
  onCancel: () => void;
  title: string;
}

function ExpenseForm({ initial = EMPTY_EXPENSE, onSave, onCancel, title }: ExpenseFormProps) {
  const [form, setForm] = useState(initial);
  const set = <K extends keyof typeof EMPTY_EXPENSE>(k: K, v: typeof EMPTY_EXPENSE[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount) return;
    onSave({ ...form, currency: 'TRY' });
  };

  const inputClass = 'w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#333] focus:outline-none focus:border-[#2a2a2a] transition-colors';
  const labelClass = 'text-[9px] uppercase tracking-wider text-[#444] font-bold block mb-1';

  return (
    <form onSubmit={handleSubmit} className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-white font-medium">{title}</span>
        <button type="button" onClick={onCancel} className="text-[#444] hover:text-white transition-colors"><X size={14} /></button>
      </div>
      <div>
        <label className={labelClass}>Başlık</label>
        <input className={inputClass} placeholder="Gider adı" value={form.title} onChange={e => set('title', e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Tutar (TL)</label>
          <input type="number" className={inputClass} placeholder="0" min={0} value={form.amount || ''} onChange={e => set('amount', Number(e.target.value))} required />
        </div>
        <div>
          <label className={labelClass}>Kategori</label>
          <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value as ExpenseCategory)}>
            {(Object.keys(CATEGORY_LABELS) as ExpenseCategory[]).map(k => (
              <option key={k} value={k}>{CATEGORY_LABELS[k]}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Frekans</label>
          <select className={inputClass} value={form.frequency} onChange={e => set('frequency', e.target.value as ExpenseFrequency)}>
            {(Object.keys(FREQUENCY_LABELS) as ExpenseFrequency[]).map(k => (
              <option key={k} value={k}>{FREQUENCY_LABELS[k]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Durum</label>
          <select className={inputClass} value={form.status} onChange={e => set('status', e.target.value as ExpenseStatus)}>
            {(Object.keys(STATUS_LABELS) as ExpenseStatus[]).map(k => (
              <option key={k} value={k}>{STATUS_LABELS[k]}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Not (opsiyonel)</label>
        <textarea className={inputClass} placeholder="Ek not..." rows={2} value={form.note || ''} onChange={e => set('note', e.target.value)} />
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" className="flex-1 flex items-center justify-center gap-1.5 bg-[#F5C518]/10 border border-[#F5C518]/25 text-[#F5C518] text-[11px] font-medium py-2 rounded-lg hover:bg-[#F5C518]/15 transition-all">
          <Check size={12} />Kaydet
        </button>
        <button type="button" onClick={onCancel} className="flex-1 text-[#444] text-[11px] border border-[#1f1f1f] py-2 rounded-lg hover:text-[#666] transition-colors">
          İptal
        </button>
      </div>
    </form>
  );
}

function PlannedExpenseCard({ item, onEdit, onDelete }: { item: PlannedExpense; onEdit: (i: PlannedExpense) => void; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const monthly = calcMonthlyExpense(item);

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg overflow-hidden">
      <div className="p-3 flex items-center gap-3">
        <div className="shrink-0 cursor-pointer" onClick={() => setExpanded(v => !v)}>{categoryIcon(item.category)}</div>
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded(v => !v)}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-white font-medium">{item.title}</span>
            {statusChip(item.status)}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs font-mono text-[#f59e0b]">
              {item.amount.toLocaleString('tr-TR')} TL
              {item.durationMonths && <span className="text-[#555] text-[10px] ml-1">/ {item.durationMonths} ay</span>}
            </span>
            {item.durationMonths && monthly !== item.amount && (
              <span className="text-[10px] text-[#555]">≈ {monthly.toLocaleString('tr-TR')} TL/ay</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onEdit(item)} className="w-6 h-6 flex items-center justify-center text-[#2a2a2a] hover:text-[#666] transition-colors"><Pencil size={11} /></button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button onClick={() => onDelete(item.id)} className="text-[10px] text-[#ef4444] border border-[#ef4444]/30 px-2 py-px rounded hover:bg-[#ef4444]/10">Sil</button>
              <button onClick={() => setConfirmDelete(false)} className="text-[10px] text-[#444] border border-[#1f1f1f] px-2 py-px rounded">İptal</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="w-6 h-6 flex items-center justify-center text-[#2a2a2a] hover:text-[#ef4444] transition-colors"><Trash2 size={11} /></button>
          )}
        </div>
      </div>
      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t border-[#1a1a1a] space-y-1 mt-0">
          <div className="flex flex-wrap gap-3 mt-2">
            <div>
              <span className="text-[9px] text-[#333] uppercase tracking-wider block">Kategori</span>
              <span className="text-[11px] text-[#555]">{CATEGORY_LABELS[item.category]}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#333] uppercase tracking-wider block">Frekans</span>
              <span className="text-[11px] text-[#555]">{FREQUENCY_LABELS[item.frequency]}</span>
            </div>
          </div>
          {item.note && <p className="text-xs text-[#666] leading-relaxed">{item.note}</p>}
          {item.startNote && <p className="text-[10px] text-[#555]">{item.startNote}</p>}
        </div>
      )}
    </div>
  );
}

// ── AI Finance Panel ──────────────────────────────────────────────────────────

interface AIFinanceInsight {
  status: 'safe' | 'attention' | 'critical';
  summary: string;
  recommendedActions: string[];
  avoidThisMonth: string[];
  subscriptionActions: string[];
  debtServiceNotes: string[];
  bleedingWarnings: string[];
  assistantNote: string;
}

function AIFinancePanel({
  subscriptionTotal,
  debtServiceTotal,
  plannedTotal,
}: {
  subscriptionTotal: number;
  debtServiceTotal: number;
  plannedTotal: number;
}) {
  const [insight, setInsight] = useState<AIFinanceInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadInsight = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/ai/finance-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalIncome: HAZIRAN_TOTAL_INCOME,
          totalExpense: HAZIRAN_TOTAL_EXPENSE,
          net: HAZIRAN_NET,
          subscriptionTotal,
          debtServiceTotal,
          plannedTotal,
          mode: HAZIRAN_MODE,
          rule: HAZIRAN_RULE,
        }),
      });
      if (!res.ok) throw new Error('api error');
      const data = await res.json();
      setInsight(data as AIFinanceInsight);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = { safe: '#22c55e', attention: '#f59e0b', critical: '#ef4444' };

  if (!insight && !loading) {
    return (
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#444] font-bold block">AI Finans Yorumu</span>
            <p className="text-xs text-[#555] mt-0.5">Haziran verileri üzerinden kısa analiz</p>
          </div>
          <button onClick={loadInsight} className="text-[11px] bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#f59e0b]/30 px-3 py-1.5 rounded-lg transition-all">
            Analiz et
          </button>
        </div>
        {error && <p className="text-[11px] text-[#ef4444] mt-2">Bağlantı hatası. Tekrar dene.</p>}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 flex items-center gap-3">
        <Loader2 size={16} className="text-[#f59e0b] animate-spin" />
        <span className="text-xs text-[#555]">AI finans verileri analiz ediyor...</span>
      </div>
    );
  }

  if (!insight) return null;

  const color = statusColor[insight.status] || '#888';

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg overflow-hidden">
      <div className="p-3 border-b border-[#1a1a1a] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="text-[10px] uppercase tracking-widest text-[#444] font-bold">AI Finans Yorumu</span>
        </div>
        <button onClick={loadInsight} className="text-[10px] text-[#444] hover:text-[#888] transition-colors">Yenile</button>
      </div>
      <div className="p-3 space-y-3">
        <p className="text-xs text-[#888] leading-relaxed">{insight.summary}</p>

        {insight.recommendedActions?.length > 0 && (
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#22c55e] font-bold block mb-1.5">Önerilen Aksiyonlar</span>
            <ul className="space-y-1">
              {insight.recommendedActions.map((a, i) => (
                <li key={i} className="text-[11px] text-[#666] flex gap-1.5"><span className="text-[#22c55e] shrink-0">→</span>{a}</li>
              ))}
            </ul>
          </div>
        )}

        {insight.avoidThisMonth?.length > 0 && (
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#ef4444] font-bold block mb-1.5">Bu Ay Kaçın</span>
            <ul className="space-y-1">
              {insight.avoidThisMonth.map((a, i) => (
                <li key={i} className="text-[11px] text-[#666] flex gap-1.5"><span className="text-[#ef4444] shrink-0">✕</span>{a}</li>
              ))}
            </ul>
          </div>
        )}

        {insight.subscriptionActions?.length > 0 && (
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#f59e0b] font-bold block mb-1.5">Abonelik Önerileri</span>
            <ul className="space-y-1">
              {insight.subscriptionActions.map((a, i) => (
                <li key={i} className="text-[11px] text-[#666] flex gap-1.5"><span className="text-[#f59e0b] shrink-0">·</span>{a}</li>
              ))}
            </ul>
          </div>
        )}

        {insight.debtServiceNotes?.length > 0 && (
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#888] font-bold block mb-1.5">Borç Servis Notları</span>
            <ul className="space-y-1">
              {insight.debtServiceNotes.map((a, i) => (
                <li key={i} className="text-[11px] text-[#555] flex gap-1.5"><span className="text-[#444] shrink-0">—</span>{a}</li>
              ))}
            </ul>
          </div>
        )}

        {insight.bleedingWarnings?.length > 0 && (
          <div className="flex items-start gap-1.5">
            <AlertTriangle size={11} className="text-[#f59e0b] mt-0.5 shrink-0" />
            <div>
              <span className="text-[9px] uppercase tracking-wider text-[#f59e0b] font-bold block mb-1">Kanama Uyarıları</span>
              {insight.bleedingWarnings.map((w, i) => (
                <p key={i} className="text-[11px] text-[#555]">{w}</p>
              ))}
            </div>
          </div>
        )}

        {insight.assistantNote && (
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded px-2.5 py-2">
            <p className="text-[11px] text-[#777] leading-relaxed italic">&ldquo;{insight.assistantNote}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function FinanceCommandCenter() {
  const { expenses, addExpense, updateExpense, deleteExpense } = usePlannedExpenses();
  const { monthlyTotal: subTotal } = useSubscriptions();
  const { totalDebt } = useDebtService();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<PlannedExpense | null>(null);

  const plannedTotal = expenses
    .filter(e => e.status === 'planned' || e.status === 'active')
    .reduce((sum, e) => sum + calcMonthlyExpense(e), 0);

  const netColor = HAZIRAN_NET >= 0 ? '#22c55e' : '#ef4444';
  const netSign = HAZIRAN_NET >= 0 ? '+' : '';

  const metrics = [
    { label: 'Toplam Gelir', value: `${HAZIRAN_TOTAL_INCOME.toLocaleString('tr-TR')} TL`, color: '#22c55e' },
    { label: 'Toplam Gider', value: `${HAZIRAN_TOTAL_EXPENSE.toLocaleString('tr-TR')} TL`, color: '#ef4444' },
    { label: 'Borç Servisi', value: `${totalDebt.toLocaleString('tr-TR')} TL`, color: '#f59e0b' },
    { label: 'Planlanan', value: `~${plannedTotal.toLocaleString('tr-TR')} TL`, color: '#888' },
    { label: 'Abonelikler', value: `${subTotal.toLocaleString('tr-TR')} TL`, color: '#888' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 animate-in duration-700">

      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#444] font-bold block mb-1">Finans Komuta Merkezi</span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-mono font-bold" style={{ color: netColor }}>
                {netSign}{HAZIRAN_NET.toLocaleString('tr-TR')} TL
              </span>
              <span className="text-[10px] text-[#444]">Net Bakiye</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] px-2.5 py-1 rounded font-bold uppercase tracking-widest">
              {HAZIRAN_MODE}
            </span>
          </div>
        </div>

        {/* Haziran kuralı */}
        <div className="mt-3 bg-[#ef4444]/5 border border-[#ef4444]/15 rounded-lg px-3 py-2">
          <p className="text-[10px] text-[#ef4444] font-medium tracking-wide">{HAZIRAN_RULE}</p>
        </div>

        {/* Metrics */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {metrics.map(m => (
            <div key={m.label} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg px-3 py-2">
              <span className="text-[9px] text-[#333] uppercase tracking-wider block">{m.label}</span>
              <span className="text-xs font-mono font-bold mt-0.5 block" style={{ color: m.color }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Two-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">

        {/* ── Left column ── */}
        <div className="space-y-5">
          {/* Finans Peak */}
          <FinancePeakCard />

          {/* Borç Servis Takvimi */}
          <DebtServiceCompact />

          {/* Kanayan Yaralar */}
          <BleedingCategoriesPanel />

          {/* Haziran Simülatörü */}
          <CashFlowSimulator />

          {/* İşlem Ekle */}
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#333] font-bold block mb-3">İşlem Ekle</span>
            <AddTransactionForm />
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-5">
          {/* Abonelikler */}
          <SubscriptionManager />

          {/* Planlanan Giderler */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#333] font-bold block">Planlanan Giderler</span>
                {plannedTotal > 0 && (
                  <span className="text-[10px] text-[#444] font-mono">Aylık yük: ~{plannedTotal.toLocaleString('tr-TR')} TL</span>
                )}
              </div>
              <button
                onClick={() => { setShowAddExpense(true); setEditingExpense(null); }}
                className="flex items-center gap-1.5 text-[10px] text-[#555] hover:text-white border border-[#1f1f1f] hover:border-[#2a2a2a] px-2.5 py-1.5 rounded-lg transition-all"
              >
                <Plus size={11} />Ekle
              </button>
            </div>

            {showAddExpense && (
              <div className="mb-3">
                <ExpenseForm
                  title="Yeni Planlanan Gider"
                  onSave={d => { addExpense(d); setShowAddExpense(false); }}
                  onCancel={() => setShowAddExpense(false)}
                />
              </div>
            )}

            <div className="space-y-2">
              {expenses.filter(e => e.status !== 'archived').map(item =>
                editingExpense?.id === item.id ? (
                  <ExpenseForm
                    key={item.id}
                    title="Gideri Düzenle"
                    initial={{ title: item.title, amount: item.amount, category: item.category, frequency: item.frequency, status: item.status, note: item.note || '' }}
                    onSave={d => { updateExpense(item.id, d); setEditingExpense(null); }}
                    onCancel={() => setEditingExpense(null)}
                  />
                ) : (
                  <PlannedExpenseCard
                    key={item.id}
                    item={item}
                    onEdit={i => { setEditingExpense(i); setShowAddExpense(false); }}
                    onDelete={deleteExpense}
                  />
                )
              )}
              {expenses.filter(e => e.status !== 'archived').length === 0 && !showAddExpense && (
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-4 text-center">
                  <p className="text-[11px] text-[#333] italic">Planlanan gider yok.</p>
                </div>
              )}
            </div>
          </div>

          {/* Satın Alma Öncesi Kontrol */}
          <PurchaseCheckCard />

          {/* AI Finans Yorumu */}
          <AIFinancePanel
            subscriptionTotal={subTotal}
            debtServiceTotal={totalDebt}
            plannedTotal={plannedTotal}
          />
        </div>
      </div>
    </div>
  );
}
