import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePredictions } from '../../hooks/usePredictions';
import { useProjects } from '../../hooks/useProjects';
import { PredictionCard } from '../../components/predictions/PredictionCard';
import {
  Brain,
  Sparkles,
  Package,
  Users,
  Calendar,
  Truck,
  DollarSign,
  ShieldAlert,
  Clock,
  ArrowRight,
  Filter,
  Layers,
  History,
  FileCheck2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const PredictionsPage = () => {
  const {
    selectedProjectId,
    setSelectedProjectId,
    predictMaterialShortage,
    predictLabourRequirement,
    predictScheduleDelay,
    predictProcurementDelay,
    forecastProjectCost,
    forecastTomorrowReadiness,
    predictions,
  } = usePredictions();

  const { projects = [] } = useProjects();
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Calculate top KPI numbers
  const materialShortageCount = predictMaterialShortage.length;
  const labourGapCount = predictLabourRequirement.filter((l) => l.gap < 0).length;
  const scheduleDelayRisk = predictScheduleDelay.severity;
  const procurementDelayCount = predictProcurementDelay.filter((p) => p.delayDays > 0).length;
  const costStatus = forecastProjectCost.costRiskStatus;
  const readinessChange = forecastTomorrowReadiness.change;

  // Timeline buckets
  const timelineBuckets = [
    {
      horizon: 'TODAY',
      label: 'Today (Baseline)',
      predictions: [
        {
          id: 'TL-TODAY-01',
          title: `Current Site Readiness: ${forecastTomorrowReadiness.currentReadiness}%`,
          category: 'Readiness Baseline',
          status: 'Active',
          color: 'border-blue-500 bg-blue-50 text-blue-900',
        },
      ],
    },
    {
      horizon: 'TOMORROW',
      label: 'Tomorrow Forecast',
      predictions: [
        {
          id: 'TL-TOM-01',
          title: `Readiness ${forecastTomorrowReadiness.forecastReadiness}% (${readinessChange >= 0 ? '+' : ''}${readinessChange}%)`,
          category: 'Readiness Forecast',
          status: forecastTomorrowReadiness.severity,
          color: forecastTomorrowReadiness.severity === 'CRITICAL' ? 'border-red-500 bg-red-50 text-red-900' : 'border-amber-500 bg-amber-50 text-amber-900',
        },
        ...(predictMaterialShortage.filter((m) => m.daysToStockout <= 1).map((m) => ({
          id: `TL-TOM-${m.materialId}`,
          title: `Imminent Stockout: ${m.materialName}`,
          category: 'Material Stockout',
          status: 'CRITICAL',
          color: 'border-red-500 bg-red-50 text-red-900',
        }))),
      ],
    },
    {
      horizon: 'NEXT 7 DAYS',
      label: 'Next 7 Days',
      predictions: [
        ...(predictMaterialShortage.filter((m) => m.daysToStockout > 1 && m.daysToStockout <= 7).map((m) => ({
          id: `TL-7D-${m.materialId}`,
          title: `Material Shortage: ${m.materialName} (${m.daysToStockout} days left)`,
          category: 'Material Shortage',
          status: m.severity,
          color: 'border-orange-500 bg-orange-50 text-orange-900',
        }))),
        ...(predictLabourRequirement.filter((l) => l.gap < 0).map((l) => ({
          id: `TL-7D-${l.trade}`,
          title: `Labour Deficit: ${Math.abs(l.gap)} ${l.trade}(s)`,
          category: 'Workforce Gap',
          status: l.severity,
          color: 'border-amber-500 bg-amber-50 text-amber-900',
        }))),
        ...(predictProcurementDelay.filter((p) => p.delayDays > 0).map((p) => ({
          id: `TL-7D-${p.poNumber}`,
          title: `Vendor Delivery Delay: PO ${p.poNumber}`,
          category: 'Procurement Delay',
          status: p.severity,
          color: 'border-amber-500 bg-amber-50 text-amber-900',
        }))),
      ],
    },
    {
      horizon: 'NEXT 14 DAYS',
      label: 'Next 14 Days',
      predictions: [
        {
          id: 'TL-14D-SCH',
          title: predictScheduleDelay.title,
          category: 'Schedule Delay',
          status: predictScheduleDelay.severity,
          color: predictScheduleDelay.severity === 'CRITICAL' ? 'border-red-500 bg-red-50 text-red-900' : 'border-purple-50 bg-purple-50 text-purple-900',
        },
      ],
    },
    {
      horizon: 'PROJECT COMPLETION',
      label: 'Project Completion',
      predictions: [
        {
          id: 'TL-COMP-COST',
          title: `Cost Forecast: ${forecastProjectCost.costRiskStatus}`,
          category: 'EAC Cost Forecast',
          status: forecastProjectCost.severity,
          color: forecastProjectCost.severity === 'CRITICAL' ? 'border-red-500 bg-red-50 text-red-900' : 'border-emerald-50 bg-emerald-50 text-emerald-900',
        },
      ],
    },
  ];

  // Category Filter
  const filteredPredictions = activeCategory === 'ALL'
    ? predictions
    : predictions.filter((p) => p.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1.5">
            <Brain className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Predictive Construction Intelligence • Phase 9</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Predictive Command Center
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Forward-looking insights for materials, workforce, schedule, procurement, and cost derived deterministically from operational site logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/predictions/model-readiness"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 text-amber-400 hover:bg-slate-700 text-xs font-bold border border-slate-700 transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>Model Readiness</span>
          </Link>
          <Link
            to="/predictions/history"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold border border-slate-700 transition-colors"
          >
            <History className="w-4 h-4" />
            <span>Prediction Snapshots</span>
          </Link>
        </div>
      </div>

      {/* Project Selector & Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Project Context:</span>
          <select
            value={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Construction Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Category Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { key: 'ALL', label: 'All Predictions' },
            { key: 'material', label: 'Materials' },
            { key: 'labour', label: 'Labour' },
            { key: 'schedule', label: 'Schedule' },
            { key: 'procurement', label: 'Procurement' },
            { key: 'cost', label: 'Cost' },
            { key: 'readiness', label: 'Readiness' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCategory === cat.key
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link
          to="/predictions/material-shortage"
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <Package className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">Materials</span>
          </div>
          <div className="text-xl font-black text-slate-900">{materialShortageCount}</div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">
            {materialShortageCount > 0 ? `${materialShortageCount} Shortage Risk(s)` : 'Stock Levels Healthy'}
          </div>
        </Link>

        <Link
          to="/predictions/labour-requirement"
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <Users className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">Labour Gaps</span>
          </div>
          <div className="text-xl font-black text-slate-900">{labourGapCount}</div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">
            {labourGapCount > 0 ? `${labourGapCount} Trade Deficits` : 'Trades Fully Staffed'}
          </div>
        </Link>

        <Link
          to="/predictions/schedule-delay"
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <Calendar className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">Schedule</span>
          </div>
          <div className="text-lg font-black text-slate-900 uppercase">{scheduleDelayRisk}</div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">
            Potential Delay Risk
          </div>
        </Link>

        <Link
          to="/predictions/procurement-delay"
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <Truck className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">Procurement</span>
          </div>
          <div className="text-xl font-black text-slate-900">{procurementDelayCount}</div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">
            {procurementDelayCount > 0 ? `${procurementDelayCount} PO Delays` : 'Deliveries On Schedule'}
          </div>
        </Link>

        <Link
          to="/predictions/cost-forecast"
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <DollarSign className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">Cost (EAC)</span>
          </div>
          <div className="text-sm font-black text-slate-900 truncate">{costStatus}</div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">
            Baseline EAC Forecast
          </div>
        </Link>

        <Link
          to="/predictions/readiness"
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">Tomorrow</span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {forecastTomorrowReadiness.forecastReadiness}%
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">
            Readiness ({readinessChange >= 0 ? '+' : ''}{readinessChange}%)
          </div>
        </Link>
      </div>

      {/* VISUAL PREDICTION TIMELINE */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="font-black text-base tracking-tight text-white">
              Predictive Operational Timeline
            </h2>
          </div>
          <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded">
            Horizon Map: Today ➔ Project Completion
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {timelineBuckets.map((bucket) => (
            <div
              key={bucket.horizon}
              className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest font-mono block mb-2">
                  {bucket.horizon}
                </span>
                <div className="space-y-2">
                  {bucket.predictions.length > 0 ? (
                    bucket.predictions.map((p) => (
                      <div
                        key={p.id}
                        className={`p-2 rounded-lg border text-xs font-semibold ${p.color}`}
                      >
                        <span className="text-[9px] font-bold uppercase tracking-wider block font-mono opacity-80">
                          {p.category}
                        </span>
                        {p.title}
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] text-slate-500 italic py-2">
                      No critical signals for this horizon.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PREDICTION CARDS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Brain className="w-5 h-5 text-amber-500" />
            <span>Forward-Looking Intelligence Cards</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            Showing {filteredPredictions.length} prediction signal(s)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPredictions.map((pred) => (
            <PredictionCard key={pred.predictionId} prediction={pred} />
          ))}
        </div>
      </div>

      {/* SUBPAGE NAVIGATION TILES */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
        <h3 className="font-extrabold text-slate-900 text-sm mb-3 uppercase tracking-wider font-mono">
          Explore Key Prediction Domains
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs font-semibold">
          {[
            { title: 'Material Demand', path: '/predictions/material-demand', icon: Package },
            { title: 'Material Shortage', path: '/predictions/material-shortage', icon: AlertTriangle },
            { title: 'Labour Requirements', path: '/predictions/labour-requirement', icon: Users },
            { title: 'Schedule Delay Risk', path: '/predictions/schedule-delay', icon: Calendar },
            { title: 'Procurement Delays', path: '/predictions/procurement-delay', icon: Truck },
            { title: 'Cost Forecast', path: '/predictions/cost-forecast', icon: DollarSign },
            { title: 'Tomorrow Readiness', path: '/predictions/readiness', icon: Sparkles },
            { title: 'Model Readiness', path: '/predictions/model-readiness', icon: Layers },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="p-3 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-slate-800 hover:text-amber-600 transition-all text-center flex flex-col items-center gap-2 group shadow-xs"
              >
                <Icon className="w-5 h-5 text-slate-600 group-hover:text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="leading-tight">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
