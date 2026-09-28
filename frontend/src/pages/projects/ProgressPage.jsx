import React from 'react';
import { ProjectPhaseProgress } from '../../components/projects/ProjectPhaseProgress';
import { useProjects } from '../../hooks/useProjects';

export const ProgressPage = () => {
  const { phases } = useProjects();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Overall Construction Progress
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed phase-by-phase comparison of planned schedule vs actual site execution variance.
        </p>
      </div>

      <ProjectPhaseProgress phases={phases} />
    </div>
  );
};
