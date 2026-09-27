import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { projectTabs } from './ProjectsPage';

export const ProgressPage = () => {
  return (
    <PlaceholderPage
      title="Overall Physical Progress Tracking"
      subtitle="S-Curve completion metrics vs baseline schedule for site operations."
      tabs={projectTabs}
      phase="Phase 1"
    />
  );
};
