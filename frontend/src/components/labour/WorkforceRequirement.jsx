import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Users, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const WorkforceRequirement = () => {
  const tradeData = [
    { trade: 'Masons', required: 35, available: 32, shortage: 3, percentage: 91 },
    { trade: 'Helpers / Labourers', required: 45, available: 41, shortage: 4, percentage: 91 },
    { trade: 'Electricians', required: 12, available: 12, shortage: 0, percentage: 100 },
    { trade: 'Plumbers', required: 10, available: 8, shortage: 2, percentage: 80 },
    { trade: 'Equipment Operators', required: 10, available: 10, shortage: 0, percentage: 100 },
  ];

  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Trade Requirement vs Availability</h3>
              <p className="text-xs text-slate-500 font-normal">
                Exposing trade shortages and workforce capacity bottlenecks
              </p>
            </div>
          </div>
          <Badge variant="amber" size="sm">
            9 Trade Shortages
          </Badge>
        </div>
      }
    >
      <div className="space-y-3">
        {tradeData.map((item, idx) => {
          const isShortage = item.shortage > 0;

          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{item.trade}</span>
                  <Badge variant={isShortage ? 'warning' : 'success'} size="sm">
                    {isShortage ? `-${item.shortage} Shortage` : '100% Available'}
                  </Badge>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-slate-900">{item.available}</span>
                  <span className="text-slate-500"> / {item.required} Workers</span>
                </div>
              </div>

              <ProgressBar
                value={item.percentage}
                variant={isShortage ? 'amber' : 'emerald'}
                size="md"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span>Required Capacity: {item.required} crew</span>
                {isShortage ? (
                  <span className="text-amber-700 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Shortage of {item.shortage} workers
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Full trade capacity ready
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
