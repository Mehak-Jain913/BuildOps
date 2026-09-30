import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { IntelligenceInsightCard } from '../../components/analytics/IntelligenceInsightCard';
import { IntelligenceInsightTable } from '../../components/analytics/IntelligenceInsightTable';
import { Sparkles, Info } from 'lucide-react';

export const InsightsPage = () => {
  const { intelligenceInsights } = useAnalytics();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Rule-Based Actionable Prescriptions</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Construction Intelligence Insights</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Deterministic recommendations generated strictly from live site conditions and operational thresholds.
        </p>
      </div>

      <AnalyticsFilterBar />

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p>
          Every insight contains an empirical evidence trace, affected module tag, recommended action, and direct drill-down link to the source module. No vague AI-generated claims.
        </p>
      </div>

      {/* Grid view of insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {intelligenceInsights.map((ins) => (
          <IntelligenceInsightCard key={ins.id} insight={ins} />
        ))}
      </div>

      {/* Table view of insights */}
      <IntelligenceInsightTable insights={intelligenceInsights} />
    </div>
  );
};
