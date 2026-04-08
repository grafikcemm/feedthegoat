"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { useToast } from "@/components/Toast";
import { X, Zap, MessageSquare } from "lucide-react";

interface EndDayTask {
  is_completed: boolean;
  priority: string;
}

interface EndDayButtonProps {
  score: number;
  maxBaseScore: number;
  onFail: () => void;
  onSuccess: () => void;
}

export default function EndDayButton({ score, maxBaseScore, onFail, onSuccess }: EndDayButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskStats, setTaskStats] = useState({ p1: 0, p2: 0, p3: 0 });
  const { showToast } = useToast();

  const isSuccess = score >= maxBaseScore;

  useEffect(() => {
    if (isOpen) {
      const savedTasks = localStorage.getItem("goat-active-tasks-v2");
      if (savedTasks) {
        try {
          const parsed = JSON.parse(savedTasks);
          const done = parsed.filter((t: EndDayTask) => t.is_completed);
          setTaskStats({
            p1: done.filter((t: EndDayTask) => t.priority === "P1").length,
            p2: done.filter((t: EndDayTask) => t.priority === "P2").length,
            p3: done.filter((t: EndDayTask) => t.priority === "P3").length,
          });
        } catch {}
      }
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const today = new Date().toISOString().split("T")[0];
    const tasksSummary = `P1: ${taskStats.p1}, P2: ${taskStats.p2}, P3: ${taskStats.p3}`;

    try {
      const { error } = await supabase.from("daily_logs").insert([
        {
          date: today,
          score: score,
          energy_level: energy,
          note: note,
          tasks_summary: tasksSummary,
        },
      ]);

      if (error) throw error;

      if (isSuccess) onSuccess();
      else onFail();

      showToast("Günün kaydedildi. Yarın daha güçlü uyan.");
      setIsOpen(false);
    } catch (err: any) {
      console.error(err);
      showToast("Bir hata oluştu ama verilerin yerelde güvende.");
      if (isSuccess) onSuccess();
      else onFail();
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="end-day-btn transition-colors duration-200 hover:bg-(--amber-dim)"
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "180px",
          height: "36px",
          background: "var(--bg-void)", // To prevent transparency over content if scrolled
          border: "1px solid var(--amber-border)",
          color: "var(--amber)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--size-xs)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          borderRadius: "2px",
          cursor: "pointer",
          zIndex: 50,
          boxShadow: "none",
        }}
      >
        GÜNÜ BİTİR
      </button>

      {isOpen && (
        <div 
          style={{ 
            position: "fixed", 
            inset: 0, 
            zIndex: 9999, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: "16px" 
          }}
        >
          {/* Backdrop */}
          <div 
            onClick={() => !isSubmitting && setIsOpen(false)}
            style={{ 
              position: "absolute", 
              inset: 0, 
              background: "rgba(0,0,0,0.8)", 
            }}
          />
          
          {/* Modal */}
          <div 
            className="animate-in"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "400px",
              background: "var(--bg-overlay)",
              border: "1px solid var(--border-0)",
              borderRadius: "4px",
              padding: "24px",
              boxShadow: "none",
            }}
          >
            <div className="flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-1)", paddingBottom: "12px", marginBottom: "16px" }}>
              <h3 
                style={{ 
                  fontFamily: "var(--font-mono)", 
                  fontSize: "var(--size-sm)", 
                  color: "var(--text-2)", 
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                Günü Kapat
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ color: "var(--text-2)", background: "transparent", border: "none", cursor: "pointer", padding: "4px" }}
                className="hover:text-(--text-1)"
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "36px", color: "var(--text-0)", lineHeight: 1 }}>
                {score}
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-2)" }}>
                Toplam Puan
              </p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { label: "P1", val: taskStats.p1, color: "var(--amber)" },
                { label: "P2", val: taskStats.p2, color: "rgba(100,130,180,1)" },
                { label: "P3", val: taskStats.p3, color: "var(--text-2)" },
              ].map((s) => (
                <div key={s.label} style={{ background: "var(--bg-raised)", border: "1px solid var(--border-0)", padding: "10px", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-3)", marginBottom: "4px", textTransform: "uppercase" }}>
                    {s.label}
                  </p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "16px", color: s.color }}>
                    {s.val}
                  </p>
                </div>
              ))}
            </div>

            {/* Energy Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-2)", textTransform: "uppercase" }}>
                  Enerji Durumun
                </label>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--amber)" }}>
                  {energy}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "var(--amber)" }}
              />
            </div>

            {/* Note */}
            <div className="mb-6">
              <label style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-2)", display: "block", marginBottom: "8px", textTransform: "uppercase" }}>
                Günün Notu
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Bugün nasıl geçti?"
                style={{
                  width: "100%",
                  height: "80px",
                  background: "transparent",
                  border: "1px solid var(--border-0)",
                  borderRadius: "2px",
                  padding: "10px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--size-sm)",
                  color: "var(--text-1)",
                  outline: "none",
                  resize: "none",
                }}
                className="focus:border-(--border-1)"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                width: "100%",
                height: "40px",
                background: "transparent",
                border: "1px solid var(--amber-border)",
                color: "var(--amber)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--size-xs)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                borderRadius: "2px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.5 : 1,
                transition: "background 0.2s",
              }}
              className="hover:bg-(--amber-dim)"
            >
              {isSubmitting ? "KAYDEDİLİYOR..." : "KAYDET VE BİTİR"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
