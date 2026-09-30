import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { AnalyticsMetricCard } from '../../components/analytics/AnalyticsMetricCard';
import { VarianceBadge } from '../../components/analytics/VarianceBadge';
import { AnalyticsDrilldownLink } from '../../components/analytics/AnalyticsDrilldownLink';
import { Package, AlertTriangle, Trash2, Layers, DollarSign } from 'lucide-react';

export const MaterialAnalyticsPage = () => {
  const { materialAnalytics } = useAnalytics();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
          <Package className="w-4 h-4 text-amber-500" />
          <span>Inventory & Consumption Analytics</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Material Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Analyzes data already collected by Materials (Planned vs Actual Consumption, Stock Readiness, Wastage Impact).
        </p>
      </div>

      <AnalyticsFilterBar />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsMetricCard
          title="Total Inventory Value"
          value={`₹${(materialAnalytics.totalInvValue / 100000).toFixed(1)}L`}
          subtext={`${materialAnalytics.totalInvItems} inventory material items`}
          icon={DollarSign}
        />
        <AnalyticsMetricCard
          title="Consumption Variance"
          value={`${materialAnalytics.materialConsumptionVariancePct > 0 ? '+' : ''}${materialAnalytics.materialConsumptionVariancePct}%`}
          variance={materialAnalytics.materialConsumptionVariancePct}
          varianceSuffix="%"
          reverseVarianceColor={true}
          subtext="Actual vs Planned consumption"
          icon={Package}
        />
        <AnalyticsMetricCard
          title="Stock Readiness"
          value={`${materialAnalytics.stockReadinessPct}%`}
          subtext={`${materialAnalytics.lowStockCount} items low stock`}
          status={materialAnalytics.lowStockCount === 0 ? 'Optimal' : 'Low Stock Alert'}
          statusColor={materialAnalytics.lowStockCount === 0 ? 'emerald' : 'amber'}
          icon={Layers}
        />
        <AnalyticsMetricCard
          title="Total Wastage Cost"
          value={`₹${materialAnalytics.totalWastageCost.toLocaleString('en-IN')}`}
          subtext={`${materialAnalytics.totalWastageQty} units lost/damaged`}
          icon={Trash2}
        />
      </div>

      {/* Consumption Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">Daily Material Consumption Variance</h3>
          </div>
          <AnalyticsDrilldownLink to="/materials/consumption" label="Manage Consumption" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date & Material</th>
                <th className="py-3 px-4">Site Location / Task</th>
                <th className="py-3 px-4 text-center">Planned Qty</th>
                <th className="py-3 px-4 text-center">Actual Qty</th>
                <th className="py-3 px-4 text-center">Consumption Variance</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {materialAnalytics.consumptionBreakdown.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.materialName}</div>
                    <div className="text-[11px] font-mono text-slate-400">{item.date}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-700 font-medium">{item.blockName} • {item.levelName}</div>
                    <div className="text-[11px] text-slate-400">{item.taskName}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-600">
                    {item.plannedQuantity} {item.unit}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                    {item.actualQuantity} {item.unit}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <VarianceBadge value={item.variancePct} suffix="%" reverseColor={true} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.status === 'Over-consumed'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : item.status === 'Under-consumed'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 font-medium">
                    {item.recordedBy}
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
