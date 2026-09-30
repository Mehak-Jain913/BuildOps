import React from 'react';
import { Users, UserCheck, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { VarianceBadge } from './VarianceBadge';
import { AnalyticsDrilldownLink } from './AnalyticsDrilldownLink';

export const LabourAnalyticsCard = ({ labourData }) => {
  const {
    totalWorkers = 0,
    presentWorkers = 0,
    turnoutRatePct = 0,
    totalOvertimeHours = 0,
    avgProductivityPct = 0,
    totalShortageCount = 0,
  } = labourData || {};

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Labour Productivity</h3>
              <p className="text-[11px] text-slate-500">Workforce turnout & output</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono">
            {turnoutRatePct}% Turnout
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">On-Site Today</span>
            <div className="text-base font-black text-slate-900 font-mono">
              {presentWorkers} <span className="text-xs font-normal text-slate-400">/ {totalWorkers}</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Productivity Index</span>
            <div className="text-base font-black text-slate-900 font-mono">
              {avgProductivityPct}%
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              Total OT Hours:
            </span>
            <span className="font-bold text-slate-900">{totalOvertimeHours} hrs</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <AlertTriangle className={`w-3.5 h-3.5 ${totalShortageCount > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
              Trade Shortages:
            </span>
            <span className={`font-bold ${totalShortageCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {totalShortageCount} worker(s)
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Derived from Labour context</span>
        <AnalyticsDrilldownLink to="/labour/productivity" label="Labour Analytics" />
      </div>
    </div>
  );
};
