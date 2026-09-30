import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, AlertCircle, ArrowRight } from 'lucide-react';
import { AnalyticsDrilldownLink } from './AnalyticsDrilldownLink';

export const RiskMatrix = ({ categories = [] }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-sm text-white">Construction Operational Risk Matrix</h3>
            <p className="text-xs text-slate-400">Deterministic risk classification and empirical evidence signals</p>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          7 Derived Categories
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Risk Area</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Severity / Score</th>
              <th className="py-3 px-4">Empirical Evidence</th>
              <th className="py-3 px-4">Recommended Attention</th>
              <th className="py-3 px-4 text-right">Drill Down</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => {
              const isHigh = cat.status === 'HIGH' || cat.status === 'CRITICAL';
              const isMedium = cat.status === 'MEDIUM';

              return (
                <tr key={cat.key} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {cat.name}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                        cat.status === 'CRITICAL'
                          ? 'bg-red-500 text-white border-red-600'
                          : cat.status === 'HIGH'
                          ? 'bg-orange-500 text-white border-orange-600'
                          : cat.status === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}
                    >
                      {cat.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                    {cat.score} / 100
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-mono text-[11px] max-w-xs leading-normal">
                    {cat.evidence}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs max-w-xs leading-normal">
                    {cat.recommendation}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <AnalyticsDrilldownLink to={cat.drilldown} label="Investigate" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
