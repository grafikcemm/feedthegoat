"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

type ActiveTask = {
    id: string;
    title: string;
    is_completed: boolean;
    created_at: string;
};

export default function ActiveTasks() {
    const [tasks, setTasks] = useState<ActiveTask[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("active_tasks")
                .select("*")
                .order("created_at", { ascending: true });

            if (error) {
                // Ignore PGRST116 (missing table) for initial UI load before they run SQL
                if (error.code !== "PGRST116") console.error("Error fetching active tasks:", error);
            } else if (data) {
                setTasks(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            const { error } = await supabase
                .from("active_tasks")
                .insert([{ title: newTaskTitle.trim() }]);

            if (error) throw error;

            setNewTaskTitle("");
            fetchTasks();
        } catch (err: any) {
            console.error("Error adding task:", err);
            alert(`Görev eklenemedi. Supabase Hatası: ${err?.message || "Bilinmiyor"}`);
        }
    };

    const toggleTask = async (id: string, currentStatus: boolean) => {
        // Optimistic UI update
        setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));

        try {
            const { error } = await supabase
                .from("active_tasks")
                .update({ is_completed: !currentStatus })
                .eq("id", id);

            if (error) throw error;
        } catch (err) {
            console.error("Error toggling task:", err);
            // Revert if failed
            setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: currentStatus } : t));
        }
    };

    const deleteTask = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Bu görevi silmek istediğine emin misin?")) return;

        // Optimistic UI update
        const previousTasks = [...tasks];
        setTasks(tasks.filter(t => t.id !== id));

        try {
            const { error } = await supabase
                .from("active_tasks")
                .delete()
                .eq("id", id);

            if (error) throw error;
        } catch (err) {
            console.error("Error deleting task:", err);
            setTasks(previousTasks); // Revert fully if failed
        }
    };

    return (
        <section className="mb-8">
            <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted mb-4 font-mono">
                AKTİF GÖREVLER
            </h2>

            <div className="brutalist-card p-4 space-y-4">
                {/* Add Task Form */}
                <form onSubmit={handleAddTask} className="flex gap-2">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Yeni görev ekle..."
                        className="flex-1 bg-background brutalist-border px-3 py-2 text-sm font-mono text-text outline-none focus:border-accent-green transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!newTaskTitle.trim()}
                        className="bg-transparent brutalist-border px-4 py-2 text-xs font-bold font-mono tracking-widest uppercase hover:bg-accent-green hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        EKLE
                    </button>
                </form>

                {/* Task List */}
                {loading ? (
                    <div className="text-text-muted text-xs font-mono uppercase tracking-widest animate-pulse py-4 text-center">
                        VERİLER ÇEKİLİYOR...
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-text-muted text-xs font-mono uppercase tracking-widest py-4 text-center border border-dashed border-border">
                        AKTİF GÖREV BULUNAMADI.
                    </div>
                ) : (
                    <div className="space-y-2 mt-4">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                onClick={() => toggleTask(task.id, task.is_completed)}
                                className={`
                                    flex items-center gap-3 p-3 brutalist-border cursor-pointer transition-all duration-200 group
                                    ${task.is_completed ? "bg-surface opacity-50 border-border" : "bg-transparent hover:border-text-muted"}
                                `}
                            >
                                {/* Custom Checkbox */}
                                <div
                                    className={`
                                        w-5 h-5 flex-shrink-0 brutalist-border flex items-center justify-center text-[10px] font-bold transition-colors
                                        ${task.is_completed ? "bg-accent-green border-accent-green text-black" : "bg-transparent text-transparent"}
                                    `}
                                >
                                    {task.is_completed ? "✓" : ""}
                                </div>

                                {/* Title */}
                                <span
                                    className={`flex-1 text-sm font-mono transition-all ${task.is_completed ? "line-through text-text-muted" : "text-text"}`}
                                >
                                    {task.title}
                                </span>

                                {/* Delete Button */}
                                <button
                                    onClick={(e) => deleteTask(task.id, e)}
                                    className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-accent-red transition-all p-1"
                                    title="Görevi Sil"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
