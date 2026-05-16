// Source of truth for rhythm scheduling.
// Internal logic (task IDs, Supabase fields, localStorage keys) is untouched.
// This config drives: display titles, optional labels, day visibility helpers.

export type RhythmId = "sport" | "english" | "saz" | "treadmill" | "kelime";

export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

// JS getDay() → DayKey
const JS_TO_DAY: Record<number, DayKey> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

export type RhythmTaskStep = {
  label: string;
  duration?: string;
  required?: boolean;
};

export type RhythmResource = {
  label: string;
  type: "course" | "book" | "app" | "list" | "video" | "other";
};

export type RhythmCompletionRule = {
  label: string;
};

export type WorkoutExercise = {
  name: string;
  sets?: number;
  reps?: string;
  note?: string;
  required?: boolean;
};

export type RhythmVariant = {
  label: string;
  shortLabel?: string;
  duration?: string;
  timeHint?: string;
  optional: boolean;
  intensity?: "mini" | "light" | "main" | "review" | "recovery" | "optional";
  description?: string;
  steps?: RhythmTaskStep[];
  resources?: RhythmResource[];
  completionRules?: RhythmCompletionRule[];
  minimumVersion?: string;
  note?: string;
  // Sport-specific fields
  warmup?: WorkoutExercise[];
  exercises?: WorkoutExercise[];
  cardio?: WorkoutExercise[];
  safetyRules?: string[];
};

export const SPORT_GLOBAL_RULES: string[] = [
  "Ağırlıklar RPE 7–8 arası.",
  "Failure yok.",
  "Bel veya bacağa vuran ağrı artarsa hareketi kes.",
  "Koşu yok.",
  "Kardiyo: bisiklet, eliptik veya tempolu yürüyüş.",
  "Program değişmeyecek.",
  "Sadece ağırlık, tekrar veya kardiyo süresi artacak.",
  "Ağrı varsa egoyu bırak, hareketi kes veya hafiflet.",
];

type RhythmConfig = {
  label: string;
  days: readonly DayKey[];
  type?: string;
  timeHint?: string;
  description?: string;
  variants?: Partial<Record<DayKey, RhythmVariant>>;
};

// ── Shared variant bases ───────────────────────────────────────────────────────

const KELIME_VARIANT: RhythmVariant = {
  label: "Günlük İngilizce Kelime",
  duration: "10–15 dk",
  intensity: "mini",
  optional: false,
  description: "8–10 kelime yaz, her kelimeyle 1 cümle kur, dünün kelimelerini hatırla.",
  steps: [
    { label: "Dün çalıştığın kelimeleri hatırlamaya çalış", required: true },
    { label: "8–10 yeni kelime yaz", required: true },
    { label: "Her kelimeyle 1 basit cümle kur", required: true },
    { label: "Zorlandığın kelimeleri işaretle" },
    { label: "Minimum günlerde sadece 5 kelime yap" },
  ],
  resources: [
    { label: "Oxford 3000 kelime listeleri", type: "list" },
    { label: "Fielse Vocabulary Mastery", type: "course" },
    { label: "English for Everyone Vocabulary", type: "book" },
    { label: "Vocabulary in Use", type: "book" },
    { label: "Words A1-A2 B1-B2 C1-C2", type: "book" },
  ],
  completionRules: [
    { label: "8–10 kelime yazıldı" },
    { label: "Her kelimeyle 1 cümle kuruldu" },
    { label: "Dünün kelimeleri tekrar edildi" },
  ],
  minimumVersion: "5 kelime yaz, 5 basit cümle kur.",
};

// ── Main schedule ──────────────────────────────────────────────────────────────

