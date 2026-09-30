import React from 'react';
import { HardHat, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';
import { AnalyticsDrilldownLink } from './AnalyticsDrilldownLink';

export const SiteAnalyticsCard = ({ siteData }) => {
  const {
    totalReportsFiled = 0,
    openIssues = 0,
    highPriorityOpenIssues = 0,
    issueResolutionRatePct = 100,
    openSafetyIncidents = 0,
    criticalSafetyIncidents = 0,
  } = siteData || {};

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Site Operations & Quality</h3>
              <p className="text-[11px] text-slate-500">Logs, issue resolution & safety</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
            {issueResolutionRatePct}% Resolved
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Daily Logs Filed</span>
            <div className="text-base font-black text-slate-900 font-mono">
              {totalReportsFiled} <span className="text-xs font-normal text-slate-400">reports</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Open Site Issues</span>
            <div className="text-base font-black text-slate-900 font-mono">
              {openIssues} <span className="text-xs font-normal text-slate-400">({highPriorityOpenIssues} High)</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Safety Incident Status:
            </span>
            <span className={`font-bold ${criticalSafetyIncidents > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              {openSafetyIncidents} open ({criticalSafetyIncidents} critical)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              Quality Compliance:
            </span>
            <span className="font-bold text-slate-900">Compliant</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Derived from Site Ops context</span>
        <AnalyticsDrilldownLink to="/site/issues" label="Site Operations" />
      </div>
    </div>
  );
};
