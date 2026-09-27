import React from 'react';
import { cn } from '../../utils/cn';
import { Card } from './Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from './Badge';

/**
 * Metric Card for Key Performance Indicators (KPIs), budgets, stock, labour numbers.
 */
export const MetricCard = ({
  title,
  value,
  unit,
  change,
  changeType = 'neutral', // 'positive' | 'negative' | 'neutral'
  changeLabel = 'vs last period',
  icon: Icon,
  badgeText,
  badgeVariant = 'default',
  subtitle,
  className = '',
}) => {
  const getTrendIcon = () => {
    if (changeType === 'positive') return <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />;
    if (changeType === 'negative') return <TrendingDown className="w-3.5 h-3.5 text-red-600" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  const getTrendColor = () => {
    if (changeType === 'positive') return 'text-emerald-700 bg-emerald-50 border-emerald-200/60';
    if (changeType === 'negative') return 'text-red-700 bg-red-50 border-red-200/60';
    return 'text-slate-600 bg-slate-100 border-slate-200';
  };

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-100/80 text-slate-700">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-slate-500 uppercase">
            {unit}
          </span>
        )}
      </div>

      {(change !== undefined || badgeText || subtitle) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {change !== undefined ? (
            <div className="flex items-center gap-1.5">
              <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[11px] font-semibold', getTrendColor())}>
                {getTrendIcon()}
                {change}
              </span>
              <span className="text-slate-500 text-[11px]">{changeLabel}</span>
            </div>
          ) : (
            <span className="text-slate-500 text-xs">{subtitle || ''}</span>
          )}

          {badgeText && (
            <Badge variant={badgeVariant} size="sm">
              {badgeText}
            </Badge>
          )}
        </div>
      )}
    </Card>
  );
};
