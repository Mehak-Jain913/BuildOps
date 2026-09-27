import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { materialTabs } from './MaterialsPage';

export const ConsumptionPage = () => {
  return (
    <PlaceholderPage
      title="Daily Material Consumption Tracking"
      subtitle="Actual material usage logs per site zone and trade crew vs estimated bill of quantities (BOQ)."
      tabs={materialTabs}
      phase="Phase 2"
    />
  );
};
