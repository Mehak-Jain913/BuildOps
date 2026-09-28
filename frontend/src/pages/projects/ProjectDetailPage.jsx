import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { SiteStructureTree } from '../../components/projects/SiteStructureTree';
import { MilestoneTimeline } from '../../components/projects/MilestoneTimeline';
import { ProjectPhaseProgress } from '../../components/projects/ProjectPhaseProgress';
import { TaskTable } from '../../components/projects/TaskTable';
import { CreateTaskModal } from '../../components/projects/CreateTaskModal';
import { useProjects } from '../../hooks/useProjects';
import { useRole } from '../../hooks/useRole';
import { ROLES } from '../../constants/roles';
import { formatLakhs } from '../../utils/formatters';
import {
  Building2,
  MapPin,
  Calendar,
  User,
  Activity,
  Layers,
  Flag,
  CheckSquare,
  Info,
  Clock,
  Edit,
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  Plus,
} from 'lucide-react';

export const ProjectDetailPage = () => {
  const { id, projectId } = useParams();
  const currentId = projectId || id || 'PRJ-001';
  const navigate = useNavigate();

  const {
    getProjectById,
    getBlocksByProjectId,
    getLevelsByBlockId,
    getPhasesByProjectId,
    getMilestonesByProjectId,
    getTasksByProjectId,
    getActivitiesByProjectId,
  } = useProjects();

  const { role } = useRole();
  const isAdmin = role === ROLES.ADMIN;
  const isSupervisor = role === ROLES.SUPERVISOR || isAdmin;

  const project = getProjectById(currentId);
  const blocks = getBlocksByProjectId(project?.id || currentId);
  
  // Aggregate levels for all blocks of this project
  const levels = blocks.flatMap((b) => getLevelsByBlockId(b.id));
  const phases = getPhasesByProjectId(project?.id || currentId);
  const milestones = getMilestonesByProjectId(project?.id || currentId);
  const tasks = getTasksByProjectId(project?.id || currentId);
  const activities = getActivitiesByProjectId(project?.id || currentId);

  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  if (!project) {
    return (
      <Card className="p-8 text-center bg-white">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Project Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          The requested project code "{currentId}" does not exist in the active portfolio.
        </p>
        <Button variant="primary" onClick={() => navigate('/projects')}>
          Back to Projects List
        </Button>
      </Card>
    );
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'On Track':
        return 'success';
      case 'At Risk':
        return 'warning';
      case 'Delayed':
        return 'danger';
      case 'Planning':
        return 'info';
      case 'Completed':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'phases', label: 'Construction Phases', icon: Layers },
    { id: 'milestones', label: 'Milestones', icon: Flag },
    { id: 'structure', label: 'Site Structure', icon: Building2 },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'info', label: 'Project Info', icon: Info },
    { id: 'activity', label: 'Recent Activity', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button Link */}
      <button
        onClick={() => navigate('/projects')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects Portfolio
      </button>

      {/* 1. PROJECT DETAILS HEADER */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded bg-slate-900 text-amber-400">
                {project.code}
              </span>
              <Badge variant={getStatusBadgeVariant(project.status)} size="md">
                ● {project.status}
              </Badge>
              <Badge variant="outline" size="md">
                {project.type}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {project.name}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <strong className="text-slate-700 font-semibold">{project.location}</strong>
              {project.client && <span>• Client: {project.client}</span>}
            </p>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {isSupervisor && (
              <Button
                variant="outline"
                leftIcon={Plus}
                onClick={() => setIsCreateTaskModalOpen(true)}
              >
                Create Task
              </Button>
            )}

            {isAdmin && (
              <Button
                variant="primary"
                leftIcon={Edit}
                onClick={() => navigate(`/projects/${project.id}/edit`)}
              >
                Edit Project
              </Button>
            )}
          </div>
        </div>

        {/* Header Summary Grid (Key Metadata) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Project Manager
            </span>
            <span className="font-extrabold text-slate-900 mt-0.5 block truncate">
              {project.manager}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Start Date
            </span>
            <span className="font-bold text-slate-800 mt-0.5 block">{project.startDate}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Target Completion
            </span>
            <span className="font-bold text-amber-700 mt-0.5 block">{project.targetDate}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Project Budget
            </span>
            <span className="font-extrabold text-slate-900 mt-0.5 block">
              {formatLakhs(project.budget)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Progress
            </span>
            <span className="font-extrabold text-emerald-700 mt-0.5 block">
              {project.progress}% Complete
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Health Index
            </span>
            <span className="font-extrabold text-slate-900 mt-0.5 block">
              {project.healthScore || 82} / 100
            </span>
          </div>
        </div>
      </div>

      {/* 2. SECTION NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 no-scrollbar">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENTS */}

      {/* A. OVERVIEW TAB */}
      {(activeTab === 'overview' || activeTab === 'all') && (
        <div className="space-y-6">
          {/* Summary Health & Metrics (6 KPI Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Project Health
                </span>
                <Badge variant="emerald" size="sm">
                  Optimal
                </Badge>
              </div>
              <div className="my-3">
                <div className="text-3xl font-extrabold text-slate-900">
                  {project.healthScore || 82}
                  <span className="text-sm text-slate-400 font-normal"> / 100</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                  ● Based on schedule, resources & site safety
                </p>
              </div>
              <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                Site parameters within target boundaries
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Construction Progress
                </span>
                <Badge variant="amber" size="sm">
                  {project.progress}% Complete
                </Badge>
              </div>
              <div className="my-3">
                <div className="text-3xl font-extrabold text-slate-900">{project.progress}%</div>
                <div className="mt-2">
                  <ProgressBar value={project.progress} variant="amber" size="md" />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                Planned vs Actual completion rate
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Budget Utilization
                </span>
                <Badge variant="info" size="sm">
                  85% Spent
                </Badge>
              </div>
              <div className="my-3">
                <div className="text-3xl font-extrabold text-slate-900">
                  {formatLakhs(project.spent || 42.5)}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Total Allocation: <strong className="text-slate-800">{formatLakhs(project.budget)}</strong>
                </p>
              </div>
              <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                Remaining: {formatLakhs(project.budget - (project.spent || 42.5))}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Days Remaining
              </span>
              <div className="text-3xl font-extrabold text-slate-900 my-2">
                {project.daysRemaining || 47} <span className="text-sm text-slate-500 font-normal">Days</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Target Finish: <strong className="text-slate-900">{project.targetDate}</strong>
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Active Site Issues
              </span>
              <div className="text-3xl font-extrabold text-red-600 my-2">
                {project.activeIssues || 3} <span className="text-xs text-slate-400 font-normal">Open</span>
              </div>
              <p className="text-xs text-slate-500">Logistics & material stock reorder flags</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Upcoming Milestones
              </span>
              <div className="text-3xl font-extrabold text-amber-600 my-2">
                {project.upcomingMilestones || 4} <span className="text-xs text-slate-400 font-normal">Targets</span>
              </div>
              <p className="text-xs text-slate-500">Contractual deliverables due next</p>
            </div>
          </div>

          {/* Quick Dual Columns: Phases preview & Milestones preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProjectPhaseProgress phases={phases} />
            <MilestoneTimeline milestones={milestones} />
          </div>
        </div>
      )}

      {/* B. CONSTRUCTION PHASES TAB */}
      {activeTab === 'phases' && (
        <div className="space-y-6">
          <ProjectPhaseProgress phases={phases} />
        </div>
      )}

      {/* C. MILESTONES TAB */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          <MilestoneTimeline milestones={milestones} />
        </div>
      )}

      {/* D. SITE STRUCTURE TAB */}
      {activeTab === 'structure' && (
        <div className="space-y-6">
          <SiteStructureTree projectName={project.name} blocks={blocks} levels={levels} />
        </div>
      )}

      {/* E. TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <TaskTable
            tasks={tasks}
            onCreateTask={() => setIsCreateTaskModalOpen(true)}
            canCreateTask={isSupervisor}
            title={`Tasks for ${project.name}`}
            subtitle="View, filter and assign tasks across blocks, floors, and construction phases."
          />
        </div>
      )}

      {/* F. PROJECT INFORMATION TAB */}
      {activeTab === 'info' && (
        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Project Information & Specifications</h3>
              </div>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={Edit}
                  onClick={() => navigate(`/projects/${project.id}/edit`)}
                >
                  Edit Project Information
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-6 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Project Scope & Description
              </h4>
              <p className="text-slate-800 leading-relaxed font-medium">
                {project.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Project Name
                </span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{project.name}</span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Project Code
                </span>
                <span className="font-mono font-bold text-amber-700 text-sm mt-0.5 block">
                  {project.code}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Client Organization
                </span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {project.client || 'N/A'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Site Location
                </span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {project.location}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Project Category / Type
                </span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {project.type}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Project Manager
                </span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {project.manager}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Start Date
                </span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {project.startDate}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Expected Completion Date
                </span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {project.targetDate}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Total Sanctioned Budget
                </span>
                <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                  {formatLakhs(project.budget)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* G. RECENT ACTIVITY TAB */}
      {activeTab === 'activity' && (
        <Card
          header={
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">Recent Project Activity</h3>
            </div>
          }
          subtitle="Audit log of task updates, phase progression, and operational changes."
        >
          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{act.actor}</span>{' '}
                  <span className="text-slate-600">{act.action}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0 font-medium">
                  {act.timestamp}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* CREATE TASK MODAL */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        defaultProjectId={project.id}
      />
    </div>
  );
};
