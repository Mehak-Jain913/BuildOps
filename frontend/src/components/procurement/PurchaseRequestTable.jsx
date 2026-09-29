import React, { useState, useMemo } from 'react';
import { Table } from '../ui/Table';
import { SearchInput } from '../forms/SearchInput';
import { Select } from '../forms/Select';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProcurementStatusBadge } from './ProcurementStatusBadge';
import { useRole } from '../../hooks/useRole';
import { useProcurement } from '../../hooks/useProcurement';
import { useProjects } from '../../hooks/useProjects';
import { PURCHASE_REQUEST_STATUSES } from '../../mock/procurementData';
import { Check, X, ArrowRight, FileText, Calendar } from 'lucide-react';

export const PurchaseRequestTable = ({ requests = [], onCreatePO }) => {
  const { isRole } = useRole();
  const { approvePurchaseRequest, rejectPurchaseRequest } = useProcurement();
  const { projects } = useProjects();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const canApprove = isRole(['ADMIN']);

  const filteredRequests = useMemo(() => {
    return requests.filter((pr) => {
      const matchSearch =
        pr.prNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pr.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pr.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pr.reason.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || pr.status === statusFilter;
      const matchProject = projectFilter === 'ALL' || pr.projectId === projectFilter;
      const matchPriority = priorityFilter === 'ALL' || pr.priority === priorityFilter;

      return matchSearch && matchStatus && matchProject && matchPriority;
    });
  }, [requests, searchTerm, statusFilter, projectFilter, priorityFilter]);

  const columns = [
    {
      title: 'Request ID',
      key: 'prNumber',
      render: (val, row) => (
        <div>
          <span className="font-bold font-mono text-white text-xs block">{val}</span>
          <span className="text-[10px] text-slate-400 font-mono">{row.createdDate}</span>
        </div>
      ),
    },
    {
      title: 'Project & Location',
      key: 'projectName',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-white text-xs block">{val}</span>
          <span className="text-[10px] text-slate-400">
            {row.blockName ? `${row.blockName} • ${row.levelName || ''}` : 'General Site'}
          </span>
        </div>
      ),
    },
    {
      title: 'Requested Material & Quantity',
      key: 'materialName',
      render: (val, row) => (
        <div>
          <span className="font-bold text-amber-400 text-xs block">{val}</span>
          <span className="font-mono text-xs text-white font-bold">
            {row.requestedQuantity.toLocaleString('en-IN')} {row.unit}
          </span>
        </div>
      ),
    },
    {
      title: 'Requested By',
      key: 'requestedBy',
      render: (val) => <span className="text-xs text-slate-300 font-medium">{val}</span>,
    },
    {
      title: 'Required By',
      key: 'requiredBy',
      render: (val) => (
        <div className="flex items-center gap-1 font-mono text-xs text-slate-300">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>{val}</span>
        </div>
      ),
    },
    {
      title: 'Priority',
      key: 'priority',
      render: (val) => {
        let variant = 'slate';
        if (val === 'Critical') variant = 'rose';
        if (val === 'High') variant = 'amber';
        if (val === 'Medium') variant = 'blue';
        return <Badge variant={variant} size="xs">{val}</Badge>;
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (val) => <ProcurementStatusBadge status={val} type="pr" />,
    },
    {
      title: 'Actions',
      key: 'id',
      align: 'right',
      render: (val, row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.status === 'Pending Approval' && canApprove && (
            <>
              <Button
                variant="emerald"
                size="xs"
                onClick={() => approvePurchaseRequest(row.id)}
                title="Approve Requisition"
                className="px-2"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve</span>
              </Button>
              <Button
                variant="rose"
                size="xs"
                onClick={() => rejectPurchaseRequest(row.id)}
                title="Reject Requisition"
                className="px-2"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </>
          )}

          {row.status === 'Approved' && (
            <Button
              variant="amber"
              size="xs"
              onClick={() => onCreatePO && onCreatePO(row)}
              className="gap-1 text-xs"
            >
              <span>Convert to PO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}

          {row.status !== 'Pending Approval' && row.status !== 'Approved' && (
            <span className="text-[11px] text-slate-500 font-mono italic">No actions</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search PR #, material, requester, reason..."
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-40">
            <Select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Projects' },
                ...projects.map((p) => ({ value: p.id, label: p.name })),
              ]}
            />
          </div>
          <div className="w-36">
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
            />
          </div>
          <div className="w-40">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                ...PURCHASE_REQUEST_STATUSES.map((st) => ({ value: st, label: st })),
              ]}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredRequests}
        keyExtractor={(row) => row.id}
        emptyMessage="No purchase requests found matching filters."
      />
    </div>
  );
};
