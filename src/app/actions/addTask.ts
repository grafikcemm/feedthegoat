"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabaseServer";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1).max(500),
});

export async function addTask(input: { title: string }) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Invalid title" };
  }

  const supabase = createServerSupabase();
  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase.from("tasks").insert({
    title: parsed.data.title,
    category: "production",
    time_of_day: "day",
    points: 10,
    is_bonus: false,
    is_done: false,
    date: today,
  });

  if (error) {
    return { success: false as const, error: error.message };
  }

  revalidatePath("/");
  return { success: true as const };
}
