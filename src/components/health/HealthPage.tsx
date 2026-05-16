"use client";

import React, { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useHealthProtocol, type DailyHealthCompletion, type ChecklistField, type WeeklyHealthCheck, CHECKLIST_FIELDS } from "@/hooks/useHealthProtocol";
import { PHASE_LABELS } from "@/data/healthProtocol";
import { HealthShell } from "@/components/health/HealthShell";

// ─── Shared styles ────────────────────────────────────────────────────────────

const card = "bg-[#111111] border border-[#1f1f1f] rounded-lg p-4";
const sectionLabel = "text-[9px] uppercase tracking-widest text-[#444] font-bold block mb-1";
const cardTitle = "text-xs text-white font-semibold";
const mutedText = "text-[10px] text-[#555]";

// ─── Checkbox atom ────────────────────────────────────────────────────────────

function Checkbox({
  checked,
  onToggle,
  label,
  sub,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  sub?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-start gap-2.5 w-full text-left group"
    >
      <div
        className="mt-0.5 w-3.5 h-3.5 rounded shrink-0 border flex items-center justify-center transition-colors"
        style={{
          backgroundColor: checked ? "#22c55e" : "transparent",
          borderColor: checked ? "#22c55e" : "#333",
        }}
      >
        {checked && <Check size={8} color="#000" strokeWidth={3} />}
      </div>
      <div>
        <span
          className="text-[11px] leading-tight transition-colors"
          style={{ color: checked ? "#555" : "#bbb" }}
        >
          {label}
        </span>
        {sub && <span className="block text-[9px] text-[#444] mt-0.5">{sub}</span>}
      </div>
    </button>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={card}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full"
      >
        <span className={cardTitle}>{title}</span>
        {open ? <ChevronUp size={13} className="text-[#444]" /> : <ChevronDown size={13} className="text-[#444]" />}
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const color = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1">
        <span className="text-[9px] text-[#444]">{done}/{total} tamamlandı</span>
        <span className="text-[9px]" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ─── 1. HealthCommandCenter ───────────────────────────────────────────────────

function HealthCommandCenter({
  protocolDay,
  phase,
  focusLine,
  completedCount,
  totalCount,
  protocolStarted,
  PROTOCOL_START_DATE: startDate,
}: {
  protocolDay: number;
  phase: ReturnType<typeof useHealthProtocol>["phase"];
  focusLine: string;
  completedCount: number;
  totalCount: number;
  protocolStarted: boolean;
  PROTOCOL_START_DATE: string;
}) {
  const dayDisplay = protocolDay > 30 ? `Gün ${protocolDay}` : `Gün ${protocolDay} / 30`;
  const phaseLabel = PHASE_LABELS[phase];

  return (
    <div className={card}>
      <div className="flex items-start justify-between">
        <div>
          <span className={sectionLabel}>30 Günlük Sağlık Protokolü</span>
          {protocolStarted ? (
            <>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-white">{dayDisplay}</span>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{
                    color: phase === "attack" ? "#ef4444" : phase === "control" ? "#f59e0b" : "#22c55e",
                    background: phase === "attack" ? "rgba(239,68,68,0.1)" : phase === "control" ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)",
                    border: `1px solid ${phase === "attack" ? "rgba(239,68,68,0.3)" : phase === "control" ? "rgba(245,158,11,0.3)" : "rgba(34,197,94,0.3)"}`,
                  }}
                >
                  {phaseLabel}
                </span>
              </div>
              <p className="text-[11px] text-[#666] mt-1.5">Bugün: {focusLine}</p>
            </>
          ) : (
            <>
              <div className="text-lg font-bold text-white mt-1">Protokol başlamadı</div>
              <p className="text-[11px] text-[#555] mt-1">Başlangıç: {startDate}</p>
            </>
          )}
        </div>
        <div className="text-right shrink-0">
          <span className="text-2xl font-bold text-white">{completedCount}</span>
          <span className="text-[#444] text-sm">/{totalCount}</span>
          <p className={`${mutedText} mt-0.5`}>checklist</p>
        </div>
      </div>
      <ProgressBar done={completedCount} total={totalCount} />
    </div>
  );
}

