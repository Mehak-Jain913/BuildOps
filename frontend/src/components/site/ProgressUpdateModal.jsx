import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../forms/Input';
import { Select } from '../forms/Select';
import { useProjects } from '../../hooks/useProjects';
import { useSiteOperations } from '../../hooks/useSiteOperations';
import { WORK_PROGRESS_STATUSES } from '../../mock/siteOperationsData';

export const ProgressUpdateModal = ({ isOpen, onClose, selectedRecord = null }) => {
  const { projects, blocks, levels, tasks } = useProjects();
  const { updateWorkProgress } = useSiteOperations();

  const [projectId, setProjectId] = useState(selectedRecord?.projectId || projects[0]?.id || 'PRJ-001');
  const [blockId, setBlockId] = useState(selectedRecord?.blockId || '');
  const [levelId, setLevelId] = useState(selectedRecord?.levelId || '');
  const [taskId, setTaskId] = useState(selectedRecord?.taskId || '');
  const [date, setDate] = useState(selectedRecord?.date || new Date().toISOString().split('T')[0]);
  const [plannedQuantity, setPlannedQuantity] = useState(selectedRecord?.plannedQuantity?.toString() || '1000');
  const [completedQuantity, setCompletedQuantity] = useState(selectedRecord?.completedQuantity?.toString() || '0');
  const [unit, setUnit] = useState(selectedRecord?.unit || 'sq.ft.');
  const [status, setStatus] = useState(selectedRecord?.status || 'In Progress');
  const [supervisor, setSupervisor] = useState(selectedRecord?.supervisorId || 'David Miller');
  const [remarks, setRemarks] = useState(selectedRecord?.remarks || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedRecord) {
      setProjectId(selectedRecord.projectId || 'PRJ-001');
      setBlockId(selectedRecord.blockId || '');
      setLevelId(selectedRecord.levelId || '');
      setTaskId(selectedRecord.taskId || '');
      setDate(selectedRecord.date || new Date().toISOString().split('T')[0]);
      setPlannedQuantity(selectedRecord.plannedQuantity?.toString() || '1000');
      setCompletedQuantity(selectedRecord.completedQuantity?.toString() || '0');
      setUnit(selectedRecord.unit || 'sq.ft.');
      setStatus(selectedRecord.status || 'In Progress');
      setSupervisor(selectedRecord.supervisorId || 'David Miller');
      setRemarks(selectedRecord.remarks || '');
    }
  }, [selectedRecord]);

  const plannedNum = parseFloat(plannedQuantity) || 0;
  const completedNum = parseFloat(completedQuantity) || 0;
  const calculatedPct = plannedNum > 0 ? Math.min(100, Math.round((completedNum / plannedNum) * 100)) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (completedNum < 0) errs.completedQuantity = 'Completed quantity cannot be negative.';
    if (plannedNum <= 0) errs.plannedQuantity = 'Planned quantity must be greater than 0.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const proj = projects.find((p) => p.id === projectId);
    const blk = blocks.find((b) => b.id === blockId);
    const lvl = levels.find((l) => l.id === levelId);
    const tsk = tasks.find((t) => t.id === taskId);

    updateWorkProgress({
      projectId,
      projectName: proj?.name || 'Sunrise Heights',
      blockId,
      blockName: blk?.name || 'Block A',
      levelId,
      levelName: lvl?.name || 'Level 1',
      taskId: taskId || `TSK-${Date.now()}`,
      taskName: tsk?.name || selectedRecord?.taskName || 'Site Task',
      date,
      plannedQuantity: plannedNum,
      completedQuantity: completedNum,
      unit,
      status,
      supervisorId: supervisor,
      remarks,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Work Progress Update">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Project *</label>
            <Select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Associated Task *</label>
            <Select
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              options={tasks.map((t) => ({ value: t.id, label: `${t.name} (${t.status})` }))}
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Log Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Supervisor</label>
            <Input value={supervisor} onChange={(e) => setSupervisor(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 border-t border-slate-800 pt-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Planned Qty *</label>
            <Input
              type="number"
              step="any"
              value={plannedQuantity}
              onChange={(e) => setPlannedQuantity(e.target.value)}
            />
            {errors.plannedQuantity && <span className="text-rose-400 text-[10px]">{errors.plannedQuantity}</span>}
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Completed Qty *</label>
            <Input
              type="number"
              step="any"
              value={completedQuantity}
              onChange={(e) => setCompletedQuantity(e.target.value)}
            />
            {errors.completedQuantity && <span className="text-rose-400 text-[10px]">{errors.completedQuantity}</span>}
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Unit</label>
            <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g. sq.ft., m" />
          </div>
        </div>

        {/* Calculated Progress Preview */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between font-mono">
          <span className="text-slate-400 text-xs">Auto-Calculated Progress:</span>
          <span className="text-amber-400 font-bold text-sm">{calculatedPct}% Completed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Task Status</label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={WORK_PROGRESS_STATUSES.map((s) => ({ value: s, label: s }))}
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Field Remarks / Obstacles</label>
            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Pouring velocity optimal"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="amber" type="submit">
            Save Progress Log
          </Button>
        </div>
      </form>
    </Modal>
  );
};
