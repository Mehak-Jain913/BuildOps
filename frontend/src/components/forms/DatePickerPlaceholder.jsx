import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Reusable Date Picker component placeholder with consistent enterprise styling
 */
export const DatePickerPlaceholder = ({
  label,
  value,
  onChange,
  placeholder = 'Select date range...',
  className = '',
  required = false,
  error,
}) => {
  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1 select-none">
          {label}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <Calendar className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="date"
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            'w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 transition-colors shadow-xs',
            error && 'border-red-500 focus:ring-red-500/20'
          )}
        />
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
};
