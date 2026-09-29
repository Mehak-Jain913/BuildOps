import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../forms/Input';
import { Select } from '../forms/Select';
import { Textarea } from '../forms/Textarea';
import { useProcurement } from '../../hooks/useProcurement';
import { useRole } from '../../hooks/useRole';
import { CheckCircle2, Warehouse, ShieldAlert } from 'lucide-react';

export const GRNModal = ({ isOpen, onClose, selectedDelivery = null, grnToPost = null }) => {
  const { deliveries, createGRN, postGRN } = useProcurement();
  const { isRole } = useRole();

  const [deliveryId, setDeliveryId] = useState(selectedDelivery?.id || deliveries[0]?.id || '');
  const [receivedQty, setReceivedQty] = useState(selectedDelivery?.deliveredQuantity?.toString() || '0');
  const [acceptedQty, setAcceptedQty] = useState(selectedDelivery?.deliveredQuantity?.toString() || '0');
  const [rejectedQty, setRejectedQty] = useState('0');
  const [qualityStatus, setQualityStatus] = useState('Accepted');
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [errors, setErrors] = useState({});

  const isPostingExisting = !!grnToPost;

  useEffect(() => {
    if (selectedDelivery) {
      setDeliveryId(selectedDelivery.id);
      setReceivedQty(selectedDelivery.deliveredQuantity?.toString() || selectedDelivery.orderedQuantity?.toString() || '0');
      setAcceptedQty(selectedDelivery.deliveredQuantity?.toString() || selectedDelivery.orderedQuantity?.toString() || '0');
      setRejectedQty('0');
    }
  }, [selectedDelivery]);

  useEffect(() => {
    if (deliveryId && !grnToPost) {
      const del = deliveries.find((d) => d.id === deliveryId);
      if (del) {
        const defaultQty = del.deliveredQuantity > 0 ? del.deliveredQuantity : del.orderedQuantity;
        setReceivedQty(defaultQty.toString());
        setAcceptedQty(defaultQty.toString());
        setRejectedQty('0');
      }
    }
  }, [deliveryId, deliveries, grnToPost]);

  const validate = () => {
    const errs = {};
    const rec = parseFloat(receivedQty) || 0;
    const acc = parseFloat(acceptedQty) || 0;
    const rej = parseFloat(rejectedQty) || 0;

    if (rec < 0) errs.receivedQty = 'Received quantity cannot be negative.';
    if (acc < 0) errs.acceptedQty = 'Accepted quantity cannot be negative.';
    if (rej < 0) errs.rejectedQty = 'Rejected quantity cannot be negative.';

    if (acc + rej > rec) {
      errs.quantityCheck = `Validation Error: Accepted (${acc}) + Rejected (${rej}) cannot exceed Received Quantity (${rec}).`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePostExisting = () => {
    if (!grnToPost) return;
    const res = postGRN(grnToPost.id);
    if (res.success) {
      onClose();
    } else if (res.error) {
      setErrors({ form: res.error });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isPostingExisting) {
      handlePostExisting();
      return;
    }

    const del = deliveries.find((d) => d.id === deliveryId) || deliveries[0];
    const rec = parseFloat(receivedQty) || 0;
    const acc = parseFloat(acceptedQty) || 0;
    const rej = parseFloat(rejectedQty) || 0;

    const grnRes = createGRN({
      poId: del.poId,
      poNumber: del.poNumber,
      deliveryId: del.id,
      supplierId: del.supplierId,
      supplierName: del.supplierName,
      projectId: del.projectId,
      projectName: del.projectName,
      qualityStatus,
      inspectionNotes,
      items: [
        {
          materialId: del.materialId,
          materialName: del.materialName,
          unit: del.unit,
          orderedQuantity: del.orderedQuantity,
          receivedQuantity: rec,
          acceptedQuantity: acc,
          rejectedQuantity: rej,
          remarks: inspectionNotes,
        },
      ],
    });

    if (grnRes.success && grnRes.grn) {
      // Auto post if status is Accepted
      postGRN(grnRes.grn.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isPostingExisting ? `Post GRN to Stock: ${grnToPost.grnNumber}` : 'Create Goods Received Note (GRN)'}
      maxWidth="xl"
    >
      {isPostingExisting ? (
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
            <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-amber-400" />
              Confirm Goods Stock-IN Action
            </h4>
            <p className="text-slate-300">
              Posting this Goods Received Note will automatically perform a <strong>Stock IN</strong> operation into the
              existing Site Material Inventory for <strong>{grnToPost.projectName}</strong>.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">GRN Number:</span>
              <span className="text-white font-bold">{grnToPost.grnNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Supplier:</span>
              <span className="text-white">{grnToPost.supplierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Material Items:</span>
              <span className="text-amber-400 font-bold">
                {grnToPost.items?.map((i) => `${i.acceptedQuantity} ${i.unit} ${i.materialName}`).join(', ')}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="emerald" type="button" onClick={handlePostExisting} className="gap-2">
              <Warehouse className="w-4 h-4" />
              <span>Post Stock IN Now</span>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errors.quantityCheck && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 font-medium">
              {errors.quantityCheck}
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Select Delivery *</label>
            <Select
              value={deliveryId}
              onChange={(e) => setDeliveryId(e.target.value)}
              options={deliveries.map((d) => ({
                value: d.id,
                label: `${d.deliveryNumber} (PO: ${d.poNumber}) — ${d.supplierName} [${d.materialName}]`,
              }))}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-b border-slate-800 py-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Received Qty *</label>
              <Input
                type="number"
                step="any"
                value={receivedQty}
                onChange={(e) => setReceivedQty(e.target.value)}
              />
              {errors.receivedQty && <span className="text-rose-400 text-[10px]">{errors.receivedQty}</span>}
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Accepted Qty *</label>
              <Input
                type="number"
                step="any"
                value={acceptedQty}
                onChange={(e) => setAcceptedQty(e.target.value)}
              />
              {errors.acceptedQty && <span className="text-rose-400 text-[10px]">{errors.acceptedQty}</span>}
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Rejected Qty *</label>
              <Input
                type="number"
                step="any"
                value={rejectedQty}
                onChange={(e) => setRejectedQty(e.target.value)}
              />
              {errors.rejectedQty && <span className="text-rose-400 text-[10px]">{errors.rejectedQty}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Quality Inspection Status</label>
              <Select
                value={qualityStatus}
                onChange={(e) => setQualityStatus(e.target.value)}
                options={[
                  { value: 'Accepted', label: 'Accepted (100% Quality Passed)' },
                  { value: 'Partially Accepted', label: 'Partially Accepted (Minor Defect)' },
                  { value: 'Under Inspection', label: 'Under Inspection' },
                  { value: 'Rejected', label: 'Rejected (Failed QC)' },
                ]}
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Inspection Notes / Batch #</label>
              <Input
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                placeholder="e.g. Moisture test passed, batch #C53-901"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="emerald" type="submit" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Create & Post GRN to Stock</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
