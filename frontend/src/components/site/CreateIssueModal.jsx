import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../forms/Input';
import { Select } from '../forms/Select';
import { Textarea } from '../forms/Textarea';
import { useProjects } from '../../hooks/useProjects';
import { useSiteOperations } from '../../hooks/useSiteOperations';
import { ISSUE_TYPES, ISSUE_PRIORITIES } from '../../mock/siteOperationsData';

export const CreateIssueModal = ({ isOpen, onClose }) => {
  const { projects, blocks, levels, tasks } = useProjects();
  const { createSiteIssue } = useSiteOperations();

  const [projectId, setProjectId] = useState(projects[0]?.id || 'PRJ-001');
  const [blockId, setBlockId] = useState('');
  const [levelId, setLevelId] = useState('');
  const [taskId, setTaskId] = useState('');
  const [type, setType] = useState('Material');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [impact, setImpact] = useState('Schedule + Material');
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState({});

  const availableBlocks = blocks.filter((b) => b.projectId === projectId);
  const availableLevels = levels.filter((l) => l.blockId === blockId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!projectId) errs.projectId = 'Project is required.';
    if (!title.trim()) errs.title = 'Title is required.';
    if (!description.trim()) errs.description = 'Description is required.';
    if (!type) errs.type = 'Issue type is required.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const proj = projects.find((p) => p.id === projectId);
    const blk = blocks.find((b) => b.id === blockId);
    const lvl = levels.find((l) => l.id === levelId);
    const tsk = tasks.find((t) => t.id === taskId);

    const res = createSiteIssue({
      projectId,
      projectName: proj?.name || 'Sunrise Heights',
      blockId,
      blockName: blk?.name || '',
      levelId,
      levelName: lvl?.name || '',
      taskId,
      taskName: tsk?.name || '',
      type,
      title,
      description,
      priority,
      assignedTo: assignedTo || 'Site Supervisor',
      dueDate: dueDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      impact,
      remarks,
    });

    if (res.success) {
      onClose();
      setTitle('');
      setDescription('');
      setRemarks('');
      setErrors({});
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Site Operational Issue" maxWidth="2xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Project *</label>
            <Select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
            />
            {errors.projectId && <span className="text-rose-400 text-[10px]">{errors.projectId}</span>}
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Issue Category Type *</label>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={ISSUE_TYPES.map((t) => ({ value: t, label: t }))}
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Block / Area</label>
            <Select
              value={blockId}
              onChange={(e) => setBlockId(e.target.value)}
              options={[
                { value: '', label: 'Entire Site / Common Area' },
                ...availableBlocks.map((b) => ({ value: b.id, label: b.name })),
              ]}
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Floor Level</label>
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
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Issue Summary Title *</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Steel rebar consignment PO-2026-203 delayed by 2 days"
          />
          {errors.title && <span className="text-rose-400 text-[10px]">{errors.title}</span>}
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Detailed Operational Impact Description *</label>
          <Textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe cause, location, and potential construction delay..."
          />
          {errors.description && <span className="text-rose-400 text-[10px]">{errors.description}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-800 pt-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Priority Level</label>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={ISSUE_PRIORITIES.map((p) => ({ value: p, label: p }))}
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Assign Resolution To</label>
            <Input
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="e.g. Store Keeper / Logistics"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Resolution Date</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Impact Category</label>
          <Select
            value={impact}
            onChange={(e) => setImpact(e.target.value)}
            options={[
              { value: 'Schedule + Material', label: 'Schedule + Material' },
              { value: 'Labour + Schedule', label: 'Labour + Schedule' },
              { value: 'Quality + Cost', label: 'Quality + Cost' },
              { value: 'Safety + Productivity', label: 'Safety + Productivity' },
              { value: 'Site Access', label: 'Site Access' },
            ]}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="amber" type="submit">
            Log Site Issue
          </Button>
        </div>
      </form>
    </Modal>
  );
};
