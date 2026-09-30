import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { AnalyticsMetricCard } from '../../components/analytics/AnalyticsMetricCard';
import { AnalyticsDrilldownLink } from '../../components/analytics/AnalyticsDrilldownLink';
import { ShoppingBag, Truck, CheckCircle2, Clock, AlertTriangle, FileText, Star } from 'lucide-react';

export const ProcurementAnalyticsPage = () => {
  const { procurementAnalytics } = useAnalytics();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
          <ShoppingBag className="w-4 h-4 text-emerald-500" />
          <span>Procurement & Logistics Intelligence</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Procurement Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Analyzes Purchase Requests, Purchase Orders, Deliveries, GRNs, and Supplier performance.
        </p>
      </div>

      <AnalyticsFilterBar />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsMetricCard
          title="PR Approval Rate"
          value={`${procurementAnalytics.prApprovalRatePct}%`}
          subtext={`${procurementAnalytics.approvedPRs} / ${procurementAnalytics.totalPRs} PRs approved`}
          icon={FileText}
        />
        <AnalyticsMetricCard
          title="PO Conversion Rate"
          value={`${procurementAnalytics.poConversionRatePct}%`}
          subtext={`${procurementAnalytics.totalPOs} total issued POs`}
          icon={ShoppingBag}
        />
        <AnalyticsMetricCard
          title="On-Time Delivery Rate"
          value={`${procurementAnalytics.onTimeDeliveryRatePct}%`}
          subtext={`${procurementAnalytics.deliveredCount} delivered / ${procurementAnalytics.totalDeliveries} total`}
          icon={Truck}
        />
        <AnalyticsMetricCard
          title="Delayed Deliveries"
          value={procurementAnalytics.delayedCount}
          subtext="Shipments past expected date"
          status={procurementAnalytics.delayedCount === 0 ? 'On Time' : 'Shipment Alert'}
          statusColor={procurementAnalytics.delayedCount === 0 ? 'emerald' : 'red'}
          icon={AlertTriangle}
        />
      </div>

      {/* Supplier Delivery Performance Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">Supplier Performance & Logistics Analytics</h3>
          </div>
          <AnalyticsDrilldownLink to="/suppliers" label="Supplier Directory" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Supplier Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Quality Rating</th>
                <th className="py-3 px-4 text-center">Total Orders</th>
                <th className="py-3 px-4 text-center">On-Time Delivery %</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {procurementAnalytics.supplierPerformance.map((sup) => (
                <tr key={sup.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{sup.name}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{sup.category}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 font-bold font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {sup.rating}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">{sup.totalOrders}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">{sup.onTimePct}%</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        sup.status === 'High Performing'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : sup.status === 'Satisfactory'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-red-50 text-red-800 border-red-200'
                      }`}
                    >
                      {sup.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <AnalyticsDrilldownLink to={`/suppliers/${sup.id}`} label="View Supplier" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
