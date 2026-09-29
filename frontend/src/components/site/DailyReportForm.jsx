import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../forms/Input';
import { Select } from '../forms/Select';
import { Textarea } from '../forms/Textarea';
import { useProjects } from '../../hooks/useProjects';
import { useMaterials } from '../../hooks/useMaterials';
import { useLabour } from '../../hooks/useLabour';
import { useProcurement } from '../../hooks/useProcurement';
import { useSiteOperations } from '../../hooks/useSiteOperations';
import { useRole } from '../../hooks/useRole';
import { WEATHER_CONDITIONS } from '../../mock/siteOperationsData';
import { FileText, CheckCircle2, Save, Send, ShieldCheck, Users, Package, Truck, Wrench } from 'lucide-react';

export const DailyReportForm = ({ initialReport = null, onSuccess }) => {
  const { isRole } = useRole();
  const { projects } = useProjects();
  const { consumption } = useMaterials();
  const { attendance } = useLabour();
  const { deliveries, purchaseRequests } = useProcurement();
  const { createDailyReport, approveDailyReport } = useSiteOperations();

  const isAdmin = isRole(['ADMIN']);

  const [projectId, setProjectId] = useState(initialReport?.projectId || projects[0]?.id || 'PRJ-001');
  const [date, setDate] = useState(initialReport?.date || new Date().toISOString().split('T')[0]);
  const [supervisorName, setSupervisorName] = useState(initialReport?.supervisorName || 'David Miller');
  const [weather, setWeather] = useState(initialReport?.weather || 'Partly Cloudy');
  const [siteStatus, setSiteStatus] = useState(initialReport?.siteStatus || 'Operational');
  const [workforcePresent, setWorkforcePresent] = useState(initialReport?.workforcePresent?.toString() || '103');
  const [workforceRequired, setWorkforceRequired] = useState(initialReport?.workforceRequired?.toString() || '118');
  const [majorActivities, setMajorActivities] = useState(initialReport?.majorActivities || 'Level 4 structural slab concrete pour, Level 3 brickwork, and plumbing line inspections.');
  const [completedWork, setCompletedWork] = useState(initialReport?.completedWork || '820 sq.ft. slab poured, 1100 sq.ft. masonry finished.');
  const [equipmentUsed, setEquipmentUsed] = useState(initialReport?.equipmentUsed || 'Concrete Boom Pump P-02, Tower Crane #1, Batching Plant');
  const [safetySummary, setSafetySummary] = useState(initialReport?.safetySummary || '1 TBT conducted; 1 PPE harness violation corrected on Level 4.');
  const [overallProgress, setOverallProgress] = useState(initialReport?.overallProgress?.toString() || '68');
  const [remarks, setRemarks] = useState(initialReport?.remarks || 'Concrete pouring velocity on track for Level 4 slab section.');
  const [tomorrowPlan, setTomorrowPlan] = useState(initialReport?.tomorrowPlan || 'Complete remaining 380 sq.ft. Level 4 slab pour and start Level 2 electrical conduit chasing.');

  const handleSubmit = (e) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === projectId);

    const res = createDailyReport({
      projectId,
      projectName: proj?.name || 'Sunrise Heights',
      date,
      supervisorName,
      weather,
      siteStatus,
      workforcePresent: parseInt(workforcePresent) || 103,
      workforceRequired: parseInt(workforceRequired) || 118,
      majorActivities,
      completedWork,
      equipmentUsed,
      safetySummary,
      overallProgress: parseInt(overallProgress) || 68,
      remarks,
      tomorrowPlan,
      materialConsumption: [
        { name: 'Cement (OPC 53)', quantity: 180, unit: 'Bags' },
        { name: 'Steel (16mm TMT)', quantity: 2.4, unit: 'Tonnes' },
        { name: 'Coarse Sand', quantity: 18, unit: 'Tonnes' },
      ],
    });

    if (res.success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs">
      {/* 1. Site Information */}
      <Card className="bg-slate-900 border-slate-800 p-5 space-y-4">
        <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
          <FileText className="w-4 h-4 text-amber-400" />
          1. Site & General Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Project *</label>
            <Select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Report Date *</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Site Supervisor *</label>
            <Input value={supervisorName} onChange={(e) => setSupervisorName(e.target.value)} />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Weather Condition</label>
            <Select
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              options={WEATHER_CONDITIONS.map((w) => ({ value: w, label: w }))}
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Operational Site Status</label>
            <Select
              value={siteStatus}
              onChange={(e) => setSiteStatus(e.target.value)}
              options={[
                { value: 'Operational', label: 'Operational (Normal Shift)' },
                { value: 'Partial Shift', label: 'Partial Shift' },
                { value: 'Weather Delay', label: 'Weather Delay' },
                { value: 'Site Halted', label: 'Site Halted' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* 2. Workforce (from useLabour) */}
      <Card className="bg-slate-900 border-slate-800 p-5 space-y-4">
        <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
          <Users className="w-4 h-4 text-blue-400" />
          2. Workforce & Attendance Summary (useLabour Integration)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono">
          <div>
            <label className="block text-slate-300 font-semibold mb-1 font-sans">Present Workforce *</label>
            <Input
              type="number"
              value={workforcePresent}
              onChange={(e) => setWorkforcePresent(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 font-sans">Required Workforce *</label>
            <Input
              type="number"
              value={workforceRequired}
              onChange={(e) => setWorkforceRequired(e.target.value)}
            />
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Absent Count</span>
            <span className="text-rose-400 font-bold text-base">
              {Math.max(0, (parseInt(workforceRequired) || 0) - (parseInt(workforcePresent) || 0))} workers
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Logged OT Hours</span>
            <span className="text-amber-400 font-bold text-base">42.5 hrs Total</span>
          </div>
        </div>
      </Card>

      {/* 3 & 4. Major Activities & Completed Work */}
      <Card className="bg-slate-900 border-slate-800 p-5 space-y-4">
        <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          3 & 4. Major Site Activities & Completed Progress
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Major Tasks & Activities Conducted Today *</label>
            <Textarea
              rows={2}
              value={majorActivities}
              onChange={(e) => setMajorActivities(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Quantified Completed Work *</label>
            <Input
              value={completedWork}
              onChange={(e) => setCompletedWork(e.target.value)}
              placeholder="e.g. 820 sq.ft. slab poured, 1100 sq.ft. masonry finished"
            />
          </div>
        </div>
      </Card>

      {/* 5, 6, 7 & 8. Materials, Equipment, Issues & Safety */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Materials & Equipment */}
        <Card className="bg-slate-900 border-slate-800 p-5 space-y-4">
          <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Package className="w-4 h-4 text-amber-400" />
            5 & 6. Material Consumption & Heavy Equipment
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
              <span className="text-slate-400 text-[10px] font-sans font-bold uppercase block">Material Consumption Log</span>
              <div className="text-amber-400 font-bold">● Cement OPC 53: 180 Bags</div>
              <div className="text-white">● Steel 16mm Rebar: 2.4 Tonnes</div>
              <div className="text-white">● Coarse Sand: 18 Tonnes</div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Heavy Machinery & Tools Engaged</label>
              <Input value={equipmentUsed} onChange={(e) => setEquipmentUsed(e.target.value)} />
            </div>
          </div>
        </Card>

        {/* Safety & Progress */}
        <Card className="bg-slate-900 border-slate-800 p-5 space-y-4">
          <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            8 & 9. Safety Briefing & Overall Site Progress
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Safety Summary & TBT Log</label>
              <Input value={safetySummary} onChange={(e) => setSafetySummary(e.target.value)} />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Overall Project Completion (%)</label>
              <Input
                type="number"
                value={overallProgress}
                onChange={(e) => setOverallProgress(e.target.value)}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* 10 & 11. Remarks & Tomorrow Plan */}
      <Card className="bg-slate-900 border-slate-800 p-5 space-y-4">
        <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
          <FileText className="w-4 h-4 text-amber-400" />
          10 & 11. Supervisor Remarks & Tomorrow Execution Plan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Supervisor Notes / Remarks</label>
            <Textarea rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tomorrow Planned Site Work</label>
            <Textarea rows={3} value={tomorrowPlan} onChange={(e) => setTomorrowPlan(e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
        <Button variant="secondary" type="submit" className="gap-2">
          <Save className="w-4 h-4" />
          <span>Save Draft</span>
        </Button>
        <Button variant="amber" type="submit" className="gap-2">
          <Send className="w-4 h-4" />
          <span>Submit Daily Site Report</span>
        </Button>
      </div>
    </form>
  );
};
