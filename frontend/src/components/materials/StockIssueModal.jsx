import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../forms/Input';
import { Select } from '../forms/Select';
import { Textarea } from '../forms/Textarea';
import { Button } from '../ui/Button';
import { useMaterials } from '../../hooks/useMaterials';
import { useProjects } from '../../hooks/useProjects';
import { useToast } from '../../hooks/useToast';
import { AlertCircle, CheckCircle2, User, Layers } from 'lucide-react';

export const StockIssueModal = ({ isOpen, onClose, defaultMaterialId }) => {
  const { materials, inventory, issueMaterial } = useMaterials();
  const { projects, blocks, levels, tasks } = useProjects();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    materialId: defaultMaterialId || materials[0]?.id || '',
    projectId: projects[0]?.id || '',
    blockId: '',
    levelId: '',
    taskId: '',
    quantity: '',
    requestedBy: 'David Miller',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const selectedMaterial = materials.find((m) => m.id === formData.materialId) || materials[0];
  const selectedProject = projects.find((p) => p.id === formData.projectId) || projects[0];

  const projectBlocks = blocks.filter((b) => b.projectId === formData.projectId);
  const blockLevels = levels.filter((l) => l.blockId === formData.blockId);
  const projectTasks = tasks.filter((t) => t.projectId === formData.projectId);

  // Available stock calculation
  const inventoryEntry = inventory.find(
    (inv) => inv.materialId === formData.materialId && inv.projectId === formData.projectId
  );

  const availableStock = inventoryEntry ? inventoryEntry.quantityAvailable : 0;
  const requestedQty = parseFloat(formData.quantity) || 0;
  const remainingStock = availableStock - requestedQty;
  const isStockInsufficient = requestedQty > availableStock;

  const validate = () => {
    const newErrors = {};
    if (!formData.materialId) newErrors.materialId = 'Please select a material';
    if (!formData.projectId) newErrors.projectId = 'Please select a project';
    if (!formData.quantity || requestedQty <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    } else if (isStockInsufficient) {
      newErrors.quantity = 'Insufficient available stock.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'projectId') {
        updated.blockId = '';
        updated.levelId = '';
        updated.taskId = '';
      }
      if (name === 'blockId') {
        updated.levelId = '';
      }
      return updated;
    });

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedBlockObj = projectBlocks.find((b) => b.id === formData.blockId);
    const selectedLevelObj = blockLevels.find((l) => l.id === formData.levelId);
    const selectedTaskObj = projectTasks.find((t) => t.id === formData.taskId);

    const res = issueMaterial({
      ...formData,
      projectName: selectedProject?.name,
      blockName: selectedBlockObj?.name || 'Block A',
      levelName: selectedLevelObj?.name || 'Level 1',
      taskName: selectedTaskObj?.name || 'Site Task',
    });

    if (res.success) {
      addToast({
        title: 'Material Issued Successfully',
        message: `Issued ${requestedQty} ${selectedMaterial?.unit} of ${selectedMaterial?.name} to ${selectedBlockObj?.name || 'site'}.`,
        type: 'success',
      });
      setFormData({
        materialId: defaultMaterialId || materials[0]?.id || '',
        projectId: projects[0]?.id || '',
        blockId: '',
        levelId: '',
        taskId: '',
        quantity: '',
        requestedBy: 'David Miller',
        notes: '',
      });
      setErrors({});
      onClose();
    } else {
      addToast({
        title: 'Issue Stock Error',
        message: res.error || 'Insufficient available stock.',
        type: 'danger',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue Material to Site / Task"
      subtitle="Release material from store inventory to site blocks, levels, and active work tasks."
      maxWidth="max-w-xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isDisabled={isStockInsufficient}
          >
            Issue Material
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Project"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
            required
          />

          <Select
            label="Material SKU"
            name="materialId"
            value={formData.materialId}
            onChange={handleChange}
            options={materials.map((m) => ({
              value: m.id,
              label: `${m.name} (${m.code})`,
            }))}
            required
          />
        </div>

        {/* Live Stock Calculation Banner */}
        <div
          className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isStockInsufficient
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-amber-50/60 border-amber-200 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-2">
            {isStockInsufficient ? (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <div>
              <span className="font-bold">Stock Calculator:</span> Available in Store:{' '}
              <strong className="font-extrabold">{availableStock} {selectedMaterial?.unit}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 font-semibold text-right">
            <span>Issue: {requestedQty || 0}</span>
            <span>→</span>
            <span className={isStockInsufficient ? 'text-red-700 font-extrabold' : 'text-emerald-700 font-extrabold'}>
              Rem: {remainingStock >= 0 ? remainingStock : 0} {selectedMaterial?.unit}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Block / Zone"
            name="blockId"
            value={formData.blockId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select Block...' },
              ...projectBlocks.map((b) => ({ value: b.id, label: b.name })),
            ]}
          />

          <Select
            label="Floor / Level"
            name="levelId"
            value={formData.levelId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select Level...' },
              ...blockLevels.map((l) => ({ value: l.id, label: l.name })),
            ]}
          />

          <Select
            label="Associated Task"
            name="taskId"
            value={formData.taskId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select Task...' },
              ...projectTasks.map((t) => ({ value: t.id, label: t.name })),
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={`Issue Quantity (${selectedMaterial?.unit || 'units'})`}
            name="quantity"
            type="number"
            step="0.01"
            placeholder="e.g. 120"
            value={formData.quantity}
            onChange={handleChange}
            error={errors.quantity}
            required
            rightElement={
              <span className="text-xs font-bold text-slate-500">{selectedMaterial?.unit}</span>
            }
          />

          <Input
            label="Requested By / Supervisor"
            name="requestedBy"
            value={formData.requestedBy}
            onChange={handleChange}
            leftIcon={User}
          />
        </div>

        <Textarea
          label="Issue Notes / Purpose"
          name="notes"
          placeholder="Specify slab casting segment, gang assignment, or installation notes..."
          value={formData.notes}
          onChange={handleChange}
          rows={2}
        />
      </form>
    </Modal>
  );
};
