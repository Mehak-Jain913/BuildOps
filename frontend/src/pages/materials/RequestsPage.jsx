import React, { useState } from 'react';
import { MaterialRequestTable } from '../../components/materials/MaterialRequestTable';
import { MaterialRequestModal } from '../../components/materials/MaterialRequestModal';
import { useMaterials } from '../../hooks/useMaterials';

export const RequestsPage = () => {
  const { requests, approveMaterialRequest, rejectMaterialRequest } = useMaterials();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <MaterialRequestTable
        requests={requests}
        onRequestNew={() => setIsRequestModalOpen(true)}
        onApprove={approveMaterialRequest}
        onReject={rejectMaterialRequest}
        title="Material Requisitions & Approval Queue"
        subtitle="Manage site material requests, priority escalations, and manager sign-off clearance."
      />

      <MaterialRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </div>
  );
};