// ─── 2. TodayHealthProtocolCard ───────────────────────────────────────────────

const CHECKLIST_META: Record<ChecklistField, { label: string; sub?: string }> = {
  waterDone:          { label: "2.5–3 litre su içtim" },
  proteinDone:        { label: "150g protein hedefini tutturdum" },
  noDairyGlutenSugar: { label: "Süt / gluten / şeker yemedim", sub: "30 gün veri temizliği" },
  shampooDone:        { label: "Şampuan rutinine uydum" },
  faceMorningDone:    { label: "Yüzümü sabah sade temizledim" },
  faceEveningDone:    { label: "Yüzümü akşam sade temizledim" },
  psylliumDone:       { label: "Psyllium 5g aldım", sub: "Gece, 500 ml su ile" },
  creatineDone:       { label: "Creatine 5g aldım" },
  hygieneDone:        { label: "Yastık / tişört / ter hijyenine dikkat ettim" },
  noPickingDone:      { label: "Kaşıma / sıkma yapmadım" },
};

function TodayHealthProtocolCard({
  todayCompletion,
  toggle,
}: {
  todayCompletion: DailyHealthCompletion;
  toggle: (f: ChecklistField) => void;
}) {
  return (
    <div className={card}>
      <span className={sectionLabel}>Günlük Sağlık Checklist</span>
      <div className="space-y-2.5 mt-1">
        {CHECKLIST_FIELDS.map(field => (
          <Checkbox
            key={field}
            checked={todayCompletion[field]}
            onToggle={() => toggle(field)}
            label={CHECKLIST_META[field].label}
            sub={CHECKLIST_META[field].sub}
          />
        ))}
      </div>
    </div>
  );
}

// ─── 3. NutritionProtocolCard ─────────────────────────────────────────────────

