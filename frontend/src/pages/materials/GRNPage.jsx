import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { materialTabs } from './MaterialsPage';

export const GRNPage = () => {
  return (
    <PlaceholderPage
      title="Goods Received Notes (GRN)"
      subtitle="Digital waybill verification, gate pass entry, and physical stock inspection logs."
      tabs={materialTabs}
      phase="Phase 2"
    />
  );
};
