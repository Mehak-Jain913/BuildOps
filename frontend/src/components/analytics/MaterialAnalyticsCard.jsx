import React from 'react';
import { Package, AlertTriangle, Layers, Trash2, ArrowRight } from 'lucide-react';
import { VarianceBadge } from './VarianceBadge';
import { AnalyticsDrilldownLink } from './AnalyticsDrilldownLink';

export const MaterialAnalyticsCard = ({ materialData }) => {
  const {
    totalInvValue = 0,
    lowStockCount = 0,
    materialConsumptionVariancePct = 0,
    totalWastageCost = 0,
    stockReadinessPct = 100,
  } = materialData || {};

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Material Efficiency</h3>
              <p className="text-[11px] text-slate-500">Stock & consumption performance</p>
            </div>
          </div>
          <VarianceBadge value={materialConsumptionVariancePct} suffix="%" reverseColor={true} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Inventory Value</span>
            <div className="text-base font-black text-slate-900 font-mono">
              ₹{(totalInvValue / 100000).toFixed(1)}L
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Stock Readiness</span>
            <div className="text-base font-black text-slate-900 font-mono">
              {stockReadinessPct}%
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Low Stock Items:
            </span>
            <span className="font-bold text-slate-900">{lowStockCount} items</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              Est. Wastage Cost:
            </span>
            <span className="font-bold text-slate-900">₹{totalWastageCost.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Derived from Material context</span>
        <AnalyticsDrilldownLink to="/materials/inventory" label="Material Analytics" />
      </div>
    </div>
  );
};
