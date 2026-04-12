import { createServerSupabase } from "./supabaseServer";
import { computeFinanceSummary, computeStatus } from "./financeCalc";
import { format } from "date-fns";

export async function updateFinanceState() {
  const supabase = createServerSupabase();
  const currentMonth = format(new Date(), "yyyy-MM");

  // 1. Fetch data
  const { data: txs } = await supabase
    .from("finance_transactions")
    .select("amount, type")
    .eq("month", currentMonth);

  const { data: subs } = await supabase
    .from("finance_subscriptions")
    .select("amount")
    .eq("is_active", true);

  // 2. Compute
  const income = (txs || [])
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + (t.amount || 0), 0);
  const expense = (txs || [])
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + (t.amount || 0), 0);
  const subscriptions = (subs || []).reduce(
    (acc, s) => acc + (s.amount || 0),
    0
  );

  const summary = computeFinanceSummary(income, expense, subscriptions);
  const status = computeStatus(summary.net);

  // 3. Update state
  const { error } = await supabase.from("finance_state").upsert({
    id: 1, // singleton
    net_balance: summary.net,
    status_label: status.label,
    status_description: status.description,
    severity: status.severity,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Failed to update finance state:", error.message);
  }
}