export const RHYTHM_SCHEDULE = {
  sport: {
    label: "Spor",
    days: ["monday", "wednesday", "friday", "saturday"] as const,
    type: "main",
    timeHint: "Akşam / iş çıkışı",
    description: "İş biter bitmez. Eve gelip oturmadan çık.",
    variants: {
      monday: {
        label: "Upper A + Kardiyo",
        shortLabel: "Upper A",
        duration: "75–90 dk",
        timeHint: "Akşam / iş çıkışı",
        intensity: "main",
        optional: false,
        description: "Üst vücut ana gün. Göğüs, sırt, omuz ve kol çalışılır. Antrenman sonunda eğimli kardiyo yapılır.",
        warmup: [
          { name: "Bisiklet veya eliptik", reps: "10 dk" },
        ],
        exercises: [
          { name: "Machine Chest Press", sets: 4, reps: "8–12 tekrar" },
          { name: "Chest Supported Row", sets: 4, reps: "8–12 tekrar" },
          { name: "Neutral Grip Lat Pulldown", sets: 3, reps: "10–12 tekrar" },
          { name: "Machine Shoulder Press", sets: 3, reps: "8–10 tekrar" },
          { name: "Cable Lateral Raise", sets: 4, reps: "12–20 tekrar" },
          { name: "Rope Pushdown", sets: 3, reps: "10–15 tekrar" },
          { name: "Hammer Curl", sets: 3, reps: "10–15 tekrar" },
          { name: "Face Pull", sets: 3, reps: "15–20 tekrar", note: "Tükenişe yakın ama failure yok" },
        ],
        cardio: [
          { name: "Eğimli kardiyo", reps: "20 dk" },
        ],
        completionRules: [
          { label: "Isınma yapıldı" },
          { label: "Ana hareketler tamamlandı" },
          { label: "Kardiyo (20 dk) tamamlandı" },
          { label: "Ağrı kontrolü yapıldı" },
          { label: "RPE 7–8 dışına çıkılmadı" },
        ],
        safetyRules: ["Bel ağrısı takip edildi", "Failure yapılmadı"],
      } as RhythmVariant,

      wednesday: {
        label: "Lower A + Core + Interval",
        shortLabel: "Lower A",
        duration: "75–90 dk",
        timeHint: "Akşam / iş çıkışı",
        intensity: "main",
        optional: false,
        description: "Alt vücut ve core günü. Kontrollü derinlik, bel/bacak ağrısı takibi ve antrenman sonunda eğimli kardiyo odaklıdır.",
        warmup: [
          { name: "Bisiklet veya eliptik", reps: "10 dk" },
        ],
        exercises: [
          { name: "Seated Leg Curl", sets: 4, reps: "10–12 tekrar" },
          { name: "Leg Extension", sets: 4, reps: "12–15 tekrar" },
          { name: "Leg Press", sets: 3, reps: "10–12 tekrar", note: "Kontrollü derinlik — bel/bacak ağrısı artarsa kes" },
          { name: "Hip Thrust Machine", sets: 4, reps: "8–12 tekrar" },
          { name: "Seated Calf Raise", sets: 4, reps: "12–20 tekrar" },
          { name: "Pallof Press", sets: 3, reps: "12 tekrar" },
          { name: "Dead Bug", sets: 2, reps: "10 tekrar" },
          { name: "Side Plank", sets: 3, reps: "tutma" },
        ],
        cardio: [
          { name: "Eğimli kardiyo", reps: "20 dk" },
        ],
        completionRules: [
          { label: "Isınma yapıldı" },
          { label: "Lower hareketleri tamamlandı" },
          { label: "Core hareketleri tamamlandı" },
          { label: "Kardiyo (20 dk) tamamlandı" },
          { label: "Bel/bacak ağrısı kontrol edildi" },
          { label: "Failure yapılmadı" },
        ],
        safetyRules: ["Leg Press derinliğine dikkat", "Bel ağrısı takip edildi"],
      } as RhythmVariant,

      friday: {
        label: "Upper B + Uzun Kardiyo",
        shortLabel: "Upper B",
        duration: "80–95 dk",
        timeHint: "Akşam / iş çıkışı",
        intensity: "main",
        optional: false,
        description: "Üst vücut ikinci gün. Farklı press/row açıları, arka omuz, kol ve daha uzun kardiyo içerir.",
        warmup: [
          { name: "Bisiklet veya eliptik", reps: "10 dk" },
        ],
        exercises: [
          { name: "Incline Machine Press", sets: 4, reps: "8–10 tekrar" },
          { name: "Seated Cable Row", sets: 4, reps: "10–12 tekrar" },
          { name: "Lat Pulldown", sets: 3, reps: "12–15 tekrar" },
          { name: "Pec Deck", sets: 3, reps: "12–15 tekrar" },
          { name: "Reverse Pec Deck", sets: 4, reps: "15–20 tekrar" },
          { name: "Cable Curl", sets: 3, reps: "10–15 tekrar" },
          { name: "Rope Pushdown", sets: 3, reps: "10–15 tekrar" },
          { name: "Cable Lateral Raise", sets: 3, reps: "15–20 tekrar" },
          { name: "Face Pull", sets: 3, reps: "15–20 tekrar", note: "Tükenişe yakın ama failure yok" },
        ],
        cardio: [
          { name: "Eğimli kardiyo", reps: "30 dk" },
        ],
        completionRules: [
          { label: "Isınma yapıldı" },
          { label: "Ana hareketler tamamlandı" },
          { label: "Uzun kardiyo (30 dk) tamamlandı" },
          { label: "RPE 7–8 korundu" },
          { label: "Failure yapılmadı" },
        ],
        safetyRules: ["Bel ağrısı takip edildi", "Failure yapılmadı"],
      } as RhythmVariant,

      saturday: {
        label: "Lower B + Metabolik Gün",
        shortLabel: "Lower B",
        duration: "75–90 dk",
        timeHint: "Akşam / iş çıkışı",
        intensity: "main",
        optional: false,
        description: "Alt vücut ikinci gün. Kontrollü bacak çalışması, core ve metabolik bitiriş içerir. Cumartesi saz ve hafif İngilizce de var; enerjini dengeli kullan.",
        warmup: [
          { name: "Bisiklet veya eliptik", reps: "10 dk" },
        ],
        exercises: [
          { name: "Leg Press", sets: 4, reps: "12–15 tekrar", note: "Kontrollü derinlik — bel/bacak ağrısı artarsa kes" },
          { name: "Lying veya Seated Leg Curl", sets: 4, reps: "10–12 tekrar" },
          { name: "Leg Extension", sets: 3, reps: "15–20 tekrar" },
          { name: "Supported Split Squat", sets: 3, reps: "8–10 tekrar" },
          { name: "Cable Hip Abduction", sets: 3, reps: "12–15 tekrar" },
          { name: "Seated Calf Raise", sets: 4, reps: "12–20 tekrar" },
          { name: "Bird Dog", sets: 3, reps: "8 tekrar" },
          { name: "Pallof Press", sets: 3, reps: "12 tekrar" },
        ],
        cardio: [
          { name: "Eğimli kardiyo", reps: "20 dk" },
        ],
        completionRules: [
          { label: "Isınma yapıldı" },
          { label: "Lower hareketleri tamamlandı" },
          { label: "Core hareketleri tamamlandı" },
          { label: "Kardiyo (20 dk) tamamlandı" },
          { label: "Ağrı kontrolü yapıldı" },
          { label: "Program değiştirilmedi" },
        ],
        safetyRules: ["Cumartesi yoğun gün — enerjini dengeli kullan", "Bel ağrısı takip edildi"],
      } as RhythmVariant,
    } as Partial<Record<DayKey, RhythmVariant>>,
  },

  kelime: {
    label: "Günlük İngilizce Kelime",
    days: [
      "monday", "tuesday", "wednesday", "thursday",
      "friday", "saturday", "sunday",
    ] as const,
    variants: {
      monday:    KELIME_VARIANT,
      tuesday:   KELIME_VARIANT,
      wednesday: KELIME_VARIANT,
      thursday:  KELIME_VARIANT,
      friday:    KELIME_VARIANT,
      saturday:  KELIME_VARIANT,
      sunday:    KELIME_VARIANT,
    },
  },

  english: {
    label: "İngilizce",
    days: ["tuesday", "thursday", "saturday", "sunday"] as const,
    variants: {
      tuesday: {
        label: "İngilizce Mikro Temas",
        duration: "20–30 dk",
        intensity: "light",
        optional: false,
        description: "İngilizceyle haftaya yumuşak giriş. Kısa ders/video, birkaç kelime, birkaç cümle ve kısa sesli tekrar.",
        steps: [
          { label: "Fielse'den kısa bir ders/video aç", required: true },
          { label: "5–8 yeni kelime çıkar", required: true },
          { label: "5 basit cümle yaz", required: true },
          { label: "2 dakika sesli oku veya tekrar et", required: true },
          { label: "Bugün öğrendiğin 3 şeyi İngilizce söyle", required: true },
        ],
        resources: [
          { label: "Fielse English 2", type: "course" },
          { label: "Fielse English 3", type: "course" },
          { label: "Vocabulary Mastery", type: "book" },
          { label: "Proverbs", type: "list" },
          { label: "Kısa grammar konusu", type: "other" },
        ],
        completionRules: [
          { label: "5–8 kelime çıkarıldı" },
          { label: "5 cümle yazıldı" },
          { label: "2 dakika sesli tekrar yapıldı" },
          { label: "\"Bugün öğrendiğim 3 şeyi söyleyebiliyorum\" çıktısı alındı" },
        ],
      } as RhythmVariant,

      thursday: {
        label: "İngilizce Ana Çalışma",
        duration: "40–60 dk",
        intensity: "main",
        optional: false,
        description: "Haftanın asıl İngilizce dersi. Fielse ana omurga. Önce tekrar, sonra ana ders, sonra grammar/vocabulary destek ve kısa çıktı.",
        steps: [
          { label: "10 dk önceki dersi tekrar et", duration: "10 dk", required: true },
          { label: "25–30 dk Fielse ana ders çalış", duration: "25–30 dk", required: true },
          { label: "10 dk grammar veya vocabulary destek yap", duration: "10 dk", required: true },
          { label: "10 kelime/cümle çıkar", required: true },
          { label: "1 kısa paragraf yaz veya 1 dakikalık ses kaydı al", required: true },
        ],
        resources: [
          { label: "Fielse English 2: A2-B1", type: "course" },
          { label: "Fielse English 3: B1-B2", type: "course" },
          { label: "Vocabulary Mastery", type: "book" },
          { label: "English Grammar in Use", type: "book" },
          { label: "Essential Grammar in Use", type: "book" },
        ],
        completionRules: [
          { label: "1 ana konu bitti" },
          { label: "10 kelime/cümle çıkarıldı" },
          { label: "1 kısa paragraf yazıldı veya 1 dakikalık ses kaydı alındı" },
        ],
        note: "Seviye net değilse Fielse English 2: Pre-intermediate ile başla. Çok kolaysa English 3'e geç.",
      } as RhythmVariant,

      saturday: {
        label: "Hafif İngilizce Okuma",
        duration: "20–30 dk",
        intensity: "light",
        optional: false,
        description: "Cumartesi spor ve saz da olduğu için ağır ders yapılmaz. İngilizce aktif toparlanma gibi çalışır.",
        steps: [
          { label: "Kısa hikaye oku veya kısa dinleme yap", required: true },
          { label: "Bilmediğin 5 kelimeyi çıkar", required: true },
          { label: "Hikayeyi 3 basit İngilizce cümleyle özetle", required: true },
          { label: "Zorlandığın kelimeleri kelime listesine ekle" },
        ],
        resources: [
          { label: "100 English Short Stories", type: "book" },
          { label: "English Made Easy", type: "book" },
          { label: "Fielse Proverbs", type: "course" },
          { label: "Fielse konuşma derslerinden kısa bölüm", type: "course" },
          { label: "short-stories-for-children", type: "other" },
        ],
        completionRules: [
          { label: "Kısa okuma/dinleme yapıldı" },
          { label: "5 kelime çıkarıldı" },
          { label: "3 cümlelik İngilizce özet yazıldı" },
        ],
      } as RhythmVariant,

      sunday: {
        label: "İngilizce Tekrar + Konuşma",
        duration: "45–60 dk",
        intensity: "review",
        optional: false,
        description: "Hafta boyunca öğrenilenleri aktif hale getirme günü. Speaking, writing ve tekrar odaklıdır.",
        steps: [
          { label: "10 dk haftanın kelimelerini tekrar et", duration: "10 dk", required: true },
          { label: "10 dk yanlış yaptığın grammar noktalarına bak", duration: "10 dk", required: true },
          { label: "15 dk speaking practice yap", duration: "15 dk", required: true },
          { label: "10 dk kısa writing yap", duration: "10 dk", required: true },
          { label: "5 dk gelecek haftanın mini hedefini seç", duration: "5 dk" },
        ],
        resources: [
          { label: "Fielse İngilizce Konuşma Dersleri", type: "course" },
          { label: "Speakpal", type: "app" },
          { label: "English Grammar in Use", type: "book" },
          { label: "Essential Grammar in Use", type: "book" },
          { label: "Oxford 3000 listesi", type: "list" },
        ],
        completionRules: [
          { label: "10 kelime tekrar edildi" },
          { label: "1 dakikalık İngilizce konuşma yapıldı" },
          { label: "1 kısa paragraf yazıldı" },
          { label: "Gelecek haftanın mini hedefi seçildi" },
        ],
      } as RhythmVariant,
    } as Partial<Record<DayKey, RhythmVariant>>,
  },

  saz: {
    label: "Saz",
    days: ["wednesday", "saturday", "sunday"] as const,
    variants: {
      wednesday: {
        label: "Saz Ana Ders 1",
        duration: "35–45 dk",
        intensity: "main",
        optional: false,
        description: "Udemy başlangıç kursundan 1 ders grubu izle. Akort yap, dersi uygula, zorlandığın kısmı 5 tekrar çalış. Amaç yeni konu öğrenmek.",
        steps: [
          { label: "Sazı akort et", required: true },
          { label: "Udemy başlangıç kursundan 1 ders grubu izle", required: true },
          { label: "Dersi uygulamalı çalış", required: true },
          { label: "Zorlandığın kısmı 5 tekrar yap", required: true },
          { label: "Kısa not al: bugün ne öğrendim?" },
        ],
        resources: [
          { label: "Udemy başlangıç saz kursu", type: "course" },
        ],
        completionRules: [
          { label: "Akort yapıldı" },
          { label: "1 ders grubu izlendi" },
          { label: "Uygulama yapıldı" },
          { label: "Zorlanılan kısım 5 tekrar edildi" },
        ],
      } as RhythmVariant,

      saturday: {
        label: "Saz Ana Ders 2",
        duration: "35–45 dk",
        intensity: "main",
        optional: false,
        description: "Udemy dersine devam et. Önceki konuyu 5 dk tekrar et, yeni dersi izle, uygulama yap. Amaç haftanın ana ilerlemesini almak.",
        steps: [
          { label: "Önceki konuyu 5 dk tekrar et", duration: "5 dk", required: true },
          { label: "Udemy dersine devam et", required: true },
          { label: "Yeni konuyu uygula", required: true },
          { label: "Zorlandığın yeri işaretle", required: true },
          { label: "Haftanın ana ilerlemesini not al" },
        ],
        resources: [
          { label: "Udemy başlangıç saz kursu", type: "course" },
        ],
        completionRules: [
          { label: "5 dk tekrar yapıldı" },
          { label: "Yeni ders izlendi" },
          { label: "Uygulama yapıldı" },
          { label: "Zorlanılan yer not edildi" },
        ],
      } as RhythmVariant,

      sunday: {
        label: "Saz Tekrar + Ders",
        duration: "35–45 dk",
        intensity: "review",
        optional: false,
        description: "Önceki iki saz gününü tekrar et. Kısa kayıt al. Hatalı kısmı çalış. Enerjin varsa Udemy'den kısa bir sonraki derse geç.",
        steps: [
          { label: "Çarşamba ve Cumartesi konularını tekrar et", required: true },
          { label: "Kısa kayıt al", required: true },
          { label: "Kaydı dinle", required: true },
          { label: "Hatalı kısmı çalış", required: true },
          { label: "Enerji varsa kısa bir sonraki Udemy dersine geç" },
        ],
        resources: [
          { label: "Udemy başlangıç saz kursu", type: "course" },
          { label: "Telefon ses kaydı", type: "app" },
        ],
        completionRules: [
          { label: "Önceki iki konu tekrar edildi" },
          { label: "Kısa kayıt alındı" },
          { label: "Hatalı kısım çalışıldı" },
        ],
        note: "Pazar günü saz ritmi tekrar odaklıdır. Yeni ders zorunlu değildir.",
      } as RhythmVariant,
    } as Partial<Record<DayKey, RhythmVariant>>,
  },

  treadmill: {
    label: "Koşu Bandı",
    days: ["tuesday", "thursday", "sunday"] as const,
    type: "recovery",
    description: "Spor değil, aktif toparlanma.",
    variants: {
      tuesday: {
        label: "Koşu Bandı",
        duration: "20 dk",
        timeHint: "Sabah",
        optional: false,
        intensity: "recovery",
      },
      thursday: {
        label: "Koşu Bandı",
        duration: "20 dk",
        timeHint: "Sabah",
        optional: false,
        intensity: "recovery",
      },
      sunday: {
        label: "Hafif Yürüyüş",
        duration: "Opsiyonel",
        timeHint: "Hafif tempo",
        optional: true,
        intensity: "light",
      },
    } as Partial<Record<DayKey, RhythmVariant>>,
  },
} satisfies Record<RhythmId, RhythmConfig>;

