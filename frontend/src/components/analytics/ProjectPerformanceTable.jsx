import React from 'react';
import { VarianceBadge } from './VarianceBadge';
import { AnalyticsDrilldownLink } from './AnalyticsDrilldownLink';
import { FolderKanban, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export const ProjectPerformanceTable = ({ projects = [] }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-900 text-sm">Project Progress & Schedule Performance</h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {projects.length} Active Project(s)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Project Code & Name</th>
              <th className="py-3 px-4">Location & Manager</th>
              <th className="py-3 px-4 text-center">Planned %</th>
              <th className="py-3 px-4 text-center">Actual %</th>
              <th className="py-3 px-4 text-center">Schedule Variance</th>
              <th className="py-3 px-4 text-right">Budget vs Spent</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{p.name}</div>
                  <div className="text-[11px] font-mono text-slate-400">{p.code}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-slate-700 font-medium">{p.location}</div>
                  <div className="text-[11px] text-slate-400">PM: {p.manager}</div>
                </td>
                <td className="py-3 px-4 text-center font-mono font-semibold text-slate-600">
                  {p.plannedProgress}%
                </td>
                <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                  {p.actualProgress}%
                </td>
                <td className="py-3 px-4 text-center">
                  <VarianceBadge value={p.scheduleVariance} suffix="%" />
                </td>
                <td className="py-3 px-4 text-right font-mono">
                  <div className="font-bold text-slate-900">₹{(p.spent / 100000).toFixed(1)}L</div>
                  <div className="text-[11px] text-slate-400">of ₹{(p.budget / 100000).toFixed(1)}L</div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      p.scheduleStatus === 'Ahead of Schedule'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : p.scheduleStatus === 'Delayed' || p.scheduleStatus === 'Severely Delayed'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {p.scheduleStatus === 'Ahead of Schedule' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : p.scheduleStatus === 'Severely Delayed' ? (
                      <AlertTriangle className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {p.scheduleStatus}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <AnalyticsDrilldownLink to={`/projects/${p.id}`} label="View Project" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
