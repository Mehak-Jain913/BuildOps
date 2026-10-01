import React from 'react';
import { usePredictions } from '../../hooks/usePredictions';
import { PredictionDetailCard } from '../../components/predictions/PredictionDetailCard';
import { Calendar, AlertTriangle, ShieldCheck, Clock, ExternalLink, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ScheduleDelayPage = () => {
  const { predictScheduleDelay } = usePredictions();

  const pred = predictScheduleDelay;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 uppercase tracking-wider mb-1">
          <Calendar className="w-4 h-4 text-amber-500" />
          <span>Schedule Variance & Slip Forecasting • Phase 9</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Schedule Delay Risk Prediction
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Evaluate critical path schedule risk deterministically by analyzing progress variance, open site issues, material stockout severity, trade deficits, and PO delivery delays.
        </p>
      </div>

      {/* Main KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
            Actual Progress
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {pred.actualProgress}%
          </span>
          <span className="text-[11px] text-slate-500">Physical verified completion</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
            Planned Baseline
          </span>
          <span className="text-2xl font-black text-slate-800 mt-1 block">
            {pred.plannedProgress}%
          </span>
          <span className="text-[11px] text-slate-500">Schedule baseline target</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
            Progress Variance
          </span>
          <span
            className={`text-2xl font-black mt-1 block ${
              pred.variance < 0 ? 'text-red-600' : 'text-emerald-600'
            }`}
          >
            {pred.variance > 0 ? `+${pred.variance}` : pred.variance}%
          </span>
          <span className="text-[11px] text-slate-500">Difference from baseline</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-mono">
            Potential Delay Slip
          </span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">
            {pred.projectedDaysSlip > 0 ? `+${pred.projectedDaysSlip} Days` : '0 Days'}
          </span>
          <span className="text-[11px] text-slate-400">Forecasted milestone delay</span>
        </div>
      </div>

      {/* Delay Score & Risk Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Schedule Risk Factor Contribution
            </h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg">
            Delay Risk Index: <strong>{pred.delayRiskScore} / 100</strong> ({pred.severity})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-xs block uppercase tracking-wider font-mono">
              Primary Delay Signals:
            </span>
            <ul className="space-y-1.5 text-slate-700">
              <li className="flex items-center justify-between py-1 border-b border-slate-200">
                <span>Progress Variance Slip:</span>
                <strong className={pred.variance < 0 ? 'text-red-600' : 'text-slate-900'}>
                  {pred.variance}%
                </strong>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-200">
                <span>Open High-Priority Site Issues:</span>
                <strong className="text-slate-900">Active</strong>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-200">
                <span>Material Stockout Headwinds:</span>
                <strong className="text-slate-900">Evaluated</strong>
              </li>
              <li className="flex items-center justify-between py-1">
                <span>Trade Workforce Shortage Gaps:</span>
                <strong className="text-slate-900">Evaluated</strong>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
            <div>
              <span className="font-bold text-amber-400 text-xs block uppercase tracking-wider font-mono">
                Calculation Methodology:
              </span>
              <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">
                Schedule delay risk is computed deterministically by adding weighted risk penalties for progress variance, open structural issues, material shortages, and labour deficits.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <Link
                to="/projects/progress"
                className="inline-flex items-center gap-1.5 font-bold px-3 py-1.5 bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 text-xs"
              >
                <span>Drill down to Project Progress Matrix</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Card */}
      <PredictionDetailCard prediction={pred} />
    </div>
  );
};
