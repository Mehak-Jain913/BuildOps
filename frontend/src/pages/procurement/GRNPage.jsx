import React, { useState } from 'react';
import { useProcurement } from '../../hooks/useProcurement';
import { MetricCard } from '../../components/ui/MetricCard';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { ProcurementStatusBadge } from '../../components/procurement/ProcurementStatusBadge';
import { GRNModal } from '../../components/procurement/GRNModal';
import { FileCheck2, Plus, Warehouse, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export const GRNPage = () => {
  const { grns } = useProcurement();

  const [isGRNModalOpen, setIsGRNModalOpen] = useState(false);
  const [grnToPost, setGrnToPost] = useState(null);

  const totalGRNs = grns.length;
  const underInspectionCount = grns.filter((g) => g.status === 'Under Inspection' || g.status === 'Draft').length;
  const acceptedCount = grns.filter((g) => g.qualityStatus === 'Accepted').length;
  const postedToStockCount = grns.filter((g) => g.status === 'Posted').length;

  const handlePostClick = (grn) => {
    setGrnToPost(grn);
  };

  const columns = [
    {
      title: 'GRN Number & Date',
      key: 'grnNumber',
      render: (val, row) => (
        <div>
          <span className="font-bold font-mono text-white text-xs block">{val}</span>
          <span className="text-[10px] text-slate-400 font-mono">{row.receivedDate} • By {row.receivedBy}</span>
        </div>
      ),
    },
    {
      title: 'PO & Delivery Ref',
      key: 'poNumber',
      render: (val, row) => (
        <div>
          <span className="font-bold text-amber-400 font-mono text-xs block">PO: {val}</span>
          <span className="text-[10px] text-slate-400 font-mono">Del: {row.deliveryId || 'DEL-301'}</span>
        </div>
      ),
    },
    {
      title: 'Supplier & Project',
      key: 'supplierName',
      render: (val, row) => (
        <div>
          <span className="font-bold text-white text-xs block">{val}</span>
          <span className="text-[11px] text-slate-300 font-medium">{row.projectName}</span>
        </div>
      ),
    },
    {
      title: 'Received vs Accepted Items',
      key: 'items',
      render: (val) => {
        const item = val && val[0];
        if (!item) return <span className="text-slate-500">—</span>;
        return (
          <div>
            <span className="font-bold text-white text-xs block">{item.materialName}</span>
            <span className="font-mono text-xs text-emerald-400 font-bold">
              Accepted: {item.acceptedQuantity} {item.unit}
            </span>
            {item.rejectedQuantity > 0 && (
              <span className="text-[10px] text-rose-400 font-mono block">
                Rejected: {item.rejectedQuantity} {item.unit}
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: 'Quality Status',
      key: 'qualityStatus',
      render: (val) => {
        let variant = 'emerald';
        if (val === 'Under Inspection') variant = 'amber';
        if (val === 'Partially Accepted') variant = 'purple';
        if (val === 'Rejected') variant = 'rose';
        return <Badge variant={variant} size="xs">{val}</Badge>;
      },
    },
    {
      title: 'Stock Status',
      key: 'status',
      render: (val) => <ProcurementStatusBadge status={val} type="grn" />,
    },
    {
      title: 'Actions',
      key: 'id',
      align: 'right',
      render: (val, row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.status !== 'Posted' ? (
            <Button
              variant="emerald"
              size="xs"
              onClick={() => handlePostClick(row)}
              className="gap-1 text-xs"
            >
              <Warehouse className="w-3.5 h-3.5" />
              <span>Post to Inventory</span>
            </Button>
          ) : (
            <span className="text-[11px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>In Stock</span>
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-amber-400" />
            Goods Received Notes (GRN) & Inventory Stock-IN
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Physical site material inspection, accepted vs rejected quantity audit, and automated inventory Stock IN.
          </p>
        </div>

        <Button variant="amber" onClick={() => setIsGRNModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Create GRN</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Total GRNs"
          value={totalGRNs}
          icon={FileCheck2}
          subtitle="Inspection Slips"
        />
        <MetricCard
          title="Under Inspection"
          value={underInspectionCount}
          icon={Clock}
          badgeText="Pending Quality"
          badgeVariant="warning"
        />
        <MetricCard
          title="Quality Approved"
          value={acceptedCount}
          icon={ShieldCheck}
          badgeText="Passed QC"
          badgeVariant="emerald"
        />
        <MetricCard
          title="Posted to Site Stock"
          value={postedToStockCount}
          icon={Warehouse}
          badgeText="Inventory Updated"
          badgeVariant="info"
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={grns}
        keyExtractor={(row) => row.id}
        emptyMessage="No Goods Received Notes found."
      />

      {/* Modals */}
      <GRNModal isOpen={isGRNModalOpen} onClose={() => setIsGRNModalOpen(false)} />
      {grnToPost && (
        <GRNModal
          isOpen={!!grnToPost}
          onClose={() => setGrnToPost(null)}
          grnToPost={grnToPost}
        />
      )}
    </div>
  );
};
