import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Enterprise Form Input with label, helper text, error state, and icon support
 */
export const Input = React.forwardRef(({
  label,
  id,
  type = 'text',
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  required = false,
  isDisabled = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-700 flex items-center gap-1 select-none"
        >
          {label}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={isDisabled}
          className={cn(
            'w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed shadow-xs',
            LeftIcon && 'pl-9',
            RightIcon && 'pr-9',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900'
              : 'border-slate-300 focus:border-slate-800 focus:ring-slate-800/10',
            className
          )}
          {...props}
        />

        {RightIcon && (
          <div className="absolute right-3 text-slate-400">
            <RightIcon className="w-4 h-4" />
          </div>
        )}
      </div>

      {error ? (
        <span className="text-xs text-red-600 font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-slate-500">{helperText}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
