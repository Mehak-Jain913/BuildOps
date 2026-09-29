import React, { useState, useMemo } from 'react';
import { Table } from '../ui/Table';
import { SearchInput } from '../forms/SearchInput';
import { Select } from '../forms/Select';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SAFETY_TYPES, SAFETY_SEVERITIES } from '../../mock/siteOperationsData';
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export const SafetyIncidentTable = ({ incidents = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchSearch =
        inc.incidentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.projectName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = typeFilter === 'ALL' || inc.type === typeFilter;
      const matchSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;

      return matchSearch && matchType && matchSeverity;
    });
  }, [incidents, searchTerm, typeFilter, severityFilter]);

  const getSeverityBadge = (severity) => {
    let variant = 'slate';
    if (severity === 'Critical') variant = 'rose';
    if (severity === 'High') variant = 'amber';
    if (severity === 'Medium') variant = 'blue';
    return <Badge variant={variant} size="xs">{severity}</Badge>;
  };

  const getStatusBadge = (status) => {
    let variant = 'emerald';
    if (status === 'Open' || status === 'Corrective Action Required') variant = 'rose';
    if (status === 'Investigating' || status === 'In Progress') variant = 'amber';
    return <Badge variant={variant} size="xs">{status}</Badge>;
  };

  const columns = [
    {
      title: 'Incident Code & Time',
      key: 'incidentCode',
      render: (val, row) => (
        <div>
          <span className="font-bold font-mono text-amber-400 text-xs block">{val}</span>
          <span className="text-[10px] text-slate-400 font-mono">{row.date} • {row.time}</span>
        </div>
      ),
    },
    {
      title: 'Type & Location',
      key: 'type',
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
      title: 'Severity',
      key: 'severity',
      render: (val) => getSeverityBadge(val),
    },
    {
      title: 'Observation & Immediate Action',
      key: 'description',
      render: (val, row) => (
        <div className="space-y-1 max-w-sm">
          <p className="text-xs text-slate-200 line-clamp-2">{val}</p>
          {row.immediateAction && (
            <p className="text-[10px] text-amber-300 italic">Action: {row.immediateAction}</p>
          )}
        </div>
      ),
    },
    {
      title: 'Corrective Action Required',
      key: 'correctiveAction',
      render: (val) => <span className="text-xs text-slate-300 font-medium">{val || 'None'}</span>,
    },
    {
      title: 'Safety Status',
      key: 'status',
      render: (val) => getStatusBadge(val),
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
            placeholder="Search code, description, reported by..."
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-40">
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Incident Types' },
                ...SAFETY_TYPES.map((t) => ({ value: t, label: t })),
              ]}
            />
          </div>
          <div className="w-36">
            <Select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Severities' },
                ...SAFETY_SEVERITIES.map((s) => ({ value: s, label: s })),
              ]}
            />
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredIncidents}
        keyExtractor={(row) => row.id}
        emptyMessage="No safety incidents recorded."
      />
    </div>
  );
};
