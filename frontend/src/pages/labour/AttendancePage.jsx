import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { labourTabs } from './LabourPage';

export const AttendancePage = () => {
  return (
    <PlaceholderPage
      title="Daily Labour Attendance & Gate Verification"
      subtitle="Biometric/RFID gate check-in records, trade turnout percentages, and absent worker logs."
      tabs={labourTabs}
      phase="Phase 3"
    />
  );
};
