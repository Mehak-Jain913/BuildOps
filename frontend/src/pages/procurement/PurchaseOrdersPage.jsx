import React, { useState } from 'react';
import { useProcurement } from '../../hooks/useProcurement';
import { MetricCard } from '../../components/ui/MetricCard';
import { Button } from '../../components/ui/Button';
import { PurchaseOrderTable } from '../../components/procurement/PurchaseOrderTable';
import { CreatePurchaseOrderModal } from '../../components/procurement/CreatePurchaseOrderModal';
import { ReceiptText, Plus, CheckCircle2, Truck, DollarSign } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { ProcurementStatusBadge } from '../../components/procurement/ProcurementStatusBadge';

export const PurchaseOrdersPage = () => {
  const { purchaseOrders } = useProcurement();
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [selectedPODetail, setSelectedPODetail] = useState(null);

  const totalPOs = purchaseOrders.length;
  const activePOs = purchaseOrders.filter((po) => po.status === 'Sent to Supplier' || po.status === 'Approved' || po.status === 'Partially Delivered').length;
  const completedPOs = purchaseOrders.filter((po) => po.status === 'Delivered' || po.status === 'Closed').length;
  const totalPOValue = purchaseOrders.reduce((acc, po) => acc + po.totalAmount, 0);

  const formatINR = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ReceiptText className="w-6 h-6 text-amber-400" />
            Purchase Orders (PO)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Binding commercial contracts, 18% GST calculation, vendor order dispatch, and delivery tracking.
          </p>
        </div>

        <Button variant="amber" onClick={() => setIsPOModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Issue Purchase Order</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Total Orders Issued"
          value={totalPOs}
          icon={ReceiptText}
          subtitle="All PO Contracts"
        />
        <MetricCard
          title="Active Open POs"
          value={activePOs}
          icon={Truck}
          badgeText="In Dispatch"
          badgeVariant="info"
        />
        <MetricCard
          title="Fulfilled POs"
          value={completedPOs}
          icon={CheckCircle2}
          badgeText="Delivered"
          badgeVariant="emerald"
        />
        <MetricCard
          title="Total Commitment"
          value={formatINR(totalPOValue)}
          icon={DollarSign}
          subtitle="Contract Value"
        />
      </div>

      {/* PO Table */}
      <PurchaseOrderTable orders={purchaseOrders} onSelectOrder={(po) => setSelectedPODetail(po)} />

      {/* Create PO Modal */}
      <CreatePurchaseOrderModal isOpen={isPOModalOpen} onClose={() => setIsPOModalOpen(false)} />

      {/* PO Detail View Modal */}
      {selectedPODetail && (
        <Modal
          isOpen={!!selectedPODetail}
          onClose={() => setSelectedPODetail(null)}
          title={`Purchase Order Details: ${selectedPODetail.poNumber}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Vendor</span>
                <span className="text-white font-bold text-sm">{selectedPODetail.supplierName}</span>
              </div>
              <ProcurementStatusBadge status={selectedPODetail.status} type="po" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-slate-400 text-[10px] block">Project</span>
                <span className="text-white font-bold">{selectedPODetail.projectName}</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-slate-400 text-[10px] block">Order Date</span>
                <span className="text-white font-bold">{selectedPODetail.orderDate}</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-slate-400 text-[10px] block">Expected Delivery</span>
                <span className="text-amber-400 font-bold">{selectedPODetail.expectedDeliveryDate}</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-2">Line Items</h4>
              <div className="space-y-2 font-mono">
                {selectedPODetail.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded border border-slate-800">
                    <div>
                      <span className="text-white font-bold block">{item.materialName}</span>
                      <span className="text-slate-400 text-[10px]">{item.quantity} {item.unit} @ ₹{item.unitPrice}/unit</span>
                    </div>
                    <span className="text-amber-400 font-bold">₹{item.total.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span>₹{selectedPODetail.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST Tax (18%):</span>
                <span>+₹{selectedPODetail.tax?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-slate-800">
                <span>Grand Total:</span>
                <span className="text-amber-400">₹{selectedPODetail.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {selectedPODetail.notes && (
              <p className="text-slate-400 text-[11px] italic bg-slate-900/40 p-2 rounded border border-slate-800/60">
                Notes: {selectedPODetail.notes}
              </p>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setSelectedPODetail(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
