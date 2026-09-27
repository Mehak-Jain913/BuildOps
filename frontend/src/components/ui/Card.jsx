import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Standard enterprise card component with header, content, and footer options
 */
export const Card = ({
  children,
  className = '',
  header,
  subtitle,
  action,
  footer,
  padding = 'normal',
  bordered = true,
  noShadow = false,
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    tight: 'p-3 sm:p-4',
    normal: 'p-5 sm:p-6',
    spacious: 'p-6 sm:p-8',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl transition-all duration-200',
        bordered && 'border border-slate-200/90',
        !noShadow && 'shadow-xs hover:shadow-sm',
        className
      )}
      {...props}
    >
      {(header || subtitle || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 gap-4">
          <div>
            {header && (
              <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                {header}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className={paddings[padding]}>{children}</div>

      {footer && (
        <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 rounded-b-xl flex items-center justify-between text-xs text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
};
