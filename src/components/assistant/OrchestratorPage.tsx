'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bot, Shield, Scale, Rocket, RefreshCw, Send, CheckCircle, Clock, Zap } from 'lucide-react';
import type { UnifiedTodayPlan, AgencyLoad, EnergyLevel, PlanMode } from '@/lib/dailyOrchestrator';
import { REMINDER_SCHEDULE } from '@/data/orchestratorConfig';
import type { ReminderType } from '@/data/orchestratorConfig';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DailyState {
  date: string;
  agency_load: AgencyLoad;
  energy: EnergyLevel;
  mode: PlanMode;
  today_plan_json: UnifiedTodayPlan | null;
}

interface ReminderRow {
  date: string;
  reminder_type: ReminderType;
  sent_at: string;
  status: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MODE_ICONS: Record<PlanMode, React.ReactNode> = {
  koruma: <Shield size={14} className="text-[#ef4444]" />,
  denge: <Scale size={14} className="text-[#f59e0b]" />,
  atak: <Rocket size={14} className="text-[#22c55e]" />,
};
const MODE_LABELS: Record<PlanMode, string> = {
  koruma: 'Koruma',
  denge: 'Denge',
  atak: 'Atak',
};
const MODE_COLORS: Record<PlanMode, string> = {
  koruma: '#ef4444',
  denge: '#f59e0b',
  atak: '#22c55e',
};
const AGENCY_LABELS: Record<AgencyLoad, string> = { low: 'Rahat', normal: 'Normal', high: 'Yoğun' };
const ENERGY_LABELS: Record<EnergyLevel, string> = { low: 'Düşük', medium: 'Orta', high: 'Yüksek' };
const REMINDER_LABELS: Record<ReminderType, string> = {
  morning_checkin: 'Sabah Check-in',
  midday_status: 'Gün Ortası Yoklama',
  evening_rhythm: 'Akşam Ritim',
  night_shutdown: 'Gece Shutdown',
};

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#111111] border border-[#1f1f1f] rounded-xl p-5 ${className}`}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] uppercase tracking-widest text-[#444444] font-medium block mb-3">
      {children}
    </span>
  );
}

// ─── Sub-cards ────────────────────────────────────────────────────────────────

