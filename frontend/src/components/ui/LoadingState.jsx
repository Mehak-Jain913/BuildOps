import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Loading state skeleton and spinner loaders
 */
export const LoadingState = ({
  variant = 'spinner', // 'spinner' | 'card' | 'table'
  text = 'Loading operational data...',
  rows = 4,
  columns = 4,
  className = '',
}) => {
  if (variant === 'spinner') {
    return (
      <div className={cn('flex flex-col items-center justify-center p-8 text-center gap-2', className)}>
        <Loader2 className="w-7 h-7 text-amber-500 animate-spin" />
        <span className="text-xs font-medium text-slate-500 tracking-wide">{text}</span>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="w-full rounded-xl border border-slate-200 bg-white p-4 animate-pulse">
        <div className="h-8 bg-slate-100 rounded mb-3 w-full" />
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex gap-4 my-2.5">
            {Array.from({ length: columns }).map((_, cIdx) => (
              <div key={cIdx} className="h-6 bg-slate-100/80 rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="p-5 rounded-xl border border-slate-200 bg-white animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
        <div className="h-8 bg-slate-200 rounded w-1/2 mb-3" />
        <div className="h-3 bg-slate-100 rounded w-3/4" />
      </div>
    );
  }

  return null;
};
