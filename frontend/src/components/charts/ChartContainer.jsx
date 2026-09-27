import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { RefreshCw, Download } from 'lucide-react';

/**
 * Reusable wrapper component for construction metrics & analytics charts
 */
export const ChartContainer = ({
  title,
  subtitle,
  children,
  action,
  legend,
  onRefresh,
  height = 'h-64',
  className = '',
}) => {
  return (
    <Card
      header={title}
      subtitle={subtitle}
      action={
        <div className="flex items-center gap-2">
          {action}
          {onRefresh && (
            <Button size="sm" variant="ghost" iconOnly onClick={onRefresh} title="Refresh chart data">
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            </Button>
          )}
        </div>
      }
      className={className}
    >
      <div className={`w-full ${height} flex flex-col justify-between pt-2`}>
        {children}
      </div>

      {legend && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-6 flex-wrap text-xs text-slate-600">
          {legend}
        </div>
      )}
    </Card>
  );
};