function TodayPlanCard({ state, onRefresh }: { state: DailyState | null; onRefresh: () => void }) {
  const plan = state?.today_plan_json;
  const mode = state?.mode ?? 'denge';
  const agencyLoad = state?.agency_load ?? 'normal';
  const energy = state?.energy ?? 'medium';

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <Label>Günlük Plan</Label>
        <button
          onClick={onRefresh}
          className="text-[#333333] hover:text-[#666666] transition-colors"
          title="Yenile"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
          style={{ backgroundColor: `${MODE_COLORS[mode]}18`, border: `1px solid ${MODE_COLORS[mode]}30` }}
        >
          {MODE_ICONS[mode]}
          <span style={{ color: MODE_COLORS[mode] }} className="text-[11px] font-medium">
            {MODE_LABELS[mode]}
          </span>
        </div>
        <span className="text-[11px] text-[#444444]">Ajans: {AGENCY_LABELS[agencyLoad]}</span>
        <span className="text-[11px] text-[#444444]">Enerji: {ENERGY_LABELS[energy]}</span>
      </div>

      {plan ? (
        <>
          <div className="bg-[#161200] border border-[#2a2000] rounded-lg px-3 py-2.5 mb-4">
            <span className="text-[10px] uppercase tracking-widest text-[#f5c518] font-medium block mb-1">
              Kilit
            </span>
            <p className="text-sm text-[#cccccc]">{plan.todayLock}</p>
          </div>

          <div className="mb-3">
            <span className="text-[10px] text-[#444444] block mb-2">
              Maks {plan.maxActiveTasks} aktif iş
            </span>
            {plan.priorityTasks.map((t, i) => (
              <div key={i} className="flex items-start gap-2 mb-1.5">
                <span className="text-[10px] text-[#555555] mt-0.5 shrink-0">{i + 1}.</span>
                <span className="text-xs text-[#888888]">{t.title}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-[#1a1a1a] mb-3" />

          <div className="grid grid-cols-2 gap-2 text-xs text-[#555555]">
            <div>
              <span className="text-[10px] text-[#3b3b3b] block">Sağlık</span>
              {plan.health.todaySummary}
            </div>
            {plan.readingTarget && (
              <div>
                <span className="text-[10px] text-[#3b3b3b] block">Okuma</span>
                {plan.readingTarget}
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-xs text-[#444444]">
          Plan henüz oluşturulmadı. Sabah check-in sonrasında Telegram'dan /plan yaz.
        </p>
      )}
    </Card>
  );
}

function ConnectedSystemsCard({ plan }: { plan: UnifiedTodayPlan | null }) {
  const systems = [
    { label: 'Ritimler', value: plan ? `${plan.rhythms.length} aktif` : '—', color: '#3b82f6' },
    { label: 'Sağlık', value: plan ? `Gün ${plan.health.day}/30` : '—', color: '#22c55e' },
    { label: 'Finans', value: plan ? 'Bağlı' : '—', color: '#f59e0b' },
    { label: 'Kütüphane', value: plan?.readingTarget ? 'Aktif kitap' : 'Seçili değil', color: '#8b5cf6' },
    { label: 'Gelişim', value: plan ? 'Bağlı' : '—', color: '#f97316' },
  ];

  return (
    <Card>
      <Label>Bağlı Modüller</Label>
      <div className="grid grid-cols-5 gap-2">
        {systems.map(s => (
          <div key={s.label} className="text-center">
            <div
              className="w-2 h-2 rounded-full mx-auto mb-1.5"
              style={{ backgroundColor: plan ? s.color : '#2a2a2a' }}
            />
            <div className="text-[10px] text-[#333333] font-medium">{s.label}</div>
            <div className="text-[10px] text-[#555555] mt-0.5">{s.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TelegramStatusCard({ reminders }: { reminders: ReminderRow[] }) {
  const today = new Date().toISOString().slice(0, 10);
  const todayReminders = reminders.filter(r => r.date === today);
  const lastSent = todayReminders.sort((a, b) => b.sent_at.localeCompare(a.sent_at))[0];
  const isConnected = !!process.env.NEXT_PUBLIC_TELEGRAM_CONNECTED;

  return (
    <Card>
      <Label>Telegram</Label>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
        <span className="text-xs text-[#666666]">
          Feed The Goat Asistanı
        </span>
      </div>

      <div className="space-y-2">
        {lastSent ? (
          <div className="text-xs text-[#444444]">
            Son gönderim: {REMINDER_LABELS[lastSent.reminder_type]} —{' '}
            {new Date(lastSent.sent_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        ) : (
          <div className="text-xs text-[#333333]">Bugün henüz mesaj gönderilmedi.</div>
        )}

        <div className="space-y-1 mt-3">
          {(Object.entries(REMINDER_LABELS) as [ReminderType, string][]).map(([type, label]) => {
            const sent = todayReminders.find(r => r.reminder_type === type);
            return (
              <div key={type} className="flex items-center justify-between">
                <span className="text-[11px] text-[#444444]">{label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#333333]">{REMINDER_SCHEDULE[type]}</span>
                  {sent ? (
                    <CheckCircle size={11} className="text-[#22c55e]" />
                  ) : (
                    <Clock size={11} className="text-[#333333]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!isConnected && (
        <p className="text-[10px] text-[#333333] mt-3">
          Env: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID gerekli
        </p>
      )}
    </Card>
  );
}

function ReminderSettingsCard() {
  const order: ReminderType[] = ['morning_checkin', 'midday_status', 'evening_rhythm', 'night_shutdown'];

  return (
    <Card>
      <Label>Hatırlatma Saatleri</Label>
      <div className="space-y-2">
        {order.map(type => (
          <div key={type} className="flex items-center justify-between">
            <span className="text-xs text-[#555555]">{REMINDER_LABELS[type]}</span>
            <span className="text-xs text-[#333333] font-mono">{REMINDER_SCHEDULE[type]}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-[#2a2a2a] mt-3">
        Saatleri değiştirmek için src/data/orchestratorConfig.ts dosyasını düzenle.
      </p>
      <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
        <p className="text-[10px] text-[#333333]">
          Cron trigger: <span className="font-mono">/api/cron/orchestrator?secret=CRON_SECRET</span>
        </p>
      </div>
    </Card>
  );
}

function AssistantLog({ plan, reminders }: { plan: UnifiedTodayPlan | null; reminders: ReminderRow[] }) {
  const today = new Date().toISOString().slice(0, 10);
  const todayReminders = reminders
    .filter(r => r.date === today)
    .sort((a, b) => b.sent_at.localeCompare(a.sent_at));

  return (
    <Card>
      <Label>Asistan Logu</Label>

      {plan && (
        <div className="mb-4">
          <span className="text-[10px] text-[#3b3b3b] block mb-2">Bugünkü Telegram Mesajları</span>
          {[
            { key: 'morningCheckIn', label: 'Sabah' },
            { key: 'eveningRhythm', label: 'Akşam' },
            { key: 'nightShutdown', label: 'Gece' },
          ].map(({ key, label }) => (
            <details key={key} className="mb-1.5">
              <summary className="text-[11px] text-[#444444] cursor-pointer hover:text-[#666666] transition-colors">
                {label} mesajı
              </summary>
              <pre className="mt-1 text-[10px] text-[#333333] whitespace-pre-wrap leading-relaxed pl-2 border-l border-[#1e1e1e]">
                {plan.telegramMessages[key as keyof typeof plan.telegramMessages]}
              </pre>
            </details>
          ))}
        </div>
      )}

      {todayReminders.length > 0 && (
        <div>
          <span className="text-[10px] text-[#3b3b3b] block mb-2">Gönderilen Hatırlatmalar</span>
          {todayReminders.map((r, i) => (
            <div key={i} className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[#555555]">{REMINDER_LABELS[r.reminder_type]}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#333333]">
                  {new Date(r.sent_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <CheckCircle size={10} className="text-[#22c55e]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!plan && todayReminders.length === 0 && (
        <p className="text-xs text-[#333333]">
          Bugün henüz log yok. Sistem {process.env.NEXT_PUBLIC_ORCHESTRATOR_START ?? '1 Haziran 2026'}'dan itibaren aktif.
        </p>
      )}
    </Card>
  );
}

// ─── QuickSend Panel ──────────────────────────────────────────────────────────

function QuickSendPanel() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function triggerCron(type: string) {
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch(`/api/cron/orchestrator?secret=${type}`, { method: 'GET' });
      const data = await res.json() as { ok: boolean; sent?: string; message?: string };
      setStatus(data.ok ? `Gönderildi: ${data.sent ?? data.message}` : 'Hata oluştu.');
    } catch {
      setStatus('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  }

  async function sendTelegramCommand(command: string) {
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: { text: command, chat: { id: 0 } } }),
      });
      setStatus(res.ok ? `${command} gönderildi.` : 'Hata oluştu.');
    } catch {
      setStatus('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  }

  const quickCommands = ['/plan', '/ritimler', '/saglik', '/finans', '/shutdown'];

  return (
    <Card>
      <Label>Hızlı Gönder</Label>
      <div className="flex flex-wrap gap-2 mb-3">
        {quickCommands.map(cmd => (
          <button
            key={cmd}
            onClick={() => sendTelegramCommand(cmd)}
            disabled={loading}
            className="px-2.5 py-1 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]
                       text-[11px] text-[#555555] hover:text-[#888888] hover:border-[#333333]
                       transition-colors disabled:opacity-40 font-mono"
          >
            {cmd}
          </button>
        ))}
      </div>

      {status && (
        <p className="text-[11px] text-[#444444] mt-2 flex items-center gap-1.5">
          <Zap size={10} />
          {status}
        </p>
      )}
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function OrchestratorPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [state, setState] = useState<DailyState | null>(null);
  const [reminders, setReminders] = useState<ReminderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchState = useCallback(async () => {
    setLoading(true);
    try {
      const [stateRes, remindersRes] = await Promise.all([
        fetch(`/api/orchestrator/state?date=${today}`),
        fetch(`/api/orchestrator/reminders?date=${today}`),
      ]);
      if (stateRes.ok) setState(await stateRes.json() as DailyState);
      if (remindersRes.ok) setReminders(await remindersRes.json() as ReminderRow[]);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [today]);

  useEffect(() => { fetchState(); }, [fetchState]);

  const plan = state?.today_plan_json ?? null;

  return (
    <div className="max-w-[920px] mx-auto px-4 sm:px-6 pb-16">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Bot size={14} className="text-[#444444]" strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-widest text-[#444444] font-medium">
            Asistan — Günlük Orkestra
          </span>
        </div>
        <p className="text-[12px] text-[#333333]">
          Tüm tabları birbirine bağlayan günlük planlama sistemi. Başlangıç: 1 Haziran 2026.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-[#111111] border border-[#1a1a1a] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Row 1: Plan + Systems */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
            <TodayPlanCard state={state} onRefresh={fetchState} />
            <div className="flex flex-col gap-4">
              <ConnectedSystemsCard plan={plan} />
              <QuickSendPanel />
            </div>
          </div>

          {/* Row 2: Telegram + Reminders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TelegramStatusCard reminders={reminders} />
            <ReminderSettingsCard />
          </div>

          {/* Row 3: Log */}
          <AssistantLog plan={plan} reminders={reminders} />

          {/* Row 4: Original AssistantChat (kept) */}
          <div className="mt-2">
            <span className="text-[10px] uppercase tracking-widest text-[#2a2a2a] font-medium block mb-3">
              AI Sohbet
            </span>
            <div id="assistant-chat-slot" />
          </div>
        </div>
      )}
    </div>
  );
}
