import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Users,
  Calendar,
  Truck,
  DollarSign,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { SEVERITY_LEVELS } from '../../mock/predictionData';
import { PredictionExplanation } from './PredictionExplanation';

const ICON_MAP = {
  Package,
  Users,
  Calendar,
  Truck,
  DollarSign,
  Sparkles,
};

export const PredictionCard = ({ prediction, showExplanationToggle = true }) => {
  const [expanded, setExpanded] = useState(false);

  if (!prediction) return null;

  const {
    category,
    title,
    value,
    confidence,
    confidenceReason,
    severity = 'LOW',
    horizon = 'Next 7 Days',
    evidence,
    recommendedAction,
    drilldownUrl = '/predictions',
    actualData,
    derivedAnalytics,
    forecastValue,
    iconType = 'Sparkles',
  } = prediction;

  const IconComponent = ICON_MAP[iconType] || Sparkles;
  const severityMeta = SEVERITY_LEVELS[severity] || SEVERITY_LEVELS.LOW;

  return (
    <div
      className={`rounded-2xl border p-5 shadow-xs transition-all duration-200 flex flex-col justify-between ${severityMeta.cardClass}`}
    >
      <div>
        {/* Top Header: Category, Icon, Horizon, Severity & Confidence */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs shrink-0">
              <IconComponent className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
                {category}
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight leading-snug">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${severityMeta.badgeClass}`}
            >
              {severity} RISK
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              {horizon}
            </span>
          </div>
        </div>

        {/* Forecasted Value Banner */}
        <div className="my-3 p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between border border-slate-800 shadow-inner">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block font-mono">
              Forecasted Output
            </span>
            <span className="text-base font-black text-amber-400 tracking-tight">
              {value}
            </span>
          </div>
          <ConfidenceIndicator confidence={confidence} reason={confidenceReason} />
        </div>

        {/* Data Badges: ACTUAL / DERIVED / FORECAST */}
        <div className="flex flex-wrap gap-1.5 mb-3 text-[11px] font-mono">
          {actualData && (
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              <span className="font-bold font-sans">ACTUAL:</span> {actualData}
            </span>
          )}
          {derivedAnalytics && (
            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
              <span className="font-bold font-sans">DERIVED:</span> {derivedAnalytics}
            </span>
          )}
          {forecastValue && (
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300">
              <span className="font-bold font-sans">FORECAST:</span> {forecastValue}
            </span>
          )}
        </div>

        {/* Evidence & Action Summary */}
        <div className="space-y-2 text-xs text-slate-600">
          <div className="p-2.5 rounded-lg bg-white/70 border border-slate-200/80 text-slate-700">
            <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider mb-0.5">
              Evidence Signal:
            </span>
            {evidence}
          </div>

          <div className="text-slate-700">
            <span className="font-bold text-slate-900">Recommended Action:</span>{' '}
            {recommendedAction}
          </div>
        </div>
      </div>

      {/* Footer Controls & Expand */}
      <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2 text-xs">
        {showExplanationToggle ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 font-bold text-slate-700 hover:text-amber-600 transition-colors text-[11px]"
          >
            {expanded ? (
              <>
                <span>Hide Logic Breakdown</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>View Logic & Explanation</span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-500" />
              </>
            )}
          </button>
        ) : <div />}

        <Link
          to={drilldownUrl}
          className="inline-flex items-center gap-1 font-bold text-amber-600 hover:text-amber-700 hover:underline text-xs"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Expanded Logic Breakdown */}
      {expanded && (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <PredictionExplanation prediction={prediction} />
        </div>
      )}
    </div>
  );
};
