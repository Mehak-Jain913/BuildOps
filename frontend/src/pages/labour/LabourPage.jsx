import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { MOCK_WORKERS } from '../../mock/mockData';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { Users, UserCheck, Clock, DollarSign, TrendingUp } from 'lucide-react';

export const labourTabs = [
  { title: 'Workforce Roster', path: '/labour', icon: Users, end: true },
  { title: 'Daily Attendance', path: '/labour/attendance', icon: UserCheck },
  { title: 'Shift Management', path: '/labour/shifts', icon: Clock },
  { title: 'Wage & Payroll', path: '/labour/wages', icon: DollarSign },
  { title: 'Productivity Metrics', path: '/labour/productivity', icon: TrendingUp },
];

export const LabourPage = () => {
  const metrics = [
    { title: 'Total Registered Workers', value: '320', icon: Users, subtitle: 'Across 14 trade subcontractors' },
    { title: 'Morning Attendance', value: '92.1%', icon: UserCheck, change: '+4.2%', changeType: 'positive' },
    { title: 'Active Shifts', value: '2 Shifts', icon: Clock, badgeText: 'Day & Night', badgeVariant: 'info' },
    { title: 'Est. Daily Payroll', value: '$52,400', icon: DollarSign, changeLabel: 'allocated budget' },
  ];

  const columns = [
    {
      title: 'Worker Name / ID',
      key: 'name',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 block">{val}</span>
          <span className="text-xs font-mono text-slate-400">{row.id} • {row.contact}</span>
        </div>
      ),
    },
    {
      title: 'Trade & Role',
      key: 'role',
      render: (val) => <span className="font-semibold text-slate-800 text-xs">{val}</span>,
    },
    {
      title: 'Skill Classification',
      key: 'skillLevel',
      render: (val) => <Badge variant={val === 'Expert' ? 'amber' : 'neutral'} size="sm">{val}</Badge>,
    },
    {
      title: 'Duty Status',
      key: 'status',
      render: (val) => <StatusIndicator status={val} customLabel="On Site" />,
    },
    {
      title: 'Daily Wage Rate',
      key: 'dailyRate',
      align: 'right',
      render: (val) => <span className="font-mono text-xs font-semibold">{formatCurrency(val)} / day</span>,
    },
  ];

  return (
    <PlaceholderPage
      title="Labour Force & Subcontractor Management"
      subtitle="Monitor site attendance, shift rosters, wage calculations, and trade productivity velocity."
      tabs={labourTabs}
      metrics={metrics}
      tableColumns={columns}
      tableData={MOCK_WORKERS}
      phase="Phase 3"
    />
  );
};
