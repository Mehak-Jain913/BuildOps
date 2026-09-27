import React from 'react';
import { cn } from '../../utils/cn';
import { STATUS_CONFIG, STATUS_TYPES } from '../../constants/status';

/**
 * Visual status indicator with dot and text label
 */
export const StatusIndicator = ({
  status = STATUS_TYPES.PENDING,
  customLabel,
  showLabel = true,
  className = '',
  size = 'md',
}) => {
  const config = STATUS_CONFIG[status] || {
    label: customLabel || status,
    badgeVariant: 'neutral',
    dotColor: 'bg-slate-400',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm font-medium',
    lg: 'text-base font-medium',
  };

  return (
    <div className={cn('inline-flex items-center gap-2 text-slate-700', className)}>
      <span className={cn('rounded-full shrink-0', dotSizes[size], config.dotColor)} />
      {showLabel && (
        <span className={cn(textSizes[size], 'capitalize')}>
          {customLabel || config.label}
        </span>
      )}
    </div>
  );
};
