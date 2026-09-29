import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Select } from '../forms/Select';
import { useProjects } from '../../hooks/useProjects';
import {
  HardHat,
  Sun,
  Users,
  PackageCheck,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Building2,
  Activity
} from 'lucide-react';

export const DailySiteSummary = ({
  selectedDate,
  onDateChange,
  weather = 'Partly Cloudy',
  siteStatus = 'Operational',
  workforcePresent = 103,
  workforceRequired = 118,
  materialAvailability = 91,
  todayProgress = 68,
  openIssuesCount = 7,
  safetyIncidentsCount = 1,
}) => {
  const { projects, selectedProjectId, setSelectedProjectId } = useProjects();

  const attendancePct = Math.round((workforcePresent / workforceRequired) * 100);

  return (
    <div className="space-y-4">
      {/* Selector & Environment Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 font-bold uppercase text-[10px]">Project:</span>
            <div className="w-48">
              <Select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                options={projects.map((p) => ({ value: p.id, label: p.name }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 font-bold uppercase text-[10px]">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange && onDateChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-white rounded px-2 py-1 font-mono text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>{weather}</span>
          </div>
          <Badge variant={siteStatus === 'Operational' ? 'emerald' : 'amber'} size="sm">
            ● {siteStatus}
          </Badge>
        </div>
      </div>

      {/* KPI Cards Grid (Section 8) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Workforce Present</span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-mono font-extrabold text-white">
              {workforcePresent} <span className="text-xs text-slate-400 font-normal">/ {workforceRequired}</span>
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">{attendancePct}%</span>
          </div>
          <ProgressBar progress={attendancePct} color="bg-emerald-500" size="xs" />
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Material Availability</span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-mono font-extrabold text-amber-400">{materialAvailability}%</span>
            <span className="text-[10px] text-slate-400">Readiness</span>
          </div>
          <ProgressBar progress={materialAvailability} color="bg-amber-500" size="xs" />
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Today&apos;s Progress</span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-mono font-extrabold text-emerald-400">{todayProgress}%</span>
            <span className="text-[10px] text-slate-400">Target 75%</span>
          </div>
          <ProgressBar progress={todayProgress} color="bg-emerald-500" size="xs" />
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Open Site Issues</span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-mono font-extrabold text-rose-400">{openIssuesCount}</span>
            <Badge variant={openIssuesCount > 5 ? 'danger' : 'amber'} size="xs">Active</Badge>
          </div>
          <span className="text-[10px] text-slate-400 block">Bottlenecks</span>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Safety Status</span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-mono font-extrabold text-amber-300">{safetyIncidentsCount}</span>
            <Badge variant={safetyIncidentsCount > 0 ? 'amber' : 'emerald'} size="xs">
              {safetyIncidentsCount > 0 ? 'Attention' : 'Safe'}
            </Badge>
          </div>
          <span className="text-[10px] text-slate-400 block">Incidents Logged</span>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Tomorrow Readiness</span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-mono font-extrabold text-emerald-400">92%</span>
            <Badge variant="emerald" size="xs">High</Badge>
          </div>
          <span className="text-[10px] text-slate-400 block">Prep Complete</span>
        </div>
      </div>
    </div>
  );
};
