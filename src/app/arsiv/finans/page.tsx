export const dynamic = 'force-dynamic';
import React from "react";
import { format } from "date-fns";
import { createServerSupabase } from "@/lib/supabaseServer";
import { computeFinanceSummary } from "@/lib/financeCalc";
import { FinanceShell } from "@/components/finance/FinanceShell";

export default async function FinansArchivePage() {
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

  const hasData = incomeItems.length > 0 || expenseItems.length > 0 || (subscriptions?.length || 0) > 0;
  
  const safeState = financeState || {
    net_balance: summary.net,
    status_label: hasData ? "MEVCUT DURUM" : "VERİ BEKLENİYOR",
    status_description: hasData 
      ? "Finansal verileriniz üzerinden otomatik özet oluşturuldu." 
      : "Henüz bir finansal veri girişi yapılmadı.",
    severity: "neutral" as const,
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="pt-8 pl-4 pr-4">
        <FinanceShell
          summary={summary}
          status={{
            label: safeState.status_label,
            description: safeState.status_description,
            severity: safeState.severity as "neutral" | "warning" | "danger" | "positive",
          }}
          incomeItems={incomeItems}
          expenseItems={expenseItems}
          subscriptionItems={subscriptions || []}
        />
      </div>
    </div>
  );
}
