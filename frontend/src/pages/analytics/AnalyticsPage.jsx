import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { AnalyticsMetricCard } from '../../components/analytics/AnalyticsMetricCard';
import { ProjectPerformanceTable } from '../../components/analytics/ProjectPerformanceTable';
import { MaterialAnalyticsCard } from '../../components/analytics/MaterialAnalyticsCard';
import { LabourAnalyticsCard } from '../../components/analytics/LabourAnalyticsCard';
import { ProcurementAnalyticsCard } from '../../components/analytics/ProcurementAnalyticsCard';
import { SiteAnalyticsCard } from '../../components/analytics/SiteAnalyticsCard';
import { CostAnalyticsCard } from '../../components/analytics/CostAnalyticsCard';
import { ReadinessBreakdown } from '../../components/analytics/ReadinessBreakdown';
import { LineChartContainer } from '../../components/charts/LineChartContainer';
import { BarChartContainer } from '../../components/charts/BarChartContainer';
import {
  BarChart3,
  TrendingUp,
  Clock,
  DollarSign,
  Package,
  Users,
  ShoppingBag,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const AnalyticsPage = () => {
  const {
    projectAnalytics,
    materialAnalytics,
    labourAnalytics,
    procurementAnalytics,
    siteAnalytics,
    costAnalytics,
    readinessIntelligence,
  } = useAnalytics();

  // Reusable bar data for progress chart
  const plannedVsActualChartData = (projectAnalytics.projectBreakdown || []).map((p) => ({
    label: p.code,
    actual: p.actualProgress,
    target: p.plannedProgress,
  }));

  // Reusable line data for trend
  const scheduleTrendData = [
    { label: 'Week 1', value: 20 },
    { label: 'Week 2', value: 38 },
    { label: 'Week 3', value: 52 },
    { label: 'Week 4', value: 64 },
    { label: 'Week 5', value: 71 },
    { label: 'Week 6', value: projectAnalytics.avgActualProgress || 68 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4 text-amber-500" />
          <span>Derived Operational Intelligence</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Construction Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Project performance, resource efficiency and operational trends derived from active site contexts.
        </p>
      </div>

      {/* Filter Bar */}
      <AnalyticsFilterBar />

      {/* EXECUTIVE KPI SECTION (8 Construction-Specific KPIs) */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
          Executive Construction KPIs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Project Progress */}
          <AnalyticsMetricCard
            title="Overall Progress"
            subtext="Avg across active projects"
            value={`${projectAnalytics.avgActualProgress}%`}
            variance={projectAnalytics.scheduleVariancePct}
            varianceSuffix="%"
            status={projectAnalytics.scheduleVariancePct >= 0 ? 'On Track' : 'Behind'}
            statusColor={projectAnalytics.scheduleVariancePct >= 0 ? 'emerald' : 'amber'}
            icon={TrendingUp}
            calculationExplanation="Actual progress derived from project tasks and phase milestones."
            drilldownTo="/analytics/projects"
          />

          {/* 2. Schedule Variance */}
          <AnalyticsMetricCard
            title="Schedule Variance"
            subtext="Actual vs Planned Timeline"
            value={`${projectAnalytics.scheduleVariancePct > 0 ? '+' : ''}${projectAnalytics.scheduleVariancePct}%`}
            variance={projectAnalytics.scheduleVariancePct}
            varianceSuffix="%"
            status={projectAnalytics.scheduleVariancePct >= 0 ? 'Ahead' : 'Delayed'}
            statusColor={projectAnalytics.scheduleVariancePct >= 0 ? 'emerald' : 'red'}
            icon={Clock}
            calculationExplanation="Schedule Variance = Actual Progress (%) - Planned Progress (%)"
            drilldownTo="/projects/progress"
          />

          {/* 3. Budget Variance */}
          <AnalyticsMetricCard
            title="Budget Variance"
            subtext="Actual spend vs Baseline budget"
            value={`₹${(costAnalytics.costVariance / 100000).toFixed(1)}L`}
            variance={costAnalytics.costVariancePct}
            varianceSuffix="%"
            reverseVarianceColor={true}
            status={costAnalytics.status}
            statusColor={costAnalytics.status === 'Under Budget' ? 'emerald' : costAnalytics.status === 'Near Budget' ? 'amber' : 'red'}
            icon={DollarSign}
            calculationExplanation="Cost Variance = Actual Cost (₹) - Baseline Budget (₹)"
            drilldownTo="/analytics/costs"
          />

          {/* 4. Material Variance */}
          <AnalyticsMetricCard
            title="Material Variance"
            subtext="Actual vs Planned usage"
            value={`${materialAnalytics.materialConsumptionVariancePct > 0 ? '+' : ''}${materialAnalytics.materialConsumptionVariancePct}%`}
            variance={materialAnalytics.materialConsumptionVariancePct}
            varianceSuffix="%"
            reverseVarianceColor={true}
            status={materialAnalytics.materialConsumptionVariancePct > 5 ? 'Over Usage' : 'Normal'}
            statusColor={materialAnalytics.materialConsumptionVariancePct > 5 ? 'amber' : 'emerald'}
            icon={Package}
            calculationExplanation="Material Consumption Variance = Actual Consumed - Planned Consumption"
            drilldownTo="/analytics/materials"
          />

          {/* 5. Labour Productivity */}
          <AnalyticsMetricCard
            title="Labour Productivity"
            subtext="Workforce output index"
            value={`${labourAnalytics.avgProductivityPct}%`}
            subtext={`${labourAnalytics.presentWorkers} workers present today`}
            status={labourAnalytics.totalShortageCount > 0 ? `${labourAnalytics.totalShortageCount} Shortage` : 'Optimal'}
            statusColor={labourAnalytics.totalShortageCount > 0 ? 'amber' : 'emerald'}
            icon={Users}
            calculationExplanation="Productivity Index = (Actual Work Completed / Target Work Output) * 100"
            drilldownTo="/analytics/labour"
          />

          {/* 6. Procurement Performance */}
          <AnalyticsMetricCard
            title="On-Time Deliveries"
            subtext="Supplier logistics fulfillment"
            value={`${procurementAnalytics.onTimeDeliveryRatePct}%`}
            subtext={`${procurementAnalytics.delayedCount} delayed shipments`}
            status={procurementAnalytics.onTimeDeliveryRatePct >= 90 ? 'High Speed' : 'Warning'}
            statusColor={procurementAnalytics.onTimeDeliveryRatePct >= 90 ? 'emerald' : 'amber'}
            icon={ShoppingBag}
            calculationExplanation="On-Time Delivery Rate = (On-Time PO Deliveries / Total Scheduled PO Deliveries) * 100"
            drilldownTo="/analytics/procurement"
          />

          {/* 7. Open Site Issues */}
          <AnalyticsMetricCard
            title="Open Site Issues"
            subtext="Operational blockages"
            value={siteAnalytics.openIssues}
            subtext={`${siteAnalytics.highPriorityOpenIssues} high priority remaining`}
            status={siteAnalytics.highPriorityOpenIssues === 0 ? 'Clear' : 'Requires Focus'}
            statusColor={siteAnalytics.highPriorityOpenIssues === 0 ? 'emerald' : 'red'}
            icon={AlertTriangle}
            calculationExplanation="Derived directly from open site issues logged in Site Operations."
            drilldownTo="/analytics/site"
          />

          {/* 8. Safety Status */}
          <AnalyticsMetricCard
            title="Safety Status"
            subtext="Zero incident compliance"
            value={siteAnalytics.openSafetyIncidents === 0 ? 'Zero Incidents' : `${siteAnalytics.openSafetyIncidents} Open`}
            subtext="100% TBT Compliance"
            status={siteAnalytics.criticalSafetyIncidents === 0 ? 'Safe' : 'Risk Flag'}
            statusColor={siteAnalytics.criticalSafetyIncidents === 0 ? 'emerald' : 'red'}
            icon={ShieldCheck}
            calculationExplanation="Safety clearance score based on zero active critical safety incidents."
            drilldownTo="/site/safety"
          />
        </div>
      </section>

      {/* PROJECT PERFORMANCE & SCHEDULE PERFORMANCE */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectPerformanceTable projects={projectAnalytics.projectBreakdown} />
        </div>

        <div>
          {/* Planned vs Actual Progress Chart */}
          <BarChartContainer
            title="Planned vs Actual Progress (%)"
            subtitle="Comparing target vs actual completion by project code"
            data={plannedVsActualChartData}
          />
        </div>
      </section>

      {/* RESOURCE PERFORMANCE MATRIX */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Resource Performance Head Breakdown
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MaterialAnalyticsCard materialData={materialAnalytics} />
          <LabourAnalyticsCard labourData={labourAnalytics} />
          <ProcurementAnalyticsCard procurementData={procurementAnalytics} />
        </div>
      </section>

      {/* COST & SITE PERFORMANCE */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostAnalyticsCard costData={costAnalytics} />
        <SiteAnalyticsCard siteData={siteAnalytics} />
      </section>

      {/* READINESS INTELLIGENCE */}
      <section>
        <ReadinessBreakdown readinessData={readinessIntelligence} />
      </section>
    </div>
  );
};
