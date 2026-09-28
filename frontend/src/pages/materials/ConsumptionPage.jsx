import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { BarChartContainer } from '../../components/charts/BarChartContainer';
import { ConsumptionTable } from '../../components/materials/ConsumptionTable';
import { useMaterials } from '../../hooks/useMaterials';
import { PackageMinus, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const ConsumptionPage = () => {
  const { consumption } = useMaterials();

  // Prepare data for BarChartContainer comparing Planned vs Actual consumption
  const chartData = [
    { label: 'Cement (Bags)', actual: 720, target: 650, unit: 'Bags' },
    { label: 'Steel (Tons x10)', actual: 84, target: 78, unit: 'Tons' },
    { label: 'Bricks (k-pcs)', actual: 81, target: 75, unit: 'k-pcs' },
    { label: 'Sand (Tons)', actual: 63, target: 58, unit: 'Tons' },
  ];

  // Aggregate totals
  const totalPlannedBags = consumption.reduce((acc, c) => acc + (c.plannedQuantity || 0), 0);
  const totalActualBags = consumption.reduce((acc, c) => acc + (c.actualQuantity || 0), 0);
  const totalVariance = totalActualBags - totalPlannedBags;
  const variancePct = totalPlannedBags > 0 ? Math.round((totalVariance / totalPlannedBags) * 100 * 10) / 10 : 10.8;

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
            Material Analytics
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Daily Material Consumption
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track material burn rates, Compare planned budget targets vs actual site consumption variance.
        </p>
      </div>

      {/* 2. PLANNED VS ACTUAL SUMMARY BANNER & CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Bar Chart */}
        <div className="lg:col-span-2">
          <BarChartContainer
            title="Planned vs Actual Consumption Variance"
            subtitle="Comparing site material consumption against budgeted baseline allocation."
            data={chartData}
          />
        </div>

        {/* Right 1-Col: Consumption Variance Summary Card */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">Consumption Variance</h3>
            </div>
          }
          subtitle="Overall material burn rate vs baseline plan."
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Cement Consumption Benchmark
                </span>
                <Badge variant="amber" size="sm">
                  +{variancePct}% Variance
                </Badge>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-2xl font-extrabold text-amber-400">720 Bags</span>
                  <span className="text-xs text-slate-400 block">Actual Used</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-300">650 Bags</span>
                  <span className="text-[11px] text-slate-400 block">Planned Target</span>
                </div>
              </div>
            </div>

            {/* Contextual Explanation */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Consumption is above the planned quantity.</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed pl-5">
                Block A slab-casting pour segment consumed +70 bags (+10.8%) above baseline budget over the last 7 days.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. CONSUMPTION TABLE */}
      <ConsumptionTable consumption={consumption} />
    </div>
  );
};
