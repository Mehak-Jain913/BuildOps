import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SearchInput } from '../forms/SearchInput';
import { Select } from '../forms/Select';
import { REQUEST_STATUSES } from '../../mock/materialData';
import { useRole } from '../../hooks/useRole';
import { useToast } from '../../hooks/useToast';
import { ROLES } from '../../constants/roles';
import { FileText, CheckCircle2, XCircle, Plus, Calendar, User } from 'lucide-react';

export const MaterialRequestTable = ({
  requests = [],
  onRequestNew,
  onApprove,
  onReject,
  title = 'Material Requisitions',
  subtitle = 'Track pending site material requisitions, urgency levels, and manager approval status.',
}) => {
  const { role } = useRole();
  const { addToast } = useToast();
  const isAdmin = role === ROLES.ADMIN;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const filteredRequests = requests.filter((req) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      req.id.toLowerCase().includes(query) ||
      req.materialName.toLowerCase().includes(query) ||
      req.requestedBy.toLowerCase().includes(query) ||
      req.projectName.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || req.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityBadge = (priority) => {
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Pending Approval':
        return 'warning';
      case 'Rejected':
        return 'danger';
      case 'Fulfilled':
        return 'emerald';
      default:
        return 'neutral';
    }
  };

  const handleApprove = (req) => {
    if (onApprove) onApprove(req.id);
    addToast({
      title: 'Material Request Approved',
      message: `Requisition ${req.id} for ${req.requestedQuantity} ${req.unit} of ${req.materialName} approved.`,
      type: 'success',
    });
  };

  const handleReject = (req) => {
    if (onReject) onReject(req.id);
    addToast({
      title: 'Material Request Rejected',
      message: `Requisition ${req.id} rejected by Project Manager.`,
      type: 'warning',
    });
  };

  return (
    <Card
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 font-normal">{subtitle}</p>
            </div>
          </div>

          {onRequestNew && (
            <Button variant="primary" size="sm" leftIcon={Plus} onClick={onRequestNew}>
              Create Request
            </Button>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
        <SearchInput
          placeholder="Search request ID, material, or supervisor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
        />

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Request Statuses' },
            ...REQUEST_STATUSES.map((s) => ({ value: s, label: s })),
          ]}
          placeholder={null}
        />

        <Select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Priority Levels' },
            { value: 'Critical', label: 'Critical' },
            { value: 'High', label: 'High' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Low', label: 'Low' },
          ]}
          placeholder={null}
        />
      </div>

      {filteredRequests.length === 0 ? (
        <div className="py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No material requests found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Material Name</th>
                <th className="py-3 px-4">Project & Location</th>
                <th className="py-3 px-4 text-right">Requested Qty</th>
                <th className="py-3 px-4">Requested By</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Req. Date</th>
                <th className="py-3 px-4">Status</th>
                {isAdmin && <th className="py-3 px-4 text-right">Approval Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 bg-white">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-extrabold text-slate-900 whitespace-nowrap">
                    {req.id}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {req.materialName}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-800 block">{req.projectName}</span>
                    <span className="text-[11px] text-slate-400">{req.blockName}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                    {req.requestedQuantity} {req.unit}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                    {req.requestedBy}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge variant={getPriorityBadge(req.priority)} size="sm">
                      {req.priority}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {req.requiredDate}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge variant={getStatusBadge(req.status)} size="sm">
                      {req.status}
                    </Badge>
                  </td>
                  {isAdmin && (
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {req.status === 'Pending Approval' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={CheckCircle2}
                            onClick={() => handleApprove(req)}
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={XCircle}
                            onClick={() => handleReject(req)}
                            className="text-red-700 border-red-200 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Actioned</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};
