"use client";

import React, { useState } from "react";
import { Plus, X, Check } from "lucide-react";
import { useFinanceTransactions, type NewTransactionInput } from "@/hooks/useFinanceTransactions";
import { useCurrentExpenses, type CurrentExpense } from "@/hooks/useCurrentExpenses";
import { useDebtService, type DebtServiceItem } from "@/hooks/useDebtService";
import { useSubscriptions, type SubscriptionItem } from "@/hooks/useSubscriptions";

// ── Category definitions ──────────────────────────────────────────────────────

const INCOME_CATEGORIES = [
  { value: "salary", label: "Maaş" },
  { value: "freelance", label: "Freelance" },
  { value: "extra", label: "Ek gelir" },
  { value: "refund", label: "İade" },
  { value: "other", label: "Diğer" },
];

const EXPENSE_CATEGORIES = [
  { value: "current_expense", label: "Güncel gider", suggestCurrentExpense: true },
  { value: "debt_payment", label: "Borç / kredi kartı", suggestDebt: true },
  { value: "loan_installment", label: "Kredi taksiti", suggestDebt: true },
  { value: "subscription", label: "Abonelik", suggestSub: true },
  { value: "market", label: "Market" },
  { value: "food", label: "Yemek" },
  { value: "education", label: "Eğitim", suggestCurrentExpense: true },
  { value: "sport", label: "Spor", suggestCurrentExpense: true },
  { value: "other", label: "Diğer" },
];

const inputClass =
  "w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#333] focus:outline-none focus:border-[#2a2a2a] transition-colors";
const labelClass =
  "text-[9px] uppercase tracking-wider text-[#444] font-bold block mb-1";

// ── Main Form ─────────────────────────────────────────────────────────────────

interface AddTransactionFormProps {
  onAdded?: () => void;
}

