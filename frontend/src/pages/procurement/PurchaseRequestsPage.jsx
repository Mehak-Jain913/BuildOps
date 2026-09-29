import React, { useState } from 'react';
import { useProcurement } from '../../hooks/useProcurement';
import { MetricCard } from '../../components/ui/MetricCard';
import { Button } from '../../components/ui/Button';
import { PurchaseRequestTable } from '../../components/procurement/PurchaseRequestTable';
import { CreatePurchaseRequestModal } from '../../components/procurement/CreatePurchaseRequestModal';
import { CreatePurchaseOrderModal } from '../../components/procurement/CreatePurchaseOrderModal';
import { FileText, Plus, Clock, CheckCircle2, PackageCheck, AlertCircle } from 'lucide-react';

export const PurchaseRequestsPage = () => {
  const { purchaseRequests } = useProcurement();

  const [isPRModalOpen, setIsPRModalOpen] = useState(false);
  const [selectedPRForPO, setSelectedPRForPO] = useState(null);

  const totalPRs = purchaseRequests.length;
  const pendingApprovals = purchaseRequests.filter((pr) => pr.status === 'Pending Approval').length;
  const approvedPRs = purchaseRequests.filter((pr) => pr.status === 'Approved').length;
  const convertedPRs = purchaseRequests.filter((pr) => pr.status === 'Converted to PO').length;

  const handleConvertPRToPO = (pr) => {
    setSelectedPRForPO(pr);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            Material Purchase Requisitions (PR)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Internal site material requests, approval workflows, priority levels, and PO conversions.
          </p>
        </div>

        <Button variant="amber" onClick={() => setIsPRModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Create Purchase Request</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Total Requisitions"
          value={totalPRs}
          icon={FileText}
          subtitle="All Time Requests"
        />
        <MetricCard
          title="Pending Approvals"
          value={pendingApprovals}
          icon={Clock}
          badgeText="Requires Action"
          badgeVariant={pendingApprovals > 0 ? "warning" : "slate"}
        />
        <MetricCard
          title="Approved Requests"
          value={approvedPRs}
          icon={CheckCircle2}
          badgeText="Ready for PO"
          badgeVariant="emerald"
        />
        <MetricCard
          title="Converted to PO"
          value={convertedPRs}
          icon={PackageCheck}
          badgeText="Issued"
          badgeVariant="info"
        />
      </div>

      {/* Table Component */}
      <PurchaseRequestTable requests={purchaseRequests} onCreatePO={handleConvertPRToPO} />

      {/* Modals */}
      <CreatePurchaseRequestModal isOpen={isPRModalOpen} onClose={() => setIsPRModalOpen(false)} />
      {selectedPRForPO && (
        <CreatePurchaseOrderModal
          isOpen={!!selectedPRForPO}
          onClose={() => setSelectedPRForPO(null)}
          selectedPR={selectedPRForPO}
        />
      )}
    </div>
  );
};
