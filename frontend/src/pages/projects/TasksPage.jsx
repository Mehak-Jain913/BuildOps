import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { projectTabs } from './ProjectsPage';

export const TasksPage = () => {
  return (
    <PlaceholderPage
      title="Task Execution Matrix"
      subtitle="Detailed site activity assignments, trade deliverables, and completion status."
      tabs={projectTabs}
      phase="Phase 1"
    />
  );
};
