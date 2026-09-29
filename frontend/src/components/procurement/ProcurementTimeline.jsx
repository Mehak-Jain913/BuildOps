import React from 'react';
import {
  FileText,
  CheckCircle,
  ReceiptText,
  Truck,
  FileCheck2,
  Warehouse,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const ProcurementTimeline = ({ activeStep = 3, className = '' }) => {
  const steps = [
    { number: 1, label: 'Material Requirement', icon: FileText, desc: 'Site Request' },
    { number: 2, label: 'Purchase Request', icon: FileText, desc: 'PR Submitted' },
    { number: 3, label: 'PM Approval', icon: CheckCircle, desc: 'Requisition Approved' },
    { number: 4, label: 'Purchase Order', icon: ReceiptText, desc: 'PO Issued' },
    { number: 5, label: 'Supplier Dispatch', icon: Truck, desc: 'In Transit' },
    { number: 6, label: 'Site Delivery', icon: Truck, desc: 'Offloaded' },
    { number: 7, label: 'GRN Inspection', icon: FileCheck2, desc: 'Quality Check' },
    { number: 8, label: 'Inventory Stock IN', icon: Warehouse, desc: 'Available Stock' },
  ];

  return (
    <div className={cn('bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5', className)}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Warehouse className="w-4 h-4 text-amber-400" />
          Construction Procurement Execution Workflow
        </h4>
        <span className="text-[11px] font-mono text-slate-400">Step {activeStep} of {steps.length}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 relative">
        {steps.map((step) => {
          const Icon = step.icon;
          const isDone = step.number < activeStep;
          const isCurrent = step.number === activeStep;
          const isPending = step.number > activeStep;

          return (
            <div
              key={step.number}
              className={cn(
                'flex flex-col items-center text-center p-2.5 rounded-lg border transition-all relative',
                isDone && 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300',
                isCurrent && 'bg-amber-950/40 border-amber-500/80 text-amber-300 ring-1 ring-amber-500/50 shadow-lg',
                isPending && 'bg-slate-950/40 border-slate-800/60 text-slate-500'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold mb-2 transition-colors',
                  isDone && 'bg-emerald-500 text-slate-950',
                  isCurrent && 'bg-amber-500 text-slate-950 animate-pulse',
                  isPending && 'bg-slate-800 text-slate-400'
                )}
              >
                {isDone ? <CheckCircle className="w-4 h-4 stroke-[2.5]" /> : step.number}
              </div>
              <span className="text-[11px] font-bold leading-tight line-clamp-1">{step.label}</span>
              <span className="text-[9px] text-slate-400 font-mono mt-0.5">{step.desc}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
