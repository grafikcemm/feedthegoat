'use client';

import { useState } from 'react';
import { Plus, X, Check, Pencil, Trash2, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import {
  useSubscriptions,
  CATEGORY_LABELS,
  STATUS_LABELS,
  AI_REC_LABELS,
  type SubscriptionItem,
  type NewSubscriptionInput,
  type SubscriptionCategory,
  type SubscriptionStatus,
  type RevenueImpact,
  type AiRecommendation,
} from '@/hooks/useSubscriptions';

const inputClass = 'w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#333] focus:outline-none focus:border-[#2a2a2a] transition-colors';
const labelClass = 'text-[9px] uppercase tracking-wider text-[#444] font-bold block mb-1';

const REVENUE_LABELS: Record<RevenueImpact, string> = {
  none: 'Katkısı yok',
  indirect: 'Dolaylı katkı',
  direct: 'Doğrudan katkı',
  unknown: 'Bilinmiyor',
};

const AI_REC_COLORS: Record<AiRecommendation, string> = {
  keep: 'text-[#22c55e]',
  cancel: 'text-[#ef4444]',
  pause: 'text-[#f59e0b]',
  review: 'text-[#888]',
};

const EMPTY_FORM: Omit<NewSubscriptionInput, never> = {
  name: '',
  amount: 0,
  currency: 'TRY',
  category: 'other',
  billingCycle: 'monthly',
  status: 'active',
  isEssential: false,
  revenueImpact: 'unknown',
  aiRecommendation: 'review',
  purpose: '',
  note: '',
};

interface FormProps {
  initial?: typeof EMPTY_FORM;
  onSave: (data: NewSubscriptionInput) => void;
  onCancel: () => void;
  title: string;
}

function SubForm({ initial = EMPTY_FORM, onSave, onCancel, title }: FormProps) {
  const [form, setForm] = useState(initial);
  const set = <K extends keyof typeof EMPTY_FORM>(k: K, v: typeof EMPTY_FORM[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.amount) return;
    onSave({ ...form, name: form.name.trim() });
  };

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
          <label className={labelClass}>Abonelik Adı</label>
          <input className={inputClass} placeholder="Claude, Figma..." value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Tutar</label>
          <input type="number" className={inputClass} placeholder="0" min={0} value={form.amount || ''} onChange={e => set('amount', Number(e.target.value))} required />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className={labelClass}>Para Birimi</label>
          <select className={inputClass} value={form.currency} onChange={e => set('currency', e.target.value as 'TRY' | 'USD' | 'EUR')}>
            <option value="TRY">TRY</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Kategori</label>
          <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value as SubscriptionCategory)}>
            {(Object.keys(CATEGORY_LABELS) as SubscriptionCategory[]).map(k => (
              <option key={k} value={k}>{CATEGORY_LABELS[k]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Durum</label>
          <select className={inputClass} value={form.status} onChange={e => set('status', e.target.value as SubscriptionStatus)}>
            {(Object.keys(STATUS_LABELS) as SubscriptionStatus[]).map(k => (
              <option key={k} value={k}>{STATUS_LABELS[k]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Gelire Katkı</label>
          <select className={inputClass} value={form.revenueImpact} onChange={e => set('revenueImpact', e.target.value as RevenueImpact)}>
            {(Object.keys(REVENUE_LABELS) as RevenueImpact[]).map(k => (
              <option key={k} value={k}>{REVENUE_LABELS[k]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>AI Önerisi</label>
          <select className={inputClass} value={form.aiRecommendation || 'review'} onChange={e => set('aiRecommendation', e.target.value as AiRecommendation)}>
            {(Object.keys(AI_REC_LABELS) as AiRecommendation[]).map(k => (
              <option key={k} value={k}>{AI_REC_LABELS[k]}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Kullanım Amacı (opsiyonel)</label>
        <input className={inputClass} placeholder="Ne için kullanıyorum..." value={form.purpose || ''} onChange={e => set('purpose', e.target.value)} />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isEssential"
          checked={form.isEssential}
          onChange={e => set('isEssential', e.target.checked)}
          className="accent-[#F5C518]"
        />
        <label htmlFor="isEssential" className="text-[11px] text-[#666]">Zorunlu abonelik</label>
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

interface CardProps {
  item: SubscriptionItem;
  onEdit: (item: SubscriptionItem) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: SubscriptionStatus) => void;
}

function SubCard({ item, onEdit, onDelete, onToggleStatus }: CardProps) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isActive = item.status === 'active' || item.status === 'trial';
  const statusColors: Record<SubscriptionStatus, string> = {
    active: 'text-[#22c55e] bg-[#22c55e]/10',
    trial: 'text-[#3b82f6] bg-[#3b82f6]/10',
    paused: 'text-[#f59e0b] bg-[#f59e0b]/10',
    cancelled: 'text-[#ef4444] bg-[#ef4444]/10',
    archived: 'text-[#444] bg-[#1a1a1a]',
  };

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg overflow-hidden">
      <div className="p-3 flex items-center gap-3">
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded(v => !v)}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-white font-medium">{item.name}</span>
            <span className={`text-[9px] px-1.5 py-px rounded font-bold tracking-wide uppercase ${statusColors[item.status]}`}>
              {STATUS_LABELS[item.status]}
            </span>
            {item.isEssential && (
              <span className="text-[9px] text-[#F5C518] bg-[#F5C518]/10 px-1.5 py-px rounded uppercase font-bold tracking-wide">Zorunlu</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs font-mono text-[#f59e0b]">
              {item.amount.toLocaleString('tr-TR')} {item.currency}
            </span>
            <span className="text-[10px] text-[#444]">{CATEGORY_LABELS[item.category]}</span>
            {item.aiRecommendation && (
              <span className={`text-[9px] font-bold ${AI_REC_COLORS[item.aiRecommendation]}`}>
                → {AI_REC_LABELS[item.aiRecommendation]}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onEdit(item)} className="w-6 h-6 flex items-center justify-center text-[#2a2a2a] hover:text-[#666] transition-colors" title="Düzenle">
            <Pencil size={11} />
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button onClick={() => onDelete(item.id)} className="text-[10px] text-[#ef4444] border border-[#ef4444]/30 px-2 py-px rounded hover:bg-[#ef4444]/10 transition-all">Sil</button>
              <button onClick={() => setConfirmDelete(false)} className="text-[10px] text-[#444] border border-[#1f1f1f] px-2 py-px rounded">İptal</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="w-6 h-6 flex items-center justify-center text-[#2a2a2a] hover:text-[#ef4444] transition-colors" title="Sil">
              <Trash2 size={11} />
            </button>
          )}
          {isActive ? (
            <button onClick={() => onToggleStatus(item.id, 'paused')} className="w-6 h-6 flex items-center justify-center text-[#2a2a2a] hover:text-[#f59e0b] transition-colors" title="Dondur">
              <Lock size={11} />
            </button>
          ) : null}
          <button onClick={() => setExpanded(v => !v)} className="w-6 h-6 flex items-center justify-center text-[#2a2a2a] hover:text-[#444] transition-colors">
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t border-[#1a1a1a] space-y-2 mt-0">
          <div className="flex flex-wrap gap-4 mt-2">
            <div>
              <span className="text-[9px] text-[#333] uppercase tracking-wider block">Frekans</span>
              <span className="text-[11px] text-[#555]">{item.billingCycle === 'monthly' ? 'Aylık' : item.billingCycle === 'yearly' ? 'Yıllık' : 'Tek seferlik'}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#333] uppercase tracking-wider block">Gelir Katkısı</span>
              <span className="text-[11px] text-[#555]">{REVENUE_LABELS[item.revenueImpact]}</span>
            </div>
            {item.renewalDay && (
              <div>
                <span className="text-[9px] text-[#333] uppercase tracking-wider block">Yenileme Günü</span>
                <span className="text-[11px] text-[#555]">{item.renewalDay}. gün</span>
              </div>
            )}
          </div>
          {item.purpose && <p className="text-xs text-[#666] leading-relaxed">{item.purpose}</p>}
          {item.note && <p className="text-[10px] text-[#555] italic">{item.note}</p>}
          {item.status === 'paused' && (
            <button
              onClick={() => onToggleStatus(item.id, 'active')}
              className="text-[10px] text-[#22c55e] border border-[#22c55e]/20 px-2 py-1 rounded hover:bg-[#22c55e]/10 transition-all"
            >
              Tekrar Aktifleştir
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function SubscriptionManager() {
  const { subscriptions, monthlyTotal, aiSaasTotal, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();
  const [showAdd, setShowAdd] = useState(false);
  const [editingItem, setEditingItem] = useState<SubscriptionItem | null>(null);
  const [locked, setLocked] = useState(false);

  const handleEdit = (item: SubscriptionItem) => {
    setShowAdd(false);
    setEditingItem(item);
  };

  const handleSaveEdit = (data: NewSubscriptionInput) => {
    if (!editingItem) return;
    updateSubscription(editingItem.id, data);
    setEditingItem(null);
  };

  const handleToggleStatus = (id: string, status: SubscriptionStatus) => {
    updateSubscription(id, { status });
  };

  const visibleSubs = subscriptions.filter(s => s.status !== 'archived');

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#333] font-bold block">Abonelikler ve Dijital Araçlar</span>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[10px] text-[#444] font-mono">Aylık: {monthlyTotal.toLocaleString('tr-TR')} TRY</span>
            {aiSaasTotal > 0 && (
              <span className="text-[10px] text-[#f59e0b] font-mono">AI/SaaS: {aiSaasTotal.toLocaleString('tr-TR')} TRY</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocked(v => !v)}
            title={locked ? 'Abonelik ekleme kilidi açık' : 'Bu ay abonelik ekleme kilidi'}
            className={`flex items-center gap-1 text-[9px] uppercase tracking-widest px-2 py-1 rounded transition-all ${
              locked
                ? 'bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444]'
                : 'border border-[#1f1f1f] text-[#444] hover:text-[#666]'
            }`}
          >
            <Lock size={9} />
            {locked ? 'Kilitli' : 'Kilitle'}
          </button>
          {!locked && (
            <button
              onClick={() => { setShowAdd(true); setEditingItem(null); }}
              className="flex items-center gap-1.5 text-[10px] text-[#555] hover:text-white border border-[#1f1f1f] hover:border-[#2a2a2a] px-2.5 py-1.5 rounded-lg transition-all"
            >
              <Plus size={11} />
              Ekle
            </button>
          )}
        </div>
      </div>

      {locked && (
        <div className="mb-3 bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-lg px-3 py-2">
          <p className="text-[10px] text-[#ef4444]">Bu ay abonelik ekleme kilidi açık. Yeni araç başlatma.</p>
        </div>
      )}

      {showAdd && !locked && (
        <div className="mb-3">
          <SubForm title="Yeni Abonelik" onSave={d => { addSubscription(d); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />
        </div>
      )}

      <div className="space-y-2">
        {visibleSubs.map(item =>
          editingItem?.id === item.id ? (
            <SubForm
              key={item.id}
              title="Aboneliği Düzenle"
              initial={{
                name: item.name,
                amount: item.amount,
                currency: item.currency,
                category: item.category,
                billingCycle: item.billingCycle,
                status: item.status,
                isEssential: item.isEssential,
                revenueImpact: item.revenueImpact,
                aiRecommendation: item.aiRecommendation,
                purpose: item.purpose || '',
                note: item.note || '',
              }}
              onSave={handleSaveEdit}
              onCancel={() => setEditingItem(null)}
            />
          ) : (
            <SubCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={deleteSubscription}
              onToggleStatus={handleToggleStatus}
            />
          )
        )}
        {visibleSubs.length === 0 && !showAdd && (
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-4 text-center">
            <p className="text-[11px] text-[#333] italic">Abonelik yok.</p>
          </div>
        )}
      </div>
    </div>
  );
}
