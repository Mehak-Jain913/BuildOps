import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Sun, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const TomorrowReadinessLabour = ({ onAction }) => {
  const items = [
    { trade: 'Masons', required: 35, available: 32, shortage: 3, isReady: false },
    { trade: 'Helpers / Labourers', required: 45, available: 41, shortage: 4, isReady: false },
    { trade: 'Plumbers', required: 10, available: 8, shortage: 2, isReady: false },
    { trade: 'Electricians', required: 12, available: 12, shortage: 0, isReady: true },
    { trade: 'Equipment Operators', required: 10, available: 10, shortage: 0, isReady: true },
  ];

  return (
    <Card
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Tomorrow Workforce Readiness</h3>
              <p className="text-xs text-slate-500 font-normal">
                Will tomorrow's planned site activities have sufficient trade workforce?
              </p>
            </div>
          </div>
          <Badge variant="warning" size="sm">
            87% Ready
          </Badge>
        </div>
      }
      className="border-amber-200/80 bg-gradient-to-b from-amber-50/30 to-white"
    >
      <div className="space-y-4">
        {/* Readiness Score Banner */}
        <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Workforce Readiness Score
            </span>
            <div className="text-xl font-extrabold text-amber-400 mt-0.5">
              Attention Required (87%)
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              103 available vs 118 required (15 worker shortage)
            </span>
          </div>

          <Button variant="secondary" size="sm" onClick={onAction}>
            Resolve Shortage
          </Button>
        </div>

        {/* Trade Breakdown List */}
        <div className="divide-y divide-slate-100">
          {items.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                {item.isReady ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-slate-900">{item.trade}</span>
                  <span className="text-slate-500 text-[11px] ml-2">
                    {item.available} / {item.required} available
                  </span>
                </div>
              </div>

              <Badge variant={item.isReady ? 'success' : 'warning'} size="sm">
                {item.isReady ? 'Ready' : `-${item.shortage} Shortage`}
              </Badge>
            </div>
          ))}
        </div>

        {/* Recommended Action Notice */}
        <div className="p-3 rounded-lg bg-amber-100/70 border border-amber-200/90 text-amber-950 text-xs font-semibold flex items-center justify-between">
          <span>Action: Review workforce allocation for tomorrow's planned activities.</span>
          <ArrowRight className="w-4 h-4 text-amber-700" />
        </div>
      </div>
    </Card>
  );
};
