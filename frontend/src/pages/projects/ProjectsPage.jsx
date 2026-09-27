import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { MOCK_PROJECTS } from '../../mock/mockData';
import { STATUS_TYPES } from '../../constants/status';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { FolderKanban, Briefcase, ClipboardList, Calendar, TrendingUp } from 'lucide-react';

export const projectTabs = [
  { title: 'All Projects', path: '/projects', icon: FolderKanban, end: true },
  { title: 'Project Details', path: '/projects/PRJ-001', icon: Briefcase },
  { title: 'Tasks Matrix', path: '/projects/tasks', icon: ClipboardList },
  { title: 'Timeline & Schedule', path: '/projects/timeline', icon: Calendar },
  { title: 'Overall Progress', path: '/projects/progress', icon: TrendingUp },
];

export const ProjectsPage = () => {
  const metrics = [
    { title: 'Total Projects', value: '8', icon: FolderKanban, subtitle: '3 Active, 5 Planned' },
    { title: 'Active Budget', value: '$15.8M', icon: TrendingUp, change: '+5.4%', changeType: 'positive' },
    { title: 'Site Workforce', value: '295', icon: Briefcase, badgeText: 'On Site', badgeVariant: 'success' },
    { title: 'Avg Progress', value: '41.6%', icon: Calendar, changeLabel: 'schedule track' },
  ];

  const columns = [
    {
      title: 'Project Name',
      key: 'name',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 block">{val}</span>
          <span className="text-xs text-slate-400">{row.id} • Client: {row.client}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (val) => <StatusIndicator status={val} />,
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (val) => (
        <div className="w-36">
          <ProgressBar value={val} showPercentage variant={val > 50 ? 'emerald' : 'amber'} size="sm" />
        </div>
      ),
    },
    {
      title: 'Total Budget',
      key: 'budget',
      align: 'right',
      render: (val) => <span className="font-mono text-xs font-semibold">{formatCurrency(val)}</span>,
    },
    {
      title: 'Supervisor',
      key: 'supervisor',
      render: (val) => <span className="text-xs font-medium text-slate-700">{val}</span>,
    },
  ];

  return (
    <PlaceholderPage
      title="Project Portfolio Management"
      subtitle="Track active construction sites, milestone progress, budgets, and operational task matrices."
      tabs={projectTabs}
      metrics={metrics}
      tableColumns={columns}
      tableData={MOCK_PROJECTS}
      phase="Phase 1"
    />
  );
};
