import React from 'react';
import { useProcurement } from '../../hooks/useProcurement';
import { MetricCard } from '../../components/ui/MetricCard';
import { DeliveryTable } from '../../components/procurement/DeliveryTable';
import { Truck, Clock, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';

export const DeliveriesPage = () => {
  const { deliveries } = useProcurement();

  const totalDeliveries = deliveries.length;
  const inTransitCount = deliveries.filter((d) => d.status === 'In Transit' || d.status === 'Dispatched').length;
  const deliveredCount = deliveries.filter((d) => d.status === 'Delivered').length;
  const delayedCount = deliveries.filter((d) => d.status === 'Delayed').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-amber-400" />
            Material Site Deliveries & Transit Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time delivery progress, partial offloading meters, expected vs actual schedule tracking, and delay alerts.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Total Deliveries"
          value={totalDeliveries}
          icon={Truck}
          subtitle="Tracked Dispatches"
        />
        <MetricCard
          title="In Transit / Dispatched"
          value={inTransitCount}
          icon={Clock}
          badgeText="En Route"
          badgeVariant="info"
        />
        <MetricCard
          title="Offloaded & Delivered"
          value={deliveredCount}
          icon={CheckCircle2}
          badgeText="Site Received"
          badgeVariant="emerald"
        />
        <MetricCard
          title="Delayed Deliveries"
          value={delayedCount}
          icon={AlertTriangle}
          badgeText={delayedCount > 0 ? "Action Required" : "Zero Delays"}
          badgeVariant={delayedCount > 0 ? "danger" : "emerald"}
        />
      </div>

      {/* Delivery Table */}
      <DeliveryTable deliveries={deliveries} />
    </div>
  );
};
