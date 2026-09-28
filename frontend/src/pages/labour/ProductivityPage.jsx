import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { BarChartContainer } from '../../components/charts/BarChartContainer';
import { useLabour } from '../../hooks/useLabour';
import { TrendingUp, Clock, AlertTriangle, CheckCircle2, Users } from 'lucide-react';

export const ProductivityPage = () => {
  const { productivity } = useLabour();

  // Data for BarChartContainer displaying daily productivity trend
  const chartData = [
    { label: 'Mon', actual: 88, target: 100, unit: '%' },
    { label: 'Tue', actual: 90, target: 100, unit: '%' },
    { label: 'Wed', actual: 92, target: 100, unit: '%' },
    { label: 'Thu', actual: 91, target: 100, unit: '%' },
    { label: 'Fri', actual: 94, target: 100, unit: '%' },
    { label: 'Sat', actual: 93, target: 100, unit: '%' },
  ];

  const topOvertimeTrades = [
    { trade: 'Masons', hours: 18.0, cost: 2700, percentage: 42.3 },
    { trade: 'Helpers', hours: 12.0, cost: 1080, percentage: 28.2 },
    { trade: 'Carpenters', hours: 7.0, cost: 1120, percentage: 16.5 },
    { trade: 'Operators', hours: 5.5, cost: 1475, percentage: 13.0 },
  ];

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
            Workforce Performance Analytics
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Labour Productivity & Overtime Metrics
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Identify trade inefficiency, compare planned vs actual workforce crew sizing, and audit overtime hours.
        </p>
      </div>

      {/* 2. PLANNED VS ACTUAL LABOUR CREW COMPARISON */}
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Task Productivity Velocity</h3>
                <p className="text-xs text-slate-500 font-normal">
                  Planned crew vs actual crew deployment per task segment
                </p>
              </div>
            </div>
            <Badge variant="amber" size="sm">
              92% Avg Velocity
            </Badge>
          </div>
        }
      >
        <div className="space-y-4">
          {productivity.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/40 space-y-2.5 hover:bg-white hover:border-slate-300 transition-all shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.taskName}</h4>
                  <span className="text-xs text-slate-500 font-medium">Output Rate: {item.outputRate}</span>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="text-slate-600">
                    Planned: <strong className="text-slate-800">{item.plannedWorkers} crew</strong>
                  </span>
                  <span className="text-slate-900 font-extrabold">
                    Actual: {item.actualWorkers} crew
                  </span>
                  <Badge variant={item.productivityPercent >= 95 ? 'success' : 'amber'} size="sm">
                    {item.productivityPercent}% Velocity
                  </Badge>
                </div>
              </div>

              <ProgressBar value={item.productivityPercent} variant="amber" size="md" />

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Crew Variance: +{item.variance} workers above planned baseline</span>
                <span className="font-semibold text-slate-800">Status: {item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 3. PRODUCTIVITY TREND CHART & OVERTIME BREAKDOWN (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Productivity Trend Chart */}
        <div className="lg:col-span-2">
          <BarChartContainer
            title="Daily Labour Productivity Trend (%)"
            subtitle="Comparing site daily trade output percentage against 100% target baseline."
            data={chartData}
          />
        </div>

        {/* Right 1-Col: Overtime Breakdown */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">Overtime Summary</h3>
            </div>
          }
          subtitle="Today's overtime hours & trade cost impact."
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Total Overtime Logged Today
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-amber-400">42.5 Hours</span>
                <span className="text-xs text-slate-300 font-bold">18 Workers</span>
              </div>
              <p className="text-xs text-slate-400 border-t border-slate-800 pt-2 mt-1">
                Estimated Overtime Cost: <strong className="text-white font-extrabold">₹6,375</strong>
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Top Overtime Skill Trades
              </h4>
              {topOvertimeTrades.map((t, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{t.trade}</span>
                    <span className="text-[11px] text-slate-400">Est. Cost: ₹{t.cost.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-amber-700 block">{t.hours} hrs</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{t.percentage}% of total OT</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
