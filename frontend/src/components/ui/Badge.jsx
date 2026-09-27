import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable Badge component for status, tags, and metrics
 */
export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
}) => {
  const baseStyles = 'inline-flex items-center gap-1 font-medium rounded-md tracking-wide uppercase';

  const variants = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-slate-900 text-slate-100 border border-slate-900',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    danger: 'bg-red-50 text-red-700 border border-red-200/80',
    info: 'bg-blue-50 text-blue-700 border border-blue-200/80',
    neutral: 'bg-slate-50 text-slate-600 border border-slate-200',
    outline: 'bg-transparent text-slate-600 border border-slate-300',
    amber: 'bg-amber-500/10 text-amber-600 border border-amber-500/20 font-semibold',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 leading-tight',
    md: 'text-xs px-2 py-0.5 leading-snug',
    lg: 'text-xs px-2.5 py-1 leading-normal font-semibold',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
};
