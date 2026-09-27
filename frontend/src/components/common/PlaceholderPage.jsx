import React from 'react';
import { PageHeader } from './PageHeader';
import { SubNavTabs } from './SubNavTabs';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MetricCard } from '../ui/MetricCard';
import { Table } from '../ui/Table';
import { StatusIndicator } from '../ui/StatusIndicator';
import { HardHat, Sparkles, Layers, Info, CheckCircle2 } from 'lucide-react';
import { STATUS_TYPES } from '../../constants/status';

/**
 * Reusable Phase 0 Placeholder Page Renderer displaying design token components
 */
export const PlaceholderPage = ({
  title,
  subtitle,
  tabs,
  phase = 'Phase 1',
  metrics = [],
  tableColumns,
  tableData = [],
  action,
}) => {
  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={action}
        badgeText={`Phase 0 Architecture Ready`}
        badgeVariant="amber"
      />

      {tabs && <SubNavTabs tabs={tabs} />}

      {/* Metrics Row if provided */}
      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((m, idx) => (
            <MetricCard key={idx} {...m} />
          ))}
        </div>
      )}

      {/* Main Content Area: Design System Demonstration Table or Specs Card */}
      <div className="space-y-6">
        {tableColumns && tableData.length > 0 ? (
          <Card
            header={`${title} Overview Matrix`}
            subtitle="Standardized Phase 0 data grid component demonstration"
          >
            <Table columns={tableColumns} data={tableData} striped />
          </Card>
        ) : null}

        {/* Phase 0 Status Banner */}
        <Card className="border-amber-500/30 bg-amber-50/30">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20 shrink-0">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">
                  {title} Module Foundation Established
                </h4>
                <Badge variant="amber" size="sm">
                  Coming in {phase}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                The frontend routing structure, role permissions, layout boundaries, and design tokens for {title} are fully configured. Business logic and backend API endpoints will be wired up during {phase}.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
