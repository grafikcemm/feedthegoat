"use client";

export interface PerformanceMetricsProps {
    doneCount: number;
    totalCount: number;
    refreshKey?: number;
}

export default function PerformanceMetrics({ doneCount, totalCount }: PerformanceMetricsProps) {
    const pointsPerTask = 10;
    const maxScore = totalCount * pointsPerTask;
    const currentScore = doneCount * pointsPerTask;
    const scorePct = Math.min(100, Math.round((currentScore / maxScore) * 100));

    return (
        <section className="mb-8">
            <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted mb-4">
                PERFORMANS METRİKLERİ
            </h2>

            <div className="grid grid-cols-1 gap-4">
                {/* Dopamin Skoru */}
                <div className="brutalist-card border-t-2 border-text/20">
                    <div className="flex justify-between items-end mb-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-text">
                            DOPAMİN SKORU
                        </p>
                        <p className="text-xl tabular-nums font-bold leading-none">
                            {currentScore.toFixed(1)} <span className="text-text-muted text-sm">/ {maxScore}</span>
                        </p>
                    </div>

                    <div className="w-full h-3 bg-surface brutalist-border overflow-hidden">
                        <div
                            className="h-full progress-fill transition-all duration-500 ease-out bg-accent-green glow-green"
                            style={{ width: `${scorePct}%` }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
