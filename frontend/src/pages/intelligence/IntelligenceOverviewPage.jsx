import React from 'react';
import { IntelligencePage } from './IntelligencePage';

export const intelligenceTabs = [
  { title: 'Intelligence Overview', path: '/intelligence' },
  { title: 'Risk Radar', path: '/intelligence/risk-radar' },
  { title: 'Tomorrow Readiness', path: '/intelligence/readiness' },
  { title: 'Actionable Insights', path: '/intelligence/insights' },
];

export const IntelligenceOverviewPage = () => {
  return <IntelligencePage />;
};
