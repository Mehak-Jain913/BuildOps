import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { labourTabs } from './LabourPage';

export const ShiftsPage = () => {
  return (
    <PlaceholderPage
      title="Shift Rosters & Overtime Scheduling"
      subtitle="Day/Night shift assignments, overtime authorizations, and safety rest cycle enforcement."
      tabs={labourTabs}
      phase="Phase 3"
    />
  );
};
