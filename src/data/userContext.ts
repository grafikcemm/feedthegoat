export const USER_CONTEXT = {
  name: "Cem",
  language: "tr",
  personality: {
    prefers: [
      "kısa ve net yönlendirme",
      "sade arayüz",
      "az görev",
      "günlük karar yükünün azalması",
      "sürdürülebilir disiplin",
    ],
    struggles: [
      "aynı anda çok fazla şeyi yapmak istemek",
      "kalabalık dashboard görünce bunalmak",
      "yoğun iş temposu nedeniyle uygulamaya bakamamak",
      "başlamadan önce fazla düşünmek",
    ],
    values: [
      "disiplin",
      "temiz çizgi",
      "kendini geliştirme",
      "sistemli yaşam",
      "az ama doğru iş",
    ],
  },
  currentFocus: {
    mainGoal: "kendini geliştirmek",
    notPrimaryGoals: ["iş bulmak", "freelance müşteri kovalamak"],
    developmentAreas: [
      "Frontend",
      "React / Next.js",
      "UI/UX",
      "AI araçları",
      "otomasyon",
      "Claude Code",
      "n8n",
      "içerik üretimi",
      "ürün geliştirme",
    ],
  },
  dailyRules: {
    maxMainLocks: 1,
    maxSuggestedActiveTasksLowEnergy: 1,
    maxSuggestedActiveTasksMediumEnergy: 3,
    maxSuggestedActiveTasksHighEnergy: 4,
    avoidNewTasksWhenWaitingTasksHigh: true,
  },
  peakRules: [
    "Dışarıdan yemek yemedim",
    "Pornografi izlemedim",
    "Ertelemedim, başladım",
    "Herkese her şeyi anlatmadım",
  ],
  rhythmRules: {
    sport: "Pazartesi, Çarşamba, Cuma, Cumartesi",
    english:
      "Salı mikro temas 15-20 dk, Perşembe ana çalışma 30-40 dk, Pazar tekrar + konuşma 40-45 dk",
    saz: "Cumartesi temas 20-30 dk, Pazar opsiyonel 20 dk",
    treadmill:
      "Koşu bandı: Salı sabah 20 dk, Perşembe sabah 20 dk, Pazar opsiyonel hafif yürüyüş. Spor değildir, aktif toparlanmadır.",
  },
} as const;

export type UserContext = typeof USER_CONTEXT;
