import React, { useState } from 'react';
import { useSiteOperations } from '../../hooks/useSiteOperations';
import { MetricCard } from '../../components/ui/MetricCard';
import { Button } from '../../components/ui/Button';
import { WorkProgressTable } from '../../components/site/WorkProgressTable';
import { ProgressUpdateModal } from '../../components/site/ProgressUpdateModal';
import { BarChartContainer } from '../../components/charts/BarChartContainer';
import { Card } from '../../components/ui/Card';
import { TrendingUp, Plus, CheckCircle2, AlertTriangle, Clock, PlayCircle } from 'lucide-react';

export const WorkProgressPage = () => {
  const { workProgress } = useSiteOperations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState(null);

  const totalTasks = workProgress.length;
  const completedTasks = workProgress.filter((w) => w.status === 'Completed').length;
  const inProgressTasks = workProgress.filter((w) => w.status === 'In Progress').length;
  const delayedTasks = workProgress.filter((w) => w.status === 'Delayed' || w.status === 'Blocked').length;

  const chartData = workProgress.map((wp) => ({
    name: wp.taskName.split('—')[0] || wp.taskName,
    planned: wp.plannedQuantity,
    actual: wp.completedQuantity,
  }));

  const handleUpdate = (record) => {
    setSelectedProgress(record);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            Actual Work Progress & Schedule Variance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Field execution progress tracking, planned vs completed quantities, schedule variance, and task bottlenecks.
          </p>
        </div>

        <Button variant="amber" onClick={() => { setSelectedProgress(null); setIsModalOpen(true); }} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Log Progress Update</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Active Site Tasks"
          value={totalTasks}
          icon={TrendingUp}
          subtitle="Tracked Work Tasks"
        />
        <MetricCard
          title="Completed Tasks"
          value={completedTasks}
          icon={CheckCircle2}
          badgeText="Finished"
          badgeVariant="emerald"
        />
        <MetricCard
          title="In Execution"
          value={inProgressTasks}
          icon={PlayCircle}
          badgeText="Active Shift"
          badgeVariant="amber"
        />
        <MetricCard
          title="Delayed / Blocked"
          value={delayedTasks}
          icon={AlertTriangle}
          badgeText={delayedTasks > 0 ? "Action Required" : "Zero Delays"}
          badgeVariant={delayedTasks > 0 ? "danger" : "emerald"}
        />
      </div>

      {/* Task Progress Intelligence Chart (Section 13) */}
      <Card className="bg-slate-900 border-slate-800 p-5 space-y-3">
        <div className="border-b border-slate-800 pb-2">
          <h3 className="font-bold text-white text-base">Task Execution Intelligence: Planned vs Actual Quantity</h3>
          <span className="text-xs text-slate-400">Quantitative variance comparison across site tasks</span>
        </div>
        <BarChartContainer
          title=""
          data={chartData}
          barColor="#10b981"
        />
      </Card>

      {/* Work Progress Table */}
      <WorkProgressTable records={workProgress} onUpdateProgress={handleUpdate} />

      {/* Progress Update Modal */}
      <ProgressUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedRecord={selectedProgress}
      />
    </div>
  );
};
