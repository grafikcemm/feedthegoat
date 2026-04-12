"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabaseServer";
import { updateFinanceState } from "@/lib/financeService";
import { z } from "zod";

const schema = z.object({
  id: z.string().uuid(),
});

export async function deleteSubscription(formData: z.infer<typeof schema>) {
  const result = schema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid input data");
  }

  const supabase = createServerSupabase();

  // Soft delete as requested: sets is_active = false
  const { error } = await supabase
    .from("finance_subscriptions")
    .update({ is_active: false })
    .eq("id", result.data.id);

  if (error) {
    throw new Error(error.message);
  }

  await updateFinanceState();
  revalidatePath("/");
}
