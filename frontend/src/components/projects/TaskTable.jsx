import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { SearchInput } from '../forms/SearchInput';
import { Select } from '../forms/Select';
import { CheckSquare, Plus, Filter, Calendar, User, AlertCircle } from 'lucide-react';

export const TaskTable = ({
  tasks = [],
  onCreateTask,
  canCreateTask = true,
  title = 'Project Tasks',
  subtitle = 'Manage site execution activities, supervisor assignments, priority & progress.',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [phaseFilter, setPhaseFilter] = useState('ALL');

  // Extract unique phases for filtering
  const phaseOptions = Array.from(new Set(tasks.map((t) => t.phaseName || t.phaseId || 'General'))).filter(Boolean);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.location && t.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.supervisor && t.supervisor.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchesPhase = phaseFilter === 'ALL' || (t.phaseName || t.phaseId) === phaseFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesPhase;
  });

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'danger';
      case 'High':
        return 'amber';
      case 'Medium':
        return 'info';
      case 'Low':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'info';
      case 'Scheduled':
        return 'neutral';
      case 'Blocked':
        return 'danger';
      case 'Not Started':
        return 'outline';
      default:
        return 'neutral';
    }
  };

  return (
    <Card
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 font-normal">{subtitle}</p>
            </div>
          </div>

          {canCreateTask && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={Plus}
              onClick={onCreateTask}
              className="shrink-0"
            >
              Create Task
            </Button>
          )}
        </div>
      }
    >
      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
        <SearchInput
          placeholder="Search tasks or supervisors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
        />

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Statuses' },
            { value: 'Not Started', label: 'Not Started' },
            { value: 'Scheduled', label: 'Scheduled' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Blocked', label: 'Blocked' },
            { value: 'Completed', label: 'Completed' },
          ]}
          placeholder={null}
        />

        <Select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Priorities' },
            { value: 'Critical', label: 'Critical' },
            { value: 'High', label: 'High' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Low', label: 'Low' },
          ]}
          placeholder={null}
        />

        <Select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Phases' },
            ...phaseOptions.map((p) => ({ value: p, label: p })),
          ]}
          placeholder={null}
        />
      </div>

      {/* Task List / Table */}
      {filteredTasks.length === 0 ? (
        <div className="py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <CheckSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No tasks found matching criteria</p>
          <p className="text-xs text-slate-400 mt-0.5">Try adjusting filters or create a new task.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Task Name & Details</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Phase</th>
                <th className="py-3 px-4">Supervisor</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 w-32">Progress</th>
                <th className="py-3 px-4 text-right">Target Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 bg-white">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{t.name}</span>
                    {t.description && (
                      <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                        {t.description}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                    {t.location || `${t.blockName} • ${t.levelName}`}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
                    {t.phaseName || 'Construction'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {t.supervisor}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge variant={getPriorityBadgeVariant(t.priority)} size="sm">
                      {t.priority}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge variant={getStatusBadgeVariant(t.status)} size="sm">
                      {t.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 w-8">{t.progress}%</span>
                      <div className="flex-1">
                        <ProgressBar
                          value={t.progress}
                          variant={t.progress === 100 ? 'emerald' : t.status === 'Blocked' ? 'danger' : 'amber'}
                          size="sm"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono font-medium text-slate-600">
                    {t.dueDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};
