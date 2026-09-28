import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Layers, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const ProjectPhaseProgress = ({ phases = [] }) => {
  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Construction Phases</h3>
              <p className="text-xs text-slate-500 font-normal">
                Planned vs actual progress velocity and schedule variance per phase
              </p>
            </div>
          </div>
          <Badge variant="neutral" size="sm">
            {phases.length} Active Phases
          </Badge>
        </div>
      }
    >
      <div className="space-y-4">
        {phases.map((phase) => {
          const isDelayed = phase.variance < 0;
          const isCompleted = phase.actualProgress >= 100 || phase.status === 'Completed';

          return (
            <div
              key={phase.id || phase.name}
              className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/40 space-y-2.5 hover:border-slate-300 hover:bg-white transition-all shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{phase.name}</span>
                  <Badge
                    variant={isCompleted ? 'success' : isDelayed ? 'danger' : 'info'}
                    size="sm"
                  >
                    {phase.status || (isCompleted ? 'Completed' : isDelayed ? 'Delayed' : 'On Schedule')}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="text-slate-500">
                    Planned: <span className="font-bold text-slate-700">{phase.plannedProgress}%</span>
                  </span>
                  <span className="text-slate-900 font-extrabold">
                    Actual: {phase.actualProgress}%
                  </span>
                  <span
                    className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded ${
                      phase.variance < 0
                        ? 'bg-red-100 text-red-800'
                        : phase.variance > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Var: {phase.variance > 0 ? `+${phase.variance}%` : `${phase.variance}%`}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <ProgressBar
                  value={phase.actualProgress}
                  target={phase.plannedProgress}
                  variant={isCompleted ? 'emerald' : isDelayed ? 'amber' : 'emerald'}
                  size="md"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Phase Progress Tracking</span>
                {isDelayed ? (
                  <span className="text-red-600 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Behind schedule by {Math.abs(phase.variance)}%
                  </span>
                ) : (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    On track with master project schedule
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
