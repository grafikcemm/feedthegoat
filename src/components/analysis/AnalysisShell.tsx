interface DayScore {
  date: string;
  total_score: number;
  completion_rate: number;
  finalized: boolean;
}

interface PeakLog {
  log_date: string;
  success: boolean;
}

interface AnalysisShellProps {
  last7Scores: DayScore[];
  peakLogs: PeakLog[];
  waitingTasksCount: number;
  rhythmStreakDays?: number;
}

function HabitHeatmap({ scores }: { scores: DayScore[] }) {
  const days = ["Pzt", "Sal", "Çrş", "Per", "Cum", "Cts", "Paz"];

  return (
    <div>
      <span className="text-[10px] uppercase tracking-widest text-[#444444] font-medium block mb-3">
        Son 7 Gün
      </span>
      <div className="flex gap-2 flex-wrap">
        {scores.map((s, i) => {
          const rate = s.completion_rate ?? 0;
          const color =
            !s.finalized ? "#1a1a1a" :
            rate >= 70 ? "#22c55e" :
            rate >= 40 ? "#f59e0b" : "#ef4444";

          return (
            <div key={s.date} className="flex flex-col items-center gap-1">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-medium transition-colors"
                style={{ backgroundColor: color + "22", border: `1px solid ${color}44`, color }}
              >
                {s.finalized ? Math.round(rate) + "%" : "–"}
              </div>
              <span className="text-[9px] text-[#444444]">{days[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-[#111111] rounded-xl border border-[#1f1f1f] px-4 py-4">
      <span className="text-[10px] uppercase tracking-widest text-[#444444] font-medium block mb-2">
        {label}
      </span>
      <span className="text-2xl font-bold text-[#cccccc]">{value}</span>
      {sub && <p className="text-[11px] text-[#444444] mt-1">{sub}</p>}
    </div>
  );
}

export function AnalysisShell({
  last7Scores,
  peakLogs,
  waitingTasksCount,
}: AnalysisShellProps) {
  const cleanPeakDays = peakLogs.filter((l) => l.success).length;
  const finalizedDays = last7Scores.filter((s) => s.finalized).length;
  const goodDays = last7Scores.filter(
    (s) => s.finalized && (s.completion_rate ?? 0) >= 70
  ).length;

  const weeklyNote =
    waitingTasksCount >= 4
      ? "Bekleyen görevler birikmiş. Bu hafta yeni görev ekleme, mevcutları bitir."
      : goodDays >= 5
      ? "Güçlü bir hafta. Ritmi koru."
      : goodDays >= 3
      ? "Denge haftası. Tutarlılık iyi."
      : "Tempo düşük. Kritik rutinleri merkeze al.";

  return (
    <div className="max-w-[860px] mx-auto px-4 sm:px-6 pb-16">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-widest text-[#444444] font-medium block">
          ANALİZ
        </span>
        <p className="text-[13px] text-[#555555] mt-1">
          Haftalık farkındalık. Sistemi iyileştir, kendini cezalandırma.
        </p>
      </div>

      {/* Heatmap */}
      <div className="bg-[#111111] rounded-xl border border-[#1f1f1f] px-5 py-4 mb-4">
        <HabitHeatmap scores={last7Scores} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <StatCard
          label="Tamamlanan Gün"
          value={`${goodDays}/7`}
          sub="≥%70 tamamlanma"
        />
        <StatCard
          label="Peak Temiz Gün"
          value={cleanPeakDays}
          sub="Son 7 gün"
        />
        <StatCard
          label="Bekleyen Görev"
          value={waitingTasksCount}
          sub={waitingTasksCount >= 4 ? "Fazla birikmiş" : "Normal seviye"}
        />
        <StatCard
          label="Finalize Edilen"
          value={`${finalizedDays}/7`}
          sub="Günü bitir butonuna basıldı"
        />
      </div>

      {/* Weekly summary */}
      <div className="bg-[#111111] rounded-xl border border-[#1f1f1f] px-5 py-4">
        <span className="text-[10px] uppercase tracking-widest text-[#444444] font-medium block mb-3">
          Haftalık Yorum
        </span>
        <p className="text-sm text-[#888888] leading-relaxed">{weeklyNote}</p>
        {waitingTasksCount >= 4 && (
          <div className="mt-3 flex items-start gap-2 rounded-lg px-3 py-2 bg-[#1c1500] border border-[#2a2000]">
            <span className="text-[#f59e0b] text-xs mt-px">⚠</span>
            <span className="text-xs text-[#777777]">
              Bu hafta neyi azaltmalısın? Bekleyenleri önce temizle.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
