import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../forms/Input';
import { Select } from '../forms/Select';
import { Textarea } from '../forms/Textarea';
import { useProjects } from '../../hooks/useProjects';
import { useSiteOperations } from '../../hooks/useSiteOperations';
import { SAFETY_TYPES, SAFETY_SEVERITIES } from '../../mock/siteOperationsData';

export const ReportSafetyIncidentModal = ({ isOpen, onClose }) => {
  const { projects, blocks, levels } = useProjects();
  const { createSafetyIncident } = useSiteOperations();

  const [projectId, setProjectId] = useState(projects[0]?.id || 'PRJ-001');
  const [blockId, setBlockId] = useState('');
  const [levelId, setLevelId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:30 AM');
  const [type, setType] = useState('PPE Violation');
  const [severity, setSeverity] = useState('Medium');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('Safety Officer');
  const [affectedWorkers, setAffectedWorkers] = useState('None');
  const [immediateAction, setImmediateAction] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [errors, setErrors] = useState({});

  const availableBlocks = blocks.filter((b) => b.projectId === projectId);
  const availableLevels = levels.filter((l) => l.blockId === blockId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!projectId) errs.projectId = 'Project is required.';
    if (!description.trim()) errs.description = 'Incident description is required.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const proj = projects.find((p) => p.id === projectId);
    const blk = blocks.find((b) => b.id === blockId);
    const lvl = levels.find((l) => l.id === levelId);

    const res = createSafetyIncident({
      projectId,
      projectName: proj?.name || 'Sunrise Heights',
      blockId,
      blockName: blk?.name || 'Block A',
      levelId,
      levelName: lvl?.name || 'Level 1',
      date,
      time,
      type,
      severity,
      description,
      reportedBy,
      affectedWorkers,
      immediateAction,
      correctiveAction,
    });

    if (res.success) {
      onClose();
      setDescription('');
      setImmediateAction('');
      setCorrectiveAction('');
      setErrors({});
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Site Safety Incident / Near Miss" maxWidth="2xl">
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
            <label className="block text-slate-300 font-semibold mb-1">Safety Incident Category *</label>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={SAFETY_TYPES.map((t) => ({ value: t, label: t }))}
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Block / Area</label>
            <Select
              value={blockId}
              onChange={(e) => setBlockId(e.target.value)}
              options={[
                { value: '', label: 'Select Block Area' },
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-800 pt-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Incident Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Incident Time</label>
            <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 11:30 AM" />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Severity Level</label>
            <Select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              options={SAFETY_SEVERITIES.map((s) => ({ value: s, label: s }))}
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Incident Description & Observation *</label>
          <Textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what occurred, unsafe conditions, or PPE non-compliance observed..."
          />
          {errors.description && <span className="text-rose-400 text-[10px]">{errors.description}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Reported By</label>
            <Input value={reportedBy} onChange={(e) => setReportedBy(e.target.value)} />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Affected Workers / Crew</label>
            <Input value={affectedWorkers} onChange={(e) => setAffectedWorkers(e.target.value)} placeholder="e.g. 2 scaffolders" />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Immediate Action Taken on Site</label>
          <Input
            value={immediateAction}
            onChange={(e) => setImmediateAction(e.target.value)}
            placeholder="e.g. Work halted; safety harness re-briefing conducted"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Required Long-Term Corrective Action</label>
          <Input
            value={correctiveAction}
            onChange={(e) => setCorrectiveAction(e.target.value)}
            placeholder="e.g. Install double anchor line net along Level 4 edge"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="amber" type="submit">
            Submit Safety Report
          </Button>
        </div>
      </form>
    </Modal>
  );
};
