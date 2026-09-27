import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { materialTabs } from './MaterialsPage';

export const RequestsPage = () => {
  return (
    <PlaceholderPage
      title="Material Requisitions & Reorder Requests"
      subtitle="Site supervisor material requests, approval workflows, and store keeper dispatches."
      tabs={materialTabs}
      phase="Phase 2"
    />
  );
};
