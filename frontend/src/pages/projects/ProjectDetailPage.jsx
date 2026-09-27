import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { projectTabs } from './ProjectsPage';
import { Briefcase, FolderKanban } from 'lucide-react';

export const ProjectDetailPage = () => {
  return (
    <PlaceholderPage
      title="Project Details - Skyline Commercial Tower (PRJ-001)"
      subtitle="Comprehensive breakdown of scope, site specs, contractors, and financial allocation."
      tabs={projectTabs}
      phase="Phase 1"
    />
  );
};
