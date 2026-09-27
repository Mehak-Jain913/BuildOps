import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { intelligenceTabs } from './IntelligenceOverviewPage';

export const PredictionsPage = () => {
  return (
    <PlaceholderPage
      title="Predictive Material Depletion Engine"
      subtitle="Machine learning forecasting models for cement, rebar, and aggregate stockout prevention."
      tabs={intelligenceTabs}
      phase="Phase 4"
    />
  );
};
