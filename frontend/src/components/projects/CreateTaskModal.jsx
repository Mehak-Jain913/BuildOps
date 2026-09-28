import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../forms/Input';
import { Select } from '../forms/Select';
import { Textarea } from '../forms/Textarea';
import { Button } from '../ui/Button';
import { useProjects } from '../../hooks/useProjects';
import { useToast } from '../../hooks/useToast';
import { CheckSquare, Calendar, User, Building2, Layers } from 'lucide-react';

export const CreateTaskModal = ({ isOpen, onClose, defaultProjectId }) => {
  const { projects, blocks, levels, phases, addTask } = useProjects();
  const { addToast } = useToast();

  const activeProjectId = defaultProjectId || projects[0]?.id || 'PRJ-001';

  const [formData, setFormData] = useState({
    projectId: activeProjectId,
    blockId: '',
    levelId: '',
    phaseId: '',
    name: '',
    description: '',
    supervisor: 'David Miller',
    priority: 'Medium',
    status: 'In Progress',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    progress: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (defaultProjectId) {
      setFormData((prev) => ({ ...prev, projectId: defaultProjectId }));
    }
  }, [defaultProjectId]);

  const availableBlocks = blocks.filter((b) => b.projectId === formData.projectId);
  const availableLevels = levels.filter((l) => l.blockId === formData.blockId);
  const availablePhases = phases.filter((p) => p.projectId === formData.projectId);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Task Name is required';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due Date is required';
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
        updated.phaseId = '';
      }
      if (name === 'blockId') {
        updated.levelId = '';
      }
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedBlockObj = blocks.find((b) => b.id === formData.blockId);
    const selectedLevelObj = levels.find((l) => l.id === formData.levelId);
    const selectedPhaseObj = phases.find((p) => p.id === formData.phaseId);

    const created = addTask({
      ...formData,
      blockName: selectedBlockObj ? selectedBlockObj.name : 'General Block',
      levelName: selectedLevelObj ? selectedLevelObj.name : 'General Level',
      phaseName: selectedPhaseObj ? selectedPhaseObj.name : 'Superstructure',
      location: selectedBlockObj
        ? `${selectedBlockObj.name} • ${selectedLevelObj?.name || 'All Levels'}`
        : 'Site Area',
    });

    addToast({
      title: 'Task Created Successfully',
      message: `Task "${formData.name}" assigned to ${formData.supervisor}.`,
      type: 'success',
    });

    setFormData({
      projectId: activeProjectId,
      blockId: '',
      levelId: '',
      phaseId: '',
      name: '',
      description: '',
      supervisor: 'David Miller',
      priority: 'Medium',
      status: 'In Progress',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      progress: 0,
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Site Task"
      subtitle="Assign daily site deliverables to supervisors, tag block/level location & target timeline."
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Task
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Name"
          name="name"
          placeholder="e.g. Slab Casting — Level 4"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          leftIcon={CheckSquare}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Project"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
            required
          />

          <Select
            label="Block / Zone"
            name="blockId"
            value={formData.blockId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select Block...' },
              ...availableBlocks.map((b) => ({ value: b.id, label: b.name })),
            ]}
          />

          <Select
            label="Floor / Level"
            name="levelId"
            value={formData.levelId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select Floor...' },
              ...availableLevels.map((l) => ({ value: l.id, label: l.name })),
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Construction Phase"
            name="phaseId"
            value={formData.phaseId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select Phase...' },
              ...availablePhases.map((p) => ({ value: p.id, label: p.name })),
            ]}
          />

          <Input
            label="Assigned Supervisor"
            name="supervisor"
            value={formData.supervisor}
            onChange={handleChange}
            leftIcon={User}
          />

          <Select
            label="Priority Level"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={[
              { value: 'Low', label: 'Low Priority' },
              { value: 'Medium', label: 'Medium Priority' },
              { value: 'High', label: 'High Priority' },
              { value: 'Critical', label: 'Critical Alert' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Initial Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'Not Started', label: 'Not Started' },
              { value: 'Scheduled', label: 'Scheduled' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Blocked', label: 'Blocked' },
              { value: 'Completed', label: 'Completed' },
            ]}
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
            label="Target Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            error={errors.dueDate}
            required
            leftIcon={Calendar}
          />
        </div>

        <Textarea
          label="Task Scope & Instructions"
          name="description"
          placeholder="Describe daily task requirements, material dependencies, and safety specs..."
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
      </form>
    </Modal>
  );
};