function NutritionProtocolCard({
  meals,
  toggleMeal,
}: {
  meals: DailyHealthCompletion["meals"];
  toggleMeal: (k: keyof DailyHealthCompletion["meals"]) => void;
}) {
  const mealItems: { key: keyof DailyHealthCompletion["meals"]; label: string; detail: string }[] = [
    { key: "breakfast", label: "Sabah — 40g protein", detail: "200ml yumurta beyazı + 1 tam yumurta + 50g tavuk/hindi + zeytinyağı" },
    { key: "lunch",     label: "Öğle — 40g protein",  detail: "160g pişmiş tavuk/hindi/dana + basmati pirinç + zeytinyağı" },
    { key: "snack",     label: "Ara öğün — 25g protein", detail: "Vegan protein 1 ölçek + su + buz + kahve + tarçın" },
    { key: "dinner",    label: "Akşam — 45g protein", detail: "Tavuk göğsü veya az yağlı dana + basmati pirinç + zeytinyağı" },
    { key: "night",     label: "Gece", detail: "Psyllium 5g + 500 ml su" },
  ];

  return (
    <div className={card}>
      <div className="flex items-center justify-between mb-3">
        <span className={sectionLabel}>Beslenme Protokolü</span>
        <span className="text-[9px] text-[#444]">1550–1650 kcal · 150g protein</span>
      </div>
      <div className="space-y-2">
        {mealItems.map(item => (
          <Checkbox
            key={item.key}
            checked={meals[item.key]}
            onToggle={() => toggleMeal(item.key)}
            label={item.label}
            sub={item.detail}
          />
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
        <p className="text-[9px] text-[#333]">Yasak: süt · yoğurt · peynir · whey · gluten · ekmek · şeker · fast food · protein bar · işlenmiş et (günlük)</p>
        <p className="text-[9px] text-[#333] mt-1">30 gün kaçak olmazsa cilt, saç, kilo ve enerji hakkında gerçek veri alırız.</p>
      </div>
    </div>
  );
}

// ─── 4. SupplementProtocolCard ────────────────────────────────────────────────

function SupplementProtocolCard({
  supplements,
  toggleSupplement,
  isWorkoutDay,
}: {
  supplements: DailyHealthCompletion["supplements"];
  toggleSupplement: (k: keyof DailyHealthCompletion["supplements"]) => void;
  isWorkoutDay: boolean;
}) {
  type SupKey = keyof DailyHealthCompletion["supplements"];

  interface SuppItem {
    key: SupKey;
    label: string;
    time: string;
    optional?: boolean;
  }

  const workoutItems: SuppItem[] = [
    { key: "d3k2",           label: "D3 + K2 damla",           time: "Sabah" },
    { key: "omega3",         label: "Sıvı Omega-3",            time: "Sabah" },
    { key: "veganProtein",   label: "Vegan Protein 1 ölçek",   time: "15:30" },
    { key: "optionalTyrosine", label: "Tyrosine / Alpha GPC",  time: "Antrenman öncesi", optional: true },
    { key: "creatine",       label: "Creatine 5g",             time: "Spor sonrası" },
    { key: "optionalGlutamine", label: "Glutamine 5g",         time: "Spor sonrası", optional: true },
    { key: "magnimore",      label: "Magnimore Plus saşe",     time: "Gece" },
    { key: "psyllium",       label: "Psyllium 5g + 500ml su",  time: "Gece" },
  ];

  const restItems: SuppItem[] = [
    { key: "d3k2",         label: "D3 + K2 damla",         time: "Sabah" },
    { key: "omega3",       label: "Sıvı Omega-3",          time: "Sabah" },
    { key: "veganProtein", label: "Vegan Protein 1 ölçek", time: "15:30" },
    { key: "creatine",     label: "Creatine 5g",           time: "Akşam" },
    { key: "magnimore",    label: "Magnimore Plus saşe",   time: "Gece" },
    { key: "psyllium",     label: "Psyllium 5g + 500ml su",time: "Gece" },
  ];

  const items = isWorkoutDay ? workoutItems : restItems;

  return (
    <div className={card}>
      <div className="flex items-center justify-between mb-3">
        <span className={sectionLabel}>Supplement Protokolü</span>
        <span
          className="text-[9px] px-1.5 py-0.5 rounded border"
          style={{
            color: isWorkoutDay ? "#22c55e" : "#888",
            borderColor: isWorkoutDay ? "rgba(34,197,94,0.25)" : "#2a2a2a",
          }}
        >
          {isWorkoutDay ? "Antrenman günü" : "Dinlenme günü"}
        </span>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.key} className="flex items-start gap-2">
            <div className="shrink-0 mt-0.5">
              <button
                type="button"
                onClick={() => toggleSupplement(item.key)}
                className="w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: supplements[item.key] ? "#22c55e" : "transparent",
                  borderColor: supplements[item.key] ? "#22c55e" : "#333",
                }}
              >
                {supplements[item.key] && <Check size={8} color="#000" strokeWidth={3} />}
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <span
                className="text-[11px] leading-tight"
                style={{ color: supplements[item.key] ? "#555" : "#bbb" }}
              >
                {item.label}
                {item.optional && <span className="text-[#444] ml-1">(opsiyonel)</span>}
              </span>
            </div>
            <span className="text-[9px] text-[#333] shrink-0">{item.time}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
        <p className="text-[9px] text-[#333]">Not: Magnimore ile psyllium arasına 2 saat koy.</p>
      </div>
    </div>
  );
}

// ─── 5. SkinHairProtocolCard ──────────────────────────────────────────────────

