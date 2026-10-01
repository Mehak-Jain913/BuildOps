import React from 'react';
import { usePredictions } from '../../hooks/usePredictions';
import { PredictionDetailCard } from '../../components/predictions/PredictionDetailCard';
import { Sparkles, Calendar, ExternalLink, ShieldAlert, ArrowDown, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReadinessForecastPage = () => {
  const { forecastTomorrowReadiness } = usePredictions();

  const rd = forecastTomorrowReadiness;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Next Operational Day Forecast • Phase 9</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Tomorrow Readiness Forecast
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Predict tomorrow site operational readiness by evaluating overnight material stockouts, trade workforce allocation gaps, and open high-priority site issues.
        </p>
      </div>

      {/* Readiness Score Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">
              ACTUAL TODAY READINESS
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {rd.currentReadiness}%
            </div>
            <span className="text-xs text-slate-500">Verified site readiness score</span>
          </div>
          <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold font-mono">
            ACTUAL
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block font-mono">
              FORECAST TOMORROW READINESS
            </span>
            <div className="text-3xl font-black text-amber-400 mt-1">
              {rd.forecastReadiness}%
            </div>
            <span className="text-xs text-slate-400">Projected next-shift score</span>
          </div>
          <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
            FORECAST
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">
              PROJECTED SCORE CHANGE
            </span>
            <div
              className={`text-3xl font-black mt-1 flex items-center gap-1 ${
                rd.change < 0 ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              {rd.change < 0 ? <ArrowDown className="w-6 h-6 stroke-[3]" /> : <ArrowUp className="w-6 h-6 stroke-[3]" />}
              <span>{rd.change}%</span>
            </div>
            <span className="text-xs text-slate-500">Expected readiness shift</span>
          </div>
          <span
            className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
              rd.change < 0 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {rd.change < 0 ? 'DECLINE' : 'STABLE'}
          </span>
        </div>
      </div>

      {/* Main Driver Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Main Operational Risk Drivers for Tomorrow
            </h3>
          </div>
          <Link
            to="/intelligence/readiness"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline"
          >
            <span>View Phase 8 Readiness Dimensions</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2">
          {rd.mainDrivers.map((driver, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-extrabold text-[10px] flex items-center justify-center font-mono">
                  0{idx + 1}
                </span>
                <span>{driver}</span>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                Risk Factor
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Prediction Card */}
      <PredictionDetailCard prediction={rd} />
    </div>
  );
};
