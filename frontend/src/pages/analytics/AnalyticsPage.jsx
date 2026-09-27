import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { BarChart3, TrendingUp, DollarSign, Award } from 'lucide-react';

export const AnalyticsPage = () => {
  const metrics = [
    { title: 'Project ROI Variance', value: '+14.2%', icon: TrendingUp, change: 'above benchmark' },
    { title: 'Cost Performance Index', value: '1.08', icon: DollarSign, badgeText: 'On Budget', badgeVariant: 'success' },
    { title: 'Schedule Performance (SPI)', value: '0.96', icon: BarChart3, change: '-4%', changeType: 'negative' },
    { title: 'Safety Score (EMR)', value: '98.5', icon: Award, badgeText: 'Excellence', badgeVariant: 'amber' },
  ];

  return (
    <PlaceholderPage
      title="Enterprise Analytics & Reporting Hub"
      subtitle="Executive cross-project reporting, cost variance analysis, earned value management (EVM), and KPI dashboards."
      metrics={metrics}
      phase="Phase 3"
    />
  );
};
