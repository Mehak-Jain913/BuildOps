import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../forms/Input';
import { Select } from '../forms/Select';
import { Textarea } from '../forms/Textarea';
import { Button } from '../ui/Button';
import { useMaterials } from '../../hooks/useMaterials';
import { useProjects } from '../../hooks/useProjects';
import { useToast } from '../../hooks/useToast';
import { PackagePlus, Calendar, Truck, Building2, MapPin } from 'lucide-react';

export const StockInModal = ({ isOpen, onClose }) => {
  const { materials, recordStockIn } = useMaterials();
  const { projects, blocks } = useProjects();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    materialId: materials[0]?.id || '',
    projectId: projects[0]?.id || '',
    blockId: '',
    locationName: '',
    quantity: '',
    supplier: '',
    reference: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const selectedMaterial = materials.find((m) => m.id === formData.materialId) || materials[0];
  const selectedProject = projects.find((p) => p.id === formData.projectId) || projects[0];
  const projectBlocks = blocks.filter((b) => b.projectId === formData.projectId);

  const validate = () => {
    const newErrors = {};
    if (!formData.materialId) newErrors.materialId = 'Please select a material';
    if (!formData.projectId) newErrors.projectId = 'Please select a project';
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedBlockObj = projectBlocks.find((b) => b.id === formData.blockId);

    const res = recordStockIn({
      ...formData,
      projectName: selectedProject?.name,
      blockName: selectedBlockObj?.name || 'Main Yard',
      supplier: formData.supplier || selectedMaterial?.defaultSupplier || 'Site Supplier',
    });

    if (res.success) {
      addToast({
        title: 'Stock In Recorded',
        message: `Received ${formData.quantity} ${selectedMaterial?.unit} of ${selectedMaterial?.name} at ${selectedProject?.name}.`,
        type: 'success',
      });
      setFormData({
        materialId: materials[0]?.id || '',
        projectId: projects[0]?.id || '',
        blockId: '',
        locationName: '',
        quantity: '',
        supplier: '',
        reference: '',
        notes: '',
      });
      setErrors({});
      onClose();
    } else {
      addToast({
        title: 'Stock In Error',
        message: res.error || 'Failed to record stock in.',
        type: 'danger',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Stock In (Material Delivery)"
      subtitle="Log incoming material delivery consignments and update site inventory stock levels."
      maxWidth="max-w-xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Record Stock In
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Material SKU"
          name="materialId"
          value={formData.materialId}
          onChange={handleChange}
          options={materials.map((m) => ({
            value: m.id,
            label: `${m.name} (${m.code}) — ${m.category}`,
          }))}
          error={errors.materialId}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Destination Project"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
            error={errors.projectId}
            required
          />

          <Select
            label="Block / Storage Zone"
            name="blockId"
            value={formData.blockId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select Storage Zone...' },
              ...projectBlocks.map((b) => ({ value: b.id, label: b.name })),
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={`Received Quantity (${selectedMaterial?.unit || 'units'})`}
            name="quantity"
            type="number"
            step="0.01"
            placeholder={`e.g. 500`}
            value={formData.quantity}
            onChange={handleChange}
            error={errors.quantity}
            required
            rightElement={
              <span className="text-xs font-bold text-slate-500">{selectedMaterial?.unit}</span>
            }
          />

          <Input
            label="Storage Location Detail"
            name="locationName"
            placeholder="e.g. Block A Warehouse Shed 2"
            value={formData.locationName}
            onChange={handleChange}
            leftIcon={MapPin}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Supplier Name"
            name="supplier"
            placeholder={`e.g. ${selectedMaterial?.defaultSupplier || 'Apex Steel'}`}
            value={formData.supplier}
            onChange={handleChange}
            leftIcon={Truck}
          />

          <Input
            label="Delivery Challan / GRN Ref #"
            name="reference"
            placeholder="e.g. GRN-2026-081"
            value={formData.reference}
            onChange={handleChange}
          />
        </div>

        <Textarea
          label="Consignment Notes / Batch Details"
          name="notes"
          placeholder="Delivery condition, quality inspection status, or batch numbers..."
          value={formData.notes}
          onChange={handleChange}
          rows={3}
        />
      </form>
    </Modal>
  );
};
