import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { SearchInput } from '../../components/forms/SearchInput';
import { Select } from '../../components/forms/Select';
import { CreateProjectModal } from '../../components/projects/CreateProjectModal';
import { useProjects } from '../../hooks/useProjects';
import { useRole } from '../../hooks/useRole';
import { ROLES } from '../../constants/roles';
import { PROJECT_TYPES } from '../../mock/projectData';
import { formatLakhs } from '../../utils/formatters';
import {
  FolderKanban,
  Plus,
  MapPin,
  Calendar,
  User,
  TrendingUp,
  Building2,
  ArrowRight,
  ShieldAlert,
  Edit,
} from 'lucide-react';

export const projectTabs = [
  { title: 'All Projects', path: '/projects', icon: FolderKanban, end: true },
  { title: 'Project Details', path: '/projects/PRJ-001', icon: Building2 },
  { title: 'Tasks Matrix', path: '/projects/tasks', icon: TrendingUp },
];

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const { projects, addProject } = useProjects();
  const { role } = useRole();
  const isAdmin = role === ROLES.ADMIN;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter projects by search query, status, and project type
  const filteredProjects = projects.filter((p) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(query) ||
      p.location.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query) ||
      (p.client && p.client.toLowerCase().includes(query));

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || p.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate portfolio statistics
  const totalProjects = projects.length;
  const activeProjectsCount = projects.filter(
    (p) => p.status === 'On Track' || p.status === 'In Progress' || p.status === 'At Risk'
  ).length;
  const totalBudgetLakhs = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const avgProgress = Math.round(
    projects.reduce((acc, p) => acc + (p.progress || 0), 0) / (totalProjects || 1)
  );
  const totalWorkforce = projects.reduce((acc, p) => acc + (p.workersOnSite || 0), 0);

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

  return (
    <div className="space-y-6">
      {/* 1. PAGE HEADER */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
              Project Management Foundation
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">
              {totalProjects} Portfolio Entities
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage construction projects, sites and project progress.
          </p>
        </div>

        {/* Action Button: Create Project */}
        {isAdmin ? (
          <Button
            variant="primary"
            leftIcon={Plus}
            onClick={() => setIsCreateModalOpen(true)}
            className="shrink-0 shadow-sm"
          >
            Create Project
          </Button>
        ) : (
          <div className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
            Logged in as <strong className="text-slate-800">Site Supervisor</strong> (Read-only project creation)
          </div>
        )}
      </div>

      {/* 2. PORTFOLIO METRICS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Total Projects
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalProjects}</div>
          <p className="text-xs text-slate-500 mt-1">
            <strong className="text-emerald-700 font-bold">{activeProjectsCount} Active</strong> site deployments
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Active Portfolio Budget
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
            {formatLakhs(totalBudgetLakhs)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Total committed capital across sites</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Average Progress
          </span>
          <div className="text-2xl font-extrabold text-amber-600 mt-0.5">{avgProgress}%</div>
          <div className="mt-1">
            <ProgressBar value={avgProgress} variant="amber" size="sm" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Total Site Workforce
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalWorkforce}</div>
          <p className="text-xs text-slate-500 mt-1">Active site workers & supervisors</p>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS BAR */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SearchInput
          placeholder="Search by project name, code, client, location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
        />

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Statuses' },
            { value: 'On Track', label: 'On Track' },
            { value: 'At Risk', label: 'At Risk' },
            { value: 'Planning', label: 'Planning' },
            { value: 'Delayed', label: 'Delayed' },
            { value: 'Completed', label: 'Completed' },
          ]}
          placeholder={null}
        />

        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Project Types' },
            ...PROJECT_TYPES.map((t) => ({ value: t, label: t })),
          ]}
          placeholder={null}
        />
      </div>

      {/* 4. PROJECT CARDS GRID */}
      {filteredProjects.length === 0 ? (
        <Card className="py-12 text-center bg-white border-dashed border-slate-300">
          <FolderKanban className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">No Projects Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            No projects matched your search criteria. Try modifying your filter settings or create a new project.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                      {project.code || project.id}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-tight">
                      {project.name}
                    </h3>
                  </div>

                  <Badge variant={getStatusBadgeVariant(project.status)} size="md">
                    {project.status}
                  </Badge>
                </div>

                {/* Location & Client */}
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{project.location}</span>
                  </div>

                  {project.client && (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Client: {project.client}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body: Progress & Key Details */}
              <div className="p-5 space-y-4 bg-slate-50/30 flex-1">
                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Construction Completion</span>
                    <span className="font-extrabold text-slate-900">{project.progress}%</span>
                  </div>
                  <ProgressBar
                    value={project.progress}
                    variant={project.progress > 50 ? 'emerald' : 'amber'}
                    size="md"
                  />
                </div>

                {/* Project Specs Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Target Completion
                    </span>
                    <span className="font-bold text-slate-800 mt-0.5 block flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-600" />
                      {project.targetDate}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Project Budget
                    </span>
                    <span className="font-extrabold text-slate-900 mt-0.5 block">
                      {formatLakhs(project.budget)}
                    </span>
                  </div>
                </div>

                {/* Manager */}
                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1 text-slate-500">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Manager:
                  </span>
                  <span className="font-bold text-slate-900">{project.manager}</span>
                </div>
              </div>

              {/* Card Footer: View & Edit Buttons */}
              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={Edit}
                    onClick={() => navigate(`/projects/${project.id}/edit`)}
                  >
                    Edit
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  rightIcon={ArrowRight}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="w-full sm:w-auto"
                >
                  View Project
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. CREATE PROJECT MODAL */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitProject={addProject}
      />
    </div>
  );
};
