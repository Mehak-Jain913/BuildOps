import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../forms/Input';
import { Select } from '../forms/Select';
import { Textarea } from '../forms/Textarea';
import { Button } from '../ui/Button';
import { useLabour } from '../../hooks/useLabour';
import { useProjects } from '../../hooks/useProjects';
import { useToast } from '../../hooks/useToast';
import { WORKER_TRADES, SHIFTS } from '../../mock/labourData';
import { Users, Calendar, Clock, User, AlertCircle } from 'lucide-react';

export const AllocationModal = ({ isOpen, onClose }) => {
  const { createAllocation } = useLabour();
  const { projects, blocks, levels, tasks } = useProjects();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    projectId: projects[0]?.id || '',
    blockId: '',
    levelId: '',
    taskId: '',
    trade: 'Mason',
    allocatedCount: '10',
    requiredCount: '12',
    shift: 'General',
    supervisor: 'David Miller',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const [errors, setErrors] = useState({});

  const selectedProject = projects.find((p) => p.id === formData.projectId) || projects[0];
  const projectBlocks = blocks.filter((b) => b.projectId === formData.projectId);
  const blockLevels = levels.filter((l) => l.blockId === formData.blockId);
  const projectTasks = tasks.filter((t) => t.projectId === formData.projectId);

  const validate = () => {
    const newErrors = {};
    if (!formData.projectId) newErrors.projectId = 'Please select a project';
    if (!formData.allocatedCount || parseInt(formData.allocatedCount) <= 0) {
      newErrors.allocatedCount = 'Allocated worker count must be greater than 0';
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

    const res = createAllocation({
      ...formData,
      projectName: selectedProject?.name,
      blockName: selectedBlockObj?.name || 'Block A',
      levelName: selectedLevelObj?.name || 'Level 1',
      taskName: selectedTaskObj?.name || 'Site Task',
    });

    if (res.success) {
      addToast({
        title: 'Workforce Allocation Created',
        message: `Assigned ${formData.allocatedCount} ${formData.trade}s to ${selectedBlockObj?.name || 'site'} on ${formData.shift} shift.`,
        type: 'success',
      });
      setFormData({
        projectId: projects[0]?.id || '',
        blockId: '',
        levelId: '',
        taskId: '',
        trade: 'Mason',
        allocatedCount: '10',
        requiredCount: '12',
        shift: 'General',
        supervisor: 'David Miller',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
      });
      setErrors({});
      onClose();
    } else {
      setErrors((prev) => ({ ...prev, general: res.error }));
      addToast({
        title: 'Allocation Conflict',
        message: res.error || 'Failed to create workforce allocation.',
        type: 'danger',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Workforce to Site / Task"
      subtitle="Deploy trade crews to project blocks, floor levels, active tasks, and shift schedules."
      maxWidth="max-w-xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Assign Workforce
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

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
            label="Trade Category to Deploy"
            name="trade"
            value={formData.trade}
            onChange={handleChange}
            options={WORKER_TRADES.map((t) => ({ value: t, label: t }))}
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
            label="Allocated Workers"
            name="allocatedCount"
            type="number"
            placeholder="e.g. 10"
            value={formData.allocatedCount}
            onChange={handleChange}
            error={errors.allocatedCount}
            required
          />

          <Input
            label="Planned Target Workers"
            name="requiredCount"
            type="number"
            placeholder="e.g. 12"
            value={formData.requiredCount}
            onChange={handleChange}
          />

          <Select
            label="Shift Schedule"
            name="shift"
            value={formData.shift}
            onChange={handleChange}
            options={SHIFTS.map((s) => ({ value: s, label: `${s} Shift` }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Assigned Supervisor"
            name="supervisor"
            value={formData.supervisor}
            onChange={handleChange}
            leftIcon={User}
          />

          <Input
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            leftIcon={Calendar}
          />

          <Input
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            leftIcon={Calendar}
          />
        </div>
      </form>
    </Modal>
  );
};
