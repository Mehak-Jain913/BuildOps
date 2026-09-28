import React from 'react';
import { MilestoneTimeline } from '../../components/projects/MilestoneTimeline';
import { useProjects } from '../../hooks/useProjects';

export const TimelinePage = () => {
  const { milestones } = useProjects();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Project Timelines & Milestones
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track master construction schedules, target handover dates, and contractual milestone checkpoints.
        </p>
      </div>

      <MilestoneTimeline milestones={milestones} />
    </div>
  );
};
