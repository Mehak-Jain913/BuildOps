import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AlertCard } from '../../components/ui/AlertCard';
import { InsightCard } from '../../components/ui/InsightCard';
import { WorkforceRequirement } from '../../components/labour/WorkforceRequirement';
import { TomorrowReadinessLabour } from '../../components/labour/TomorrowReadinessLabour';
import { WorkerTable } from '../../components/labour/WorkerTable';
import { AddWorkerModal } from '../../components/labour/AddWorkerModal';
import { MarkAttendanceModal } from '../../components/labour/MarkAttendanceModal';
import { AllocationModal } from '../../components/labour/AllocationModal';
import { useLabour } from '../../hooks/useLabour';
import { useProjects } from '../../hooks/useProjects';
import { formatLakhs } from '../../utils/formatters';
import {
  Users,
  UserCheck,
  Plus,
  Clock,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  PieChart,
  Layers,
  Sun,
  AlertTriangle,
} from 'lucide-react';

export const labourTabs = [
  { title: 'Labour Overview', path: '/labour', icon: Users, end: true },
  { title: 'Worker Directory', path: '/labour/workers', icon: Users },
  { title: 'Daily Attendance', path: '/labour/attendance', icon: UserCheck },
  { title: 'Workforce Allocation', path: '/labour/allocation', icon: Layers },
  { title: 'Productivity & OT', path: '/labour/productivity', icon: TrendingUp },
  { title: 'Labour Costs', path: '/labour/costs', icon: DollarSign },
];

export const LabourPage = () => {
  const navigate = useNavigate();
  const { workers, contractors, attendance, alerts, intelligence, costs } = useLabour();
  const { projects } = useProjects();

  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [isMarkAttendanceOpen, setIsMarkAttendanceOpen] = useState(false);
  const [isAllocationOpen, setIsAllocationOpen] = useState(false);

  const totalWorkforce = workers.length || 120;
  const presentToday = attendance.filter((a) => a.status === 'Present').length || 103;
  const attendanceRate = Math.round((presentToday / (totalWorkforce || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
              Workforce Operations & Deployment
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">
              {totalWorkforce} Active Registered Workers
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Labour & Workforce
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor workforce availability, attendance, deployment and productivity.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            leftIcon={Plus}
            onClick={() => setIsAddWorkerOpen(true)}
          >
            Add Worker
          </Button>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={UserCheck}
            onClick={() => setIsMarkAttendanceOpen(true)}
          >
            Mark Attendance
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={Layers}
            onClick={() => setIsAllocationOpen(true)}
          >
            Assign Workforce
          </Button>
        </div>
      </div>

      {/* 2. SUMMARY METRICS BAR (8 KPI Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Total Crew
          </span>
          <div className="text-xl font-extrabold text-slate-900 mt-0.5">{totalWorkforce}</div>
          <span className="text-[10px] text-slate-500 block">Registered</span>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Present Today
          </span>
          <div className="text-xl font-extrabold text-emerald-600 mt-0.5">{presentToday}</div>
          <span className="text-[10px] text-emerald-700 font-semibold block">{attendanceRate}% Rate</span>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Attendance
          </span>
          <div className="text-xl font-extrabold text-slate-900 mt-0.5">{attendanceRate}%</div>
          <span className="text-[10px] text-slate-500 block">Site Average</span>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Allocated Today
          </span>
          <div className="text-xl font-extrabold text-slate-900 mt-0.5">96</div>
          <span className="text-[10px] text-slate-500 block">On Active Tasks</span>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Available Reserve
          </span>
          <div className="text-xl font-extrabold text-blue-600 mt-0.5">7</div>
          <span className="text-[10px] text-blue-700 font-semibold block">Unassigned</span>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Tomorrow Req.
          </span>
          <div className="text-xl font-extrabold text-slate-900 mt-0.5">118</div>
          <span className="text-[10px] text-slate-500 block">Planned Crew</span>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Shortage
          </span>
          <div className="text-xl font-extrabold text-red-600 mt-0.5">-15</div>
          <span className="text-[10px] text-red-700 font-semibold block">Workers Needed</span>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Daily Cost
          </span>
          <div className="text-xl font-extrabold text-slate-900 mt-0.5">₹1.12 L</div>
          <span className="text-[10px] text-slate-500 block">Payroll Today</span>
        </div>
      </div>

      {/* 3. DUAL COLUMN: WORKFORCE REQUIREMENT & TOMORROW READINESS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkforceRequirement />
        <TomorrowReadinessLabour onAction={() => setIsAllocationOpen(true)} />
      </div>

      {/* 4. LABOUR ALERTS & INTELLIGENCE PREVIEW (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Workforce Alerts & Cost Snapshot */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  <h3 className="text-base font-bold text-slate-900">Workforce & Trade Alerts</h3>
                </div>
                <Badge variant="danger" size="sm">
                  {alerts.length} Operational Flags
                </Badge>
              </div>
            }
            subtitle="Trade shortages, overtime spikes, and workforce capacity bottlenecks."
          >
            <div className="space-y-3">
              {alerts.map((alt) => (
                <AlertCard
                  key={alt.id}
                  title={alt.title}
                  description={alt.description}
                  severity={alt.severity}
                  location={`Trade: ${alt.trade}`}
                  actionLabel="Assign Workforce"
                  onAction={() => setIsAllocationOpen(true)}
                />
              ))}
            </div>
          </Card>

          {/* Labour Cost Breakdown Bar */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-slate-800" />
                <h3 className="text-base font-bold text-slate-900">Labour Cost Breakdown</h3>
              </div>
            }
            subtitle="Monthly payroll allocation across major skill trades."
          >
            <div className="space-y-3">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-bold text-slate-700">Monthly Labour Expenditure:</span>
                <span className="text-base font-extrabold text-slate-900">
                  ₹{costs.thisMonthLakhs} Lakhs
                </span>
              </div>

              {/* Stacked Bar */}
              <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
                {costs.tradeBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className={`${item.color} h-full`}
                    style={{ width: `${item.percentage}%` }}
                    title={`${item.trade}: ₹${item.amountLakhs}L (${item.percentage}%)`}
                  />
                ))}
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-2">
                {costs.tradeBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                    <span className="text-slate-600 truncate">{item.trade}:</span>
                    <strong className="text-slate-900 font-bold">₹{item.amountLakhs}L</strong>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right 1-Col: Labour Intelligence Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Labour Intelligence</span>
            </h3>
            <Badge variant="amber" size="sm">
              Intelligence Preview
            </Badge>
          </div>

          {intelligence.map((ins) => (
            <InsightCard
              key={ins.id}
              type={ins.badgeLabel}
              title={ins.title}
              description={ins.description}
              confidence={ins.confidence}
              recommendation={ins.recommendation}
              impact={ins.impact}
              onApply={() => setIsAllocationOpen(true)}
            />
          ))}
        </div>
      </div>

      {/* 5. WORKER DIRECTORY PREVIEW */}
      <WorkerTable
        workers={workers}
        contractors={contractors}
        projects={projects}
        onAddWorker={() => setIsAddWorkerOpen(true)}
      />

      {/* MODALS */}
      <AddWorkerModal isOpen={isAddWorkerOpen} onClose={() => setIsAddWorkerOpen(false)} />
      <MarkAttendanceModal isOpen={isMarkAttendanceOpen} onClose={() => setIsMarkAttendanceOpen(false)} />
      <AllocationModal isOpen={isAllocationOpen} onClose={() => setIsAllocationOpen(false)} />
    </div>
  );
};
