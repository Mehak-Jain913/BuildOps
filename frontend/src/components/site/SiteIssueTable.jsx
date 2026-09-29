import React, { useState, useMemo } from 'react';
import { Table } from '../ui/Table';
import { SearchInput } from '../forms/SearchInput';
import { Select } from '../forms/Select';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ISSUE_TYPES, ISSUE_PRIORITIES, ISSUE_STATUSES } from '../../mock/siteOperationsData';
import { useSiteOperations } from '../../hooks/useSiteOperations';
import { AlertTriangle, CheckCircle2, Clock, Edit3, ShieldAlert } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../forms/Input';

export const SiteIssueTable = ({ issues = [] }) => {
  const { updateSiteIssue, resolveSiteIssue } = useProcurementOrSite();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [resolvingIssue, setResolvingIssue] = useState(null);
  const [resolutionText, setResolutionText] = useState('');

  const filteredIssues = useMemo(() => {
    return issues.filter((iss) => {
      const matchSearch =
        iss.issueCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        iss.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        iss.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        iss.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = typeFilter === 'ALL' || iss.type === typeFilter;
      const matchPriority = priorityFilter === 'ALL' || iss.priority === priorityFilter;
      const matchStatus = statusFilter === 'ALL' || iss.status === statusFilter;

      return matchSearch && matchType && matchPriority && matchStatus;
    });
  }, [issues, searchTerm, typeFilter, priorityFilter, statusFilter]);

  function useProcurementOrSite() {
    return useSiteOperations();
  }

  const handleConfirmResolve = (e) => {
    e.preventDefault();
    if (!resolvingIssue) return;
    resolveSiteIssue(resolvingIssue.id, resolutionText);
    setResolvingIssue(null);
    setResolutionText('');
  };

  const getPriorityBadge = (priority) => {
    let variant = 'slate';
    if (priority === 'Critical') variant = 'rose';
    if (priority === 'High') variant = 'amber';
    if (priority === 'Medium') variant = 'blue';
    return <Badge variant={variant} size="xs">{priority}</Badge>;
  };

  const getStatusBadge = (status) => {
    let variant = 'slate';
    if (status === 'Resolved' || status === 'Closed') variant = 'emerald';
    if (status === 'In Progress' || status === 'Investigating') variant = 'amber';
    if (status === 'Open') variant = 'rose';
    return <Badge variant={variant} size="xs">{status}</Badge>;
  };

  const columns = [
    {
      title: 'Issue Code & Title',
      key: 'title',
      render: (val, row) => (
        <div>
          <span className="font-bold font-mono text-amber-400 text-xs block">{row.issueCode}</span>
          <span className="font-bold text-white text-xs block">{val}</span>
          <span className="text-[10px] text-slate-400 font-mono">{row.type} Issue</span>
        </div>
      ),
    },
    {
      title: 'Location & Task',
      key: 'projectName',
      render: (val, row) => (
        <div>
          <span className="font-bold text-white text-xs block">{val}</span>
          <span className="text-[10px] text-slate-400">
            {row.blockName ? `${row.blockName} • ${row.levelName || ''}` : 'Site Wide'}
          </span>
        </div>
      ),
    },
    {
      title: 'Impact',
      key: 'impact',
      render: (val) => <Badge variant="purple" size="xs">{val}</Badge>,
    },
    {
      title: 'Priority',
      key: 'priority',
      render: (val) => getPriorityBadge(val),
    },
    {
      title: 'Assigned & Due',
      key: 'assignedTo',
      render: (val, row) => (
        <div className="text-xs">
          <span className="text-slate-300 font-semibold block">{val}</span>
          <span className="text-[10px] text-slate-400 font-mono">Due: {row.dueDate}</span>
        </div>
      ),
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
        <div className="flex items-center justify-end gap-1.5">
          {row.status !== 'Resolved' && row.status !== 'Closed' ? (
            <Button
              variant="emerald"
              size="xs"
              onClick={() => setResolvingIssue(row)}
              className="gap-1 text-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolve</span>
            </Button>
          ) : (
            <span className="text-[11px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolved</span>
            </span>
          )}
        </div>
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
            placeholder="Search issue code, title, assignee..."
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-36">
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Types' },
                ...ISSUE_TYPES.map((t) => ({ value: t, label: t })),
              ]}
            />
          </div>
          <div className="w-36">
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Priorities' },
                ...ISSUE_PRIORITIES.map((p) => ({ value: p, label: p })),
              ]}
            />
          </div>
          <div className="w-36">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                ...ISSUE_STATUSES.map((s) => ({ value: s, label: s })),
              ]}
            />
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredIssues}
        keyExtractor={(row) => row.id}
        emptyMessage="No site issues found."
      />

      {/* Resolve Issue Modal */}
      {resolvingIssue && (
        <Modal
          isOpen={!!resolvingIssue}
          onClose={() => setResolvingIssue(null)}
          title={`Resolve Site Issue ${resolvingIssue.issueCode}`}
        >
          <form onSubmit={handleConfirmResolve} className="space-y-4 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-white block text-sm">{resolvingIssue.title}</span>
              <p className="text-slate-400 text-xs">{resolvingIssue.description}</p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Resolution Summary / Action Taken *</label>
              <Input
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="e.g. Replacement shipment dispatched from Pithampur depot."
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <Button variant="ghost" type="button" onClick={() => setResolvingIssue(null)}>
                Cancel
              </Button>
              <Button variant="emerald" type="submit">
                Mark as Resolved
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
