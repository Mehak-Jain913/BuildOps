import React from 'react';
import { usePredictions } from '../../hooks/usePredictions';
import { PredictionDetailCard } from '../../components/predictions/PredictionDetailCard';
import { Truck, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProcurementDelayPage = () => {
  const { predictProcurementDelay } = usePredictions();

  const delayedPOs = predictProcurementDelay.filter((p) => p.delayDays > 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 uppercase tracking-wider mb-1">
          <Truck className="w-4 h-4 text-amber-500" />
          <span>Vendor Lead Time & Dispatch Intelligence • Phase 9</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Procurement Delay Prediction
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Forecast PO dispatch and gate delivery delays by cross-referencing supplier On-Time In-Full (OTIF) historical performance against active PO status.
        </p>
      </div>

      {/* PO Delivery Delay Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">
              Purchase Order Delay Risk Matrix ({predictProcurementDelay.length} Active Orders)
            </h3>
          </div>
          <Link
            to="/procurement/deliveries"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:underline"
          >
            <span>View All Active Deliveries</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="p-3">PO Number</th>
                <th className="p-3">Supplier Name</th>
                <th className="p-3">Material Specs</th>
                <th className="p-3">Target Delivery Date</th>
                <th className="p-3">Supplier OTIF Score</th>
                <th className="p-3">Forecasted Lead Delay</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3">Recommended Site Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {predictProcurementDelay.map((po) => (
                <tr key={po.predictionId} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold font-mono text-slate-900">
                    {po.poNumber}
                  </td>
                  <td className="p-3 font-semibold text-slate-800">
                    {po.supplierName}
                  </td>
                  <td className="p-3 text-slate-700">
                    {po.materialName}
                  </td>
                  <td className="p-3 font-mono font-semibold text-slate-800">
                    {po.expectedDelivery}
                  </td>
                  <td className="p-3 font-bold">
                    <span
                      className={
                        po.otifRating >= 85
                          ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200'
                          : 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200'
                      }
                    >
                      {po.otifRating}% OTIF
                    </span>
                  </td>
                  <td className="p-3 font-bold font-mono">
                    <span className={po.delayDays > 0 ? 'text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200' : 'text-slate-700'}>
                      {po.delayDays > 0 ? `+${po.delayDays} Days` : 'On Schedule'}
                    </span>
                  </td>
                  <td className="p-3 font-bold uppercase text-[10px]">
                    <span
                      className={
                        po.severity === 'CRITICAL'
                          ? 'bg-red-500 text-white px-2 py-0.5 rounded font-black border border-red-600'
                          : po.severity === 'HIGH'
                          ? 'bg-orange-500 text-white px-2 py-0.5 rounded font-black border border-orange-600'
                          : po.severity === 'MEDIUM'
                          ? 'bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black border border-amber-600'
                          : 'bg-emerald-500 text-white px-2 py-0.5 rounded font-black border border-emerald-600'
                      }
                    >
                      {po.severity}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700 max-w-xs leading-tight">
                    {po.recommendedAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Featured Delay Cards */}
      {delayedPOs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-black text-slate-900">
            Elevated PO Delay Evidence Cards
          </h3>
          {delayedPOs.map((item) => (
            <PredictionDetailCard key={item.predictionId} prediction={item} />
          ))}
        </div>
      )}
    </div>
  );
};
