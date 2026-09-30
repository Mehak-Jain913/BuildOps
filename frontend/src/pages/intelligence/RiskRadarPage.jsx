import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { RiskSignalCard } from '../../components/analytics/RiskSignalCard';
import { RiskMatrix } from '../../components/analytics/RiskMatrix';
import { ShieldAlert, Info } from 'lucide-react';

export const RiskRadarPage = () => {
  const { riskRadar } = useAnalytics();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>Construction Risk Radar</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Construction Risk Radar</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Deterministic risk classification across Schedule, Material, Labour, Procurement, Cost, Site Issues, and Safety.
        </p>
      </div>

      <AnalyticsFilterBar />

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p>
          Risk statuses (<strong>LOW, MEDIUM, HIGH, CRITICAL</strong>) are calculated deterministically from active operational metrics.
          For example: Schedule Risk increases if actual progress is behind planned progress; Material Risk increases if stock levels fall below reorder thresholds.
        </p>
      </div>

      {/* Grid of Risk Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {riskRadar.categories.map((cat) => (
          <RiskSignalCard key={cat.key} category={cat} />
        ))}
      </div>

      {/* Complete Operational Risk Matrix */}
      <RiskMatrix categories={riskRadar.categories} />
    </div>
  );
};
