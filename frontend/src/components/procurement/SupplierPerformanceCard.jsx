import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Truck, ShieldCheck, Clock, AlertTriangle, Award, CheckCircle2 } from 'lucide-react';

export const SupplierPerformanceCard = ({ supplier }) => {
  if (!supplier) return null;

  const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <Card className="bg-slate-900 border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold font-mono">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">{supplier.name}</h3>
            <span className="text-xs text-slate-400 font-mono">{supplier.supplierCode} • {supplier.category}</span>
          </div>
        </div>
        <Badge variant={supplier.rating >= 4.5 ? 'emerald' : 'amber'} size="md" className="font-mono font-bold">
          ★ {supplier.rating} / 5.0
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            On-Time Delivery
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-mono font-extrabold text-emerald-400">{supplier.reliabilityScore}%</span>
          </div>
          <ProgressBar progress={supplier.reliabilityScore} color="bg-emerald-500" size="xs" className="mt-2" />
        </div>

        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Quality Acceptance
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-mono font-extrabold text-amber-400">{supplier.qualityScore}%</span>
          </div>
          <ProgressBar progress={supplier.qualityScore} color="bg-amber-500" size="xs" className="mt-2" />
        </div>

        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Avg Delivery Time
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-mono font-extrabold text-blue-400">{supplier.averageDeliveryDays}</span>
            <span className="text-xs text-slate-400">days</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-2 font-mono">SLA: &le; 3.0 days</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs pt-1 border-t border-slate-800/60">
        <div>
          <span className="text-slate-400 block">Completed Orders</span>
          <span className="font-mono font-bold text-white text-sm">{supplier.completedOrders} / {supplier.totalOrders}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Delayed Orders</span>
          <span className="font-mono font-bold text-rose-400 text-sm">{supplier.delayedOrders}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Total Procurement</span>
          <span className="font-mono font-bold text-amber-400 text-sm">{formatCurrency(supplier.totalProcurementValue)}</span>
        </div>
      </div>
    </Card>
  );
};
