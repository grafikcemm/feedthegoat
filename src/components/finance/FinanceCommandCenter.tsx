'use client';

import React, { useState } from "react";
import {
  AlertTriangle, Clock, Wallet, BookOpen, Dumbbell,
  ChevronDown, ChevronUp, Loader2, Plus, Pencil, Trash2, X, Check, CreditCard,
} from "lucide-react";
import { FinanceSummary } from "@/lib/financeCalc";
import { AddTransactionForm } from "./AddTransactionForm";
import {
  usePlannedExpenses,
  calcMonthlyExpense,
  PlannedExpense,
  NewExpenseInput,
  ExpenseCategory,
  ExpenseFrequency,
  ExpenseStatus,
} from "@/hooks/usePlannedExpenses";
import {
  useCreditCards,
  CreditCard as CreditCardType,
  NewCreditCardInput,
} from "@/hooks/useCreditCards";

interface TransactionItem {
  id: string | number;
  title: string;
  amount: number;
  type: string;
}

interface SubscriptionItem {
  id: string | number;
  title: string;
  amount: number;
  currency: string;
}

interface FinanceCommandCenterProps {
  summary: FinanceSummary;
  incomeItems: TransactionItem[];
  expenseItems: TransactionItem[];
  subscriptionItems: SubscriptionItem[];
}

// ── Icon helpers ─────────────────────────────────────────────────────────────

const categoryIcon = (cat: ExpenseCategory) => {
  if (cat === "education") return <BookOpen size={14} className="text-[#3b82f6]" />;
  if (cat === "sport") return <Dumbbell size={14} className="text-[#22c55e]" />;
  return <Wallet size={14} className="text-[#888]" />;
};

const statusChip = (status: ExpenseStatus) => {
  const map: Record<ExpenseStatus, React.ReactElement> = {
    planned: <span className="text-[9px] bg-[#3b82f6]/10 text-[#3b82f6] px-1.5 py-px rounded font-bold tracking-wide uppercase">Planlanan</span>,
    active:  <span className="text-[9px] bg-[#22c55e]/10 text-[#22c55e] px-1.5 py-px rounded font-bold tracking-wide uppercase">Aktif</span>,
    paid:    <span className="text-[9px] bg-[#888]/10 text-[#888] px-1.5 py-px rounded font-bold tracking-wide uppercase">Ödendi</span>,
    archived:<span className="text-[9px] bg-[#444]/10 text-[#444] px-1.5 py-px rounded font-bold tracking-wide uppercase">Arşiv</span>,
  };
  return map[status] ?? null;
};

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  education: "Eğitim",
  sport: "Spor",
  subscription: "Abonelik",
  debt: "Borç",
  personal: "Kişisel",
  other: "Diğer",
};

const FREQUENCY_LABELS: Record<ExpenseFrequency, string> = {
  monthly: "Aylık",
  one_time: "Tek seferlik",
  quarterly: "3 Aylık",
  unknown: "Bilinmiyor",
};

const STATUS_LABELS: Record<ExpenseStatus, string> = {
  planned: "Planlanan",
  active: "Aktif",
  paid: "Ödendi",
  archived: "Arşiv",
};

// ── Expense Form ─────────────────────────────────────────────────────────────

