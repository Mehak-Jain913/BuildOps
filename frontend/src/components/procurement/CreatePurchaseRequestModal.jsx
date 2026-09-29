import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../forms/Input';
import { Select } from '../forms/Select';
import { Textarea } from '../forms/Textarea';
import { useProjects } from '../../hooks/useProjects';
import { useMaterials } from '../../hooks/useMaterials';
import { useProcurement } from '../../hooks/useProcurement';
import { MATERIAL_UNITS } from '../../mock/materialData';

export const CreatePurchaseRequestModal = ({ isOpen, onClose }) => {
  const { projects, blocks, levels, tasks } = useProjects();
  const { materials } = useMaterials();
  const { createPurchaseRequest } = useProcurement();

  const [projectId, setProjectId] = useState(projects[0]?.id || 'PRJ-001');
  const [blockId, setBlockId] = useState('');
  const [levelId, setLevelId] = useState('');
  const [taskId, setTaskId] = useState('');
  const [materialId, setMaterialId] = useState(materials[0]?.id || '');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Bags');
  const [requiredBy, setRequiredBy] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  // Filter blocks for selected project
  const availableBlocks = blocks.filter((b) => b.projectId === projectId);
  // Filter levels for selected block
  const availableLevels = levels.filter((l) => l.blockId === blockId);
  // Filter tasks for selected project/block/level
  const availableTasks = tasks.filter(
    (t) => t.projectId === projectId && (!blockId || t.blockId === blockId)
  );

  // Auto set unit when material changes
  useEffect(() => {
    if (materialId) {
      const selectedMat = materials.find((m) => m.id === materialId);
      if (selectedMat && selectedMat.unit) {
        setUnit(selectedMat.unit);
      }
    }
  }, [materialId, materials]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!projectId) errs.projectId = 'Project is required.';
    if (!materialId) errs.materialId = 'Material is required.';
    if (!quantity || parseFloat(quantity) <= 0) errs.quantity = 'Quantity must be greater than 0.';
    if (!requiredBy) errs.requiredBy = 'Required date is required.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const selectedProj = projects.find((p) => p.id === projectId);
    const selectedBlock = blocks.find((b) => b.id === blockId);
    const selectedLevel = levels.find((l) => l.id === levelId);
    const selectedTask = tasks.find((t) => t.id === taskId);
    const selectedMat = materials.find((m) => m.id === materialId);

    const result = createPurchaseRequest({
      projectId,
      projectName: selectedProj?.name || 'Sunrise Heights',
      blockId,
      blockName: selectedBlock?.name || '',
      levelId,
      levelName: selectedLevel?.name || '',
      taskId,
      taskName: selectedTask?.name || '',
      materialId,
      materialName: selectedMat?.name || 'Material',
      requestedQuantity: parseFloat(quantity),
      unit,
      requiredBy,
      priority,
      reason,
      notes,
    });

    if (result.success) {
      onClose();
      // Reset form
      setQuantity('');
      setReason('');
      setNotes('');
      setErrors({});
    } else if (result.error) {
      setErrors({ form: result.error });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Purchase Request (PR)" maxWidth="2xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errors.form && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300">
            {errors.form}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Project *</label>
            <Select
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                setBlockId('');
                setLevelId('');
              }}
              options={projects.map((p) => ({ value: p.id, label: `${p.name} (${p.code})` }))}
            />
            {errors.projectId && <span className="text-rose-400 text-[10px]">{errors.projectId}</span>}
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Block / Area</label>
            <Select
              value={blockId}
              onChange={(e) => {
                setBlockId(e.target.value);
                setLevelId('');
              }}
              options={[
                { value: '', label: 'Select Block (Optional)' },
                ...availableBlocks.map((b) => ({ value: b.id, label: b.name })),
              ]}
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Floor / Level</label>
            <Select
              value={levelId}
              onChange={(e) => setLevelId(e.target.value)}
              disabled={!blockId}
              options={[
                { value: '', label: 'Select Level (Optional)' },
                ...availableLevels.map((l) => ({ value: l.id, label: l.name })),
              ]}
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Associated Task</label>
            <Select
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              options={[
                { value: '', label: 'Select Task (Optional)' },
                ...availableTasks.map((t) => ({ value: t.id, label: `${t.name} (${t.status})` })),
              ]}
            />
          </div>
        </div>

        <div className="border-t border-slate-800 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Material Catalog Item *</label>
              <Select
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
                options={materials.map((m) => ({
                  value: m.id,
                  label: `${m.name} [${m.category}] — Stock Unit: ${m.unit}`,
                }))}
              />
              {errors.materialId && <span className="text-rose-400 text-[10px]">{errors.materialId}</span>}
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Priority</label>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                options={[
                  { value: 'Low', label: 'Low' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'High', label: 'High' },
                  { value: 'Critical', label: 'Critical' },
                ]}
              />
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
              <label className="block text-slate-300 font-semibold mb-1">Unit</label>
              <Select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                options={MATERIAL_UNITS.map((u) => ({ value: u, label: u }))}
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Required By Date *</label>
              <Input
                type="date"
                value={requiredBy}
                onChange={(e) => setRequiredBy(e.target.value)}
              />
              {errors.requiredBy && <span className="text-rose-400 text-[10px]">{errors.requiredBy}</span>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Reason / Scope</label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Level 5 slab casting pour"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Additional Notes</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Delivery required at Block A staging yard"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="amber" type="submit">
            Submit Purchase Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
