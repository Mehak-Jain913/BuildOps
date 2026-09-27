import React from 'react';
import { cn } from '../../utils/cn';
import { Check } from 'lucide-react';

/**
 * Enterprise Checkbox Control
 */
export const Checkbox = React.forwardRef(({
  label,
  description,
  id,
  checked,
  onChange,
  isDisabled = false,
  className = '',
  ...props
}, ref) => {
  const checkId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label
      htmlFor={checkId}
      className={cn(
        'flex items-start gap-3 select-none cursor-pointer group',
        isDisabled && 'cursor-not-allowed opacity-60',
        className
      )}
    >
      <div className="relative flex items-center mt-0.5">
        <input
          ref={ref}
          type="checkbox"
          id={checkId}
          checked={checked}
          onChange={onChange}
          disabled={isDisabled}
          className="sr-only peer"
          {...props}
        />
        <div className="w-4 h-4 rounded border border-slate-300 bg-white peer-checked:bg-slate-900 peer-checked:border-slate-900 peer-focus:ring-2 peer-focus:ring-slate-800/20 transition-all flex items-center justify-center">
          <Check className="w-3 h-3 text-white stroke-[3] opacity-0 peer-checked:opacity-100 transition-opacity" />
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

Checkbox.displayName = 'Checkbox';