// ── Helpers ──────────────────────────────────────────────────────────────────

function toDayKey(date: Date): DayKey {
  return JS_TO_DAY[date.getDay()];
}

export function isRhythmActiveToday(rhythmId: RhythmId, date: Date = new Date()): boolean {
  const dayKey = toDayKey(date);
  return (RHYTHM_SCHEDULE[rhythmId].days as readonly string[]).includes(dayKey);
}

export function getRhythmVariantForDay(
  rhythmId: RhythmId,
  date: Date = new Date()
): RhythmVariant | null {
  const dayKey = toDayKey(date);
  const config = RHYTHM_SCHEDULE[rhythmId];
  if (!isRhythmActiveToday(rhythmId, date)) return null;
  const variants = "variants" in config ? config.variants : undefined;
  return variants?.[dayKey] ?? null;
}

export function getTodayRhythms(date: Date = new Date()): RhythmId[] {
  return (Object.keys(RHYTHM_SCHEDULE) as RhythmId[]).filter(id =>
    isRhythmActiveToday(id, date)
  );
}

export function isRhythmOptionalToday(rhythmId: RhythmId, date: Date = new Date()): boolean {
  const variant = getRhythmVariantForDay(rhythmId, date);
  return variant?.optional ?? false;
}

export function mapTurkishDayToDayKey(day: string): DayKey | null {
  const map: Record<string, DayKey> = {
    Pazartesi: "monday",  Pzt: "monday",
    Salı:      "tuesday", Sal: "tuesday",
    Çarşamba:  "wednesday", Çrş: "wednesday", CRS: "wednesday",
    Perşembe:  "thursday", Prş: "thursday",
    Cuma:      "friday",  Cum: "friday",
    Cumartesi: "saturday", Cts: "saturday", CMT: "saturday",
    Pazar:     "sunday",  Paz: "sunday",
  };
  return map[day] ?? null;
}
