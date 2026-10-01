import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { PredictionExplanation } from './PredictionExplanation';
import { SEVERITY_LEVELS } from '../../mock/predictionData';

/**
 * Detailed Comprehensive Card Component for Prediction Subpages
 */
export const PredictionDetailCard = ({ prediction }) => {
  if (!prediction) return null;

  const {
    category,
    title,
    value,
    confidence,
    confidenceReason,
    severity = 'LOW',
    horizon = 'Next 7 Days',
    explanation,
    evidence,
    assumptions,
    recommendedAction,
    sourceModule,
    drilldownUrl,
    actualData,
    derivedAnalytics,
    forecastValue,
    calculationBasis,
    modelType,
    modelVersion,
  } = prediction;

  const severityMeta = SEVERITY_LEVELS[severity] || SEVERITY_LEVELS.LOW;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
      {/* Header Banner */}
      <div className="p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{category} Baseline Forecast</span>
          </div>
          <h2 className="text-lg font-black tracking-tight text-white">{title}</h2>
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className={`text-xs font-black px-3 py-1 rounded border uppercase tracking-wider ${severityMeta.badgeClass}`}
          >
            {severity} RISK
          </span>
          <ConfidenceIndicator confidence={confidence} reason={confidenceReason} />
        </div>
      </div>

      {/* Main Grid Body */}
      <div className="p-5 space-y-5">
        {/* Forecast Summary KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200">
            <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider block font-mono">
              ACTUAL DATA
            </span>
            <p className="text-xs font-semibold text-slate-800 mt-1">{actualData || 'Active Operational Logs'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200">
            <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider block font-mono">
              DERIVED ANALYTICS
            </span>
            <p className="text-xs font-semibold text-slate-800 mt-1">{derivedAnalytics || 'Calculated Burn Rate'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300">
            <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block font-mono">
              PREDICTED FORECAST ({horizon})
            </span>
            <p className="text-sm font-black text-amber-950 mt-1">{value || forecastValue}</p>
          </div>
        </div>

        {/* 6-Point Explanation Breakdown */}
        <PredictionExplanation prediction={prediction} />

        {/* Architecture & Drill-down Footer */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Engine: <strong>{modelType || 'RULE_BASED_BASELINE'}</strong> ({modelVersion || 'v1.0'})</span>
            <span className="text-slate-300">•</span>
            <span>Module: <strong>{sourceModule || 'BuildOps Core'}</strong></span>
          </div>

          {drilldownUrl && (
            <Link
              to={drilldownUrl}
              className="inline-flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors text-xs shadow-xs"
            >
              <span>Investigate Operational Module ({sourceModule})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