const EMPTY_FORM: Omit<NewExpenseInput, 'currency'> = {
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

function ExpenseForm({ initial = EMPTY_FORM, onSave, onCancel, title }: ExpenseFormProps) {
  const [form, setForm] = useState(initial);

  const set = <K extends keyof typeof EMPTY_FORM>(k: K, v: typeof EMPTY_FORM[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount) return;
    onSave({ ...form, currency: 'TRY' });
  };

  const inputClass = "w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#333] focus:outline-none focus:border-[#2a2a2a] transition-colors";
  const labelClass = "text-[9px] uppercase tracking-wider text-[#444] font-bold block mb-1";

  return (
    <form onSubmit={handleSubmit} className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-white font-medium">{title}</span>
        <button type="button" onClick={onCancel} className="text-[#444] hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>

      <div>
        <label className={labelClass}>Başlık</label>
        <input
          className={inputClass}
          placeholder="Gider adı"
          value={form.title}
          onChange={e => set('title', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Tutar (TL)</label>
          <input
            type="number"
            className={inputClass}
            placeholder="0"
            min={0}
            value={form.amount || ''}
            onChange={e => set('amount', Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Kategori</label>
          <select
            className={inputClass}
            value={form.category}
            onChange={e => set('category', e.target.value as ExpenseCategory)}
          >
            {(Object.keys(CATEGORY_LABELS) as ExpenseCategory[]).map(k => (
              <option key={k} value={k}>{CATEGORY_LABELS[k]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Frekans</label>
          <select
            className={inputClass}
            value={form.frequency}
            onChange={e => set('frequency', e.target.value as ExpenseFrequency)}
          >
            {(Object.keys(FREQUENCY_LABELS) as ExpenseFrequency[]).map(k => (
              <option key={k} value={k}>{FREQUENCY_LABELS[k]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Durum</label>
          <select
            className={inputClass}
            value={form.status}
            onChange={e => set('status', e.target.value as ExpenseStatus)}
          >
            {(Object.keys(STATUS_LABELS) as ExpenseStatus[]).map(k => (
              <option key={k} value={k}>{STATUS_LABELS[k]}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Not (opsiyonel)</label>
        <textarea
          className={inputClass}
          placeholder="Ek not..."
          rows={2}
          value={form.note || ''}
          onChange={e => set('note', e.target.value)}
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#F5C518]/10 border border-[#F5C518]/25 text-[#F5C518] text-[11px] font-medium py-2 rounded-lg hover:bg-[#F5C518]/15 transition-all"
        >
          <Check size={12} />
          Kaydet
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 text-[#444] text-[11px] border border-[#1f1f1f] py-2 rounded-lg hover:text-[#666] transition-colors"
        >
          İptal
        </button>
      </div>
    </form>
  );
}

// ── Planned Expense Card ──────────────────────────────────────────────────────

interface PlannedExpenseCardProps {
  item: PlannedExpense;
  onEdit: (item: PlannedExpense) => void;
  onDelete: (id: string) => void;
}

function PlannedExpenseCard({ item, onEdit, onDelete }: PlannedExpenseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const monthly = calcMonthlyExpense(item);

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg overflow-hidden">
      <div className="p-3 flex items-center gap-3">
        {/* Expand toggle */}
        <div
          className="shrink-0 cursor-pointer"
          onClick={() => setExpanded(v => !v)}
        >
          {categoryIcon(item.category)}
        </div>

        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => setExpanded(v => !v)}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-white font-medium">{item.title}</span>
            {statusChip(item.status)}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs font-mono text-[#f59e0b]">
              {item.amount.toLocaleString("tr-TR")} TL
              {item.durationMonths && (
                <span className="text-[#555] text-[10px] ml-1">/ {item.durationMonths} ay</span>
              )}
            </span>
            {item.durationMonths && monthly !== item.amount && (
              <span className="text-[10px] text-[#555]">≈ {monthly.toLocaleString("tr-TR")} TL/ay</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(item)}
            className="w-6 h-6 flex items-center justify-center text-[#2a2a2a] hover:text-[#666] transition-colors rounded"
            title="Düzenle"
          >
            <Pencil size={11} />
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(item.id)}
                className="text-[10px] text-[#ef4444] border border-[#ef4444]/30 px-2 py-px rounded hover:bg-[#ef4444]/10 transition-all"
              >
                Sil
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-[10px] text-[#444] border border-[#1f1f1f] px-2 py-px rounded"
              >
                İptal
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-6 h-6 flex items-center justify-center text-[#2a2a2a] hover:text-[#ef4444] transition-colors rounded"
              title="Sil"
            >
              <Trash2 size={11} />
            </button>
          )}
          <button
            onClick={() => setExpanded(v => !v)}
            className="w-6 h-6 flex items-center justify-center text-[#2a2a2a] hover:text-[#444] transition-colors"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t border-[#1a1a1a] space-y-2">
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
          {item.note && (
            <p className="text-xs text-[#666] leading-relaxed">{item.note}</p>
          )}
          {item.startNote && (
            <div className="flex items-center gap-1.5">
              <Clock size={11} className="text-[#444]" />
              <span className="text-[10px] text-[#555]">{item.startNote}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Credit Card Form ─────────────────────────────────────────────────────────

const EMPTY_CC: Omit<NewCreditCardInput, never> = {
  bankName: '',
  cardLabel: '',
  totalDebt: 0,
  minPayment: undefined,
  dueDay: undefined,
  cardLimit: undefined,
  status: 'active',
};

interface CreditCardFormProps {
  initial?: typeof EMPTY_CC;
  onSave: (data: NewCreditCardInput) => void;
  onCancel: () => void;
  title: string;
}

function CreditCardForm({ initial = EMPTY_CC, onSave, onCancel, title }: CreditCardFormProps) {
  const [form, setForm] = useState(initial);

  const set = <K extends keyof typeof EMPTY_CC>(k: K, v: typeof EMPTY_CC[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bankName.trim() || !form.totalDebt) return;
    onSave({
      bankName: form.bankName.trim(),
      cardLabel: form.cardLabel?.trim() || undefined,
      totalDebt: Number(form.totalDebt),
      minPayment: form.minPayment ? Number(form.minPayment) : undefined,
      dueDay: form.dueDay ? Number(form.dueDay) : undefined,
      cardLimit: form.cardLimit ? Number(form.cardLimit) : undefined,
      status: form.status,
    });
  };

  const inputClass = "w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#333] focus:outline-none focus:border-[#2a2a2a] transition-colors";
  const labelClass = "text-[9px] uppercase tracking-wider text-[#444] font-bold block mb-1";

  return (
    <form onSubmit={handleSubmit} className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-white font-medium">{title}</span>
        <button type="button" onClick={onCancel} className="text-[#444] hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Banka Adı</label>
          <input className={inputClass} placeholder="Garanti, Yapı Kredi..." value={form.bankName} onChange={e => set('bankName', e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Kart Adı (opsiyonel)</label>
          <input className={inputClass} placeholder="Bonus, Miles..." value={form.cardLabel || ''} onChange={e => set('cardLabel', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Toplam Borç (TL)</label>
          <input type="number" className={inputClass} placeholder="0" min={0} value={form.totalDebt || ''} onChange={e => set('totalDebt', Number(e.target.value))} required />
        </div>
        <div>
          <label className={labelClass}>Asgari Ödeme (TL)</label>
          <input type="number" className={inputClass} placeholder="opsiyonel" min={0} value={form.minPayment ?? ''} onChange={e => set('minPayment', e.target.value ? Number(e.target.value) : undefined)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Son Ödeme Günü</label>
          <input type="number" className={inputClass} placeholder="1-31" min={1} max={31} value={form.dueDay ?? ''} onChange={e => set('dueDay', e.target.value ? Number(e.target.value) : undefined)} />
        </div>
        <div>
          <label className={labelClass}>Kart Limiti (TL)</label>
          <input type="number" className={inputClass} placeholder="opsiyonel" min={0} value={form.cardLimit ?? ''} onChange={e => set('cardLimit', e.target.value ? Number(e.target.value) : undefined)} />
        </div>
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

// ── Credit Card Item ──────────────────────────────────────────────────────────

interface CreditCardItemProps {
  card: CreditCardType;
  onEdit: (card: CreditCardType) => void;
  onDelete: (id: string) => void;
}

function CreditCardItem({ card, onEdit, onDelete }: CreditCardItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const usagePercent = card.cardLimit ? Math.min(100, Math.round((card.totalDebt / card.cardLimit) * 100)) : null;
  const usageColor = usagePercent !== null
    ? usagePercent >= 80 ? '#ef4444' : usagePercent >= 50 ? '#f59e0b' : '#22c55e'
    : '#888';

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-3">
      <div className="flex items-start gap-2">
        <CreditCard size={14} className="text-[#555] mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-white font-medium">{card.bankName}</span>
            {card.cardLabel && (
              <span className="text-[9px] text-[#555] bg-[#1a1a1a] px-1.5 py-px rounded font-mono uppercase">{card.cardLabel}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-1.5">
            <div>
              <span className="text-[9px] text-[#333] uppercase tracking-wider block">Borç</span>
              <span className="text-sm font-mono text-[#ef4444]">{card.totalDebt.toLocaleString("tr-TR")} TL</span>
            </div>
            {card.minPayment !== undefined && (
              <div>
                <span className="text-[9px] text-[#333] uppercase tracking-wider block">Asgari</span>
                <span className="text-xs font-mono text-[#f59e0b]">{card.minPayment.toLocaleString("tr-TR")} TL</span>
              </div>
            )}
            {card.dueDay !== undefined && (
              <div>
                <span className="text-[9px] text-[#333] uppercase tracking-wider block">Son Ödeme</span>
                <span className="text-xs font-mono text-[#888]">{card.dueDay}. gün</span>
              </div>
            )}
          </div>
          {usagePercent !== null && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] text-[#333]">Kullanım</span>
                <span className="text-[9px] font-mono" style={{ color: usageColor }}>%{usagePercent}</span>
              </div>
              <div className="h-0.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${usagePercent}%`, background: usageColor }} />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onEdit(card)} className="w-6 h-6 flex items-center justify-center text-[#2a2a2a] hover:text-[#666] transition-colors" title="Düzenle">
            <Pencil size={11} />
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button onClick={() => onDelete(card.id)} className="text-[10px] text-[#ef4444] border border-[#ef4444]/30 px-2 py-px rounded hover:bg-[#ef4444]/10 transition-all">Sil</button>
              <button onClick={() => setConfirmDelete(false)} className="text-[10px] text-[#444] border border-[#1f1f1f] px-2 py-px rounded">İptal</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="w-6 h-6 flex items-center justify-center text-[#2a2a2a] hover:text-[#ef4444] transition-colors" title="Sil">
              <Trash2 size={11} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── AI Finance Panel ──────────────────────────────────────────────────────────

interface AIExpenseInput {
  title: string;
  amount: number;
  monthlyAmount: number;
  status: string;
  category: string;
}

interface AIFinanceInsight {
  status: "safe" | "attention" | "critical";
  summary: string;
  recommendedActions: string[];
  avoidThisMonth: string[];
  plannedPayments: string[];
  missingInfo: string[];
  assistantNote: string;
}

function AIFinancePanel({
  totalIncome,
  totalExpense,
  plannedExpenses,
}: {
  totalIncome: number;
  totalExpense: number;
  plannedExpenses: AIExpenseInput[];
}) {
  const [insight, setInsight] = useState<AIFinanceInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadInsight = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/ai/finance-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalIncome, totalExpense, plannedExpenses }),
      });
      if (!res.ok) throw new Error("api error");
      const data = await res.json();
      setInsight(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = { safe: "#22c55e", attention: "#f59e0b", critical: "#ef4444" };

  if (!insight && !loading) {
    return (
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#444] font-bold block">AI Finans Yorumu</span>
            <p className="text-xs text-[#555] mt-0.5">Mevcut verilere göre kısa analiz</p>
          </div>
          <button
            onClick={loadInsight}
            className="text-[11px] bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#f59e0b]/30 px-3 py-1.5 rounded-lg transition-all"
          >
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

  const color = statusColor[insight.status] || "#888";

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg overflow-hidden">
      <div className="p-3 border-b border-[#1a1a1a] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="text-[10px] uppercase tracking-widest text-[#444] font-bold">AI Finans Yorumu</span>
        </div>
        <button onClick={loadInsight} className="text-[10px] text-[#444] hover:text-[#888] transition-colors">
          Yenile
        </button>
      </div>
      <div className="p-3 space-y-3">
        <p className="text-xs text-[#888] leading-relaxed">{insight.summary}</p>

        {insight.recommendedActions.length > 0 && (
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#22c55e] font-bold block mb-1.5">Önerilen Aksiyonlar</span>
            <ul className="space-y-1">
              {insight.recommendedActions.map((a, i) => (
                <li key={i} className="text-[11px] text-[#666] flex gap-1.5">
                  <span className="text-[#22c55e] shrink-0">→</span>{a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {insight.avoidThisMonth.length > 0 && (
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#ef4444] font-bold block mb-1.5">Bu Ay Dikkat</span>
            <ul className="space-y-1">
              {insight.avoidThisMonth.map((a, i) => (
                <li key={i} className="text-[11px] text-[#666] flex gap-1.5">
                  <span className="text-[#ef4444] shrink-0">✕</span>{a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {insight.missingInfo.length > 0 && (
          <div className="flex items-start gap-1.5">
            <AlertTriangle size={11} className="text-[#f59e0b] mt-0.5 shrink-0" />
            <div>
              <span className="text-[9px] uppercase tracking-wider text-[#f59e0b] font-bold block mb-1">Eksik Bilgi</span>
              {insight.missingInfo.map((m, i) => (
                <p key={i} className="text-[11px] text-[#555]">{m}</p>
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

export function FinanceCommandCenter({
  summary, incomeItems, expenseItems, subscriptionItems,
}: FinanceCommandCenterProps) {
  const { expenses, addExpense, updateExpense, deleteExpense } = usePlannedExpenses();
  const { cards, addCard, updateCard, deleteCard } = useCreditCards();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PlannedExpense | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCardType | null>(null);

  const netSign = summary.net >= 0 ? "+" : "";
  const netColor = summary.net >= 0 ? "#22c55e" : "#ef4444";

  const plannedTotal = expenses
    .filter(e => e.status === 'planned' || e.status === 'active')
    .reduce((sum, e) => sum + calcMonthlyExpense(e), 0);

  const aiExpenses = expenses.map(e => ({
    title: e.title,
    amount: e.amount,
    monthlyAmount: calcMonthlyExpense(e),
    status: e.status,
    category: e.category,
  }));

  const handleEdit = (item: PlannedExpense) => {
    setShowAddForm(false);
    setEditingItem(item);
  };

  const handleSaveEdit = (data: NewExpenseInput) => {
    if (!editingItem) return;
    updateExpense(editingItem.id, data);
    setEditingItem(null);
  };

  const handleAddSave = (data: NewExpenseInput) => {
    addExpense(data);
    setShowAddForm(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 animate-in duration-700">
      {/* ── Header ── */}
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-widest text-[#444] font-bold block">Finans Komuta Merkezi</span>
        <div className="flex items-end gap-4 mt-2">
          <div>
            <p className="text-[11px] text-[#555] mb-1">Net Bakiye</p>
            <span className="text-3xl font-mono font-bold" style={{ color: netColor }}>
              {netSign}{summary.net.toLocaleString("tr-TR")} TL
            </span>
          </div>
          <div className="flex gap-6 pb-1">
            <div>
              <p className="text-[10px] text-[#444] uppercase tracking-wider">Gelir</p>
              <span className="text-sm font-mono text-[#22c55e]">{summary.totalIncome.toLocaleString("tr-TR")} TL</span>
            </div>
            <div>
              <p className="text-[10px] text-[#444] uppercase tracking-wider">Gider</p>
              <span className="text-sm font-mono text-[#ef4444]">{summary.totalExpense.toLocaleString("tr-TR")} TL</span>
            </div>
            {summary.totalSubscriptions > 0 && (
              <div>
                <p className="text-[10px] text-[#444] uppercase tracking-wider">Abonelik</p>
                <span className="text-sm font-mono text-[#f59e0b]">{summary.totalSubscriptions.toLocaleString("tr-TR")} TL</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
        {/* ── Left column ── */}
        <div className="space-y-6">
          {/* Gelir / Gider */}
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#333] font-bold block mb-3">Aylık Akış</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-3">
                <span className="text-[9px] text-[#444] uppercase tracking-wider block mb-2">Sabit Gelir</span>
                {incomeItems.length === 0 ? (
                  <p className="text-[11px] text-[#333] italic">Henüz eklenmedi</p>
                ) : (
                  <ul className="space-y-1.5">
                    {incomeItems.map((item) => (
                      <li key={item.id} className="flex justify-between items-baseline">
                        <span className="text-[11px] text-[#666] truncate mr-2">{item.title}</span>
                        <span className="text-[11px] font-mono text-[#22c55e] shrink-0">{Number(item.amount).toLocaleString("tr-TR")}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-3">
                <span className="text-[9px] text-[#444] uppercase tracking-wider block mb-2">Giderler</span>
                {expenseItems.length === 0 ? (
                  <p className="text-[11px] text-[#333] italic">Henüz eklenmedi</p>
                ) : (
                  <ul className="space-y-1.5">
                    {expenseItems.map((item) => (
                      <li key={item.id} className="flex justify-between items-baseline">
                        <span className="text-[11px] text-[#666] truncate mr-2">{item.title}</span>
                        <span className="text-[11px] font-mono text-[#ef4444] shrink-0">{Number(item.amount).toLocaleString("tr-TR")}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Abonelikler */}
          {subscriptionItems.length > 0 && (
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#333] font-bold block mb-3">Abonelikler</span>
              <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-3 space-y-1.5">
                {subscriptionItems.map((s) => (
                  <div key={s.id} className="flex justify-between items-baseline">
                    <span className="text-[11px] text-[#666] truncate mr-2">{s.title}</span>
                    <span className="text-[11px] font-mono text-[#888]">{Number(s.amount).toLocaleString("tr-TR")} {s.currency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kredi Kartı & Borç */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#333] font-bold">Kredi Kartı & Borç</span>
              <button
                onClick={() => { setShowAddCard(true); setEditingCard(null); }}
                className="flex items-center gap-1.5 text-[10px] text-[#555] hover:text-white border border-[#1f1f1f] hover:border-[#2a2a2a] px-2.5 py-1.5 rounded-lg transition-all"
              >
                <Plus size={11} />
                Kart ekle
              </button>
            </div>

            {showAddCard && (
              <div className="mb-3">
                <CreditCardForm
                  title="Yeni Kredi Kartı"
                  onSave={data => { addCard(data); setShowAddCard(false); }}
                  onCancel={() => setShowAddCard(false)}
                />
              </div>
            )}

            <div className="space-y-2">
              {cards.filter(c => c.status === 'active').map(card =>
                editingCard?.id === card.id ? (
                  <CreditCardForm
                    key={card.id}
                    title="Kartı Düzenle"
                    initial={{
                      bankName: card.bankName,
                      cardLabel: card.cardLabel || '',
                      totalDebt: card.totalDebt,
                      minPayment: card.minPayment,
                      dueDay: card.dueDay,
                      cardLimit: card.cardLimit,
                      status: card.status,
                    }}
                    onSave={data => { updateCard(card.id, data); setEditingCard(null); }}
                    onCancel={() => setEditingCard(null)}
                  />
                ) : (
                  <CreditCardItem
                    key={card.id}
                    card={card}
                    onEdit={c => { setEditingCard(c); setShowAddCard(false); }}
                    onDelete={deleteCard}
                  />
                )
              )}
              {cards.filter(c => c.status === 'active').length === 0 && !showAddCard && (
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <AlertTriangle size={12} className="text-[#333]" />
                    <span className="text-[11px] text-[#444]">Kredi kartı eklenmedi</span>
                  </div>
                  <p className="text-[10px] text-[#2a2a2a] leading-relaxed">
                    Banka adı, borç, asgari ödeme ve son ödeme günü girebilirsin.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* İşlem Ekle */}
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#333] font-bold block mb-3">İşlem Ekle</span>
            <AddTransactionForm />
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-6">
          {/* Planlanan Giderler */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#333] font-bold block">Planlanan Giderler</span>
                {plannedTotal > 0 && (
                  <span className="text-[10px] text-[#444] font-mono">
                    Toplam aylık yük: ~{plannedTotal.toLocaleString("tr-TR")} TL
                  </span>
                )}
              </div>
              <button
                onClick={() => { setShowAddForm(true); setEditingItem(null); }}
                className="flex items-center gap-1.5 text-[10px] text-[#555] hover:text-white border border-[#1f1f1f] hover:border-[#2a2a2a] px-2.5 py-1.5 rounded-lg transition-all"
              >
                <Plus size={11} />
                Gider ekle
              </button>
            </div>

            {/* Add form */}
            {showAddForm && (
              <div className="mb-3">
                <ExpenseForm
                  title="Yeni Planlanan Gider"
                  onSave={handleAddSave}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            )}

            <div className="space-y-2">
              {expenses.filter(e => e.status !== 'archived').map(item => (
                editingItem?.id === item.id ? (
                  <ExpenseForm
                    key={item.id}
                    title="Gideri Düzenle"
                    initial={{
                      title: item.title,
                      amount: item.amount,
                      category: item.category,
                      frequency: item.frequency,
                      status: item.status,
                      note: item.note || '',
                    }}
                    onSave={handleSaveEdit}
                    onCancel={() => setEditingItem(null)}
                  />
                ) : (
                  <PlannedExpenseCard
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={deleteExpense}
                  />
                )
              ))}
              {expenses.filter(e => e.status !== 'archived').length === 0 && !showAddForm && (
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-4 text-center">
                  <p className="text-[11px] text-[#333] italic">Planlanan gider yok.</p>
                  <p className="text-[10px] text-[#2a2a2a] mt-1">Yukarıdan yeni gider ekle.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Finans Yorumu */}
          <AIFinancePanel
            totalIncome={summary.totalIncome}
            totalExpense={summary.totalExpense + summary.totalSubscriptions}
            plannedExpenses={aiExpenses}
          />
        </div>
      </div>
    </div>
  );
}
