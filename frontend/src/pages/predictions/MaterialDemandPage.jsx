import React, { useState } from 'react';
import { usePredictions } from '../../hooks/usePredictions';
import { useMaterials } from '../../hooks/useMaterials';
import { PredictionDetailCard } from '../../components/predictions/PredictionDetailCard';
import { Package, Calculator, Info, Search, Filter, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MaterialDemandPage = () => {
  const { predictMaterialDemand } = usePredictions();
  const { materials = [] } = useMaterials();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const categories = ['ALL', ...new Set(materials.map((m) => m.category).filter(Boolean))];

  const filteredDemand = predictMaterialDemand.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 uppercase tracking-wider mb-1">
          <Package className="w-4 h-4 text-amber-500" />
          <span>Material Demand Forecasting • Phase 9</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Material Demand Prediction
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Baseline material demand forecast derived deterministically from recent site consumption logs and remaining scheduled project work.
        </p>
      </div>

      {/* Baseline Calculation Disclaimer */}
      <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 text-xs flex items-start gap-3 shadow-inner">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-400 uppercase tracking-wider block">
            Transparent Forecasting Methodology:
          </span>
          <p className="text-slate-300 leading-relaxed">
            Demand is forecasted using: <strong className="text-white">Average Daily Consumption × Forecast Horizon (7 or 14 days)</strong>.
            This baseline is derived from actual site issue notes and verified daily consumption logs. No unexplainable ML black boxes.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search material name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-800 outline-none w-full placeholder-slate-400 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-600 uppercase">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'All Material Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Detailed Demand Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4 text-amber-500" />
            <span>Material Demand Matrix ({filteredDemand.length} Materials)</span>
          </h3>
          <Link
            to="/materials/consumption"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700"
          >
            <span>View Historical Consumption Logs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                <th className="p-3">Material Code / Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Actual Stock</th>
                <th className="p-3">Avg Daily Consumption</th>
                <th className="p-3">7-Day Demand</th>
                <th className="p-3">14-Day Demand</th>
                <th className="p-3">Projected Closing Stock (7D)</th>
                <th className="p-3">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredDemand.length > 0 ? (
                filteredDemand.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <span className="text-[10px] font-mono text-slate-400">{item.code}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">
                      {item.currentStock.toLocaleString()} {item.unit}
                    </td>
                    <td className="p-3 font-mono font-semibold text-purple-700">
                      {item.avgDailyConsumption} {item.unit}/day
                    </td>
                    <td className="p-3 font-bold text-amber-900 bg-amber-50/50">
                      {item.demand7Days.toLocaleString()} {item.unit}
                    </td>
                    <td className="p-3 font-bold text-amber-950">
                      {item.demand14Days.toLocaleString()} {item.unit}
                    </td>
                    <td className="p-3 font-semibold">
                      <span
                        className={
                          item.projectedClosingStock < 0
                            ? 'text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200'
                            : 'text-slate-700'
                        }
                      >
                        {item.projectedClosingStock.toLocaleString()} {item.unit}
                      </span>
                    </td>
                    <td className="p-3 font-bold uppercase text-[10px]">
                      <span
                        className={
                          item.confidence === 'HIGH'
                            ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200'
                            : 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200'
                        }
                      >
                        {item.confidence}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400 italic">
                    No matching material demand records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Prediction Detail Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-slate-900">
          Featured Material Forecast Cards
        </h3>
        {filteredDemand.slice(0, 3).map((item) => (
          <PredictionDetailCard key={item.id} prediction={item} />
        ))}
      </div>
    </div>
  );
};
