import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteOperations } from '../../hooks/useSiteOperations';
import { useProjects } from '../../hooks/useProjects';
import { DailySiteSummary } from '../../components/site/DailySiteSummary';
import { TomorrowPlan } from '../../components/site/TomorrowPlan';
import { SiteOperationalAlerts } from '../../components/site/SiteOperationalAlerts';
import { ProgressUpdateModal } from '../../components/site/ProgressUpdateModal';
import { CreateIssueModal } from '../../components/site/CreateIssueModal';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { InsightCard } from '../../components/ui/InsightCard';
import {
  HardHat,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  ShieldAlert,
  Brain,
  Camera,
  PlayCircle,
  ArrowRight
} from 'lucide-react';

export const SiteOperationsPage = () => {
  const navigate = useNavigate();
  const { workProgress, siteIssues, safetyIncidents, tomorrowPlans, siteAlerts } = useSiteOperations();
  const { selectedProjectId } = useProjects();

  const [selectedDate, setSelectedDate] = useState('2026-09-30');
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <HardHat className="w-6 h-6 text-amber-400" />
            Daily Site Operations Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time daily site performance, task execution, workforce deployment, site issues, and safety management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="amber" size="sm" onClick={() => setIsProgressModalOpen(true)} className="gap-1.5 text-xs">
            <PlayCircle className="w-4 h-4" />
            <span>Update Progress</span>
          </Button>
          <Button variant="rose" size="sm" onClick={() => setIsIssueModalOpen(true)} className="gap-1.5 text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>Report Issue</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate('/site/daily-report')} className="gap-1.5 text-xs">
            <FileText className="w-4 h-4" />
            <span>File Daily Report</span>
          </Button>
        </div>
      </div>

      {/* Today's Operational Summary Bar & KPI Cards (Sections 8, 9) */}
      <DailySiteSummary
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        weather="Partly Cloudy"
        siteStatus="Operational"
        workforcePresent={103}
        workforceRequired={118}
        materialAvailability={91}
        todayProgress={68}
        openIssuesCount={siteIssues.filter((i) => i.status !== 'Closed').length}
        safetyIncidentsCount={safetyIncidents.filter((s) => s.status !== 'Closed').length}
      />

      {/* Today's Work Plan Grid (Section 10) */}
      <Card className="bg-slate-900 border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              Today&apos;s Active Work Execution Plan
            </h3>
            <span className="text-xs text-slate-400">Tasks assigned and running on site today</span>
          </div>

          <Button variant="ghost" size="xs" onClick={() => navigate('/site/work-progress')}>
            View Full Progress Matrix →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workProgress.map((wp) => (
            <div
              key={wp.id}
              className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3 hover:border-amber-500/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-xs">{wp.taskName}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {wp.blockName} • {wp.levelName}
                  </span>
                </div>
                <Badge variant={wp.status === 'Completed' ? 'emerald' : wp.status === 'Blocked' ? 'purple' : 'amber'} size="xs">
                  {wp.status}
                </Badge>
              </div>

              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-slate-300">
                  <span>Workforce:</span>
                  <span className="font-bold text-amber-400">28 / 25 workers</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Quantity:</span>
                  <span>{wp.completedQuantity} / {wp.plannedQuantity} {wp.unit}</span>
                </div>
                <ProgressBar progress={wp.progressPercentage} color="bg-emerald-500" size="xs" />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2">
                <span>Supervisor: {wp.supervisorId}</span>
                <button
                  onClick={() => setIsProgressModalOpen(true)}
                  className="text-amber-400 hover:underline font-bold"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Operational Alerts & Deterministic AI Insights (Sections 41, 42) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operational Alerts */}
        <div className="space-y-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Active Site Operational Alerts
          </h3>
          <SiteOperationalAlerts alerts={siteAlerts} />
        </div>

        {/* Deterministic Site Intelligence Insights (Section 42) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Brain className="w-5 h-5 text-amber-400" />
              Site Operations Intelligence
            </h3>
            <Badge variant="amber" size="xs">Deterministic Risk Engine</Badge>
          </div>

          <div className="space-y-3">
            <InsightCard
              type="critical"
              badgeText="Schedule Risk"
              title="Level 4 slab casting is 18% behind planned quantity."
              description="Current pour rate of 820 sq.ft. vs 1000 sq.ft. planned target. Rebar shortage is causing slowdown."
              actionLabel="Expedite Rebar Delivery"
              onAction={() => navigate('/procurement/deliveries')}
            />

            <InsightCard
              type="warning"
              badgeText="Labour Shortage Risk"
              title="Tomorrow's masonry activity requires 35 workers but only 32 are currently available."
              description="4 masons absent today. Recommend requesting replacement masons from contractor."
              actionLabel="Adjust Labour Allocation"
              onAction={() => navigate('/labour/allocation')}
            />

            <InsightCard
              type="recommendation"
              badgeText="Safety Corrective Action"
              title="Two open safety corrective actions are due tomorrow."
              description="Perimeter edge safety netting on Level 4 requires installation before morning shift."
              actionLabel="View Safety Log"
              onAction={() => navigate('/site/safety')}
            />
          </div>
        </div>
      </div>

      {/* Tomorrow Readiness Plan Section (Section 40) */}
      <TomorrowPlan plans={tomorrowPlans} />

      {/* Modals */}
      <ProgressUpdateModal isOpen={isProgressModalOpen} onClose={() => setIsProgressModalOpen(false)} />
      <CreateIssueModal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} />
    </div>
  );
};
