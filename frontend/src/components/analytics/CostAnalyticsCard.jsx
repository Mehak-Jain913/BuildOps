import React from 'react';
import { DollarSign, PieChart, TrendingDown, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';
import { VarianceBadge } from './VarianceBadge';
import { AnalyticsDrilldownLink } from './AnalyticsDrilldownLink';

export const CostAnalyticsCard = ({ costData }) => {
  const {
    budget = 0,
    actualCost = 0,
    costVariance = 0,
    costVariancePct = 0,
    status = 'Under Budget',
    materialCost = 0,
    labourCost = 0,
    procurementCost = 0,
  } = costData || {};

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Construction Cost Intelligence</h3>
              <p className="text-[11px] text-slate-500">Budget vs actual spend baseline</p>
            </div>
          </div>
          <VarianceBadge value={costVariancePct} suffix="%" reverseColor={true} />
        </div>

        {/* Main Budget vs Actual */}
        <div className="p-4 rounded-xl bg-slate-900 text-white mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Project Baseline Budget</span>
            <span className="font-mono text-white font-bold">₹{(budget / 100000).toFixed(1)}L</span>
          </div>
          <div className="flex items-center justify-between text-sm font-bold text-white mb-2">
            <span>Actual Total Spend</span>
            <span className="font-mono text-amber-400 text-lg">₹{(actualCost / 100000).toFixed(1)}L</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
            <div
              className={`h-full transition-all ${
                costVariancePct > 5 ? 'bg-red-500' : costVariancePct > 0 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (actualCost / (budget || 1)) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Variance: ₹{(costVariance / 100000).toFixed(1)}L</span>
            <span className="text-amber-300 font-semibold">{status}</span>
          </div>
        </div>

        {/* Cost breakdown */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Material</span>
            <span className="font-bold font-mono text-slate-900">₹{(materialCost / 100000).toFixed(1)}L</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Labour</span>
            <span className="font-bold font-mono text-slate-900">₹{(labourCost / 100000).toFixed(1)}L</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Procurement</span>
            <span className="font-bold font-mono text-slate-900">₹{(procurementCost / 100000).toFixed(1)}L</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Formula: Actual Spend - Budget</span>
        <AnalyticsDrilldownLink to="/analytics/costs" label="Cost Analytics" />
      </div>
    </div>
  );
};
