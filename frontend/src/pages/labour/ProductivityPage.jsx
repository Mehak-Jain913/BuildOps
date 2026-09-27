import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { labourTabs } from './LabourPage';

export const ProductivityPage = () => {
  return (
    <PlaceholderPage
      title="Trade Productivity & Output Analytics"
      subtitle="Man-hour efficiency benchmarks, unit output per trade crew, and gang performance metrics."
      tabs={labourTabs}
      phase="Phase 3"
    />
  );
};
