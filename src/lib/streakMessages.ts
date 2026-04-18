export function getStreakMessage(streak: number): string {
  if (streak >= 100) return "Eski sen ölmüş durumda.";
  if (streak >= 60) return "Şimdi gerçek bir erkek olma yolundasın.";
  if (streak >= 21) return "Alışkanlık eşiği. Artık otomatik pilotta.";
  if (streak >= 7) return "Bir haftalık disiplin. Vücudun değişmeye başladı.";
  if (streak >= 3) return "Kıvılcım yakalandı. Devam et.";
  return "Başla. Tek yol bu.";
}
