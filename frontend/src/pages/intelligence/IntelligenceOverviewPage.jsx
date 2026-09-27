import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { Sparkles, Brain, ShieldAlert, TrendingUp, Bot } from 'lucide-react';
import { MOCK_INTELLIGENCE } from '../../mock/mockData';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const intelligenceTabs = [
  { title: 'Intelligence Overview', path: '/intelligence', icon: Sparkles, end: true },
  { title: 'Material Prediction', path: '/intelligence/predictions', icon: Brain },
  { title: 'Risk Radar', path: '/intelligence/risk', icon: ShieldAlert },
  { title: 'Actionable Advice', path: '/intelligence/recommendations', icon: TrendingUp },
  { title: 'AI Site Assistant', path: '/intelligence/assistant', icon: Bot },
];

export const IntelligenceOverviewPage = () => {
  const metrics = [
    { title: 'ML Confidence Score', value: '94.2%', icon: Brain, subtitle: 'Trained on site telemetry' },
    { title: 'Active Risk Flags', value: '2 Alerts', icon: ShieldAlert, badgeText: 'High Priority', badgeVariant: 'danger' },
    { title: 'Idle Cost Saved', value: '$24,800', icon: TrendingUp, change: '+18.5%', changeType: 'positive' },
    { title: 'AI Recommendations', value: '4 Prescriptions', icon: Bot, badgeText: 'Ready to Execute', badgeVariant: 'amber' },
  ];

  const columns = [
    {
      title: 'Insight Title / Category',
      key: 'title',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 block">{val}</span>
          <span className="text-xs text-slate-400">{row.type} • Impact: {row.impact}</span>
        </div>
      ),
    },
    {
      title: 'Confidence',
      key: 'confidence',
      render: (val) => <Badge variant="amber" size="sm" icon={Brain}>{val}</Badge>,
    },
    {
      title: 'Recommended Action',
      key: 'recommendation',
      render: (val) => <span className="text-xs font-medium text-slate-700">{val}</span>,
    },
  ];

  return (
    <PlaceholderPage
      title="AI Construction Intelligence & Risk Engine"
      subtitle="Predictive material consumption forecasting, schedule risk radar, automated recommendations, and AI assistant."
      tabs={intelligenceTabs}
      metrics={metrics}
      tableColumns={columns}
      tableData={MOCK_INTELLIGENCE}
      phase="Phase 4"
    />
  );
};
