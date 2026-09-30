import React from 'react';
import { Calendar, CheckCircle2, AlertTriangle, ShieldCheck, Users, Package, ShoppingBag, ClipboardList } from 'lucide-react';
import { AnalyticsDrilldownLink } from './AnalyticsDrilldownLink';

export const ReadinessBreakdown = ({ readinessData }) => {
  const { overallScore = 88, breakdown = [] } = readinessData || {};

  const getIcon = (key) => {
    switch (key) {
      case 'labour': return Users;
      case 'material': return Package;
      case 'procurement': return ShoppingBag;
      case 'tasks': return ClipboardList;
      case 'issues': return AlertTriangle;
      case 'safety': return ShieldCheck;
      default: return Calendar;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-md font-mono">
            {overallScore}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">Tomorrow Operational Readiness</h3>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                Rule-Based Unified Score
              </span>
            </div>
            <p className="text-xs text-slate-500">24–48 hour site execution preparedness across resource heads</p>
          </div>
        </div>

        <AnalyticsDrilldownLink to="/intelligence/readiness" label="Detailed Readiness Breakdown" variant="button" />
      </div>

      {/* Grid Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {breakdown.map((item) => {
          const ItemIcon = getIcon(item.key);
          const isHealthy = item.score >= item.target;

          return (
            <div key={item.key} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ItemIcon className="w-4 h-4 text-slate-700" />
                  <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isHealthy ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {item.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-900 mb-1.5">
                <span>Score: {item.score}%</span>
                <span className="text-[10px] font-normal text-slate-500">Target: {item.target}%</span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all ${isHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
