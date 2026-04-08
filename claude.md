# FEED THE GOAT — CLAUDE.md

# Claude Code bu dosyayı her oturumda otomatik okur.

## Proje Özeti

Next.js 14 App Router + TypeScript + Tailwind + Supabase kişisel disiplin uygulaması.
Kullanıcı: Ali Cem Bozma. DEHB uyumlu, minimal, disiplin odaklı UI felsefesi.

## Klasör Yapısı

- src/app → Next.js sayfa route'ları
- src/components → Yeniden kullanılabilir UI bileşenleri
- src/data → Statik config verileri (rutin listesi, haftalık odak config vb.)
- src/lib → Supabase client ve yardımcı fonksiyonlar
- src/utils → Utility fonksiyonlar

## Kritik Kurallar — ASLA İHLAL ETME

1. Supabase'deki mevcut tablo yapısı ve veriler dokunulmaz. Yeni tablo/kolon eklemeden önce mevcut schema'yı oku.
2. Mevcut tab sistemi (Günlük / Spor & Sağlık / Haftalık / Kariyer / Finans) bozulmaz.
3. Tüm mevcut logic, state ve API çağrıları çalışır halde kalır.
4. localStorage'a kritik veri yazılmaz — kalıcı veri sadece Supabase üzerinden.
5. Her değişiklik öncesi ilgili dosyayı oku, sonra yaz.

## Tasarım Sistemi

Tema: Siyah zemin (#0a0a0a), military/monospace estetik, flat (shadow yok).
Renkler:

- bg-card: #111111
- border: #1f1f1f
- green: #22c55e (tamamlandı)
- red: #ef4444 (kritik)
- yellow: #f59e0b (uyarı)
- orange: #f97316 (P1 görev / içerik)
- muted: #404040
  Font: IBM Plex Mono (başlıklar), DM Sans (body)
  Border radius: 6px. Buton min-height: 40px.

## Haftalık Odak Konfigürasyonu

src/data/weeklyFocusConfig.ts dosyasında tanımlı olmalı:

- Pazartesi: Ajans + Kariyer | #3b82f6 | antrenman: true (Upper A)
- Salı: Üniversite + Ajans | #8b5cf6 | antrenman: true (Lower A)
- Çarşamba: Üniversite + Deep Work | #06b6d4 | antrenman: false
- Perşembe: Ajans + Kariyer | #3b82f6 | antrenman: true (Upper B)
- Cuma: Üniversite + İçerik | #10b981 | antrenman: false
- Cumartesi: Serbest Üretim | #f59e0b | antrenman: true (Lower B)
- Pazar: Şarj Günü | #6b7280 | antrenman: false

## Puan Sistemi

Hook: src/utils/useDailyScore.ts

- Uyanış + Yüze Buz: 15 puan
- Diş + Gargara: 5 puan
- Vitaminler: 5 puan
- Antrenman (Pzt/Sal/Prş/Cmt): 20 puan
- 15 sayfa kitap: 10 puan
- X paylaşımı: 15 puan
- P1 görev: 20 puan
- P2 görev: 8 puan
- Bonus (gece 23 öncesi yat): 5 puan
- Bonus (ekstra 10 sayfa): 5 puan
  Max puan: antrenman günü 100, diğer günler 80.
  Eşikler: 0-40 kırmızı | 41-65 sarı | 66+ yeşil

## Vitamin Modal Davranışı

Vitaminler rutinine tıklandığında VitaminCheckModal açılır.
Modal, Spor & Sağlık > Vitamin Takip'teki Sabah Kombosu listesini okur.
Her vitamin için checkbox. Tümü işaretlenince rutin tamamlanır.

## Günlük Sekme Bölüm Sırası (Yukarıdan Aşağı)

1. Sabah Fokus Kartı (günün odağı + antrenman durumu)
2. Günlük Puan Sayacı (progress bar, header sağı)
3. Kritik Rutinler
4. İçerik Paylaşımı (X/Twitter) — her zaman açık, collapse yok
5. Aktif Görevler (max 5 görünür)
6. Bonus Görevler (2 otomatik öneri)
7. Gün Bitir butonu
