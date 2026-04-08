export interface DayConfig {
  gun: string;
  odakTema: string;
  renk: string;
  antrenmanVar: boolean;
  antrenmanAdi: string;
}

// key = JS getDay() index: 0=Pazar, 1=Pazartesi, ..., 6=Cumartesi
export const weeklyFocusConfig: Record<number, DayConfig> = {
  1: {
    gun: "Pazartesi",
    odakTema: "Ajans + Kariyer",
    renk: "#6B8EBF",
    antrenmanVar: true,
    antrenmanAdi: "Upper A",
  },
  2: {
    gun: "Salı",
    odakTema: "Üniversite + Ajans",
    renk: "#8B7AC4",
    antrenmanVar: true,
    antrenmanAdi: "Lower A",
  },
  3: {
    gun: "Çarşamba",
    odakTema: "Üniversite + Deep Work",
    renk: "#5B9E9E",
    antrenmanVar: false,
    antrenmanAdi: "Aktif Dinlenme",
  },
  4: {
    gun: "Perşembe",
    odakTema: "Ajans + Kariyer",
    renk: "#6B8EBF",
    antrenmanVar: true,
    antrenmanAdi: "Upper B",
  },
  5: {
    gun: "Cuma",
    odakTema: "Üniversite + İçerik",
    renk: "#7C9A72",
    antrenmanVar: false,
    antrenmanAdi: "Aktif Dinlenme",
  },
  6: {
    gun: "Cumartesi",
    odakTema: "Serbest Üretim",
    renk: "#D4A574",
    antrenmanVar: true,
    antrenmanAdi: "Lower B",
  },
  0: {
    gun: "Pazar",
    odakTema: "Şarj Günü",
    renk: "#606060",
    antrenmanVar: false,
    antrenmanAdi: "Dinlenme",
  },
};

export function getTodayConfig(): DayConfig {
  return weeklyFocusConfig[new Date().getDay()];
}
