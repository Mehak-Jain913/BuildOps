import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { materialTabs } from './MaterialsPage';

export const PurchaseOrdersPage = () => {
  return (
    <PlaceholderPage
      title="Purchase Orders (PO) Management"
      subtitle="Issued purchase orders to material suppliers, payment terms, and delivery tracking."
      tabs={materialTabs}
      phase="Phase 2"
    />
  );
};
