import { createServerSupabase } from "@/lib/supabaseServer";
import { format } from "date-fns";
import { computeFinanceSummary } from "@/lib/financeCalc";

export async function getFinanceMetrics() {
  const supabase = createServerSupabase();
  const currentMonth = format(new Date(), "yyyy-MM");

  const [
    { data: financeState },
    { data: transactions = [] },
    { data: subscriptions = [] }
  ] = await Promise.all([
    supabase.from("finance_state").select("net_balance, status_label, status_description, severity").eq("id", 1).single(),
    supabase.from("finance_transactions").select("id, amount, type, title, created_at, month").eq("month", currentMonth).order("created_at", { ascending: false }),
    supabase.from("finance_subscriptions").select("id, title, amount, currency, is_active, notes, created_at").eq("is_active", true).order("amount", { ascending: false })
  ]);

  const incomeItems = (transactions || []).filter((t) => t.type === "income");
  const expenseItems = (transactions || []).filter((t) => t.type === "expense");

  const sumIncome = incomeItems.reduce((acc, t) => acc + (t.amount || 0), 0);
  const sumExpense = expenseItems.reduce((acc, t) => acc + (t.amount || 0), 0);
  const sumSubs = (subscriptions || []).reduce(
    (acc, s) => acc + (s.amount || 0),
    0
  );

  const summary = computeFinanceSummary(sumIncome, sumExpense, sumSubs);

  return {
    financeState,
    transactions,
    subscriptions,
    incomeItems,
    expenseItems,
    summary,
    totalIncome: sumIncome,
    totalExpense: sumExpense
  };
}
