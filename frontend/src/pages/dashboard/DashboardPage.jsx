import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { AlertCard } from '../../components/ui/AlertCard';
import { InsightCard } from '../../components/ui/InsightCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { BarChartContainer } from '../../components/charts/BarChartContainer';
import { useToast } from '../../hooks/useToast';
import { useRole } from '../../hooks/useRole';
import { useAuth } from '../../hooks/useAuth';
import { useAnalytics } from '../../hooks/useAnalytics';
import { ROLE_LABELS, ROLES } from '../../constants/roles';
import { formatLakhs } from '../../utils/formatters';
import { PROJECT_OPTIONS, MOCK_DASHBOARD_DATA } from '../../mock/dashboardData';
import { useProjects } from '../../hooks/useProjects';
import {
  HardHat,
  Building2,
  Calendar,
  AlertTriangle,
  Users,
  Package,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ShieldAlert,
  PieChart,
  Activity,
  Layers,
  ChevronDown,
  Wrench,
  Sun,
  Truck,
  CheckSquare
} from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { role } = useRole();
  const { user } = useAuth();

  const { projects, selectedProjectId, setSelectedProjectId } = useProjects();
  const {
    projectAnalytics,
    materialAnalytics,
    labourAnalytics,
    readinessIntelligence,
    riskRadar,
    intelligenceInsights,
  } = useAnalytics();

  const projectOptions = projects.map((p) => ({
    id: p.id,
    name: `${p.name} — ${p.location.split(',')[0]}`,
    code: p.code,
    location: p.location,
  }));

  const selectedProject =
    projectOptions.find((p) => p.id === selectedProjectId) || projectOptions[0] || { location: 'Indore, MP' };

  const activeProjectObj = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const data = {
    ...MOCK_DASHBOARD_DATA,
    projectSummary: {
      ...MOCK_DASHBOARD_DATA.projectSummary,
      name: activeProjectObj?.name || MOCK_DASHBOARD_DATA.projectSummary.name,
      code: activeProjectObj?.code || MOCK_DASHBOARD_DATA.projectSummary.code,
      status: activeProjectObj?.status || MOCK_DASHBOARD_DATA.projectSummary.status,
      healthScore: activeProjectObj?.healthScore || 82,
      actualProgress: activeProjectObj?.progress || 64,
      totalBudgetLakhs: activeProjectObj?.budget || 50.0,
      spentBudgetLakhs: activeProjectObj?.spent || 42.5,
      utilizationPercent: Math.round(((activeProjectObj?.spent || 42.5) / (activeProjectObj?.budget || 50.0)) * 100),
      targetDate: activeProjectObj?.targetDate || '13 Nov 2026',
      daysRemaining: activeProjectObj?.daysRemaining || 47,
    },
  };

  const handleAction = (message, route) => {
    if (route) {
      navigate(route);
    }
    addToast({
      title: 'Command Center Action',
      message: message || 'Navigating to operational details...',
      type: 'info',
    });
  };

  const isSupervisor = role === ROLES.SUPERVISOR;
  const isAdmin = role === ROLES.ADMIN;

  return (
    <div className="space-y-6">
      {/* 1. DASHBOARD HEADER */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
              Site Operations Hub
            </span>
            <span className="text-xs text-slate-400 font-medium">•</span>
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {data.projectSummary.date}
            </span>
            <Badge variant="emerald" size="sm" className="ml-1">
              ● {data.projectSummary.status}
            </Badge>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Construction Command Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor project health, resource inventory, site labour, and operational readiness.
          </p>
        </div>

        {/* Project Selector Dropdown & Role Context */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Active Project
            </span>
            <span className="text-xs font-semibold text-slate-700">{selectedProject.location}</span>
          </div>

          <div className="relative min-w-[240px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none">
              <Building2 className="w-4 h-4" />
            </div>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                const prj = projectOptions.find((p) => p.id === e.target.value);
                addToast({
                  title: 'Project Context Changed',
                  message: `Switched command center view to ${prj?.name}`,
                  type: 'success',
                });
              }}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold rounded-xl pl-9 pr-8 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-slate-800 cursor-pointer shadow-2xs hover:bg-slate-100 transition-colors"
              aria-label="Select Active Project"
            >
              {projectOptions.map((prj) => (
                <option key={prj.id} value={prj.id}>
                  {prj.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Role View Notice Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold shrink-0">
            <HardHat className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white">
              Command Center View ({ROLE_LABELS[role]})
            </span>
            <span className="text-slate-400 ml-2">
              {isAdmin
                ? 'Emphasizing high-level project health, budget utilization, risk insights, and cost allocation.'
                : isSupervisor
                ? 'Emphasizing daily site tasks, labour deployment, material stock, and tomorrow readiness.'
                : 'Role-aware operational metrics enabled.'}
            </span>
          </div>
        </div>

        <Badge variant="amber" size="sm" className="shrink-0">
          Logged in as {user?.name || 'Sarah Jenkins'}
        </Badge>
      </div>

      {/* 2. TOP SUMMARY / PROJECT HEALTH (4 Cards Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* A. PROJECT HEALTH */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Project Health
            </span>
            <Badge variant="emerald" size="sm">
              Healthy
            </Badge>
          </div>

          <div className="my-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {data.projectSummary.healthScore}
                <span className="text-sm text-slate-400 font-semibold"> / 100</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                ● Optimal Site Index
              </p>
            </div>

            {/* Circular Progress Ring */}
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeDasharray={`${data.projectSummary.healthScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <Activity className="w-5 h-5 text-emerald-600 absolute" />
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-snug border-t border-slate-100 pt-2.5 mt-1">
            {data.projectSummary.healthDescription}
          </p>
        </div>

        {/* B. PROJECT PROGRESS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Project Progress
            </span>
            <Badge variant="amber" size="sm">
              Var: {data.projectSummary.progressVariance}%
            </Badge>
          </div>

          <div className="my-3">
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {data.projectSummary.actualProgress}%
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Planned: <span className="text-slate-800 font-bold">{data.projectSummary.plannedProgress}%</span>
              </div>
            </div>

            <div className="mt-2.5">
              <ProgressBar
                value={data.projectSummary.actualProgress}
                target={data.projectSummary.plannedProgress}
                variant="amber"
                size="md"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5 mt-1">
            <span>Actual vs Planned Schedule</span>
            <span className="font-bold text-amber-700">-4% Slight Lag</span>
          </div>
        </div>

        {/* C. BUDGET STATUS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Budget Utilization
            </span>
            <Badge variant="info" size="sm">
              {data.projectSummary.utilizationPercent}% Used
            </Badge>
          </div>

          <div className="my-3">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatLakhs(data.projectSummary.spentBudgetLakhs)}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Total Budget: <span className="font-bold text-slate-700">{formatLakhs(data.projectSummary.totalBudgetLakhs)}</span>
            </div>

            <div className="mt-2.5">
              <ProgressBar
                value={data.projectSummary.utilizationPercent}
                variant={data.projectSummary.utilizationPercent > 90 ? 'danger' : 'slate'}
                size="md"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5 mt-1">
            <span>Remaining Fund</span>
            <span className="font-bold text-slate-900">{formatLakhs(data.projectSummary.totalBudgetLakhs - data.projectSummary.spentBudgetLakhs)}</span>
          </div>
        </div>

        {/* D. DAYS REMAINING */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Time to Completion
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>

          <div className="my-3">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {data.projectSummary.daysRemaining}{' '}
              <span className="text-sm font-semibold text-slate-500">Days</span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Target Finish: <span className="font-bold text-slate-900">{data.projectSummary.targetDate}</span>
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5 mt-1">
            <span>Milestone Phase 2</span>
            <span className="font-bold text-emerald-700">On Track</span>
          </div>
        </div>
      </div>

      {/* 3. ACTION REQUIRED SECTION (Top Priority Operational Alerts) */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <span className="text-base font-bold text-slate-900">Action Required</span>
            <Badge variant="danger" size="sm" className="ml-1">
              {data.actionRequiredAlerts.length} Critical Flags
            </Badge>
          </div>
        }
        subtitle="Operational bottlenecks requiring immediate site supervisor or manager intervention."
        action={
          <Button
            variant="ghost"
            size="sm"
            rightIcon={ArrowUpRight}
            onClick={() => handleAction('Navigating to all site alerts...')}
          >
            View All Alerts
          </Button>
        }
        className="border-red-200/60 bg-red-50/20"
      >
        <div className="space-y-3">
          {data.actionRequiredAlerts.map((alt) => (
            <AlertCard
              key={alt.id}
              title={alt.title}
              description={alt.description}
              severity={alt.severity}
              location={`${alt.category} • ${alt.location}`}
              actionLabel={alt.actionLabel}
              onAction={() =>
                handleAction(`Navigating for action: ${alt.title}`, alt.actionRoute)
              }
            />
          ))}
        </div>
      </Card>

      {/* MAIN TWO-COLUMN LAYOUT: RESOURCE MATRIX & WORKFORCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2-COLUMNS */}
        <div className="lg:col-span-2 space-y-6">

          {/* 4. MATERIAL STATUS */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-600" />
                <span className="text-base font-bold text-slate-900">Material Status</span>
              </div>
            }
            subtitle="Current site inventory levels, stockout risks, and reorder projections."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction('Opening Material Requisition Modal...', '/materials')}
              >
                Requisition Stock
              </Button>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.materialStatus.map((mat) => (
                <div
                  key={mat.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{mat.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Stock: <span className="font-bold text-slate-800">{mat.quantity.toLocaleString()} {mat.unit}</span>
                      </p>
                    </div>
                    <Badge variant={mat.badgeVariant} size="sm">
                      {mat.status}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600">{mat.percentage}% Stock Level</span>
                      <span className="text-slate-400 text-[11px]">Cap: {mat.maxCapacity.toLocaleString()}</span>
                    </div>
                    <ProgressBar value={mat.percentage} variant={mat.barVariant} size="sm" />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                    <span className="text-slate-500 italic">Status: {mat.subtext}</span>
                    <button
                      onClick={() => handleAction(`Inspect ${mat.name} stock log`, '/materials')}
                      className="font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
                    >
                      Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Procurement Signals Banner (Section 33) */}
            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>Active Procurement Signals:</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <button onClick={() => navigate('/procurement/requests')} className="hover:underline font-bold text-slate-800">
                  Pending PRs: <span className="text-amber-700">4</span>
                </button>
                <span className="text-slate-300">•</span>
                <button onClick={() => navigate('/procurement/deliveries')} className="hover:underline font-bold text-slate-800">
                  Expected Deliveries: <span className="text-emerald-700">7</span>
                </button>
                <span className="text-slate-300">•</span>
                <button onClick={() => navigate('/procurement/deliveries')} className="hover:underline font-bold text-slate-800">
                  Delayed Deliveries: <span className="text-rose-700">2</span>
                </button>
              </div>
            </div>
          </Card>

          {/* 5. LABOUR STATUS */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-800" />
                <span className="text-base font-bold text-slate-900">Labour Status</span>
              </div>
            }
            subtitle="Today's workforce attendance rate vs tomorrow's planned site requirement."
            action={
              <Button
                variant="ghost"
                size="sm"
                rightIcon={ArrowUpRight}
                onClick={() => handleAction('Opening Labour Attendance Sheet...', '/labour')}
              >
                Attendance Log
              </Button>
            }
          >
            {/* Top Labour KPI Summary Bar */}
            <div className="p-4 rounded-xl bg-slate-900 text-white grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Total Crew
                </span>
                <span className="text-2xl font-extrabold text-white">
                  {data.labourStatus.totalWorkforce}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Registered</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Present Today
                </span>
                <span className="text-2xl font-extrabold text-emerald-400">
                  {data.labourStatus.presentToday}
                </span>
                <span className="text-[11px] text-emerald-300 block mt-0.5">
                  {data.labourStatus.attendanceRate}% Attendance
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Tomorrow Req.
                </span>
                <span className="text-2xl font-extrabold text-amber-400">
                  {data.labourStatus.requiredTomorrow}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Planned Crew</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Shortage
                </span>
                <span className="text-2xl font-extrabold text-red-400">
                  -{data.labourStatus.shortageCount}
                </span>
                <span className="text-[11px] text-red-300 block mt-0.5">Workers Needed</span>
              </div>
            </div>

            {/* Trade Category Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Deployment By Skill Trade
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.labourStatus.tradeBreakdown.map((tb, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-800 truncate">{tb.trade}</span>
                        <span className="text-slate-900 font-bold">
                          {tb.present} / {tb.required}
                        </span>
                      </div>
                      <ProgressBar
                        value={tb.percentage}
                        variant={tb.percentage === 100 ? 'emerald' : 'amber'}
                        size="sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* 6. PROJECT PROGRESS (Phases) */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                <span className="text-base font-bold text-slate-900">Project Progress (Phases)</span>
              </div>
            }
            subtitle="Construction milestone completion breakdown and planned vs actual schedule variance."
          >
            <div className="space-y-3">
              {data.phaseProgress.map((phs, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/40 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{phs.phase}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-medium">
                        Planned: <span className="font-bold text-slate-700">{phs.planned}%</span>
                      </span>
                      <span className="text-slate-900 font-extrabold">
                        Actual: {phs.actual}%
                      </span>
                      <Badge
                        variant={phs.variance < 0 ? 'amber' : 'emerald'}
                        size="sm"
                      >
                        {phs.variance === 0 ? 'On Time' : `${phs.variance}%`}
                      </Badge>
                    </div>
                  </div>
                  <ProgressBar value={phs.actual} target={phs.planned} variant="amber" size="md" />
                </div>
              ))}
            </div>
          </Card>

          {/* 7. TODAY'S WORK */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                <span className="text-base font-bold text-slate-900">Today's Work</span>
              </div>
            }
            subtitle="Active daily tasks, assigned crews, and real-time execution status on site."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAction('Adding new task log to today\'s schedule...')}
              >
                + Log Task Progress
              </Button>
            }
          >
            <div className="space-y-3">
              {data.todaysWork.map((tsk) => (
                <div
                  key={tsk.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" size="sm" className="font-bold">
                        {tsk.block}
                      </Badge>
                      <Badge variant={tsk.statusVariant} size="sm">
                        {tsk.status}
                      </Badge>
                      <span className="text-xs text-slate-400 font-mono">• {tsk.time}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{tsk.task}</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Supervisor: <span className="font-semibold text-slate-700">{tsk.supervisor}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Crew On Task
                      </span>
                      <Badge variant="neutral" size="sm" className="font-bold mt-0.5">
                        {tsk.workers} Workers
                      </Badge>
                    </div>

                    <div className="w-24 text-right">
                      <span className="text-xs font-bold text-slate-900 block">{tsk.progress}%</span>
                      <ProgressBar value={tsk.progress} variant={tsk.progress === 100 ? 'emerald' : 'amber'} size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 8. MATERIAL CONSUMPTION CHART */}
          <BarChartContainer
            title="Material Consumption (Planned vs Actual)"
            subtitle="Comparing daily material consumption variance against planned budget target."
            data={data.materialConsumption}
          />
        </div>

        {/* RIGHT 1-COLUMN SIDEBAR */}
        <div className="space-y-6">

          {/* 9. TOMORROW READINESS (Signature Concept) */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-500" />
                  <span className="text-base font-bold text-slate-900">Tomorrow Readiness</span>
                </div>
                <Badge variant={data.tomorrowReadiness.statusVariant} size="sm">
                  {data.tomorrowReadiness.overallPercentage}% Ready
                </Badge>
              </div>
            }
            subtitle="Can planned site work start smoothly tomorrow morning?"
            className="border-amber-200/80 bg-gradient-to-b from-amber-50/30 to-white"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Readiness Score
                  </span>
                  <span className="text-xl font-extrabold text-amber-400">
                    {data.tomorrowReadiness.statusText} ({data.tomorrowReadiness.overallPercentage}%)
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleAction('Running tomorrow site readiness check...')}
                >
                  Verify Now
                </Button>
              </div>

              <div className="divide-y divide-slate-100">
                {data.tomorrowReadiness.items.map((rd) => (
                  <div key={rd.id} className="py-2.5 flex items-start gap-2.5">
                    {rd.isReady ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{rd.category}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          rd.isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {rd.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">{rd.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* 10. BUILDOPS INTELLIGENCE SECTION */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span className="text-base font-bold text-slate-900">BuildOps Intelligence</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <Link to="/analytics" className="text-amber-600 hover:text-amber-700 hover:underline">
                    View Analytics →
                  </Link>
                  <span className="text-slate-300">•</span>
                  <Link to="/intelligence" className="text-amber-600 hover:text-amber-700 hover:underline">
                    View Intelligence →
                  </Link>
                </div>
              </div>
            }
            subtitle="Live operational derived signals and rule-based site prescriptions."
            className="border-amber-200/80 bg-slate-900 text-white"
          >
            <div className="space-y-4">
              {/* Derived Operational Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-800/90 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Schedule Variance</span>
                  <span className={`font-mono font-bold text-sm ${projectAnalytics.scheduleVariancePct >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {projectAnalytics.scheduleVariancePct > 0 ? '+' : ''}{projectAnalytics.scheduleVariancePct}%
                  </span>
                </div>

                <div className="p-2.5 bg-slate-800/90 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Material Variance</span>
                  <span className={`font-mono font-bold text-sm ${materialAnalytics.materialConsumptionVariancePct > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {materialAnalytics.materialConsumptionVariancePct > 0 ? '+' : ''}{materialAnalytics.materialConsumptionVariancePct}%
                  </span>
                </div>

                <div className="p-2.5 bg-slate-800/90 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Labour Output</span>
                  <span className="font-mono font-bold text-sm text-blue-400">
                    {labourAnalytics.avgProductivityPct}%
                  </span>
                </div>

                <div className="p-2.5 bg-slate-800/90 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Tomorrow Readiness</span>
                  <span className="font-mono font-bold text-sm text-amber-400">
                    {readinessIntelligence.overallScore}%
                  </span>
                </div>
              </div>

              {/* Top Risk Signal */}
              {riskRadar.categories && riskRadar.categories.length > 0 && (
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Top Operational Risk Signal</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      riskRadar.categories[0].status === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {riskRadar.categories[0].status}
                    </span>
                  </div>
                  <div className="font-bold text-white mb-0.5">{riskRadar.categories[0].name}</div>
                  <div className="text-[11px] text-slate-300 font-mono">{riskRadar.categories[0].evidence}</div>
                </div>
              )}

              {/* Actionable Insights */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Prescriptive Action Items</span>
                {intelligenceInsights.slice(0, 2).map((ins) => (
                  <div key={ins.id} className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/80 text-xs flex flex-col gap-1">
                    <div className="flex items-center justify-between font-bold text-amber-300">
                      <span>{ins.title}</span>
                      <span className="text-[10px] text-slate-400">{ins.category}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{ins.recommendedAttention}</p>
                    <Link to={ins.drilldown || '/intelligence'} className="text-[11px] text-amber-400 font-bold hover:underline self-end">
                      Investigate →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* 11. RECENT SITE ISSUES */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="text-base font-bold text-slate-900">Recent Site Issues</span>
              </div>
            }
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAction('Viewing site issue log...', '/site/issues')}
              >
                View All
              </Button>
            }
          >
            <div className="space-y-3">
              {data.siteIssues.map((iss) => (
                <div
                  key={iss.id}
                  className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={iss.statusVariant} size="sm">
                      {iss.severity.toUpperCase()} SEVERITY
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {iss.reportedTime}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-900">{iss.issue}</h5>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                    <span>Assigned: <strong className="text-slate-700">{iss.assignedTo}</strong></span>
                    <span className="font-semibold text-slate-800">{iss.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 12. PROJECT COST SNAPSHOT */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-slate-800" />
                <span className="text-base font-bold text-slate-900">Project Cost Snapshot</span>
              </div>
            }
            subtitle="Expenditure distribution across major construction heads."
            action={
              <Button
                variant="ghost"
                size="sm"
                rightIcon={ArrowUpRight}
                onClick={() => handleAction('Opening full analytics cost report...', '/analytics')}
              >
                Analytics
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Total Spent
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900">
                    {formatLakhs(data.costSummary.totalSpentLakhs)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Total Budget
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {formatLakhs(data.costSummary.totalBudgetLakhs)}
                  </span>
                </div>
              </div>

              {/* Stacked Expense Bar */}
              <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
                {data.costSummary.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className={`${item.color} h-full`}
                    style={{ width: `${item.percentage}%` }}
                    title={`${item.name}: ${formatLakhs(item.amountLakhs)} (${item.percentage}%)`}
                  />
                ))}
              </div>

              {/* Expense Legend */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {data.costSummary.breakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-slate-50">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-slate-600 font-medium text-[11px]">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-800 text-[11px]">{formatLakhs(item.amountLakhs)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
