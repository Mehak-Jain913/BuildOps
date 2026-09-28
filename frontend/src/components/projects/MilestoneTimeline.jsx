import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Flag, CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';

export const MilestoneTimeline = ({ milestones = [] }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Completed':
        return {
          icon: CheckCircle2,
          badgeVariant: 'success',
          dotBg: 'bg-emerald-500',
          cardBorder: 'border-emerald-200 bg-emerald-50/20',
          textColor: 'text-emerald-900',
        };
      case 'In Progress':
        return {
          icon: Clock,
          badgeVariant: 'amber',
          dotBg: 'bg-amber-500 animate-pulse',
          cardBorder: 'border-amber-200 bg-amber-50/30',
          textColor: 'text-amber-900',
        };
      default:
        return {
          icon: Calendar,
          badgeVariant: 'neutral',
          dotBg: 'bg-slate-300',
          cardBorder: 'border-slate-200 bg-white',
          textColor: 'text-slate-800',
        };
    }
  };

  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Project Milestones</h3>
              <p className="text-xs text-slate-500 font-normal">
                Key contractual completion targets and site progress checkpoints
              </p>
            </div>
          </div>
          <Badge variant="neutral" size="sm">
            {milestones.length} Targets
          </Badge>
        </div>
      }
    >
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {milestones.map((ms, idx) => {
          const config = getStatusConfig(ms.status);
          const Icon = config.icon;
          const displayDate = ms.date || ms.targetDate || 'TBD';

          return (
            <div key={ms.id || idx} className="relative group">
              {/* Timeline Marker Dot */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-white ${config.dotBg}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Milestone Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${config.cardBorder} hover:shadow-xs`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                  <h4 className={`text-sm font-extrabold ${config.textColor} flex items-center gap-2`}>
                    <span>{ms.name}</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={config.badgeVariant} size="sm">
                      {ms.status}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded border border-slate-200/80">
                      {ms.status === 'Completed' ? `Done: ${displayDate}` : `Target: ${displayDate}`}
                    </span>
                  </div>
                </div>

                {ms.description && (
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">{ms.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