export function AddTransactionForm({ onAdded }: AddTransactionFormProps) {
  const { addTransaction } = useFinanceTransactions();
  const { activeExpenses, markPaid: markExpensePaid } = useCurrentExpenses();
  const { activeItems: activeDebts, markPaid: markDebtPaid } = useDebtService();
  const { activeSubscriptions } = useSubscriptions();

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [note, setNote] = useState("");

  // Linking state
  const [linkCurrentExpense, setLinkCurrentExpense] = useState(false);
  const [linkedCurrentExpenseId, setLinkedCurrentExpenseId] = useState("");
  const [linkDebt, setLinkDebt] = useState(false);
  const [linkedDebtId, setLinkedDebtId] = useState("");
  const [linkSub, setLinkSub] = useState(false);
  const [linkedSubId, setLinkedSubId] = useState("");

  const [success, setSuccess] = useState(false);

  const selectedCategory = EXPENSE_CATEGORIES.find(c => c.value === category);

  const suggestCurrentExpense = type === "expense" && !!selectedCategory?.suggestCurrentExpense;
  const suggestDebt = type === "expense" && !!selectedCategory?.suggestDebt;
  const suggestSub = type === "expense" && !!selectedCategory?.suggestSub;

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory(type === "income" ? "salary" : "other");
    setNote("");
    setLinkCurrentExpense(false);
    setLinkedCurrentExpenseId("");
    setLinkDebt(false);
    setLinkedDebtId("");
    setLinkSub(false);
    setLinkedSubId("");
  };

  const handleTypeChange = (t: "income" | "expense") => {
    setType(t);
    setCategory(t === "income" ? "salary" : "other");
    setLinkCurrentExpense(false);
    setLinkDebt(false);
    setLinkSub(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!title.trim() || !amt || amt <= 0) return;

    const linkedTo: NonNullable<NewTransactionInput["linkedTo"]> = {};
    if (linkCurrentExpense && linkedCurrentExpenseId) linkedTo.currentExpenseId = linkedCurrentExpenseId;
    if (linkDebt && linkedDebtId) linkedTo.debtServiceId = linkedDebtId;
    if (linkSub && linkedSubId) linkedTo.subscriptionId = linkedSubId;

    const input: NewTransactionInput = {
      type,
      title: title.trim(),
      amount: amt,
      currency: "TRY",
      category,
      date: new Date().toISOString().slice(0, 10),
      note: note.trim() || undefined,
      linkedTo: Object.keys(linkedTo).length > 0 ? linkedTo : undefined,
    };

    addTransaction(input);

    // Mark linked items as paid/resolved
    if (linkCurrentExpense && linkedCurrentExpenseId) markExpensePaid(linkedCurrentExpenseId);
    if (linkDebt && linkedDebtId) markDebtPaid(linkedDebtId);

    resetForm();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
    onAdded?.();
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 bg-[#111111] border border-[#1f1f1f] hover:border-[#2a2a2a] rounded-lg px-4 py-3 text-left transition-all group"
      >
        <Plus size={13} className="text-[#444] group-hover:text-[#666] transition-colors" />
        <span className="text-[11px] text-[#444] group-hover:text-[#666] transition-colors">
          İşlem ekle...
        </span>
        {success && (
          <span className="ml-auto text-[10px] text-[#22c55e] flex items-center gap-1">
            <Check size={10} /> Eklendi
          </span>
        )}
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-white font-medium">Yeni İşlem</span>
        <button
          type="button"
          onClick={() => { setOpen(false); resetForm(); }}
          className="text-[#444] hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Type toggle */}
      <div>
        <label className={labelClass}>İşlem Tipi</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className="flex-1 py-2 rounded-lg text-[10px] font-bold tracking-widest transition-all uppercase border"
            style={{
              background: type === "income" ? "rgba(34,197,94,0.1)" : "transparent",
              borderColor: type === "income" ? "#22c55e" : "#1f1f1f",
              color: type === "income" ? "#22c55e" : "#444",
            }}
          >
            Gelir
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className="flex-1 py-2 rounded-lg text-[10px] font-bold tracking-widest transition-all uppercase border"
            style={{
              background: type === "expense" ? "rgba(239,68,68,0.1)" : "transparent",
              borderColor: type === "expense" ? "#ef4444" : "#1f1f1f",
              color: type === "expense" ? "#ef4444" : "#444",
            }}
          >
            Gider
          </button>
        </div>
      </div>

      {/* Title + Amount */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Başlık</label>
          <input
            className={inputClass}
            placeholder="İşlem adı"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Tutar (TL)</label>
          <input
            type="number"
            className={inputClass}
            placeholder="0"
            min={0}
            step="any"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className={labelClass}>Kategori</label>
        <select
          className={inputClass}
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {(type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Linking options for expenses */}
      {type === "expense" && (suggestCurrentExpense || suggestDebt || suggestSub) && (
        <div className="space-y-2">
          <label className={labelClass}>Listeye Bağla (opsiyonel)</label>

          {suggestCurrentExpense && activeExpenses.length > 0 && (
            <LinkRow
              checked={linkCurrentExpense}
              onToggle={() => setLinkCurrentExpense(v => !v)}
              label="Güncel Giderler'e ekle"
              selectValue={linkedCurrentExpenseId}
              onSelect={setLinkedCurrentExpenseId}
              options={activeExpenses.map((e: CurrentExpense) => ({ value: e.id, label: `${e.title} — ${e.amount.toLocaleString("tr-TR")} TL` }))}
              show={linkCurrentExpense}
            />
          )}

          {suggestDebt && activeDebts.length > 0 && (
            <LinkRow
              checked={linkDebt}
              onToggle={() => setLinkDebt(v => !v)}
              label="Borç Servis Takvimi'ne ekle"
              selectValue={linkedDebtId}
              onSelect={setLinkedDebtId}
              options={activeDebts.map((d: DebtServiceItem) => ({ value: d.id, label: `${d.title} — ${d.amount.toLocaleString("tr-TR")} TL` }))}
              show={linkDebt}
            />
          )}

          {suggestSub && activeSubscriptions.length > 0 && (
            <LinkRow
              checked={linkSub}
              onToggle={() => setLinkSub(v => !v)}
              label="Aboneliklere ekle"
              selectValue={linkedSubId}
              onSelect={setLinkedSubId}
              options={activeSubscriptions.map((s: SubscriptionItem) => ({ value: s.id, label: `${s.name} — ${s.amount.toLocaleString("tr-TR")} TL` }))}
              show={linkSub}
            />
          )}
        </div>
      )}

      {/* Note */}
      <div>
        <label className={labelClass}>Not (opsiyonel)</label>
        <input
          className={inputClass}
          placeholder="Ek not..."
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-1.5 border text-[11px] font-medium py-2 rounded-lg transition-all"
          style={{
            background: type === "income" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
            borderColor: type === "income" ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)",
            color: type === "income" ? "#22c55e" : "#ef4444",
          }}
        >
          <Check size={12} />
          {type === "income" ? "Gelir Ekle" : "Gider Ekle"}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); resetForm(); }}
          className="flex-1 text-[#444] text-[11px] border border-[#1f1f1f] py-2 rounded-lg hover:text-[#666] transition-colors"
        >
          İptal
        </button>
      </div>
    </form>
  );
}

// ── Link row sub-component ────────────────────────────────────────────────────

function LinkRow({
  checked,
  onToggle,
  label,
  selectValue,
  onSelect,
  options,
  show,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  selectValue: string;
  onSelect: (v: string) => void;
  options: { value: string; label: string }[];
  show: boolean;
}) {
  const inputClass =
    "w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-[#2a2a2a] transition-colors mt-1.5";

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 text-left w-full"
      >
        <div
          className="w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center transition-colors"
          style={{
            backgroundColor: checked ? "#f59e0b" : "transparent",
            borderColor: checked ? "#f59e0b" : "#333",
          }}
        >
          {checked && (
            <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
              <path d="M1 4l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span className="text-[10px] text-[#555]">{label}</span>
      </button>
      {show && options.length > 0 && (
        <select
          className={inputClass}
          value={selectValue}
          onChange={e => onSelect(e.target.value)}
        >
          <option value="">— Seç —</option>
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )}
    </div>
  );
}
