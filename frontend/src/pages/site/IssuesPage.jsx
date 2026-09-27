import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { siteTabs } from './DailyReportsPage';

export const IssuesPage = () => {
  return (
    <PlaceholderPage
      title="Site Issues, Snags & Safety Hazards"
      subtitle="Issue ticketing, priority triage, corrective action assignment, and resolution timelines."
      tabs={siteTabs}
      phase="Phase 1"
    />
  );
};
