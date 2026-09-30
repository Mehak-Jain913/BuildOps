import React from 'react';
import { VarianceBadge } from './VarianceBadge';
import { AnalyticsDrilldownLink } from './AnalyticsDrilldownLink';
import { HelpCircle } from 'lucide-react';

export const AnalyticsMetricCard = ({
  title,
  value,
  subtext,
  variance,
  varianceSuffix = '%',
  reverseVarianceColor = false,
  status,
  statusColor = 'slate',
  icon: Icon,
  calculationExplanation,
  drilldownTo,
  drilldownLabel = 'View Details',
}) => {
  const getStatusClasses = () => {
    switch (statusColor) {
      case 'emerald':
      case 'green':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'amber':
      case 'yellow':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'red':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'blue':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</h4>
                {calculationExplanation && (
                  <span title={calculationExplanation} className="cursor-help text-slate-400 hover:text-slate-600">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              {subtext && <p className="text-[11px] text-slate-400 font-medium">{subtext}</p>}
            </div>
          </div>

          {status && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusClasses()}`}>
              {status}
            </span>
          )}
        </div>

        {/* Metric Value */}
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">{value}</span>
          {variance !== undefined && (
            <VarianceBadge value={variance} suffix={varianceSuffix} reverseColor={reverseVarianceColor} />
          )}
        </div>
      </div>

      {/* Footer / Drill-down */}
      {drilldownTo && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
          <AnalyticsDrilldownLink to={drilldownTo} label={drilldownLabel} />
        </div>
      )}
    </div>
  );
};
