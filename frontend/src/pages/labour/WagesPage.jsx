import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useLabour } from '../../hooks/useLabour';
import { useProjects } from '../../hooks/useProjects';
import { formatLakhs } from '../../utils/formatters';
import { DollarSign, PieChart, Building2, TrendingUp, Users } from 'lucide-react';

export const WagesPage = () => {
  const { costs } = useLabour();
  const { projects } = useProjects();

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
            Financial Expenditure Analytics
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Labour Cost & Payroll Allocation
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor daily workforce wages, monthly budget utilization, trade cost distribution, and site-wise payroll.
        </p>
      </div>

      {/* 2. SUMMARY METRICS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Today's Labour Cost
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">
            ₹{costs.todayCostLakhs} Lakhs
          </div>
          <span className="text-xs text-slate-500 block mt-1">Daily accrued wages & OT</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            This Month Total
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">
            ₹{costs.thisMonthLakhs} Lakhs
          </div>
          <span className="text-xs text-slate-500 block mt-1">Total payroll processed</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Sanctioned Labour Budget
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">
            ₹{costs.budgetLakhs} Lakhs
          </div>
          <span className="text-xs text-slate-500 block mt-1">Monthly allocation ceiling</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Budget Utilization
          </span>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">
            {costs.utilizationPercent}%
          </div>
          <div className="mt-2">
            <ProgressBar value={costs.utilizationPercent} variant="amber" size="sm" />
          </div>
        </div>
      </div>

      {/* 3. DUAL COLUMNS: TRADE COST & PROJECT COST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Trade Breakdown */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">Labour Cost by Skill Trade</h3>
            </div>
          }
          subtitle="Monthly payroll distribution across masons, helpers, electricians & trades."
        >
          <div className="space-y-4">
            {/* Stacked Bar */}
            <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
              {costs.tradeBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className={`${item.color} h-full`}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.trade}: ₹${item.amountLakhs}L (${item.percentage}%)`}
                />
              ))}
            </div>

            <div className="space-y-2">
              {costs.tradeBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${item.color} shrink-0`} />
                    <span className="font-bold text-slate-900">{item.trade}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 block">
                      ₹{item.amountLakhs} Lakhs
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {item.percentage}% of total payroll
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Right: Project Breakdown */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-800" />
              <h3 className="text-base font-bold text-slate-900">Labour Cost by Project Site</h3>
            </div>
          }
          subtitle="Payroll expenditure mapped to active project sites."
        >
          <div className="space-y-3">
            {costs.projectBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs hover:border-slate-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 text-sm">{item.projectName}</span>
                  <span className="font-extrabold text-slate-900">
                    ₹{item.amountLakhs} Lakhs
                  </span>
                </div>

                <ProgressBar value={item.percentage} variant="amber" size="md" />

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Site Allocation</span>
                  <span className="font-semibold text-slate-800">{item.percentage}% of total labour budget</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
