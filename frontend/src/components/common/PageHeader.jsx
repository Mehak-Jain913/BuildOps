import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { Badge } from '../ui/Badge';
import { useRole } from '../../hooks/useRole';
import { ROLE_LABELS } from '../../constants/roles';

/**
 * Standard Page Header layout component with title, subtitle, breadcrumbs, role badge, and header action buttons
 */
export const PageHeader = ({
  title,
  subtitle,
  action,
  badgeText,
  badgeVariant = 'amber',
  children,
  breadcrumbs,
}) => {
  const { role } = useRole();

  return (
    <div className="mb-6 sm:mb-8">
      <Breadcrumbs customItems={breadcrumbs} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 m-0">
              {title}
            </h1>
            {badgeText && (
              <Badge variant={badgeVariant} size="md">
                {badgeText}
              </Badge>
            )}
            <Badge variant="outline" size="sm" className="text-slate-500 border-slate-200">
              Role: {ROLE_LABELS[role]}
            </Badge>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>

        {action && <div className="shrink-0 flex items-center gap-2.5">{action}</div>}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};
