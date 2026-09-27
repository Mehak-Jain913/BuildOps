import React from 'react';
import { cn } from '../../utils/cn';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, X } from 'lucide-react';
import { Button } from './Button';

/**
 * Alert Card for construction site issues, hazards, and critical alerts
 */
export const AlertCard = ({
  title,
  description,
  severity = 'medium', // 'low' | 'medium' | 'high' | 'critical'
  timestamp,
  location,
  onDismiss,
  onAction,
  actionLabel = 'Investigate',
  className = '',
}) => {
  const severities = {
    low: {
      border: 'border-blue-200 bg-blue-50/50',
      icon: Info,
      iconColor: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-800',
    },
    medium: {
      border: 'border-amber-200 bg-amber-50/50',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      badge: 'bg-amber-100 text-amber-800',
    },
    high: {
      border: 'border-orange-200 bg-orange-50/50',
      icon: AlertCircle,
      iconColor: 'text-orange-600',
      badge: 'bg-orange-100 text-orange-800',
    },
    critical: {
      border: 'border-red-300 bg-red-50/80',
      icon: AlertCircle,
      iconColor: 'text-red-600',
      badge: 'bg-red-600 text-white animate-pulse',
    },
  };

  const config = severities[severity] || severities.medium;
  const Icon = config.icon;

  return (
    <div className={cn('p-4 rounded-xl border transition-all relative', config.border, className)}>
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg bg-white shadow-xs shrink-0', config.iconColor)}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider', config.badge)}>
              {severity} SEVERITY
            </span>
            {location && (
              <span className="text-xs text-slate-500 font-medium">
                • {location}
              </span>
            )}
            {timestamp && (
              <span className="text-xs text-slate-400 ml-auto">
                {timestamp}
              </span>
            )}
          </div>

          <h4 className="text-sm font-semibold text-slate-900 mt-1.5">
            {title}
          </h4>

          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {description}
          </p>

          {(onAction || onDismiss) && (
            <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-200/60">
              {onAction && (
                <Button size="sm" variant={severity === 'critical' ? 'danger' : 'outline'} onClick={onAction}>
                  {actionLabel}
                </Button>
              )}
              {onDismiss && (
                <Button size="sm" variant="ghost" onClick={onDismiss}>
                  Dismiss
                </Button>
              )}
            </div>
          )}
        </div>

        {onDismiss && !onAction && (
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
