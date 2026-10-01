import React from 'react';
import { usePredictions } from '../../hooks/usePredictions';
import { PredictionDetailCard } from '../../components/predictions/PredictionDetailCard';
import { DollarSign, ExternalLink, Calculator, TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CostForecastPage = () => {
  const { forecastProjectCost } = usePredictions();

  const cost = forecastProjectCost;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider mb-1">
          <DollarSign className="w-4 h-4 text-emerald-500" />
          <span>Estimate At Completion (EAC) Cost Intelligence • Phase 9</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Project Cost Forecast
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Forecast final project cost at completion (EAC) using earned value burn rates derived from actual material, workforce, and subcontractor expenditure.
        </p>
      </div>

      {/* Financial Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">1. ACTUAL SPEND</span>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[9px] font-bold">ACTUAL</span>
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">
            ₹{(cost.currentSpend / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5">
            Verified cumulative expenditure
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">2. BASELINE BUDGET</span>
            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-bold">DERIVED</span>
          </div>
          <div className="text-xl font-black text-slate-800 mt-1">
            ₹{(cost.baselineBudget / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5">
            Approved client project budget
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">3. FORECAST EAC COST</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">FORECAST</span>
          </div>
          <div className="text-xl font-black text-amber-400 mt-1">
            ₹{(cost.forecastCompletionCost / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[11px] font-medium text-slate-400 mt-0.5">
            Projected cost at completion
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">4. FORECAST VARIANCE</span>
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                cost.forecastVariance > 0 ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
              }`}
            >
              {cost.costRiskStatus}
            </span>
          </div>
          <div
            className={`text-xl font-black mt-1 ${
              cost.forecastVariance > 0 ? 'text-red-600' : 'text-emerald-600'
            }`}
          >
            {cost.forecastVariance > 0 ? `+` : ''}₹{(cost.forecastVariance / 100000).toFixed(1)}L ({cost.forecastVariancePct}%)
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5">
            EAC Variance vs Baseline
          </div>
        </div>
      </div>

      {/* Burn Rate & EAC Logic Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Cost Burn Rate & EAC Calculation Basis
            </h3>
          </div>
          <Link
            to="/analytics/costs"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline"
          >
            <span>Explore Cost Analytics</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2 font-mono">
            <span className="text-amber-400 font-bold">Calculation Formula:</span>
            <span className="text-slate-300">
              EAC = Actual Spend / Current Physical Progress %
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-blue-400 block font-mono">
                ACTUAL DATA POINT
              </span>
              <p className="text-xs text-slate-200 mt-1">
                Cumulative Spend: <strong>₹{cost.currentSpend.toLocaleString('en-IN')}</strong>
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-purple-400 block font-mono">
                DERIVED ANALYTIC
              </span>
              <p className="text-xs text-slate-200 mt-1">
                Burn rate per 1% progress: <strong>₹{Math.round(cost.currentSpend / 42).toLocaleString('en-IN')}</strong>
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-amber-400 block font-mono">
                FORECAST RESULT
              </span>
              <p className="text-xs text-slate-200 mt-1">
                EAC Forecast: <strong>₹{cost.forecastCompletionCost.toLocaleString('en-IN')}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Detail Component */}
      <PredictionDetailCard prediction={cost} />
    </div>
  );
};
