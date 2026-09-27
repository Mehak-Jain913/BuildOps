import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { FileText, AlertTriangle, Camera, ShieldCheck, HardHat } from 'lucide-react';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { Badge } from '../../components/ui/Badge';

export const siteTabs = [
  { title: 'Daily Site Logs', path: '/site/daily-reports', icon: FileText, end: true },
  { title: 'Issues & Hazards', path: '/site/issues', icon: AlertTriangle },
  { title: 'Progress Photos', path: '/site/photos', icon: Camera },
  { title: 'Safety Inspections', path: '/site/inspections', icon: ShieldCheck },
];

export const DailyReportsPage = () => {
  const metrics = [
    { title: 'Logs Submitted Today', value: '3 / 3', icon: FileText, badgeText: '100% Filed', badgeVariant: 'success' },
    { title: 'Open Site Hazards', value: '2', icon: AlertTriangle, change: '1 High Severity', changeType: 'negative' },
    { title: 'Site Photos Uploaded', value: '48 Photos', icon: Camera, subtitle: 'Geo-tagged & timestamped' },
    { title: 'Safety Audits', value: 'Passed', icon: ShieldCheck, badgeText: 'Zero Incidents', badgeVariant: 'success' },
  ];

  const mockLogs = [
    { id: 'LOG-901', site: 'Skyline Commercial Tower', supervisor: 'David Miller', weather: 'Sunny (28°C)', status: 'approved', entries: 14 },
    { id: 'LOG-902', site: 'Harbor City Overpass', supervisor: 'Robert Chen', weather: 'Light Rain (22°C)', status: 'in_progress', entries: 8 },
    { id: 'LOG-903', site: 'Greenfield Eco Hub', supervisor: 'Elena Rostova', weather: 'Clear (26°C)', status: 'approved', entries: 11 },
  ];

  const columns = [
    {
      title: 'Report Ref / Site',
      key: 'site',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 block">{val}</span>
          <span className="text-xs text-slate-400">{row.id} • Weather: {row.weather}</span>
        </div>
      ),
    },
    {
      title: 'Submitted By',
      key: 'supervisor',
      render: (val) => <span className="text-xs font-semibold text-slate-800">{val}</span>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (val) => <StatusIndicator status={val} />,
    },
    {
      title: 'Activity Entries',
      key: 'entries',
      align: 'center',
      render: (val) => <Badge variant="neutral" size="sm">{val} Logged Tasks</Badge>,
    },
  ];

  return (
    <PlaceholderPage
      title="Daily Site Operations & Field Logs"
      subtitle="Digital supervisor daily reports, weather condition logs, equipment usage, and safety observations."
      tabs={siteTabs}
      metrics={metrics}
      tableColumns={columns}
      tableData={mockLogs}
      phase="Phase 1"
    />
  );
};
