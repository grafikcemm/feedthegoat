'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Check, X, Pencil, Trash2 } from 'lucide-react';
import {
  useDebtService,
  DEBT_TYPE_LABELS,
  DEBT_PRIORITY_LABELS,
  DEBT_STATUS_LABELS,
  type DebtServiceItem,
  type NewDebtInput,
  type DebtType,
  type DebtPriority,
  type DebtStatus,
} from '@/hooks/useDebtService';

const inputClass = 'w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#333] focus:outline-none focus:border-[#2a2a2a] transition-colors';
const labelClass = 'text-[9px] uppercase tracking-wider text-[#444] font-bold block mb-1';

const PRIORITY_COLORS: Record<DebtPriority, string> = {
  critical: 'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/20',
  high: 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20',
  medium: 'text-[#888] bg-[#1a1a1a] border-[#2a2a2a]',
  low: 'text-[#444] bg-[#1a1a1a] border-[#1f1f1f]',
};

const STATUS_COLORS: Record<DebtStatus, string> = {
  pending: 'text-[#888]',
  paid: 'text-[#22c55e]',
  deferred: 'text-[#f59e0b]',
  at_risk: 'text-[#ef4444]',
};

const EMPTY_FORM: NewDebtInput = {
  title: '',
  amount: 0,
  type: 'loan',
  priority: 'high',
  status: 'pending',
  dueDate: '',
  note: '',
};

interface DebtFormProps {
  initial?: NewDebtInput;
  onSave: (data: NewDebtInput) => void;
  onCancel: () => void;
  title: string;
}

