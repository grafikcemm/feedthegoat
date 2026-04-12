"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabaseServer";
import { z } from "zod";

const schema = z.object({
  taskId: z.string().uuid(),
});

export async function completeTask(input: { taskId: string }) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Invalid task ID" };
  }

  const supabase = createServerSupabase();

  // Get current task state
  const { data: task, error: fetchError } = await supabase
    .from("tasks")
    .select("id, is_done, points, category")
    .eq("id", parsed.data.taskId)
    .single();

  if (fetchError || !task) {
    return { success: false as const, error: "Task not found" };
  }

  const newIsDone = !task.is_done;
  const updateData: { is_done: boolean; updated_at: string; completed_at?: string | null } = { 
    is_done: newIsDone, 
    updated_at: new Date().toISOString() 
  };

  if (task.category === 'production') {
    updateData.completed_at = newIsDone ? new Date().toISOString() : null;
  }

  const { error: updateError } = await supabase
    .from("tasks")
    .update(updateData)
    .eq("id", parsed.data.taskId);

  if (updateError) {
    return { success: false as const, error: updateError.message };
  }

  revalidatePath("/");

  return {
    success: true as const,
    isDone: newIsDone,
    pointsAwarded: (newIsDone && task.category !== 'production') ? task.points : 0,
  };
}
