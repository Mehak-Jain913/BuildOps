import React, { useState, useMemo } from 'react';
import { Table } from '../ui/Table';
import { SearchInput } from '../forms/SearchInput';
import { Select } from '../forms/Select';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { WORK_PROGRESS_STATUSES } from '../../mock/siteOperationsData';
import { Edit3, CheckCircle2, AlertTriangle, Clock, PlayCircle } from 'lucide-react';

export const WorkProgressTable = ({ records = [], onUpdateProgress }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchSearch =
        rec.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.blockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.supervisorId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || rec.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [records, searchTerm, statusFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="emerald" size="xs">Completed</Badge>;
      case 'In Progress':
        return <Badge variant="amber" size="xs">In Progress</Badge>;
      case 'Delayed':
        return <Badge variant="rose" size="xs">Delayed</Badge>;
      case 'Blocked':
        return <Badge variant="purple" size="xs">Blocked</Badge>;
      case 'Not Started':
      default:
        return <Badge variant="slate" size="xs">Not Started</Badge>;
    }
  };

  const columns = [
    {
      title: 'Task & Location',
      key: 'taskName',
      render: (val, row) => (
        <div>
          <span className="font-bold text-white text-xs block">{val}</span>
          <span className="text-[10px] text-slate-400">
            {row.projectName} • {row.blockName} ({row.levelName})
          </span>
        </div>
      ),
    },
    {
      title: 'Supervisor',
      key: 'supervisorId',
      render: (val) => <span className="text-xs text-slate-300 font-medium">{val}</span>,
    },
    {
      title: 'Planned vs Completed',
      key: 'plannedQuantity',
      render: (val, row) => (
        <div className="font-mono text-xs">
          <div className="text-slate-300">
            Plan: <span className="font-bold text-white">{val} {row.unit}</span>
          </div>
          <div className="text-emerald-400">
            Done: <span className="font-bold">{row.completedQuantity} {row.unit}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Completion %',
      key: 'progressPercentage',
      render: (val, row) => {
        const pct = row.progressPercentage || 0;
        const color = pct === 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-blue-500';
        return (
          <div className="space-y-1 min-w-[140px]">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-white font-bold">{pct}%</span>
              <span className="text-slate-400 text-[10px]">
                {val > 0 ? `${row.completedQuantity} / ${row.plannedQuantity}` : '0%'}
              </span>
            </div>
            <ProgressBar progress={pct} color={color} size="xs" />
          </div>
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (val) => getStatusBadge(val),
    },
    {
      title: 'Actions',
      key: 'id',
      align: 'right',
      render: (val, row) => (
        <Button
          variant="secondary"
          size="xs"
          onClick={() => onUpdateProgress && onUpdateProgress(row)}
          className="gap-1 text-xs"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Update</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search task, project, block, supervisor..."
          />
        </div>
        <div className="w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Task Statuses' },
              ...WORK_PROGRESS_STATUSES.map((st) => ({ value: st, label: st })),
            ]}
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredRecords}
        keyExtractor={(row) => row.id}
        emptyMessage="No work progress logs recorded for selected filter."
      />
    </div>
  );
};
