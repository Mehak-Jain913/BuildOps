import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

/**
 * Visual Error Alert Container
 */
export const ErrorState = ({
  title = 'Failed to load site resource data',
  description = 'An error occurred while fetching system data. Please verify network connectivity.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={cn('p-6 rounded-xl border border-red-200 bg-red-50/60 text-center max-w-md mx-auto', className)}>
      <div className="inline-flex p-3 rounded-full bg-red-100 text-red-600 mb-3 border border-red-200">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <h4 className="text-sm font-semibold text-red-950">
        {title}
      </h4>

      <p className="text-xs text-red-700 mt-1.5 leading-relaxed">
        {description}
      </p>

      {onRetry && (
        <div className="mt-4">
          <Button variant="danger" size="sm" leftIcon={RefreshCw} onClick={onRetry}>
            Retry Request
          </Button>
        </div>
      )}
    </div>
  );
};
