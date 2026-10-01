import React from 'react';
import { usePredictions } from '../../hooks/usePredictions';
import { History, Sparkles, Layers, Info, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PredictionHistoryPage = () => {
  const { predictions } = usePredictions();

  const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 uppercase tracking-wider mb-1">
          <History className="w-4 h-4 text-amber-500" />
          <span>Model Evaluation & Historical Snapshots • Phase 9</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Prediction History & Snapshots
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Active generated prediction snapshots derived from current operational data. Prepares the frontend architecture for future backend persistence and model drift monitoring.
        </p>
      </div>

      {/* Info Disclaimer */}
      <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 text-xs flex items-start gap-3 shadow-inner">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-400 uppercase tracking-wider block font-mono">
            Model Snapshot Architecture Note:
          </span>
          <p className="text-slate-300 leading-relaxed">
            In Phase 9, prediction snapshots are rendered dynamically from deterministic rule calculations. When Spring Boot persistence and Python ML services are connected in future phases, this table will render stored snapshot records and historical accuracy drift metrics.
          </p>
        </div>
      </div>

      {/* Snapshots Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>Current Active Snapshots ({predictions.length} Generated)</span>
          </h3>
          <span className="text-xs font-mono text-slate-500 font-semibold">
            Snapshot Timestamp: {todayStr} — 09:00 AM
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                <th className="p-3">Snapshot Date</th>
                <th className="p-3">Prediction Domain</th>
                <th className="p-3">Prediction Title</th>
                <th className="p-3">Forecasted Value</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Risk Severity</th>
                <th className="p-3">Model Type</th>
                <th className="p-3">Drill-Down Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {predictions.map((p) => (
                <tr key={p.predictionId} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-semibold text-slate-600">
                    {todayStr}
                  </td>
                  <td className="p-3 font-bold text-slate-900">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-mono">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-900">
                    {p.title}
                  </td>
                  <td className="p-3 font-bold text-amber-900 font-mono">
                    {p.value}
                  </td>
                  <td className="p-3 font-bold uppercase text-[10px]">
                    <span
                      className={
                        p.confidence === 'HIGH'
                          ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200'
                          : 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200'
                      }
                    >
                      {p.confidence}
                    </span>
                  </td>
                  <td className="p-3 font-bold uppercase text-[10px]">
                    <span
                      className={
                        p.severity === 'CRITICAL'
                          ? 'bg-red-500 text-white px-2 py-0.5 rounded font-black'
                          : p.severity === 'HIGH'
                          ? 'bg-orange-500 text-white px-2 py-0.5 rounded font-black'
                          : p.severity === 'MEDIUM'
                          ? 'bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black'
                          : 'bg-emerald-500 text-white px-2 py-0.5 rounded font-black'
                      }
                    >
                      {p.severity}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[10px] text-slate-500">
                    RULE_BASED_BASELINE
                  </td>
                  <td className="p-3">
                    <Link
                      to={p.drilldownUrl || '/predictions'}
                      className="text-amber-600 hover:text-amber-700 font-bold hover:underline"
                    >
                      View Signal ➔
                    </Link>
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
