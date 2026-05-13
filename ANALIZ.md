# FEED THE GOAT — UI/UX Sadeleştirme Analizi

> Tarih: 2026-05-13 | Amaç: Kod değiştirmeden önce sistemi anlamak

---

## 1. Proje Stack Özeti

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16, React 19, TypeScript 5 |
| Stil | Tailwind CSS 4 |
| Backend | Supabase (PostgreSQL) |
| State | Server Components + localStorage (client) |
| Mutasyon | Next.js Server Actions + `revalidatePath("/")` |
| Diğer | Google AI SDK, Telegram Bot, date-fns, Zod |

---

## 2. Dosya Yapısı Özeti

```
src/
├── app/
│   ├── (dashboard)/page.tsx     ← ANA DASHBOARD (522 satır, tüm tab routing)
│   ├── actions/                 ← Server Actions (taskActions, endDayActions, vitaminActions...)
│   ├── api/telegram/route.ts    ← Telegram bot webhook
│   ├── arsiv/                   ← Spor / Haftalık / Finans arşiv sayfaları
│   └── universite/              ← Ayrı üniversite sayfası
│
├── components/
│   ├── daily/                   ← Günlük tab bileşenleri (30 dosya)
│   ├── dashboard/               ← Dashboard widget'ları (GoatEvolution, ScoringBars...)
│   ├── weekly/                  ← Haftalık tab bileşenleri
│   ├── sport/                   ← Spor tab bileşenleri
│   ├── career/                  ← Kariyer tab bileşenleri
│   ├── finance/                 ← Finans bileşenleri
│   └── layout/Sidebar.tsx       ← 72px sabit navigasyon sidebar
│
├── data/
│   ├── wakeUpMessages.ts        ← 200+ motivasyon mesajı (1339 satır)
│   ├── weeklyFocusConfig.ts     ← Günlük odak temaları + antrenman günleri
│   └── quotes.json              ← 1000+ alıntı havuzu
│
├── lib/
│   ├── goatState.ts             ← Keçi evresi hesabı (OGLAK → GOAT)
│   ├── streakLogic.ts           ← Seri eşikleri (50P normal, 30P Pazar)
│   ├── scoring.ts               ← Puan caps (discipline:35, health:35, total:70)
│   ├── dayModules.ts            ← Pazar = sunday_charge_mode
│   ├── dayUtils.ts              ← Türkçe gün haritası + İngilizce günleri
│   └── supabaseServer.ts        ← Server Supabase client
│
└── utils/
    ├── useDailyScore.ts         ← KRİTİK: Client puan hook (localStorage)
    ├── supabase.ts              ← Client Supabase helper
    └── cn.ts                   ← clsx wrapper
```

---

## 3. Günlük Sayfa Bileşen Sırası

`src/app/(dashboard)/page.tsx` içinde render sırası (yukarıdan aşağı):

| # | Bileşen | Dosya | Notlar |
|---|---------|-------|--------|
| 1 | `Greeting` | `daily/Greeting.tsx` | Tarih + isim başlığı |
| 2 | `DuaPanel` | `daily/DuaPanel.tsx` | Gece duası + alıntı, collapsible |
| 3 | `TEDCard` | `daily/TABCard.tsx` | Hafta sonu TED önerisi |
| 4 | `DailyMotto` | `dashboard/DailyMotto.tsx` | Günlük motto |
| 5 | `ActionReminderBanner` | `dashboard/ActionReminderBanner.tsx` | Eylem hatırlatması |
| 6 | `DashboardClient` | `dashboard/DashboardClient.tsx` | **CLIENT**: Enerji + Keçi görseli |
| 7 | `ScoringBars` | `daily/ScoringBars.tsx` | Disiplin/Üretim/Sağlık çubukları |
| 8 | `TaskGroup "kritik"` | `daily/TaskGroup.tsx` | Kritik rutinler |
| 9 | `WaterTracker + NutritionCard` | `dashboard/` | Grid düzen |
| 10 | `BadHabitFire` | `dashboard/BadHabitFire.tsx` | Kötü alışkanlık kontrolü |
| 11 | `DayModule` | `dashboard/DayModule.tsx` | Pazar = Şarj Modu |
| 12 | `TaskGroup "active"` | `daily/TaskGroup.tsx` | Aktif görevler (P1/P2/P3) |
| 13 | `TaskGroup "sistem"` | `daily/TaskGroup.tsx` | Sistem görevleri |
| 14 | `EndDayButton` | `daily/EndDayButton.tsx` | Günü bitir |
| 15 | `FinanceWidget` | `dashboard/FinanceWidget.tsx` | Finans özeti |

