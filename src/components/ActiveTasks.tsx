"use client";

import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/Toast";
import { Trash2 } from "lucide-react";

type Quadrant = "MIND" | "BODY" | "SPIRIT" | "VOCATION";

type ActiveTask = {
  id: string;
  title: string;
  is_completed: boolean;
  priority: "P1" | "P2" | "P3";
  is_urgent?: boolean;
  quadrant: Quadrant;
  created_at: string;
  completed_at?: string;
};

const PRIORITY_CONFIG = {
  P1: { color: "var(--amber)", bg: "var(--amber-dim)", border: "var(--amber-border)", label: "P1" },
  P2: { color: "rgba(100,130,180,1)", bg: "rgba(100,130,180,0.15)", border: "rgba(100,130,180,0.3)", label: "P2" },
  P3: { color: "var(--text-2)", bg: "transparent", border: "var(--border-0)", label: "P3" },
};

export default function ActiveTasks() {
  const [tasks, setTasks] = useState<ActiveTask[]>(() => {
    if (typeof window === "undefined") return [];
    
    // Veri Enjeksiyonu (Bir defaya mahsus zorlama)
    const migrationFlag = localStorage.getItem("goat-restoration-v2-active");
    if (!migrationFlag) {
      const screenshotTasks: ActiveTask[] = [
        { id: "1", title: "Beykent vizelerini tamamla, günlük disipline uy", is_completed: false, priority: "P1", quadrant: "VOCATION", created_at: new Date().toISOString() },
        { id: "2", title: "Anasayfada bulunan Claude Code & N8N Claude Code videolarını bitir", is_completed: false, priority: "P1", quadrant: "VOCATION", created_at: new Date().toISOString() },
        { id: "3", title: "Grafikcem reels çekimlerini & editlerini yap", is_completed: false, priority: "P2", quadrant: "VOCATION", created_at: new Date().toISOString() },
        { id: "4", title: "YouTube otomasyonu için fikir al bir saas yapılabilir mi bak", is_completed: false, priority: "P2", quadrant: "VOCATION", created_at: new Date().toISOString() },
        { id: "5", title: "Mobil uygulama üretme fikirleri", is_completed: false, priority: "P3", quadrant: "VOCATION", created_at: new Date().toISOString() },
        { id: "6", title: "Ana sayfa da bulunan yapay zeka ile reklam görselleri kursunu bitir", is_completed: false, priority: "P3", quadrant: "VOCATION", created_at: new Date().toISOString() },
        { id: "7", title: "İngilizceyi günlük rutin olarak sistem haline sokacak güncellemeleri yap ve günlük rutin olar...", is_completed: false, priority: "P3", quadrant: "VOCATION", created_at: new Date().toISOString() },
        { id: "8", title: "Behance portfolyonu güncel tutmaya odaklı planlama yap ve ajanslara mail yollamak için planla...", is_completed: false, priority: "P3", quadrant: "VOCATION", created_at: new Date().toISOString() },
      ];
      localStorage.setItem("goat-restoration-v2-active", "true");
      localStorage.setItem("goat-active-tasks-v2", JSON.stringify(screenshotTasks));
      return screenshotTasks;
    }

    const savedTasks = localStorage.getItem("goat-active-tasks-v2");
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        if (parsed.length > 0) return parsed;
      } catch {}
    }
    return [];
  });
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"P1" | "P2" | "P3">("P2");
  const [showAllTasks, setShowAllTasks] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("goat-active-tasks-v2", JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    if (newPriority === "P1") {
      const activeP1s = tasks.filter((t) => t.priority === "P1" && !t.is_completed).length;
      if (activeP1s >= 2) {
        showToast("Maksimum 2 adet P1 olabilir. Odaklan.");
        return;
      }
    }

    const newTask: ActiveTask = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      is_completed: false,
      priority: newPriority,
      quadrant: "VOCATION",
      created_at: new Date().toISOString(),
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    setNewPriority("P2");
    showToast("Görev eklendi.");
  };

  const toggleTask = (id: string) => {
    if (typeof window !== "undefined" && window.navigator?.vibrate) window.navigator.vibrate(20);
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const willComplete = !task.is_completed;
    
    if (willComplete) {
      showToast(task.priority === "P1" ? "+20p — Aslan payı" : task.priority === "P2" ? "+8p — İyi ilerleme" : "+4p — Damlaya damlaya");
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              is_completed: willComplete,
              completed_at: willComplete ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  };

  const deleteTask = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast("Görev silindi.");
  };

  const activeTasksList = useMemo(() => {
    return tasks
      .filter((t) => !t.is_completed)
      .sort((a, b) => {
        const order = { P1: 1, P2: 2, P3: 3 };
        if (order[a.priority] !== order[b.priority]) return order[a.priority] - order[b.priority];
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [tasks]);

  const completedTasksList = useMemo(() => {
    return tasks
      .filter((t) => t.is_completed)
      .sort((a, b) => {
        const timeA = a.completed_at ? new Date(a.completed_at).getTime() : 0;
        const timeB = b.completed_at ? new Date(b.completed_at).getTime() : 0;
        return timeB - timeA;
      });
  }, [tasks]);

  const MAX_VISIBLE = 5;
  const visibleActiveTasks = showAllTasks ? activeTasksList : activeTasksList.slice(0, MAX_VISIBLE);

  if (!isLoaded) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Title Header */}
      <div className="flex justify-between items-baseline mb-[-8px]">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>AKTİF GÖREVLER</span>
        <span style={{ flexGrow: 1 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-3)" }}>önce en önemlisi</span>
      </div>

      {/* Form Row */}
      <form onSubmit={handleAddTask} className="flex gap-2 items-center">
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as "P1" | "P2" | "P3")}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--size-xs)",
            border: "1px solid var(--border-0)",
            background: "transparent",
            color: "var(--text-2)",
            padding: "4px 8px",
            borderRadius: "2px",
            outline: "none",
            height: "30px",
          }}
        >
          <option value="P1">P1</option>
          <option value="P2">P2</option>
          <option value="P3">P3</option>
        </select>
        
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Bugün ne yapacaksın?"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--size-sm)",
            color: "var(--text-1)",
            background: "transparent",
            border: "none",
            flexGrow: 1,
            outline: "none",
            height: "30px",
            padding: "0 8px",
          }}
          className="placeholder:text-(--text-3)"
        />
        
        <button
          type="submit"
          disabled={!newTaskTitle.trim()}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--size-xs)",
            letterSpacing: "0.08em",
            border: "1px solid var(--border-0)",
            padding: "4px 10px",
            borderRadius: "2px",
            color: newTaskTitle.trim() ? "var(--text-0)" : "var(--text-3)",
            background: "transparent",
            cursor: newTaskTitle.trim() ? "pointer" : "not-allowed",
            height: "30px",
            textTransform: "uppercase",
            transition: "border 0.2s, color 0.2s",
          }}
          className={newTaskTitle.trim() ? "hover:border-(--amber-border) hover:text-(--amber)" : ""}
        >
          EKLE
        </button>
      </form>

      {/* Active Tasks List */}
      <div className="flex flex-col">
        {activeTasksList.length === 0 ? (
          <div style={{ padding: "16px", textAlign: "center", border: "1px solid var(--border-0)", borderRadius: "2px" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--size-sm)", color: "var(--text-3)" }}>
              Bugün görev eklemedin. Küçük bir şeyle başla.
            </span>
          </div>
        ) : (
          visibleActiveTasks.map((task) => {
            const cfg = PRIORITY_CONFIG[task.priority];
            const isDone = task.is_completed;
            
            return (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="group flex items-center transition-all duration-200"
                style={{
                  height: "40px",
                  padding: "0 16px 0 0",
                  borderBottom: "1px solid var(--border-1)",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  border: `1px solid ${isDone ? "var(--amber)" : "var(--border-0)"}`,
                  background: isDone ? "var(--amber)" : "transparent",
                  marginRight: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                {isDone && <span style={{ color: "black", fontSize: "10px", fontWeight: "bold" }}>✓</span>}
              </div>

                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    letterSpacing: "0.1em",
                    padding: "1px 5px",
                    borderRadius: "2px",
                    textTransform: "uppercase",
                    background: cfg.bg,
                    border: `1px solid ${cfg.border}`,
                    color: cfg.color,
                    marginRight: "10px",
                  }}
                >
                  {task.priority}
                </span>

                <span
                  style={{
                    flex: 1,
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--size-sm)",
                    color: "var(--text-1)",
                    textDecoration: "none",
                  }}
                  className="truncate"
                >
                  {task.title}
                </span>

                <button
                  onClick={(e) => deleteTask(e, task.id)}
                  style={{
                    color: "var(--text-3)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-(--red-signal) transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}

        {activeTasksList.length > MAX_VISIBLE && (
          <button
            onClick={() => setShowAllTasks(!showAllTasks)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--size-xs)",
              color: "var(--text-3)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "12px 0",
              textAlign: "left",
            }}
            className="hover:text-(--text-1) transition-colors"
          >
            {showAllTasks ? "Daha az göster" : `+${activeTasksList.length - MAX_VISIBLE} görev daha`}
          </button>
        )}
      </div>

      {/* Completed Tasks List */}
      {completedTasksList.length > 0 && (
        <div className="flex flex-col mt-4 border-t border-(--border-1) pt-4">
          {completedTasksList.slice(0, 10).map((task) => (
            <div
              key={task.id}
              className="flex items-center"
              style={{
                height: "32px",
                opacity: 0.2,
                padding: "0 16px 0 18px",
              }}
            >
              <span
                style={{
                  flex: 1,
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--size-sm)",
                  color: "var(--text-1)",
                  textDecoration: "line-through",
                }}
                className="truncate"
              >
                {task.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
