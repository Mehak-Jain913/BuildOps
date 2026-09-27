import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Enterprise Textarea Component
 */
export const Textarea = React.forwardRef(({
  label,
  id,
  rows = 3,
  maxLength,
  value,
  error,
  helperText,
  required = false,
  isDisabled = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const areaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={areaId}
            className="text-xs font-semibold text-slate-700 flex items-center gap-1 select-none"
          >
            {label}
            {required && <span className="text-red-500 font-bold">*</span>}
          </label>
          {maxLength && value !== undefined && (
            <span className="text-[11px] text-slate-400">
              {String(value).length}/{maxLength}
            </span>
          )}
        </div>
      )}

      <textarea
        ref={ref}
        id={areaId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        disabled={isDisabled}
        className={cn(
          'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed shadow-xs resize-y',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-300 focus:border-slate-800 focus:ring-slate-800/10',
          className
        )}
        {...props}
      />

      {error ? (
        <span className="text-xs text-red-600 font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-slate-500">{helperText}</span>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';
