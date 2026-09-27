import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { intelligenceTabs } from './IntelligenceOverviewPage';

export const RiskRadarPage = () => {
  return (
    <PlaceholderPage
      title="Construction Risk Radar Matrix"
      subtitle="Multi-factor risk heatmaps covering weather delays, labour shortages, and price volatility."
      tabs={intelligenceTabs}
      phase="Phase 4"
    />
  );
};
