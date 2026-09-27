import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { siteTabs } from './DailyReportsPage';

export const InspectionsPage = () => {
  return (
    <PlaceholderPage
      title="Quality & Safety Inspection Checklist"
      subtitle="Structural compliance audits, PPE adherence, and QA/QC punch lists."
      tabs={siteTabs}
      phase="Phase 1"
    />
  );
};
