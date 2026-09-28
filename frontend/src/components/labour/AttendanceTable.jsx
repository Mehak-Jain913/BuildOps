import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SearchInput } from '../forms/SearchInput';
import { Select } from '../forms/Select';
import { WORKER_TRADES, ATTENDANCE_STATUSES } from '../../mock/labourData';
import { UserCheck, Clock, Plus } from 'lucide-react';

export const AttendanceTable = ({
  attendance = [],
  projects = [],
  onMarkAttendance,
  title = 'Daily Attendance Roster',
  subtitle = 'Track site worker check-in times, check-out times, working hours, and overtime logs.',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tradeFilter, setTradeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');

  const filteredAttendance = attendance.filter((att) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      att.workerName.toLowerCase().includes(query) ||
      att.workerId.toLowerCase().includes(query) ||
      att.projectName.toLowerCase().includes(query);

    const matchesTrade = tradeFilter === 'ALL' || att.trade === tradeFilter;
    const matchesStatus = statusFilter === 'ALL' || att.status === statusFilter;
    const matchesProject = projectFilter === 'ALL' || att.projectId === projectFilter;

    return matchesSearch && matchesTrade && matchesStatus && matchesProject;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return 'success';
      case 'Absent':
        return 'danger';
      case 'Half Day':
        return 'warning';
      case 'Leave':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  return (
    <Card
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 font-normal">{subtitle}</p>
            </div>
          </div>

          {onMarkAttendance && (
            <Button variant="primary" size="sm" leftIcon={Plus} onClick={onMarkAttendance}>
              Mark Attendance
            </Button>
          )}
        </div>
      }
    >
      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
        <SearchInput
          placeholder="Search worker or project..."
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Attendance Statuses' },
            ...ATTENDANCE_STATUSES.map((s) => ({ value: s, label: s })),
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
      </div>

      {filteredAttendance.length === 0 ? (
        <div className="py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <UserCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No attendance logs found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Worker Name</th>
                <th className="py-3 px-4">Trade</th>
                <th className="py-3 px-4">Project & Location</th>
                <th className="py-3 px-4">Duty Status</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
                <th className="py-3 px-4 text-right">Work Hours</th>
                <th className="py-3 px-4 text-right">Overtime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 bg-white">
              {filteredAttendance.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                    {att.date}
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {att.workerName}
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-semibold whitespace-nowrap">
                    {att.trade}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-800 block">{att.projectName}</span>
                    <span className="text-[11px] text-slate-400">{att.blockName} • {att.levelName}</span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge variant={getStatusBadge(att.status)} size="sm">
                      {att.status}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                    {att.checkIn}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                    {att.checkOut}
                  </td>

                  <td className="py-3 px-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                    {att.workingHours ? `${att.workingHours} hrs` : '0'}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span
                      className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                        att.overtime > 0 ? 'bg-amber-100 text-amber-900' : 'text-slate-400'
                      }`}
                    >
                      {att.overtime > 0 ? `+${att.overtime} hrs OT` : '0 hrs'}
                    </span>
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
