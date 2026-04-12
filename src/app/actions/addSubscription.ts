"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabaseServer";
import { updateFinanceState } from "@/lib/financeService";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  amount: z.number().gt(0),
  currency: z.enum(["TRY", "USD", "EUR"]).default("TRY"),
});

export async function addSubscription(formData: z.infer<typeof schema>) {
  const result = schema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid input data");
  }

  const supabase = createServerSupabase();

  const { error } = await supabase.from("finance_subscriptions").insert({
    title: result.data.title,
    amount: result.data.amount,
    currency: result.data.currency,
    is_active: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  await updateFinanceState();
  revalidatePath("/");
}
