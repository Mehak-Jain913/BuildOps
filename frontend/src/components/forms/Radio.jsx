import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Enterprise Radio Input Component
 */
export const Radio = React.forwardRef(({
  label,
  description,
  id,
  name,
  value,
  checked,
  onChange,
  isDisabled = false,
  className = '',
  ...props
}, ref) => {
  const radioId = id || `radio-${name}-${value}`;

  return (
    <label
      htmlFor={radioId}
      className={cn(
        'flex items-start gap-3 select-none cursor-pointer group',
        isDisabled && 'cursor-not-allowed opacity-60',
        className
      )}
    >
      <div className="relative flex items-center mt-0.5">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={isDisabled}
          className="sr-only peer"
          {...props}
        />
        <div className="w-4 h-4 rounded-full border border-slate-300 bg-white peer-checked:border-slate-900 peer-focus:ring-2 peer-focus:ring-slate-800/20 transition-all flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-slate-900 group-hover:text-slate-800">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-500">{description}</span>
          )}
        </div>
      )}
    </label>
  );
});

Radio.displayName = 'Radio';
