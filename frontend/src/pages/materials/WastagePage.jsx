import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { materialTabs } from './MaterialsPage';

export const WastagePage = () => {
  return (
    <PlaceholderPage
      title="Material Wastage & Scrap Analytics"
      subtitle="Variance analysis, material breakage logs, and sustainability waste reduction targets."
      tabs={materialTabs}
      phase="Phase 2"
    />
  );
};
