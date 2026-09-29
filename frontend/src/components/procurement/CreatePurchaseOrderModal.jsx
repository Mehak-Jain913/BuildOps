import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../forms/Input';
import { Select } from '../forms/Select';
import { Textarea } from '../forms/Textarea';
import { useProjects } from '../../hooks/useProjects';
import { useMaterials } from '../../hooks/useMaterials';
import { useProcurement } from '../../hooks/useProcurement';

export const CreatePurchaseOrderModal = ({ isOpen, onClose, selectedPR = null }) => {
  const { projects } = useProjects();
  const { materials } = useMaterials();
  const { suppliers, purchaseRequests, createPurchaseOrder } = useProcurement();

  const approvedPRs = purchaseRequests.filter((pr) => pr.status === 'Approved');

  const [prId, setPRId] = useState(selectedPR?.id || '');
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [projectId, setProjectId] = useState(selectedPR?.projectId || projects[0]?.id || 'PRJ-001');
  const [materialId, setMaterialId] = useState(selectedPR?.materialId || materials[0]?.id || '');
  const [quantity, setQuantity] = useState(selectedPR?.requestedQuantity?.toString() || '');
  const [unit, setUnit] = useState(selectedPR?.unit || 'Bags');
  const [unitPrice, setUnitPrice] = useState('');
  const [taxRate, setTaxRate] = useState('18');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('Sunrise Heights Site Office, Block A Storage Yard');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  // When PR selection changes, populate fields
  useEffect(() => {
    if (selectedPR) {
      setPRId(selectedPR.id);
      setProjectId(selectedPR.projectId || 'PRJ-001');
      setMaterialId(selectedPR.materialId || '');
      setQuantity(selectedPR.requestedQuantity?.toString() || '');
      setUnit(selectedPR.unit || 'Bags');
    }
  }, [selectedPR]);

  useEffect(() => {
    if (prId) {
      const pr = purchaseRequests.find((p) => p.id === prId || p.prNumber === prId);
      if (pr) {
        setProjectId(pr.projectId || 'PRJ-001');
        setMaterialId(pr.materialId);
        setQuantity(pr.requestedQuantity.toString());
        setUnit(pr.unit);
      }
    }
  }, [prId, purchaseRequests]);

  // When material selection changes, default unit & unit price
  useEffect(() => {
    if (materialId) {
      const mat = materials.find((m) => m.id === materialId);
      if (mat) {
        setUnit(mat.unit || 'pcs');
        if (mat.unitPrice) setUnitPrice(mat.unitPrice.toString());
      }
    }
  }, [materialId, materials]);

  // Financial calculations
  const qtyNum = parseFloat(quantity) || 0;
  const priceNum = parseFloat(unitPrice) || 0;
  const taxPct = parseFloat(taxRate) || 0;

  const subtotal = qtyNum * priceNum;
  const taxAmount = (subtotal * taxPct) / 100;
  const grandTotal = subtotal + taxAmount;

  const formatINR = (val) => {
    return `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!supplierId) errs.supplierId = 'Supplier is required.';
    if (!materialId) errs.materialId = 'Material item is required.';
    if (qtyNum <= 0) errs.quantity = 'Quantity must be > 0.';
    if (priceNum <= 0) errs.unitPrice = 'Unit Price must be > 0.';
    if (!expectedDeliveryDate) errs.expectedDeliveryDate = 'Expected Delivery Date is required.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const selectedMat = materials.find((m) => m.id === materialId);
    const selectedProj = projects.find((p) => p.id === projectId);

    const result = createPurchaseOrder({
      purchaseRequestId: prId,
      supplierId,
      projectId,
      projectName: selectedProj?.name || 'Sunrise Heights',
      expectedDeliveryDate,
      deliveryAddress,
      notes,
      items: [
        {
          materialId,
          materialName: selectedMat?.name || 'Material',
          quantity: qtyNum,
          unit,
          unitPrice: priceNum,
          taxRate: taxPct,
          total: grandTotal,
        },
      ],
    });

    if (result.success) {
      onClose();
      setQuantity('');
      setUnitPrice('');
      setNotes('');
      setErrors({});
    } else if (result.error) {
      setErrors({ form: result.error });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Issue Purchase Order (PO)" maxWidth="2xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errors.form && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300">
            {errors.form}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Link Purchase Request (PR)
            </label>
            <Select
              value={prId}
              onChange={(e) => setPRId(e.target.value)}
              options={[
                { value: '', label: 'Direct PO (No Linked PR)' },
                ...approvedPRs.map((pr) => ({
                  value: pr.id,
                  label: `${pr.prNumber} — ${pr.materialName} (${pr.requestedQuantity} ${pr.unit})`,
                })),
              ]}
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Select Supplier *</label>
            <Select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              options={suppliers.map((s) => ({
                value: s.id,
                label: `${s.name} [${s.category}] — Rating: ${s.rating}★`,
              }))}
            />
            {errors.supplierId && <span className="text-rose-400 text-[10px]">{errors.supplierId}</span>}
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Project *</label>
            <Select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Expected Delivery Date *</label>
            <Input
              type="date"
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
            />
            {errors.expectedDeliveryDate && (
              <span className="text-rose-400 text-[10px]">{errors.expectedDeliveryDate}</span>
            )}
          </div>
        </div>

        {/* Item Details */}
        <div className="border-t border-slate-800 pt-3">
          <h4 className="font-bold text-slate-200 text-xs mb-2 uppercase tracking-wide">
            Order Line Item & Pricing
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Material Item *</label>
              <Select
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
                options={materials.map((m) => ({
                  value: m.id,
                  label: `${m.name} (${m.code})`,
                }))}
              />
              {errors.materialId && <span className="text-rose-400 text-[10px]">{errors.materialId}</span>}
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Quantity *</label>
              <Input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 500"
              />
              {errors.quantity && <span className="text-rose-400 text-[10px]">{errors.quantity}</span>}
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Unit Price (₹) *</label>
              <Input
                type="number"
                step="any"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="e.g. 380"
              />
              {errors.unitPrice && <span className="text-rose-400 text-[10px]">{errors.unitPrice}</span>}
            </div>
          </div>
        </div>

        {/* Automatic Tax & Total Calculator */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-300 text-xs">
            <span>Subtotal ({qtyNum} {unit} @ ₹{priceNum}/unit):</span>
            <span className="font-mono font-semibold">{formatINR(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300 text-xs">
            <div className="flex items-center gap-2">
              <span>GST Tax Rate:</span>
              <select
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-amber-400 font-mono text-xs rounded px-1.5 py-0.5"
              >
                <option value="18">18% GST (Standard)</option>
                <option value="12">12% GST</option>
                <option value="5">5% GST</option>
                <option value="28">28% GST</option>
                <option value="0">0% GST Exempt</option>
              </select>
            </div>
            <span className="font-mono text-slate-400">+{formatINR(taxAmount)}</span>
          </div>

          <div className="flex items-center justify-between text-sm font-bold text-amber-400 pt-2 border-t border-slate-800">
            <span>Grand Total (INR):</span>
            <span className="font-mono text-base font-extrabold">{formatINR(grandTotal)}</span>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Delivery Address & Instructions</label>
          <Input
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Site address / gate details"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Terms & Notes</label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special unloading terms, batch certs, etc."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="amber" type="submit">
            Generate & Issue PO
          </Button>
        </div>
      </form>
    </Modal>
  );
};
