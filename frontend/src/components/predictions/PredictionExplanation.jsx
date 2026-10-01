import React from 'react';
import { HelpCircle, AlertCircle, Calculator, Calendar, CheckSquare, Wrench } from 'lucide-react';

/**
 * Transparent Prediction Explanation Breakdown
 * Answers: WHAT, WHY, HOW, WHEN, ASSUMPTIONS, ACTION
 */
export const PredictionExplanation = ({ prediction }) => {
  if (!prediction) return null;

  const {
    explanation,
    evidence,
    calculationBasis,
    horizon,
    assumptions,
    recommendedAction,
    actualData,
    derivedAnalytics,
    forecastValue,
  } = prediction;

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-4 space-y-3.5 text-xs font-sans border border-slate-800 shadow-inner">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
        <HelpCircle className="w-4 h-4" />
        <span>Predictive Intelligence Explanation</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* WHAT */}
        <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <span className="font-extrabold text-amber-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> 1. WHAT IS PREDICTED?
          </span>
          <p className="text-slate-200 leading-relaxed font-medium">{explanation}</p>
        </div>

        {/* WHY */}
        <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <span className="font-extrabold text-blue-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-blue-400" /> 2. WHY (SIGNALS & EVIDENCE)?
          </span>
          <p className="text-slate-300 leading-relaxed">{evidence}</p>
        </div>

        {/* HOW */}
        <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <span className="font-extrabold text-emerald-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-emerald-400" /> 3. HOW WAS IT CALCULATED?
          </span>
          <p className="text-slate-300 font-mono text-[11px] leading-relaxed bg-slate-900 p-2 rounded border border-slate-800">
            {calculationBasis}
          </p>
        </div>

        {/* WHEN */}
        <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <span className="font-extrabold text-purple-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-400" /> 4. WHEN (FORECAST HORIZON)?
          </span>
          <p className="text-slate-200 font-semibold">{horizon || 'Next 7 Days'}</p>
          <div className="text-[11px] text-slate-400">
            Target window for forecast evaluation and site team preparation.
          </div>
        </div>

        {/* ASSUMPTIONS */}
        <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <span className="font-extrabold text-amber-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-amber-300" /> 5. ASSUMPTIONS & CONSTRAINTS
          </span>
          <p className="text-slate-300 leading-relaxed">{assumptions || 'Standard site working conditions without extreme weather delay.'}</p>
        </div>

        {/* RECOMMENDED ACTION */}
        <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <span className="font-extrabold text-rose-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-rose-400" /> 6. RECOMMENDED SITE ACTION
          </span>
          <p className="text-slate-200 font-semibold leading-relaxed">{recommendedAction}</p>
        </div>
      </div>

      {/* Actual vs Derived vs Forecast Data Breakdown */}
      {(actualData || derivedAnalytics || forecastValue) && (
        <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2 text-[11px]">
          {actualData && (
            <span className="px-2.5 py-1 bg-blue-950 text-blue-300 rounded border border-blue-800 font-mono">
              <strong className="font-sans font-bold text-blue-400 uppercase mr-1">ACTUAL:</strong> {actualData}
            </span>
          )}
          {derivedAnalytics && (
            <span className="px-2.5 py-1 bg-purple-950 text-purple-300 rounded border border-purple-800 font-mono">
              <strong className="font-sans font-bold text-purple-400 uppercase mr-1">DERIVED:</strong> {derivedAnalytics}
            </span>
          )}
          {forecastValue && (
            <span className="px-2.5 py-1 bg-amber-950 text-amber-300 rounded border border-amber-800 font-mono">
              <strong className="font-sans font-bold text-amber-400 uppercase mr-1">FORECAST:</strong> {forecastValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
