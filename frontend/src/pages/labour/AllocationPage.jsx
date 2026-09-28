import React, { useState } from 'react';
import { LabourAllocationTable } from '../../components/labour/LabourAllocationTable';
import { AllocationModal } from '../../components/labour/AllocationModal';
import { useLabour } from '../../hooks/useLabour';

export const AllocationPage = () => {
  const { allocations } = useLabour();
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <LabourAllocationTable
        allocations={allocations}
        onAssignWorkforce={() => setIsAllocationModalOpen(true)}
        title="Workforce Allocation & Shift Deployment"
        subtitle="Manage trade allocations across projects, site blocks, floor levels, and active work tasks."
      />

      <AllocationModal
        isOpen={isAllocationModalOpen}
        onClose={() => setIsAllocationModalOpen(false)}
      />
    </div>
  );
};
