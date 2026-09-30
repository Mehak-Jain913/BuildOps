import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { AnalyticsMetricCard } from '../../components/analytics/AnalyticsMetricCard';
import { VarianceBadge } from '../../components/analytics/VarianceBadge';
import { DollarSign, PieChart, Layers, CheckCircle2, AlertTriangle, TrendingDown } from 'lucide-react';

export const CostAnalyticsPage = () => {
  const { costAnalytics, projectAnalytics } = useAnalytics();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
          <DollarSign className="w-4 h-4 text-emerald-500" />
          <span>Financial & Cost Variance Intelligence</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Construction Cost Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Budget vs Actual cost breakdown, material/labour/procurement cost heads, and cost variance analysis.
        </p>
      </div>

      <AnalyticsFilterBar />

      {/* Main Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsMetricCard
          title="Baseline Project Budget"
          value={`₹${(costAnalytics.budget / 100000).toFixed(1)}L`}
          subtext="Approved capital baseline"
          icon={DollarSign}
        />
        <AnalyticsMetricCard
          title="Actual Total Spend"
          value={`₹${(costAnalytics.actualCost / 100000).toFixed(1)}L`}
          subtext="Cumulative project expenditure"
          icon={PieChart}
        />
        <AnalyticsMetricCard
          title="Remaining Budget"
          value={`₹${(costAnalytics.remainingBudget / 100000).toFixed(1)}L`}
          subtext="Capital balance available"
          icon={Layers}
        />
        <AnalyticsMetricCard
          title="Cost Variance"
          value={`₹${(costAnalytics.costVariance / 100000).toFixed(1)}L`}
          variance={costAnalytics.costVariancePct}
          varianceSuffix="%"
          reverseVarianceColor={true}
          status={costAnalytics.status}
          statusColor={
            costAnalytics.status === 'Under Budget'
              ? 'emerald'
              : costAnalytics.status === 'Near Budget'
              ? 'amber'
              : 'red'
          }
          icon={TrendingDown}
          calculationExplanation="Cost Variance = Actual Cost (₹) - Baseline Budget (₹). Variance % = (Actual Cost - Budget) / Budget * 100"
        />
      </div>

      {/* Detailed Cost Breakdown by Resource Head */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Material Cost Head</h3>
            <span className="text-xs font-mono font-bold text-slate-900">
              ₹{(costAnalytics.materialCost / 100000).toFixed(1)}L
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Derived from current inventory valuation stock and site material consumption.
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-500 h-full"
              style={{ width: `${Math.min(100, (costAnalytics.materialCost / (costAnalytics.actualCost || 1)) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-2 block">
            {Math.round((costAnalytics.materialCost / (costAnalytics.actualCost || 1)) * 100)}% of total actual spend
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Labour Cost Head</h3>
            <span className="text-xs font-mono font-bold text-slate-900">
              ₹{(costAnalytics.labourCost / 100000).toFixed(1)}L
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Derived from daily attendance turnout, daily wage rates, and overtime billing.
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full"
              style={{ width: `${Math.min(100, (costAnalytics.labourCost / (costAnalytics.actualCost || 1)) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-2 block">
            {Math.round((costAnalytics.labourCost / (costAnalytics.actualCost || 1)) * 100)}% of total actual spend
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Procurement Cost Head</h3>
            <span className="text-xs font-mono font-bold text-slate-900">
              ₹{(costAnalytics.procurementCost / 100000).toFixed(1)}L
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Derived from issued Purchase Orders and delivered vendor shipments.
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${Math.min(100, (costAnalytics.procurementCost / (costAnalytics.actualCost || 1)) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-2 block">
            {Math.round((costAnalytics.procurementCost / (costAnalytics.actualCost || 1)) * 100)}% of total actual spend
          </span>
        </div>
      </div>
    </div>
  );
};
