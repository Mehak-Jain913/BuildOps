import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { AnalyticsMetricCard } from '../../components/analytics/AnalyticsMetricCard';
import { AnalyticsDrilldownLink } from '../../components/analytics/AnalyticsDrilldownLink';
import { Users, UserCheck, Clock, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

export const LabourAnalyticsPage = () => {
  const { labourAnalytics } = useAnalytics();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <Users className="w-4 h-4 text-blue-500" />
          <span>Workforce & Productivity Intelligence</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Labour Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Workforce turnout, daily productivity, overtime costs, and trade-wise shortage analysis.
        </p>
      </div>

      <AnalyticsFilterBar />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsMetricCard
          title="Workforce Turnout"
          value={`${labourAnalytics.turnoutRatePct}%`}
          subtext={`${labourAnalytics.presentWorkers} present / ${labourAnalytics.totalWorkers} total`}
          icon={UserCheck}
        />
        <AnalyticsMetricCard
          title="Productivity Index"
          value={`${labourAnalytics.avgProductivityPct}%`}
          subtext="Output per crew hour"
          icon={TrendingUp}
        />
        <AnalyticsMetricCard
          title="Total Overtime"
          value={`${labourAnalytics.totalOvertimeHours} hrs`}
          subtext="Site overtime logged"
          icon={Clock}
        />
        <AnalyticsMetricCard
          title="Labour Cost Variance"
          value={`₹${(labourAnalytics.labourCostVariance / 100000).toFixed(1)}L`}
          variance={labourAnalytics.labourCostVariancePct}
          varianceSuffix="%"
          reverseVarianceColor={true}
          subtext={`Actual: ₹${(labourAnalytics.actualLabourCost / 100000).toFixed(1)}L`}
          icon={DollarSign}
        />
      </div>

      {/* Trade Analysis Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Trade-Wise Workforce Matrix & Shortage Analysis</h3>
              <p className="text-xs text-slate-400">Comparing required allocation vs actual present headcount</p>
            </div>
          </div>
          <AnalyticsDrilldownLink to="/labour/allocation" label="Manage Allocations" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Trade Name</th>
                <th className="py-3 px-4 text-center">Required Count</th>
                <th className="py-3 px-4 text-center">Allocated Count</th>
                <th className="py-3 px-4 text-center">Present On-Site</th>
                <th className="py-3 px-4 text-center">Trade Shortage</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {labourAnalytics.tradeAnalysis.map((tr) => (
                <tr key={tr.trade} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 font-mono">{tr.trade}</td>
                  <td className="py-3 px-4 text-center font-mono text-slate-600">{tr.requiredCount}</td>
                  <td className="py-3 px-4 text-center font-mono text-slate-700">{tr.allocatedCount}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">{tr.presentCount}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold">
                    {tr.shortageCount > 0 ? (
                      <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        -{tr.shortageCount} worker(s)
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        tr.status === 'Shortage'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : tr.status === 'Tight'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {tr.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <AnalyticsDrilldownLink to="/labour/allocation" label="Allocate Trade" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