---

## 4. Görevler / Rutinler / Sistemler Nerede Tutuluyor?

| Veri | Kaynak | Bileşen |
|------|--------|---------|
| Kritik rutinler (şablon) | Supabase `task_templates` | `TaskCard.tsx` |
| Aktif görevler (P1/P2/P3) | Supabase `active_tasks` | `ActiveTaskCard.tsx` |
| Günlük tamamlanma | Supabase `daily_completions` | Server Action |
| Kariyer faz/beceri | Supabase `career_phases`, `career_skills` | `CareerShell.tsx` |
| Haftalık kazanımlar | Supabase `weekly_minimum_gains` | `MinimumGainsCard.tsx` |
| UI puan cache | localStorage (4 anahtar) | `useDailyScore.ts` |

---

## 5. State Management Akışı

```
Server Component (page.tsx)
    │
    ├─ Supabase Promise.all sorgular
    │   (goat_state, task_templates, daily_completions,
    │    active_tasks, energy_checkins, daily_quotes,
    │    vitamin_packages, skincare_completions)
    │
    └─ Props olarak Client Components'e geçer

Client Components
    │
    ├─ localStorage'dan skor hesaplar (useDailyScore.ts)
    └─ Optimistic updates (optimisticIds)

Server Actions (taskActions.ts, endDayActions.ts)
    │
    ├─ Supabase mutation (INSERT / UPDATE / DELETE)
    ├─ revalidatePath("/")
    └─ window.dispatchEvent("dailyScoreUpdated")
            │
            └─ useDailyScore yeniden hesaplar
```

---

## 6. Supabase / Backend Durumu

