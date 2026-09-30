import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { ReadinessBreakdown } from '../../components/analytics/ReadinessBreakdown';
import { AnalyticsDrilldownLink } from '../../components/analytics/AnalyticsDrilldownLink';
import { Calendar, CheckCircle2, AlertTriangle, ShieldCheck, Users, Package, ShoppingBag, ClipboardList, Info } from 'lucide-react';

export const ReadinessPage = () => {
  const { readinessIntelligence } = useAnalytics();
  const { overallScore, breakdown } = readinessIntelligence;

  const getDetails = (key) => {
    switch (key) {
      case 'labour':
        return {
          evidence: 'Calculated from present workforce vs required allocation headcount.',
          drilldown: '/labour/allocation',
          drillLabel: 'Check Allocations',
        };
      case 'material':
        return {
          evidence: 'Calculated from percentage of required material items with healthy stock.',
          drilldown: '/materials/inventory',
          drillLabel: 'Check Inventory',
        };
      case 'procurement':
        return {
          evidence: 'Calculated from supplier delivery on-time rate and active PO status.',
          drilldown: '/procurement/deliveries',
          drillLabel: 'Check Deliveries',
        };
      case 'tasks':
        return {
          evidence: 'Calculated from scheduled milestone progress and active phase preparation.',
          drilldown: '/projects/progress',
          drillLabel: 'Check Tasks',
        };
      case 'issues':
        return {
          evidence: 'Calculated from absence of high-priority open site issues.',
          drilldown: '/site/issues',
          drillLabel: 'Check Issues',
        };
      case 'safety':
        return {
          evidence: 'Calculated based on zero active critical safety incidents and TBT completion.',
          drilldown: '/site/safety',
          drillLabel: 'Check Safety',
        };
      default:
        return { evidence: 'Operational evaluation.', drilldown: '/analytics', drillLabel: 'View Analytics' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
          <Calendar className="w-4 h-4 text-amber-500" />
          <span>Site Preparedness Engine</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tomorrow Operational Readiness</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Unified 24–48 hour site execution preparedness score derived from Labour, Materials, Procurement, Tasks, Issues, and Safety.
        </p>
      </div>

      <AnalyticsFilterBar />

      <ReadinessBreakdown readinessData={readinessIntelligence} />

      {/* Detailed Readiness Category Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {breakdown.map((item) => {
          const detail = getDetails(item.key);
          const isHealthy = item.score >= item.target;

          return (
            <div key={item.key} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isHealthy ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {item.status} ({item.score}%)
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-mono mb-3">{detail.evidence}</p>

                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700">
                    <span>Readiness Meter</span>
                    <span>Target: {item.target}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full transition-all ${isHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">Weight: 15–25%</span>
                <AnalyticsDrilldownLink to={detail.drilldown} label={detail.drillLabel} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
