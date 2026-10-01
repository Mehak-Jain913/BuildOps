import React from 'react';
import { ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';
import { CONFIDENCE_LEVELS } from '../../mock/predictionData';

/**
 * Deterministic Prediction Confidence Indicator
 * Displays qualitative data-backed confidence level (HIGH, MEDIUM, LOW)
 */
export const ConfidenceIndicator = ({ confidence = 'HIGH', reason }) => {
  const meta = CONFIDENCE_LEVELS[confidence] || CONFIDENCE_LEVELS.HIGH;

  return (
    <div className="inline-flex items-center gap-1.5 group relative">
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${meta.badgeClass}`}
      >
        {confidence === 'HIGH' ? (
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
        ) : (
          <AlertCircle className="w-3 h-3 text-amber-600" />
        )}
        <span>Confidence: {confidence}</span>
      </span>

      <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 w-64 p-2.5 bg-slate-900 text-slate-100 text-[11px] rounded-lg shadow-xl border border-slate-700 z-50 pointer-events-none">
        <p className="font-semibold text-amber-400 mb-0.5">Prediction Confidence Basis:</p>
        <p className="text-slate-300">{reason || meta.description}</p>
        <span className="text-[10px] text-slate-400 block mt-1 border-t border-slate-800 pt-1 italic">
          Determined by data completeness & historical observation depth.
        </span>
      </div>
    </div>
  );
};
