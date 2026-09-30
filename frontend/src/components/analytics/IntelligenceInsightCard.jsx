import React from 'react';
import { AlertTriangle, AlertCircle, Info, ArrowRight, ShieldAlert } from 'lucide-react';
import { AnalyticsDrilldownLink } from './AnalyticsDrilldownLink';

export const IntelligenceInsightCard = ({ insight }) => {
  const { category, severity, title, evidence, affectedModule, recommendedAttention, drilldown } = insight || {};

  const getSeverityBadge = () => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Info':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getIcon = () => {
    switch (severity) {
      case 'Critical':
        return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case 'Warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'Info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-100 shrink-0">
              {getIcon()}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">{category}</span>
              <h4 className="font-bold text-slate-900 text-sm leading-tight">{title}</h4>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge()}`}>
            {severity}
          </span>
        </div>

        <div className="mt-3 space-y-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 font-mono text-[11px] text-slate-700">
            <span className="font-bold text-slate-900 block font-sans text-xs mb-0.5">Empirical Evidence:</span>
            {evidence}
          </div>

          <div className="text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-900">Recommended Attention:</span> {recommendedAttention}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">Module: {affectedModule}</span>
        <AnalyticsDrilldownLink to={drilldown} label="Open Module" />
      </div>
    </div>
  );
};