**Bağlantı:** `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
**Auth yok** — tek kullanıcılı uygulama, public key yeterli.

**Kritik tablolar:**

| Tablo | Amaç |
|-------|------|
| `goat_state` | Seri, evrim aşaması, son gün bitirme |
| `task_templates` | Kritik rutin şablonları |
| `daily_completions` | Hangi şablon, hangi gün tamamlandı |
| `active_tasks` | Kullanıcı oluşturan P1/P2/P3 görevler |
| `daily_scores` | Finalize edilmiş günlük puanlar |
| `vitamin_package_completions` | Vitamin takibi |
| `energy_checkins` | Günlük enerji seviyesi |
| `career_phases` + `career_skills` | Kariyer sistemi |
| `finance_state` | Net bakiye + durum |

---

## 7. Günlük Skor Sistemi

### Hesaplama: `src/utils/useDailyScore.ts`

Client-side hook, 4 localStorage anahtarını okur:

| Anahtar | İçerik | Puan |
|---------|--------|------|
| `goat-never-break-v2` | Uyanış+Buz: 15, Diş: 5, Vitamin: 5, Workout: 20, Kitap: 10 | 15–55P |
| `goat-content-sharing-v1` | X paylaşımı | 15P |
| `goat-active-tasks-v2` | P1: 20, P2: 8, P3: 4 | değişken |
| `goat-bonus-tasks-v1` | Erken yat: 5, Ekstra kitap: 5, İngilizce: 10, Koşubandı: 10 | 0–30P |

**Max puan:**
- Spor günleri (Pzt, Sal, Prş, Cmt): **100P**
- Diğer günler: **80P**

**Renk eşikleri:**
- 0–40: 🔴 Kırmızı
- 41–65: 🟡 Sarı
- 66+: 🟢 Yeşil

### Caps: `src/lib/scoring.ts`

```
discipline: 35P
health:     35P
total:      70P  (production ayrı takip edilir, toplama eklenmez)
```

---

## 8. Tab Yapısı

```
/?tab=GUNLUK   → DailyShell   (varsayılan)
/?tab=SPOR     → SportShell
/?tab=HAFTALIK → WeeklyShell
/?tab=KARIYER  → CareerShell
/arsiv/finans  → FinanceShell (ayrı route)
/universite    → Ayrı sayfa
```

Navigasyon: `src/components/layout/Sidebar.tsx` — 72px sabit sidebar, 3 ana link + arşiv dropdown + avatar.

---

## 9. Değiştirilebilecek Ana Bileşenler

UI/UX sadeleştirme için güvenli değişim noktaları:

| Bileşen | Dosya | Ne Değiştirilebilir |
|---------|-------|---------------------|
| Bileşen sırası | `page.tsx` | JSX sıralanması — state bağlantısı yok |
| Shell layout | `DailyShell.tsx` | `max-w-[800px]` wrapper, padding, gap |
| Görev kartı UI | `TaskCard.tsx`, `ActiveTaskCard.tsx` | İçi HTML/CSS — onClick mantığına dokunma |
| Puan çubukları | `ScoringBars.tsx` | Görsel tasarım |
| Hero bölgesi | `HeroZone.tsx`, `DashboardClient.tsx` | Layout, boyut |
| Başlık | `Greeting.tsx` | Metin, tipografi |

---

## 10. Dokunulmaması Gereken Sistemler

| Sistem | Neden |
|--------|-------|
| `useDailyScore.ts` + localStorage anahtarları | Tüm puan UI buraya bağlı, anahtar ismi değişirse skor sıfırlanır |
| `task_templates` / `daily_completions` tabloları | Kritik rutinlerin Supabase hafızası |
| `goat_state` tablosu + `streakLogic.ts` | Seri ve keçi evresi buradan hesaplanır |
| `endDayActions.ts` | Gün bitişi Supabase'e yazar; kırılırsa veri kaybı |
| `weeklyFocusConfig.ts` antrenman günleri | `useDailyScore` maxPuan hesabını etkiler |
| `window.dispatchEvent("dailyScoreUpdated")` | Server Action'ların içinde var, eksik kalırsa UI güncellenmez |
| `revalidatePath("/")` | Her Server Action'ın sonunda, kaldırılırsa sayfa stale kalır |

---

## 11. Yeni UI için Teknik Plan

### Güvenli Adımlar (sırasıyla)

1. **Bileşen sırasını yeniden düzenle**  
   `page.tsx` içinde JSX bloklarını taşı. State, props, action hiçbirini değiştirme.

2. **Shell layout'u güncelle**  
   `DailyShell.tsx` → padding, max-width, gap değerleri.

3. **Leaf component'lerin HTML'ini düzenle**  
   `TaskCard.tsx`, `ActiveTaskCard.tsx`, `ScoringBars.tsx` — sadece JSX yapısı ve Tailwind class'ları.

4. **Gereksiz bileşenleri koşullu gizle**  
   `DuaPanel`, `TEDCard`, `BadHabitFire` gibi bileşenler `null` return ettirilerek geçici olarak devre dışı bırakılabilir.

5. **Yeni layout bileşeni ekle**  
   Mevcut bileşenleri yeni bir wrapper içinde grupla (örn. `MorningBlock`, `TaskBlock`).

### Öneri: Minimal Akış

```
[Sabah Kartı]        → Greeting + FocusCard + EnergyCheckIn
[Skor]               → GoatEvolution + ScoringBars
[Kritik Rutinler]    → TaskGroup "kritik"
[Görevler]           → TaskGroup "active"
[İçerik + Bonus]     → XPostSection + TaskGroup "sistem"
[Gün Bitir]          → EndDayButton
```

---

## 12. Riskli Alanlar

| Risk | Detay | Önlem |
|------|-------|-------|
| localStorage anahtar değişimi | `useDailyScore.ts` sabit string bekler | İsimlere dokunma |
| `window.dispatchEvent` eksik kalırsa | Puan UI güncellenmez ama Supabase doğru kalır | Her Server Action'da koru |
| `DashboardClient.tsx` — CLIENT boundary | Enerji state'i burada; Server Component içine taşınamaz | Wrapper'ı koru |
| `EndDayButton` → `consistency_days++` | Gün bitirmeden seri sayılmaz; görsel değişim seriyi etkilemez | Bileşene dokunma |
| Pazar günü `DayModule` | Sadece Pazar'da `sunday_charge_mode` aktif, diğer günlerde `null` | Koşul mantığına dokunma |

---

*Analiz tamamlandı. Kod değişikliği yapılmamıştır.*
