import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { siteTabs } from './DailyReportsPage';

export const PhotosPage = () => {
  return (
    <PlaceholderPage
      title="Site Progress Photo Gallery"
      subtitle="Visual evidence gallery, GPS timestamped progress snapshots, and drone aerial captures."
      tabs={siteTabs}
      phase="Phase 1"
    />
  );
};
