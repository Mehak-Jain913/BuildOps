import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SearchInput } from '../forms/SearchInput';
import { Select } from '../forms/Select';
import { WORKER_TRADES } from '../../mock/labourData';
import { Users, Plus, Eye, Phone, Building2 } from 'lucide-react';

export const WorkerTable = ({
  workers = [],
  contractors = [],
  projects = [],
  onAddWorker,
  canAddWorker = true,
  title = 'Worker Directory',
  subtitle = 'Manage registered site workers, trade skills, contractor mappings, and daily wage rates.',
}) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [tradeFilter, setTradeFilter] = useState('ALL');
  const [contractorFilter, setContractorFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredWorkers = workers.filter((w) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      w.name.toLowerCase().includes(query) ||
      w.employeeCode.toLowerCase().includes(query) ||
      (w.phone && w.phone.includes(query));

    const matchesTrade = tradeFilter === 'ALL' || w.trade === tradeFilter;
    const matchesContractor = contractorFilter === 'ALL' || w.contractorId === contractorFilter;
    const matchesProject = projectFilter === 'ALL' || w.projectId === projectFilter;
    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;

    return matchesSearch && matchesTrade && matchesContractor && matchesProject && matchesStatus;
  });

  return (
    <Card
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 font-normal">{subtitle}</p>
            </div>
          </div>

          {canAddWorker && onAddWorker && (
            <Button variant="primary" size="sm" leftIcon={Plus} onClick={onAddWorker}>
              Add Worker
            </Button>
          )}
        </div>
      }
    >
      {/* Search & Multi-Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
        <SearchInput
          placeholder="Search by worker name, code, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
        />

        <Select
          value={tradeFilter}
          onChange={(e) => setTradeFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Trades' },
            ...WORKER_TRADES.map((t) => ({ value: t, label: t })),
          ]}
          placeholder={null}
        />

        <Select
          value={contractorFilter}
          onChange={(e) => setContractorFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Contractors' },
            ...contractors.map((c) => ({ value: c.id, label: c.name })),
          ]}
          placeholder={null}
        />

        <Select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Projects' },
            ...projects.map((p) => ({ value: p.id, label: p.name })),
          ]}
          placeholder={null}
        />

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Statuses' },
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
          ]}
          placeholder={null}
        />
      </div>

      {/* Table */}
      {filteredWorkers.length === 0 ? (
        <div className="py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No workers found matching criteria</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Worker Name & Code</th>
                <th className="py-3 px-4">Trade Category</th>
                <th className="py-3 px-4">Skill Level</th>
                <th className="py-3 px-4">Contractor</th>
                <th className="py-3 px-4">Assigned Project</th>
                <th className="py-3 px-4 text-right">Daily Rate</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 bg-white">
              {filteredWorkers.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{w.name}</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {w.employeeCode} • {w.phone}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                    {w.trade}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge variant={w.skillLevel === 'Supervisor' ? 'amber' : 'neutral'} size="sm">
                      {w.skillLevel}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                    {w.contractorName}
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                    {w.projectName}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900 whitespace-nowrap">
                    ₹{w.dailyRate}/day
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge variant={w.status === 'Active' ? 'success' : 'neutral'} size="sm">
                      {w.status}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={Eye}
                      onClick={() => navigate(`/labour/workers/${w.id}`)}
                    >
                      Details
                    </Button>
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
