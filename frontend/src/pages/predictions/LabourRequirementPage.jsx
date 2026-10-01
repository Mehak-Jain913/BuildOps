import React from 'react';
import { usePredictions } from '../../hooks/usePredictions';
import { PredictionDetailCard } from '../../components/predictions/PredictionDetailCard';
import { Users, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LabourRequirementPage = () => {
  const { predictLabourRequirement } = usePredictions();

  const tradeGaps = predictLabourRequirement.filter((l) => l.gap < 0);
  const balancedTrades = predictLabourRequirement.filter((l) => l.gap >= 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 uppercase tracking-wider mb-1">
          <Users className="w-4 h-4 text-amber-500" />
          <span>Workforce Capacity Forecasting • Phase 9</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Labour Requirement Prediction
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Forecast upcoming trade workforce requirements against active site gang attendance to identify trade shortages before critical phase milestones.
        </p>
      </div>

      {/* Trade Requirements Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">
              Trade Workforce Matrix ({predictLabourRequirement.length} Trades Analyzed)
            </h3>
          </div>
          <Link
            to="/labour/allocation"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:underline"
          >
            <span>Manage Shift Allocations</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="p-3">Trade Role</th>
                <th className="p-3">Required Workforce</th>
                <th className="p-3">Available Assigned</th>
                <th className="p-3">Workforce Gap</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Recommended Site Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {predictLabourRequirement.map((item) => (
                <tr key={item.predictionId} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{item.trade}</span>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-800">
                    {item.required} Workers
                  </td>
                  <td className="p-3 font-mono font-semibold text-blue-700">
                    {item.available} Assigned
                  </td>
                  <td className="p-3 font-bold font-mono">
                    <span
                      className={
                        item.gap < 0
                          ? 'text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200'
                          : 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200'
                      }
                    >
                      {item.gap > 0 ? `+${item.gap}` : item.gap} Workers
                    </span>
                  </td>
                  <td className="p-3 font-bold uppercase text-[10px]">
                    <span
                      className={
                        item.severity === 'CRITICAL'
                          ? 'bg-red-500 text-white px-2 py-0.5 rounded font-black border border-red-600'
                          : item.severity === 'HIGH'
                          ? 'bg-orange-500 text-white px-2 py-0.5 rounded font-black border border-orange-600'
                          : item.severity === 'MEDIUM'
                          ? 'bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black border border-amber-600'
                          : 'bg-emerald-500 text-white px-2 py-0.5 rounded font-black border border-emerald-600'
                      }
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-emerald-700 uppercase text-[10px]">
                    {item.confidence}
                  </td>
                  <td className="p-3 text-slate-700 max-w-xs leading-tight">
                    {item.recommendedAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Featured Deficit Detail Cards */}
      {tradeGaps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>Priority Trade Deficit Explanations</span>
          </h3>
          {tradeGaps.map((item) => (
            <PredictionDetailCard key={item.predictionId} prediction={item} />
          ))}
        </div>
      )}
    </div>
  );
};
