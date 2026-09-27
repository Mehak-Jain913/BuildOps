import React from 'react';
import { cn } from '../../utils/cn';
import { Sparkles, Brain, ArrowRight, ShieldCheck } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';

/**
 * Insight Card for AI-driven material predictions, risk radar & site intelligence recommendations
 */
export const InsightCard = ({
  type = 'Prediction',
  title,
  description,
  confidence = '90%',
  recommendation,
  impact,
  onApply,
  className = '',
}) => {
  return (
    <div className={cn(
      'p-5 rounded-xl border border-amber-500/20 bg-gradient-to-b from-amber-50/40 via-white to-white shadow-xs relative overflow-hidden',
      className
    )}>
      {/* Top Tag & Confidence */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
            {type}
          </span>
        </div>

        <Badge variant="amber" size="sm" icon={Brain}>
          {confidence} Confidence
        </Badge>
      </div>

      <h4 className="text-base font-semibold text-slate-900 tracking-tight">
        {title}
      </h4>

      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
        {description}
      </p>

      {/* Actionable Recommendation */}
      {recommendation && (
        <div className="mt-3.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Recommended Action
          </span>
          <p className="text-xs font-medium text-slate-800">
            {recommendation}
          </p>
        </div>
      )}

      {/* Impact & Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        {impact ? (
          <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {impact}
          </span>
        ) : <span />}

        {onApply && (
          <Button size="sm" variant="secondary" rightIcon={ArrowRight} onClick={onApply}>
            Execute Recommendation
          </Button>
        )}
      </div>
    </div>
  );
};
