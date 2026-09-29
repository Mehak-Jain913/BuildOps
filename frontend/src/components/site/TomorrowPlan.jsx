import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { Sun, Users, PackageCheck, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TomorrowPlan = ({ plans = [] }) => {
  const navigate = useNavigate();

  if (!plans || plans.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-400" />
          Tomorrow Site Work Plan & Resource Readiness
        </h3>
        <span className="text-xs font-mono text-slate-400">Target Shift: Tomorrow Morning</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => {
          const isReady = plan.overallReadiness === 'Ready';

          return (
            <Card
              key={plan.id}
              className={`p-5 space-y-4 ${
                isReady ? 'bg-slate-900 border-slate-800' : 'bg-slate-900 border-amber-500/40'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-white text-sm">{plan.taskName}</h4>
                  <span className="text-xs text-slate-400 font-mono">
                    {plan.projectName} • {plan.blockName} ({plan.levelName})
                  </span>
                </div>
                <Badge variant={isReady ? 'emerald' : 'amber'} size="sm">
                  {plan.overallReadiness}
                </Badge>
              </div>

              {/* Readiness Meters */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Labour Readiness</span>
                    <span className="text-emerald-400 font-bold">{plan.labourReadiness}</span>
                  </div>
                  <span className="text-slate-300 text-[11px] block font-mono">
                    {plan.availableWorkforce} / {plan.requiredWorkforce} workers
                  </span>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Material Readiness</span>
                    <span className="text-amber-400 font-bold">{plan.materialReadiness}</span>
                  </div>
                  <span className="text-slate-300 text-[11px] block font-mono line-clamp-1">
                    {plan.requiredMaterial}
                  </span>
                </div>
              </div>

              {/* Open Dependency */}
              {plan.openDependency && plan.openDependency !== 'None' ? (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Dependency: {plan.openDependency}</span>
                  </span>
                  <Button variant="ghost" size="xs" onClick={() => navigate('/procurement/orders')} className="text-rose-300">
                    Fix →
                  </Button>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>All site & material dependencies cleared for tomorrow start.</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
