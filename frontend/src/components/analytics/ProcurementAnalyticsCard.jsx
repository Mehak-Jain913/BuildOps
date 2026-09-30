import React from 'react';
import { ShoppingBag, Truck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { AnalyticsDrilldownLink } from './AnalyticsDrilldownLink';

export const ProcurementAnalyticsCard = ({ procurementData }) => {
  const {
    prApprovalRatePct = 100,
    poConversionRatePct = 100,
    onTimeDeliveryRatePct = 90,
    delayedCount = 0,
    totalPOs = 0,
    poTotalValue = 0,
  } = procurementData || {};

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Procurement Fulfillment</h3>
              <p className="text-[11px] text-slate-500">Orders & supplier lead time</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
            {onTimeDeliveryRatePct}% On-Time
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Issued POs</span>
            <div className="text-base font-black text-slate-900 font-mono">
              {totalPOs} <span className="text-xs font-normal text-slate-400">(₹{(poTotalValue / 100000).toFixed(1)}L)</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">PR Approval Rate</span>
            <div className="text-base font-black text-slate-900 font-mono">
              {prApprovalRatePct}%
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Truck className="w-3.5 h-3.5 text-emerald-500" />
              PO Conversion Rate:
            </span>
            <span className="font-bold text-slate-900">{poConversionRatePct}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <AlertTriangle className={`w-3.5 h-3.5 ${delayedCount > 0 ? 'text-red-500' : 'text-slate-400'}`} />
              Delayed Shipments:
            </span>
            <span className={`font-bold ${delayedCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              {delayedCount} orders
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Derived from Procurement context</span>
        <AnalyticsDrilldownLink to="/procurement/deliveries" label="Procurement Analytics" />
      </div>
    </div>
  );
};
