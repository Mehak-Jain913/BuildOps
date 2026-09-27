import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable Progress Bar for projects, budgets, and stock levels
 */
export const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  variant = 'amber', // 'amber' | 'emerald' | 'blue' | 'red' | 'slate'
  size = 'md',
  animated = false,
  className = '',
}) => {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const variants = {
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-600',
    blue: 'bg-blue-600',
    red: 'bg-red-600',
    slate: 'bg-slate-800',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-mono">{percent}%</span>}
        </div>
      )}

      <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60', sizes[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            variants[variant],
            animated && 'animate-pulse'
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
