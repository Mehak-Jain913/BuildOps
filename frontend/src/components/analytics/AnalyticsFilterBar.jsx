import React, { useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useProjects } from '../../hooks/useProjects';
import { Filter, Calendar, RefreshCw, Info, CheckCircle2 } from 'lucide-react';
import { CalculationModal } from './CalculationModal';

export const AnalyticsFilterBar = () => {
  const { selectedProjectId, setSelectedProjectId, selectedDateRange, setSelectedDateRange } = useAnalytics();
  const { projects = [] } = useProjects();
  const [lastUpdated] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCalcModal, setShowCalcModal] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs text-slate-300">
            <Filter className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-400">Project:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Active Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs text-slate-300">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-400">Timeframe:</span>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="This Month" className="bg-slate-900 text-white">This Month</option>
              <option value="Last 30 Days" className="bg-slate-900 text-white">Last 30 Days</option>
              <option value="This Quarter" className="bg-slate-900 text-white">This Quarter</option>
              <option value="Year to Date" className="bg-slate-900 text-white">Year to Date</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => setShowCalcModal(true)}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-colors font-medium"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Calculation Methodology</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Sync: {lastUpdated}</span>
            <button
              onClick={handleRefresh}
              title="Refresh calculated analytics"
              className="p-1 hover:text-white transition-colors rounded hover:bg-slate-800"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {showCalcModal && <CalculationModal onClose={() => setShowCalcModal(false)} />}
    </>
  );
};