function DebtForm({ initial = EMPTY_FORM, onSave, onCancel, title }: DebtFormProps) {
  const [form, setForm] = useState(initial);
  const set = <K extends keyof NewDebtInput>(k: K, v: NewDebtInput[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount) return;
    onSave({ ...form, title: form.title.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-white font-medium">{title}</span>
        <button type="button" onClick={onCancel} className="text-[#444] hover:text-white transition-colors"><X size={14} /></button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Başlık</label>
          <input className={inputClass} placeholder="Borç adı" value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Tutar (TL)</label>
          <input type="number" className={inputClass} placeholder="0" min={0} value={form.amount || ''} onChange={e => set('amount', Number(e.target.value))} required />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className={labelClass}>Tip</label>
          <select className={inputClass} value={form.type} onChange={e => set('type', e.target.value as DebtType)}>
            {(Object.keys(DEBT_TYPE_LABELS) as DebtType[]).map(k => (
              <option key={k} value={k}>{DEBT_TYPE_LABELS[k]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Öncelik</label>
          <select className={inputClass} value={form.priority} onChange={e => set('priority', e.target.value as DebtPriority)}>
            {(Object.keys(DEBT_PRIORITY_LABELS) as DebtPriority[]).map(k => (
              <option key={k} value={k}>{DEBT_PRIORITY_LABELS[k]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Durum</label>
          <select className={inputClass} value={form.status} onChange={e => set('status', e.target.value as DebtStatus)}>
            {(Object.keys(DEBT_STATUS_LABELS) as DebtStatus[]).map(k => (
              <option key={k} value={k}>{DEBT_STATUS_LABELS[k]}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Not (opsiyonel)</label>
        <input className={inputClass} placeholder="Ek not..." value={form.note || ''} onChange={e => set('note', e.target.value)} />
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

export function DebtServiceCompact() {
  const { items, totalDebt, addDebt, updateDebt, deleteDebt, markPaid } = useDebtService();
  const [expanded, setExpanded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editingItem, setEditingItem] = useState<DebtServiceItem | null>(null);

  const activeItems = items.filter(d => d.status !== 'paid');
  const paidItems = items.filter(d => d.status === 'paid');

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg overflow-hidden">
      {/* Summary header - always visible */}
      <div
        className="p-3 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#333] font-bold block">Borç Servis Takvimi</span>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-sm font-mono text-[#ef4444]">{totalDebt.toLocaleString('tr-TR')} TL</span>
            <span className="text-[10px] text-[#444]">{activeItems.length} aktif kalem</span>
            {paidItems.length > 0 && (
              <span className="text-[10px] text-[#22c55e]">{paidItems.length} ödendi</span>
            )}
          </div>
        </div>
        {expanded ? <ChevronUp size={14} className="text-[#444]" /> : <ChevronDown size={14} className="text-[#444]" />}
      </div>

      {/* Compact summary rows (always visible, 4 items max) */}
      {!expanded && (
        <div className="px-3 pb-3 space-y-1.5 border-t border-[#1a1a1a] pt-2">
          {activeItems.slice(0, 4).map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] px-1.5 py-px rounded border uppercase font-bold tracking-wide ${PRIORITY_COLORS[item.priority]}`}>
                  {DEBT_PRIORITY_LABELS[item.priority]}
                </span>
                <span className="text-[11px] text-[#666] truncate">{item.title}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-mono text-[#ef4444]">{item.amount.toLocaleString('tr-TR')} TL</span>
                <span className={`text-[9px] ${STATUS_COLORS[item.status]}`}>{DEBT_STATUS_LABELS[item.status]}</span>
              </div>
            </div>
          ))}
          <button onClick={() => setExpanded(true)} className="text-[9px] text-[#444] hover:text-[#666] transition-colors mt-1">
            Detaylar ve düzenle →
          </button>
        </div>
      )}

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-[#1a1a1a]">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] uppercase tracking-wider text-[#444] font-bold">Tüm Kalemler</span>
              <button
                onClick={e => { e.stopPropagation(); setShowAdd(true); setEditingItem(null); }}
                className="flex items-center gap-1.5 text-[10px] text-[#555] hover:text-white border border-[#1f1f1f] hover:border-[#2a2a2a] px-2 py-1 rounded-lg transition-all"
              >
                <Plus size={10} />Ekle
              </button>
            </div>

            {showAdd && (
              <div className="mb-3">
                <DebtForm title="Yeni Borç Kalemi" onSave={d => { addDebt(d); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />
              </div>
            )}

            <div className="space-y-2">
              {items.map(item =>
                editingItem?.id === item.id ? (
                  <DebtForm
                    key={item.id}
                    title="Düzenle"
                    initial={{ title: item.title, amount: item.amount, type: item.type, priority: item.priority, status: item.status, dueDate: item.dueDate, note: item.note }}
                    onSave={d => { updateDebt(item.id, d); setEditingItem(null); }}
                    onCancel={() => setEditingItem(null)}
                  />
                ) : (
                  <DebtRow
                    key={item.id}
                    item={item}
                    onEdit={() => { setEditingItem(item); setShowAdd(false); }}
                    onDelete={() => deleteDebt(item.id)}
                    onMarkPaid={() => markPaid(item.id)}
                  />
                )
              )}
              {items.length === 0 && !showAdd && (
                <p className="text-[11px] text-[#333] italic text-center py-3">Borç kalemi yok.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DebtRow({ item, onEdit, onDelete, onMarkPaid }: {
  item: DebtServiceItem;
  onEdit: () => void;
  onDelete: () => void;
  onMarkPaid: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isPaid = item.status === 'paid';

  return (
    <div className={`bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-3 ${isPaid ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[9px] px-1.5 py-px rounded border uppercase font-bold tracking-wide ${PRIORITY_COLORS[item.priority]}`}>
              {DEBT_PRIORITY_LABELS[item.priority]}
            </span>
            <span className="text-[11px] text-white font-medium">{item.title}</span>
            <span className="text-[9px] text-[#444]">{DEBT_TYPE_LABELS[item.type]}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-sm font-mono ${isPaid ? 'text-[#22c55e] line-through' : 'text-[#ef4444]'}`}>
              {item.amount.toLocaleString('tr-TR')} TL
            </span>
            <span className={`text-[9px] ${STATUS_COLORS[item.status]}`}>{DEBT_STATUS_LABELS[item.status]}</span>
          </div>
          {item.note && <p className="text-[10px] text-[#555] mt-1 leading-relaxed">{item.note}</p>}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!isPaid && (
            <button onClick={onMarkPaid} className="w-6 h-6 flex items-center justify-center text-[#2a2a2a] hover:text-[#22c55e] transition-colors" title="Ödendi işaretle">
              <Check size={11} />
            </button>
          )}
          <button onClick={onEdit} className="w-6 h-6 flex items-center justify-center text-[#2a2a2a] hover:text-[#666] transition-colors" title="Düzenle">
            <Pencil size={11} />
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button onClick={onDelete} className="text-[10px] text-[#ef4444] border border-[#ef4444]/30 px-2 py-px rounded hover:bg-[#ef4444]/10">Sil</button>
              <button onClick={() => setConfirmDelete(false)} className="text-[10px] text-[#444] border border-[#1f1f1f] px-2 py-px rounded">İptal</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="w-6 h-6 flex items-center justify-center text-[#2a2a2a] hover:text-[#ef4444] transition-colors" title="Arşivle">
              <Trash2 size={11} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
