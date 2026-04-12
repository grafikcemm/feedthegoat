"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabaseServer";
import { updateFinanceState } from "@/lib/financeService";
import { z } from "zod";
import { format } from "date-fns";

const schema = z.object({
  type: z.enum(["income", "expense"]),
  title: z.string().min(1),
  amount: z.number().gt(0),
});

export async function addTransaction(formData: z.infer<typeof schema>) {
  const result = schema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid input data");
  }

  const supabase = createServerSupabase();
  const currentMonth = format(new Date(), "yyyy-MM");

  const { error } = await supabase.from("finance_transactions").insert({
    type: result.data.type,
    title: result.data.title,
    amount: result.data.amount,
    month: currentMonth,
  });

  if (error) {
    throw new Error(error.message);
  }

  await updateFinanceState();
  revalidatePath("/");
}