function SkinHairProtocolCard({
  todayCompletion,
  toggle,
  toggleBackRoutine,
  todayShampoo,
  dow,
}: {
  todayCompletion: DailyHealthCompletion;
  toggle: (f: ChecklistField) => void;
  toggleBackRoutine: () => void;
  todayShampoo: ReturnType<typeof useHealthProtocol>["todayShampoo"];
  dow: number;
}) {
  const [hairRulesOpen, setHairRulesOpen] = useState(false);
  const [faceRulesOpen, setFaceRulesOpen] = useState(false);
  const [backRulesOpen, setBackRulesOpen] = useState(false);

  // Back routine: Mon(1) + Thu(4)
  const isBackRoutineDay = dow === 1 || dow === 4;

  return (
    <div className={card}>
      <span className={sectionLabel}>Cilt & Saç Derisi Rutini</span>

      {/* Şampuan */}
      <div className="mb-4">
        <p className="text-[10px] text-[#666] font-medium mb-2">Bugünkü saç rutini</p>
        {todayShampoo ? (
          <div
            className="rounded-lg px-3 py-2.5 border mb-2"
            style={{
              background: todayShampoo.isRequired ? "rgba(245,158,11,0.05)" : "rgba(255,255,255,0.02)",
              borderColor: todayShampoo.isRequired ? "rgba(245,158,11,0.2)" : "#1f1f1f",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-white">{todayShampoo.product}</span>
              {todayShampoo.wait && (
                <span className="text-[9px] text-[#f59e0b]">{todayShampoo.wait} beklet</span>
              )}
            </div>
            <p className="text-[10px] text-[#555]">{todayShampoo.instruction}</p>
          </div>
        ) : (
          <div className="rounded-lg px-3 py-2 border border-[#1a1a1a] bg-[#0d0d0d] mb-2">
            <p className="text-[10px] text-[#444]">Bugün şampuan programlanmamış. Gerekirse Sebamed kullan.</p>
          </div>
        )}
        <Checkbox
          checked={todayCompletion.shampooDone}
          onToggle={() => toggle("shampooDone")}
          label="Şampuan rutinine uydum"
        />
        <button
          type="button"
          onClick={() => setHairRulesOpen(v => !v)}
          className="mt-2 text-[9px] text-[#444] hover:text-[#666] flex items-center gap-1"
        >
          {hairRulesOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          Saç derisi kuralları
        </button>
        {hairRulesOpen && (
          <ul className="mt-2 space-y-1 pl-2">
            {["Sıcak su yok, ılık su", "Tırnakla kaşıma/kazıma yok", "Wax, jöle, saç spreyi, saç yağı yok", "Şapka/kep terletiyorsa minimum", "Terledikten sonra saç derisini bekletme", "Havlu kişisel olacak", "Yastık kılıfı 2 günde bir değişecek"].map(r => (
              <li key={r} className="text-[9px] text-[#444]">· {r}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Yüz rutini */}
      <div className="pt-3 border-t border-[#1a1a1a] mb-4">
        <p className="text-[10px] text-[#666] font-medium mb-2">Yüz cilt rutini</p>
        <div className="space-y-2">
          <Checkbox
            checked={todayCompletion.faceMorningDone}
            onToggle={() => toggle("faceMorningDone")}
            label="Sabah: yumuşak jel temizleyici + yağsız nemlendirici"
          />
          <Checkbox
            checked={todayCompletion.faceEveningDone}
            onToggle={() => toggle("faceEveningDone")}
            label="Akşam: yumuşak temizleyici + nemlendirici"
          />
        </div>
        <button
          type="button"
          onClick={() => setFaceRulesOpen(v => !v)}
          className="mt-2 text-[9px] text-[#444] hover:text-[#666] flex items-center gap-1"
        >
          {faceRulesOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          Yüze yasak ürünler
        </button>
        {faceRulesOpen && (
          <ul className="mt-2 space-y-1 pl-2">
            {["Dermovate / Psoderm / Klobetazol", "Saç jölesi/wax teması", "Yağ sürmek", "Limon / kolonya / alkol bazlı ürün", "Sert peeling", "Sivilce sıkmak"].map(r => (
              <li key={r} className="text-[9px] text-[#444]">· {r}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Sırt / omuz */}
      <div className="pt-3 border-t border-[#1a1a1a]">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-[#666] font-medium">Sırt / omuz rutini</p>
          {!isBackRoutineDay && <span className="text-[9px] text-[#333]">Bugün programlanmamış</span>}
          {isBackRoutineDay && (
            <span className="text-[9px] text-[#f59e0b]">Konazol köpüğü günü</span>
          )}
        </div>
        {isBackRoutineDay && (
          <div className="space-y-2 mb-2">
            <Checkbox
              checked={todayCompletion.backRoutine}
              onToggle={toggleBackRoutine}
              label="Konazol köpüğü — sırt üst bölge, 3–5 dk beklet, durula"
            />
          </div>
        )}
        <button
          type="button"
          onClick={() => setBackRulesOpen(v => !v)}
          className="mt-1 text-[9px] text-[#444] hover:text-[#666] flex items-center gap-1"
        >
          {backRulesOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          Sırt kuralları
        </button>
        {backRulesOpen && (
          <ul className="mt-2 space-y-1 pl-2">
            {["Terli tişörtle oturma", "Antrenmandan sonra duş veya tişört değişimi", "Çarşaf haftada 1–2 kez değişsin", "Sırtı keseleme", "Yağlı vücut losyonu yok"].map(r => (
              <li key={r} className="text-[9px] text-[#444]">· {r}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── 6. WeeklyHealthCheckCard ─────────────────────────────────────────────────

function WeeklyHealthCheckCard({
  today,
  todayWeeklyCheck,
  saveWeeklyCheck,
}: {
  today: string;
  todayWeeklyCheck: WeeklyHealthCheck | null;
  saveWeeklyCheck: (c: WeeklyHealthCheck) => void;
}) {
  const [scores, setScores] = useState<Omit<WeeklyHealthCheck, "date">>({
    itching:       todayWeeklyCheck?.itching ?? 5,
    redness:       todayWeeklyCheck?.redness ?? 5,
    dandruff:      todayWeeklyCheck?.dandruff ?? 5,
    acne:          todayWeeklyCheck?.acne ?? 5,
    dietCompliance: todayWeeklyCheck?.dietCompliance ?? 5,
  });
  const [saved, setSaved] = useState(!!todayWeeklyCheck);

  const fields: { key: keyof typeof scores; label: string }[] = [
    { key: "itching",        label: "Kaşıntı (0=yok, 10=şiddetli)" },
    { key: "redness",        label: "Kızarıklık" },
    { key: "dandruff",       label: "Kepek / kabuk" },
    { key: "acne",           label: "Yeni sivilce / folikülit" },
    { key: "dietCompliance", label: "Diyete uyum (10=mükemmel)" },
  ];

  const handleSave = () => {
    saveWeeklyCheck({ date: today, ...scores });
    setSaved(true);
  };

  return (
    <div className={card}>
      <div className="flex items-center justify-between mb-3">
        <span className={sectionLabel}>Haftalık Sağlık Skoru</span>
        <span className="text-[9px] text-[#555]">Her Pazar</span>
      </div>
      <div className="space-y-3">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#888]">{label}</span>
              <span className="text-[11px] text-white font-medium">{scores[key]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={scores[key]}
              onChange={e => { setScores(s => ({ ...s, [key]: Number(e.target.value) })); setSaved(false); }}
              className="w-full h-1 accent-[#f59e0b]"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleSave}
        className="mt-3 w-full py-2 rounded-lg border text-[11px] font-medium transition-colors"
        style={{
          background: saved ? "rgba(34,197,94,0.08)" : "rgba(245,158,11,0.08)",
          borderColor: saved ? "rgba(34,197,94,0.25)" : "rgba(245,158,11,0.25)",
          color: saved ? "#22c55e" : "#f59e0b",
        }}
      >
        {saved ? "Kaydedildi" : "Kaydet"}
      </button>
    </div>
  );
}

// ─── 7. RedLinesAccordion ─────────────────────────────────────────────────────

function RedLinesAccordion() {
  const [open, setOpen] = useState(false);

  const sections = [
    {
      title: "Kırmızı Alarm — Doktora Git",
      color: "#ef4444",
      items: [
        "14 günde en az %50 düzelme yoksa",
        "Sarı kabuk veya irin varsa",
        "Ağrı artıyorsa",
        "Lezyonlar hızla yayılıyorsa",
        "Ateş varsa",
        "Göz çevresinde şişlik varsa",
        "Sırt lezyonları nodül/kist gibi derinleşiyorsa",
        "Skyrizi sonrası enfeksiyon şüphesi varsa",
      ],
    },
    {
      title: "Cilt Yasakları",
      color: "#f59e0b",
      items: [
        "Dermovate / Psoderm / Klobetazol kullanmak",
        "Yüze yağ veya limon sürmek",
        "Sert peeling veya kese",
        "Sivilce sıkmak",
        "Saç ürünleri yüz teması",
      ],
    },
    {
      title: "Supplement Yasakları",
      color: "#f59e0b",
      items: [
        "ZMA + magnezyum + çinko + multivitamin aynı gün",
        "Kapsül/tablet formda yutamadığın ürünlerde ısrar",
        "Her gün multivitamin bombardımanı",
        "Gece geç saatte uyarıcı nootropik",
        "Whey protein — 30 gün yok",
        "ZMA, multivitamin, EAA, Flava Magnesium — şimdilik yok",
      ],
    },
  ];

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
          <span className="text-[11px] text-white font-semibold">Kırmızı Çizgiler & Yasaklar</span>
        </div>
        {open ? <ChevronUp size={13} className="text-[#444]" /> : <ChevronDown size={13} className="text-[#444]" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-[#1a1a1a]">
          <p className="text-[10px] text-[#444] mt-3">
            Bu alan tıbbi teşhis koymaz. Sadece güvenlik uyarısı.
          </p>
          {sections.map(s => (
            <div key={s.title}>
              <p className="text-[10px] font-bold mb-1.5" style={{ color: s.color }}>{s.title}</p>
              <ul className="space-y-1">
                {s.items.map(item => (
                  <li key={item} className="text-[10px] text-[#555] flex items-start gap-1.5">
                    <span style={{ color: s.color }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main HealthPage ──────────────────────────────────────────────────────────

export function HealthPage() {
  const protocol = useHealthProtocol();

  return (
    <HealthShell>
      {/* Header */}
      <div>
        <span className="text-[#444444] text-[10px] uppercase tracking-widest block font-medium">SAĞLIK</span>
        <h1 className="text-white font-bold text-xl mt-0.5">30 Günlük Protokol</h1>
      </div>

      {/* 1. Command Center */}
      <HealthCommandCenter
        protocolDay={protocol.protocolDay}
        phase={protocol.phase}
        focusLine={protocol.focusLine}
        completedCount={protocol.completedCount}
        totalCount={protocol.totalCount}
        protocolStarted={protocol.protocolStarted}
        PROTOCOL_START_DATE={protocol.PROTOCOL_START_DATE}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 3. Nutrition */}
        <NutritionProtocolCard
          meals={protocol.todayCompletion.meals}
          toggleMeal={protocol.toggleMeal}
        />

        {/* 4. Supplements */}
        <SupplementProtocolCard
          supplements={protocol.todayCompletion.supplements}
          toggleSupplement={protocol.toggleSupplement}
          isWorkoutDay={protocol.isWorkoutDay}
        />
      </div>

      {/* 5. Skin & Hair */}
      <SkinHairProtocolCard
        todayCompletion={protocol.todayCompletion}
        toggle={protocol.toggle}
        toggleBackRoutine={protocol.toggleBackRoutine}
        todayShampoo={protocol.todayShampoo}
        dow={protocol.dow}
      />

      {/* 6. Weekly Check — only on Sundays */}
      {protocol.isSunday && (
        <WeeklyHealthCheckCard
          today={protocol.today}
          todayWeeklyCheck={protocol.todayWeeklyCheck}
          saveWeeklyCheck={protocol.saveWeeklyCheck}
        />
      )}

      {/* 7. Red Lines */}
      <RedLinesAccordion />
    </HealthShell>
  );
}
