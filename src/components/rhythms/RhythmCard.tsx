import { Activity, Music, BookOpen, Dumbbell, type LucideProps } from "lucide-react";
import type { RhythmId, RhythmVariant } from "@/data/rhythmSchedule";

const RHYTHM_ICONS: Record<RhythmId, React.ComponentType<LucideProps>> = {
  sport: Dumbbell,
  english: BookOpen,
  saz: Music,
  treadmill: Activity,
};

const RHYTHM_COLORS: Record<RhythmId, { accent: string; bg: string }> = {
  sport:    { accent: "#22c55e", bg: "rgba(34,197,94,0.08)" },
  english:  { accent: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
  saz:      { accent: "#a855f7", bg: "rgba(168,85,247,0.08)" },
  treadmill:{ accent: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
};

interface RhythmCardProps {
  id: RhythmId;
  variant: RhythmVariant | null;
  defaultLabel: string;
  description?: string;
}

export function RhythmCard({ id, variant, defaultLabel, description }: RhythmCardProps) {
  const Icon = RHYTHM_ICONS[id];
  const colors = RHYTHM_COLORS[id];
  const label = variant?.label ?? defaultLabel;
  const isOptional = variant?.optional ?? false;
  const duration = variant?.duration;
  const timeHint = variant?.timeHint;
  const desc = variant?.description ?? description;

  return (
    <div
      className="rounded-xl border border-[#1f1f1f] px-4 py-3.5 flex items-start gap-3"
      style={{ backgroundColor: colors.bg }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: `${colors.accent}18`, border: `1px solid ${colors.accent}30` }}
      >
        <Icon size={14} className="shrink-0" style={{ color: colors.accent }} strokeWidth={1.8} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-[#cccccc] leading-tight">{label}</span>
          {isOptional && (
            <span className="text-[9px] uppercase tracking-widest text-[#555555] border border-[#252525] px-1.5 py-0.5 rounded">
              Opsiyonel
            </span>
          )}
          {id === "treadmill" && (
            <span className="text-[9px] uppercase tracking-widest text-[#444444] border border-[#1f1f1f] px-1.5 py-0.5 rounded">
              Aktif Toparlanma
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {duration && (
            <span className="text-[11px] text-[#555555]">{duration}</span>
          )}
          {timeHint && (
            <>
              {duration && <span className="text-[#333333]">·</span>}
              <span className="text-[11px] text-[#555555]">{timeHint}</span>
            </>
          )}
        </div>

        {desc && (
          <p className="text-[11px] text-[#444444] mt-1 leading-snug">{desc}</p>
        )}
      </div>
    </div>
  );
}
