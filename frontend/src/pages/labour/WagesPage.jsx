import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { labourTabs } from './LabourPage';

export const WagesPage = () => {
  return (
    <PlaceholderPage
      title="Wage Computation & Payroll Ledger"
      subtitle="Subcontractor billing, daily wage calculations, overtime multipliers, and payout receipts."
      tabs={labourTabs}
      phase="Phase 3"
    />
  );
};
