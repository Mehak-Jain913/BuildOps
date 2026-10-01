import React from 'react';
import { usePredictions } from '../../hooks/usePredictions';
import { PredictionDetailCard } from '../../components/predictions/PredictionDetailCard';
import { AlertTriangle, ShieldCheck, Package, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MaterialShortagePage = () => {
  const { predictMaterialShortage } = usePredictions();

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-600 uppercase tracking-wider mb-1">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span>Material Shortage Risk Intelligence • Phase 9</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Material Shortage Prediction
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Identify site materials projected to stock out before upcoming phase execution based on current inventory balances and daily consumption rates.
        </p>
      </div>

      {/* Shortage Risk Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">
              Stockout Risk Matrix ({predictMaterialShortage.length} Items Flagged)
            </h3>
          </div>
          <Link
            to="/materials/inventory"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:underline"
          >
            <span>Manage Site Inventory</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="p-3">Material</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Daily Consumption</th>
                <th className="p-3">7-Day Demand</th>
                <th className="p-3">Stockout Horizon</th>
                <th className="p-3">Shortage Quantity</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {predictMaterialShortage.length > 0 ? (
                predictMaterialShortage.map((item) => (
                  <tr key={item.predictionId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{item.materialName}</div>
                      <span className="text-[10px] font-mono text-slate-400">{item.materialId}</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">
                      {item.currentStock.toLocaleString()} {item.unit}
                    </td>
                    <td className="p-3 font-mono font-semibold text-purple-700">
                      {item.avgDailyConsumption > 0 ? `${item.avgDailyConsumption} ${item.unit}/day` : 'N/A'}
                    </td>
                    <td className="p-3 font-bold text-amber-900 bg-amber-50/40">
                      {item.predictedDemand.toLocaleString()} {item.unit}
                    </td>
                    <td className="p-3 font-bold text-rose-700 font-mono">
                      {item.stockoutHorizon}
                    </td>
                    <td className="p-3 font-bold">
                      <span className={item.value.includes('Shortage') ? 'text-red-600 font-black' : 'text-slate-700'}>
                        {item.value}
                      </span>
                    </td>
                    <td className="p-3 font-bold uppercase text-[10px]">
                      <span
                        className={
                          item.severity === 'CRITICAL'
                            ? 'bg-red-500 text-white px-2 py-0.5 rounded font-black border border-red-600'
                            : 'bg-orange-500 text-white px-2 py-0.5 rounded font-black border border-orange-600'
                        }
                      >
                        {item.severity}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 max-w-xs leading-tight">
                      {item.recommendedAction}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <ShieldCheck className="w-8 h-8 text-emerald-500" />
                      <span className="font-bold text-slate-700">No Imminent Stockout Risks Identified</span>
                      <p className="text-xs text-slate-400 max-w-md">
                        All site material inventory levels currently satisfy projected 7-day and 14-day baseline demand forecasts.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Prediction Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-slate-900">
          Stockout Evidence & Recommended Action Cards
        </h3>
        {predictMaterialShortage.map((item) => (
          <PredictionDetailCard key={item.predictionId} prediction={item} />
        ))}
      </div>
    </div>
  );
};
