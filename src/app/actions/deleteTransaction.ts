"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabaseServer";
import { updateFinanceState } from "@/lib/financeService";
import { z } from "zod";

const schema = z.object({
  id: z.string().uuid(),
});

export async function deleteTransaction(formData: z.infer<typeof schema>) {
  const result = schema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid input data");
  }

  const supabase = createServerSupabase();

  const { error } = await supabase
    .from("finance_transactions")
    .delete()
    .eq("id", result.data.id);

  if (error) {
    throw new Error(error.message);
  }

  await updateFinanceState();
  revalidatePath("/");
}
