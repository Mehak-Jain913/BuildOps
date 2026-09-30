import React from 'react';
import { Sparkles } from 'lucide-react';
import { AnalyticsDrilldownLink } from './AnalyticsDrilldownLink';

export const IntelligenceInsightTable = ({ insights = [] }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-sm text-white">Actionable Operational Insights</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {insights.length} Signals Generated
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Insight Title</th>
              <th className="py-3 px-4">Empirical Evidence</th>
              <th className="py-3 px-4">Affected Module</th>
              <th className="py-3 px-4">Recommended Attention</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {insights.map((ins) => (
              <tr key={ins.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-bold font-mono text-slate-700">{ins.category}</td>
                <td className="py-3 px-4">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      ins.severity === 'Critical'
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : ins.severity === 'Warning'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-blue-100 text-blue-800 border-blue-200'
                    }`}
                  >
                    {ins.severity}
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-slate-900">{ins.title}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-slate-700 max-w-xs">{ins.evidence}</td>
                <td className="py-3 px-4 text-slate-600 font-medium">{ins.affectedModule}</td>
                <td className="py-3 px-4 text-slate-600 max-w-xs">{ins.recommendedAttention}</td>
                <td className="py-3 px-4 text-right">
                  <AnalyticsDrilldownLink to={ins.drilldown} label="Investigate" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
