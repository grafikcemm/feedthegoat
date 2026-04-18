export const MOTTOS = {
  mon: "Fırsatlar gökten düşmez, gidip kendin yaratırsın.",
  tue: "Hayatını asla onlarla değiştirmek istemediğin insanlardan tavsiye almamalısın.",
  wed: "Mutluluk özgürlükten gelir, özgürlük cesaretten gelir.",
  thu: "Herkes eninde sonunda gerçek yüzünü gösterir, zorlama ve kurcalama.",
  fri: "Hayat, insanlar senin hakkında ne kadar az şey bilirse o kadar güzelleşir."
} as const;

export function getTodayMotto(): string | null {
  const day = new Date().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const map: Record<number, keyof typeof MOTTOS | null> = {
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: null,
    0: null
  };
  const key = map[day];
  return key ? MOTTOS[key] : null;
}
