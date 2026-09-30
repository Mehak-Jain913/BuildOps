import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { ReadinessBreakdown } from '../../components/analytics/ReadinessBreakdown';
import { RiskSignalCard } from '../../components/analytics/RiskSignalCard';
import { IntelligenceInsightCard } from '../../components/analytics/IntelligenceInsightCard';
import { AnalyticsDrilldownLink } from '../../components/analytics/AnalyticsDrilldownLink';
import { Sparkles, ShieldAlert, CheckCircle2, ArrowRight, Layers, Database, Cpu, AlertTriangle } from 'lucide-react';

export const IntelligencePage = () => {
  const { readinessIntelligence, riskRadar, intelligenceInsights } = useAnalytics();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Derived Operational Intelligence</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Construction Intelligence</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Derived operational signals from project, resource and site data.
        </p>
      </div>

      <AnalyticsFilterBar />

      {/* INTELLIGENCE FLOW VISUALIZATION */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          BuildOps Intelligence Engine Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 flex flex-col items-center justify-center">
            <Database className="w-5 h-5 text-blue-400 mb-1" />
            <span className="text-xs font-bold text-white">Operational Data</span>
            <span className="text-[10px] text-slate-400">Projects, Stock, Attendance, POs, Logs</span>
          </div>

          <div className="hidden md:flex items-center justify-center text-slate-500 font-bold">
            →
          </div>

          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 flex flex-col items-center justify-center">
            <Layers className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-xs font-bold text-white">Rules & Thresholds</span>
            <span className="text-[10px] text-slate-400">Deterministic Benchmarks</span>
          </div>

          <div className="hidden md:flex items-center justify-center text-slate-500 font-bold">
            →
          </div>

          <div className="p-3 bg-amber-500/20 rounded-lg border border-amber-500/40 flex flex-col items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-300 mb-1" />
            <span className="text-xs font-bold text-amber-300">Operational Signals</span>
            <span className="text-[10px] text-amber-200/80">Risk Radar & Insights</span>
          </div>
        </div>
      </div>

      {/* TOMORROW READINESS UNIFIED SCORE */}
      <section>
        <ReadinessBreakdown readinessData={readinessIntelligence} />
      </section>

      {/* HIGH PRIORITY RISK SIGNALS */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Active Construction Risk Signals
            </h2>
            <p className="text-xs text-slate-500">Derived from live schedule variance, low stock, trade shortages, delayed POs, and open issues</p>
          </div>
          <AnalyticsDrilldownLink to="/intelligence/risk-radar" label="View Risk Radar" variant="button" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {riskRadar.categories.slice(0, 3).map((cat) => (
            <RiskSignalCard key={cat.key} category={cat} />
          ))}
        </div>
      </section>

      {/* ACTIONABLE INSIGHTS */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Actionable Construction Insights
            </h2>
            <p className="text-xs text-slate-500">Rule-based recommendations with empirical evidence</p>
          </div>
          <AnalyticsDrilldownLink to="/intelligence/insights" label="View All Insights" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intelligenceInsights.slice(0, 4).map((ins) => (
            <IntelligenceInsightCard key={ins.id} insight={ins} />
          ))}
        </div>
      </section>
    </div>
  );
};

export const IntelligenceOverviewPage = IntelligencePage;
