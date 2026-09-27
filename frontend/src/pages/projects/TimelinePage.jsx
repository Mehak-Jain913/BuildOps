import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { projectTabs } from './ProjectsPage';

export const TimelinePage = () => {
  return (
    <PlaceholderPage
      title="Project Timeline & Schedule"
      subtitle="Interactive Gantt chart schedule, milestone target dates, and critical path analysis."
      tabs={projectTabs}
      phase="Phase 1"
    />
  );
};
