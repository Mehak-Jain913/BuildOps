import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../forms/Input';
import { Select } from '../forms/Select';
import { Textarea } from '../forms/Textarea';
import { Button } from '../ui/Button';
import { useMaterials } from '../../hooks/useMaterials';
import { useProjects } from '../../hooks/useProjects';
import { useToast } from '../../hooks/useToast';
import { FileText, Calendar, User, AlertCircle } from 'lucide-react';

export const MaterialRequestModal = ({ isOpen, onClose }) => {
  const { materials, createMaterialRequest } = useMaterials();
  const { projects, blocks, levels, tasks } = useProjects();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    materialId: materials[0]?.id || '',
    projectId: projects[0]?.id || '',
    blockId: '',
    levelId: '',
    taskId: '',
    requestedQuantity: '',
    requestedBy: 'David Miller',
    priority: 'High',
    requiredDate: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const selectedMaterial = materials.find((m) => m.id === formData.materialId) || materials[0];
  const selectedProject = projects.find((p) => p.id === formData.projectId) || projects[0];

  const projectBlocks = blocks.filter((b) => b.projectId === formData.projectId);
  const blockLevels = levels.filter((l) => l.blockId === formData.blockId);
  const projectTasks = tasks.filter((t) => t.projectId === formData.projectId);

  const validate = () => {
    const newErrors = {};
    if (!formData.materialId) newErrors.materialId = 'Please select a material';
    if (!formData.projectId) newErrors.projectId = 'Please select a project';
    if (!formData.requestedQuantity || parseFloat(formData.requestedQuantity) <= 0) {
      newErrors.requestedQuantity = 'Requested quantity must be greater than 0';
    }
    if (!formData.requiredDate) newErrors.requiredDate = 'Required Date is required';
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
    const selectedLevelObj = blockLevels.find((l) => l.id === formData.levelId);
    const selectedTaskObj = projectTasks.find((t) => t.id === formData.taskId);

    const res = createMaterialRequest({
      ...formData,
      projectName: selectedProject?.name,
      blockName: selectedBlockObj?.name || 'Block A',
      levelName: selectedLevelObj?.name || 'Level 1',
      taskName: selectedTaskObj?.name || 'Site Task',
    });

    if (res.success) {
      addToast({
        title: 'Material Request Created',
        message: `Request for ${formData.requestedQuantity} ${selectedMaterial?.unit} of ${selectedMaterial?.name} submitted for approval.`,
        type: 'success',
      });
      setFormData({
        materialId: materials[0]?.id || '',
        projectId: projects[0]?.id || '',
        blockId: '',
        levelId: '',
        taskId: '',
        requestedQuantity: '',
        requestedBy: 'David Miller',
        priority: 'High',
        requiredDate: '',
        notes: '',
      });
      setErrors({});
      onClose();
    } else {
      addToast({
        title: 'Request Failed',
        message: res.error || 'Failed to submit material request.',
        type: 'danger',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Material Request / Requisition"
      subtitle="Submit formal site material requisition for manager approval and store clearance."
      maxWidth="max-w-xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit Request
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Target Project"
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label={`Requested Qty (${selectedMaterial?.unit || 'units'})`}
            name="requestedQuantity"
            type="number"
            step="0.01"
            placeholder="e.g. 300"
            value={formData.requestedQuantity}
            onChange={handleChange}
            error={errors.requestedQuantity}
            required
          />

          <Input
            label="Required By Date"
            name="requiredDate"
            type="date"
            value={formData.requiredDate}
            onChange={handleChange}
            error={errors.requiredDate}
            required
            leftIcon={Calendar}
          />

          <Select
            label="Urgency / Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={[
              { value: 'Low', label: 'Low Priority' },
              { value: 'Medium', label: 'Medium Priority' },
              { value: 'High', label: 'High Priority' },
              { value: 'Critical', label: 'Critical / Stockout Imminent' },
            ]}
          />
        </div>

        <Input
          label="Requested By (Supervisor Name)"
          name="requestedBy"
          value={formData.requestedBy}
          onChange={handleChange}
          leftIcon={User}
        />

        <Textarea
          label="Requisition Reason / Operational Notes"
          name="notes"
          placeholder="Explain site pouring schedule, gang assignment, or emergency requirement..."
          value={formData.notes}
          onChange={handleChange}
          rows={3}
        />
      </form>
    </Modal>
  );
};
