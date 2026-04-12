import React from "react";
import { FinanceHeader } from "./FinanceHeader";
import { StatusBanner } from "./StatusBanner";
import { MonthIndicator } from "./MonthIndicator";
import { AddTransactionForm } from "./AddTransactionForm";
import { TransactionColumn } from "./TransactionColumn";
import { SubscriptionColumn } from "./SubscriptionColumn";
import { FinanceSummary, StatusInfo } from "@/lib/financeCalc";

interface FinanceShellProps {
  summary: FinanceSummary;
  status: StatusInfo;
  incomeItems: any[];
  expenseItems: any[];
  subscriptionItems: any[];
}

export function FinanceShell({
  summary,
  status,
  incomeItems,
  expenseItems,
  subscriptionItems,
}: FinanceShellProps) {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-8 py-8 animate-in duration-700">
      {/* Header Info */}
      <div className="w-full mb-8">
        <FinanceHeader net={summary.net} />
        <MonthIndicator />
      </div>

      {/* Status Section */}
      <div className="w-full mb-8">
        <StatusBanner
          label={status.label}
          description={status.description}
          severity={status.severity}
        />
      </div>

      {/* Action Area */}
      <div className="w-full mb-8">
        <AddTransactionForm />
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <TransactionColumn
          title="GELİR"
          type="income"
          total={summary.totalIncome}
          transactions={incomeItems}
        />
        <TransactionColumn
          title="GİDER"
          type="expense"
          total={summary.totalExpense}
          transactions={expenseItems}
        />
        <SubscriptionColumn
          total={summary.totalSubscriptions}
          subscriptions={subscriptionItems}
        />
      </div>
    </div>
  );
}
