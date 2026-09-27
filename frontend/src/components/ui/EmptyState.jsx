import React from 'react';
import { PackageOpen } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

/**
 * Empty state visual container
 */
export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No Data Found',
  description = 'There are no records matching the current parameters.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto', className)}>
      <div className="p-3.5 rounded-full bg-slate-100 text-slate-400 mb-3 border border-slate-200">
        <Icon className="w-8 h-8" />
      </div>

      <h4 className="text-base font-semibold text-slate-800 tracking-tight">
        {title}
      </h4>

      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
