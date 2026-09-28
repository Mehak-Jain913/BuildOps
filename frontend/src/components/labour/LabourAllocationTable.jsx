import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { Layers, Plus, UserCheck, AlertTriangle } from 'lucide-react';

export const LabourAllocationTable = ({
  allocations = [],
  onAssignWorkforce,
  title = 'Workforce Allocation Matrix',
  subtitle = 'Deployments by Project → Block → Floor Level → Task Assignment.',
}) => {
  return (
    <Card
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 font-normal">{subtitle}</p>
            </div>
          </div>

          {onAssignWorkforce && (
            <Button variant="primary" size="sm" leftIcon={Plus} onClick={onAssignWorkforce}>
              Assign Workforce
            </Button>
          )}
        </div>
      }
    >
      {allocations.length === 0 ? (
        <div className="py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No workforce allocations created</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allocations.map((alc) => {
            const shortage = alc.requiredCount - alc.allocatedCount;
            const pct = Math.round((alc.allocatedCount / alc.requiredCount) * 100);

            return (
              <div
                key={alc.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                        {alc.shift} Shift
                      </span>
                      <Badge variant="outline" size="sm">
                        {alc.blockName} • {alc.levelName}
                      </Badge>
                      <Badge variant={shortage > 0 ? 'warning' : 'success'} size="sm">
                        {shortage > 0 ? `${shortage} Shortage` : 'Fully Staffed'}
                      </Badge>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{alc.taskName}</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Project: <strong className="text-slate-700">{alc.projectName}</strong> • Supervisor: <strong className="text-slate-700">{alc.supervisor}</strong>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Trade Crew Deployed
                    </span>
                    <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                      {alc.allocatedCount} / {alc.requiredCount}{' '}
                      <span className="text-xs font-semibold text-amber-600">{alc.trade}s</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar comparing allocated vs required */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-slate-600">{alc.trade} Fulfillment</span>
                    <span className="text-slate-900">{pct}% Staffed</span>
                  </div>
                  <ProgressBar
                    value={pct}
                    variant={pct < 85 ? 'amber' : 'emerald'}
                    size="md"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
