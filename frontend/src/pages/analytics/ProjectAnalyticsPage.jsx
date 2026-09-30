import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useProjects } from '../../hooks/useProjects';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { AnalyticsMetricCard } from '../../components/analytics/AnalyticsMetricCard';
import { ProjectPerformanceTable } from '../../components/analytics/ProjectPerformanceTable';
import { VarianceBadge } from '../../components/analytics/VarianceBadge';
import { FolderKanban, CheckCircle2, Clock, Calendar, AlertTriangle, Layers } from 'lucide-react';

export const ProjectAnalyticsPage = () => {
  const { projectAnalytics, selectedProjectId } = useAnalytics();
  const { getProjectById, getPhasesByProjectId, getMilestonesByProjectId, getTasksByProjectId } = useProjects();

  const selectedProj = getProjectById(selectedProjectId) || projectAnalytics.projectBreakdown[0] || {};
  const activeProjectId = selectedProj.id || 'PRJ-001';

  const phases = getPhasesByProjectId(activeProjectId);
  const milestones = getMilestonesByProjectId(activeProjectId);
  const tasks = getTasksByProjectId(activeProjectId);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
          <FolderKanban className="w-4 h-4 text-amber-500" />
          <span>Detailed Project Analytics</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Project & Schedule Performance: {selectedProj.name || 'Sunrise Heights'}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Detailed phase completion, task matrix variance, milestone tracking and project timeline health.
        </p>
      </div>

      <AnalyticsFilterBar />

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsMetricCard
          title="Planned Progress"
          value={`${selectedProj.plannedProgress || projectAnalytics.avgPlannedProgress}%`}
          subtext="Baseline schedule target"
          icon={Calendar}
        />
        <AnalyticsMetricCard
          title="Actual Progress"
          value={`${selectedProj.actualProgress || projectAnalytics.avgActualProgress}%`}
          variance={selectedProj.scheduleVariance || projectAnalytics.scheduleVariancePct}
          varianceSuffix="%"
          subtext="Actual site completion"
          icon={Clock}
        />
        <AnalyticsMetricCard
          title="Project Budget"
          value={`₹${((selectedProj.budget || projectAnalytics.totalBudget) / 100000).toFixed(1)}L`}
          subtext={`Spent: ₹${((selectedProj.spent || projectAnalytics.totalSpent) / 100000).toFixed(1)}L`}
          icon={Layers}
        />
        <AnalyticsMetricCard
          title="Milestone Health"
          value={`${milestones.filter((m) => m.status === 'Completed').length} / ${milestones.length}`}
          subtext="Completed milestones"
          status={projectAnalytics.milestonesAtRisk > 0 ? `${projectAnalytics.milestonesAtRisk} At Risk` : 'All On Track'}
          statusColor={projectAnalytics.milestonesAtRisk > 0 ? 'amber' : 'emerald'}
          icon={CheckCircle2}
        />
      </div>

      {/* Project Hierarchy: Phases & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Construction Phase Progress */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Construction Phase Breakdown</h3>
            <span className="text-xs text-slate-500 font-mono">{phases.length} Phases</span>
          </div>

          <div className="space-y-4">
            {phases.map((ph) => {
              const varVal = (ph.actualProgress || 0) - (ph.plannedProgress || 0);
              return (
                <div key={ph.id} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-slate-900">{ph.name}</span>
                    <VarianceBadge value={varVal} suffix="%" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                    <span>Planned: {ph.plannedProgress}%</span>
                    <span className="font-bold text-slate-900">Actual: {ph.actualProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${varVal < 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${ph.actualProgress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Schedule Matrix */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Key Construction Milestones</h3>
            <span className="text-xs text-slate-500 font-mono">{milestones.length} Milestones</span>
          </div>

          <div className="space-y-3">
            {milestones.map((m) => (
              <div key={m.id} className="flex items-start justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{m.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{m.description}</p>
                  <span className="text-[10px] font-mono text-slate-400">Target Date: {m.targetDate || m.date || 'TBD'}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    m.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : m.status === 'In Progress'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProjectPerformanceTable projects={projectAnalytics.projectBreakdown} />
    </div>
  );
};
