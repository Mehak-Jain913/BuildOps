import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { AnalyticsMetricCard } from '../../components/analytics/AnalyticsMetricCard';
import { AnalyticsDrilldownLink } from '../../components/analytics/AnalyticsDrilldownLink';
import { HardHat, FileText, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SiteAnalyticsPage = () => {
  const { siteAnalytics } = useAnalytics();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          <HardHat className="w-4 h-4 text-indigo-500" />
          <span>Site Activity & Quality Intelligence</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Site Operations Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Analyzes Daily Site Reports, work progress logs, open site issues resolution rate, and safety incidents.
        </p>
      </div>

      <AnalyticsFilterBar />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsMetricCard
          title="Daily Logs Filed"
          value={siteAnalytics.totalReportsFiled}
          subtext="Daily site reports submitted"
          icon={FileText}
        />
        <AnalyticsMetricCard
          title="Issue Resolution Rate"
          value={`${siteAnalytics.issueResolutionRatePct}%`}
          subtext={`${siteAnalytics.resolvedIssues} resolved / ${siteAnalytics.totalIssues} total`}
          icon={CheckCircle2}
        />
        <AnalyticsMetricCard
          title="High-Priority Issues"
          value={siteAnalytics.highPriorityOpenIssues}
          subtext="Open critical blockages"
          status={siteAnalytics.highPriorityOpenIssues === 0 ? 'Clear' : 'Action Required'}
          statusColor={siteAnalytics.highPriorityOpenIssues === 0 ? 'emerald' : 'red'}
          icon={AlertTriangle}
        />
        <AnalyticsMetricCard
          title="Safety Incidents"
          value={siteAnalytics.openSafetyIncidents}
          subtext={`${siteAnalytics.criticalSafetyIncidents} critical safety incidents`}
          status={siteAnalytics.criticalSafetyIncidents === 0 ? 'Compliant' : 'Safety Risk'}
          statusColor={siteAnalytics.criticalSafetyIncidents === 0 ? 'emerald' : 'red'}
          icon={ShieldCheck}
        />
      </div>

      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Site Operations Execution Stream</h3>
            <p className="text-xs text-slate-500">View real-time daily reports, work progress entries, and site issue tickets.</p>
          </div>
        </div>
        <AnalyticsDrilldownLink to="/site/issues" label="Open Site Issues Center" variant="button" />
      </div>
    </div>
  );
};
