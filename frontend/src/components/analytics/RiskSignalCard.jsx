import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, AlertCircle, AlertTriangle, CheckCircle2, ShieldCheck, Brain, ArrowUpRight } from 'lucide-react';
import { AnalyticsDrilldownLink } from './AnalyticsDrilldownLink';

export const RiskSignalCard = ({ category }) => {
  const { name, status, score, evidence, recommendation, drilldown, predictionUrl } = category || {};

  const getStatusColor = () => {
    switch (status) {
      case 'CRITICAL':
        return 'bg-red-500 text-white border-red-600';
      case 'HIGH':
        return 'bg-orange-500 text-white border-orange-600';
      case 'MEDIUM':
        return 'bg-amber-500 text-slate-950 border-amber-600';
      case 'LOW':
      default:
        return 'bg-emerald-500 text-white border-emerald-600';
    }
  };

  const getCardBorder = () => {
    switch (status) {
      case 'CRITICAL':
        return 'border-red-300 bg-red-50/30';
      case 'HIGH':
        return 'border-orange-300 bg-orange-50/20';
      case 'MEDIUM':
        return 'border-amber-300 bg-amber-50/20';
      case 'LOW':
      default:
        return 'border-slate-200 bg-white';
    }
  };

  const getPredictionUrl = () => {
    if (predictionUrl) return predictionUrl;
    const lower = (name || '').toLowerCase();
    if (lower.includes('schedule')) return '/predictions/schedule-delay';
    if (lower.includes('material')) return '/predictions/material-shortage';
    if (lower.includes('labour')) return '/predictions/labour-requirement';
    if (lower.includes('procurement')) return '/predictions/procurement-delay';
    if (lower.includes('cost')) return '/predictions/cost-forecast';
    if (lower.includes('readiness') || lower.includes('safety') || lower.includes('site')) return '/predictions/readiness';
    return '/predictions';
  };

  return (
    <div className={`rounded-xl border p-4 shadow-xs transition-all flex flex-col justify-between ${getCardBorder()}`}>
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className={`w-4 h-4 ${status === 'LOW' ? 'text-emerald-600' : 'text-amber-600'}`} />
            <h4 className="font-bold text-slate-900 text-sm">{name}</h4>
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor()}`}>
            {status} ({score})
          </span>
        </div>

        <div className="mt-2 text-xs space-y-2">
          <div className="p-2.5 rounded-lg bg-slate-900/5 text-slate-700 font-mono text-[11px] leading-relaxed">
            <span className="font-bold text-slate-900 block font-sans text-xs mb-0.5">Evidence Signal:</span>
            {evidence}
          </div>

          <div className="text-slate-600 text-xs">
            <span className="font-semibold text-slate-900">Recommended Action:</span> {recommendation}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-2.5 border-t border-slate-200/80 flex items-center justify-between gap-2 text-xs font-semibold">
        <Link
          to={getPredictionUrl()}
          className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 hover:underline text-xs font-bold"
        >
          <Brain className="w-3.5 h-3.5 text-amber-500" />
          <span>View Prediction ➔</span>
        </Link>

        <AnalyticsDrilldownLink to={drilldown || '/analytics'} label="Investigate Source" />
      </div>
    </div>
  );
};
