import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useLabour } from '../../hooks/useLabour';
import { formatCurrency } from '../../utils/formatters';
import {
  User,
  ArrowLeft,
  Calendar,
  Phone,
  DollarSign,
  Clock,
  CheckCircle2,
  Building2,
  Layers,
  TrendingUp,
} from 'lucide-react';

export const WorkerDetailPage = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const { getWorkerById, attendance, allocations } = useLabour();

  const worker = getWorkerById(workerId);

  if (!worker) {
    return (
      <Card className="p-8 text-center bg-white">
        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Worker Profile Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Worker record "{workerId}" does not exist in the active directory.
        </p>
        <Button variant="primary" onClick={() => navigate('/labour/workers')}>
          Back to Worker Directory
        </Button>
      </Card>
    );
  }

  // Filter attendance and allocations for this worker
  const workerAttendance = attendance.filter((a) => a.workerId === worker.id);
  const workerAllocations = allocations.filter((a) => a.trade === worker.trade);

  const totalHoursWorked = workerAttendance.reduce((acc, a) => acc + (a.workingHours || 0), 0);
  const totalOvertime = workerAttendance.reduce((acc, a) => acc + (a.overtime || 0), 0);
  const totalDaysPresent = workerAttendance.filter((a) => a.status === 'Present').length;
  const estimatedCost = totalDaysPresent * worker.dailyRate + totalOvertime * worker.overtimeRate;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <button
        onClick={() => navigate('/labour/workers')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Worker Directory
      </button>

      {/* 1. WORKER PROFILE HEADER */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-xl shrink-0 shadow-xs">
              {worker.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                  {worker.employeeCode}
                </span>
                <Badge variant="amber" size="sm">
                  {worker.trade}
                </Badge>
                <Badge variant={worker.status === 'Active' ? 'success' : 'neutral'} size="sm">
                  {worker.status}
                </Badge>
              </div>

              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {worker.name}
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>Contractor: <strong className="text-slate-800 font-bold">{worker.contractorName}</strong></span>
                <span>• Phone: <strong className="text-slate-800 font-semibold">{worker.phone}</strong></span>
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Daily Wage Rate
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
              ₹{worker.dailyRate} <span className="text-xs font-normal text-slate-500">/ day</span>
            </div>
            <span className="text-xs text-slate-500 block">OT: ₹{worker.overtimeRate}/hr</span>
          </div>
        </div>

        {/* Header Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Skill Classification
            </span>
            <span className="font-bold text-slate-900 mt-0.5 block">{worker.skillLevel}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Current Project Site
            </span>
            <span className="font-bold text-slate-900 mt-0.5 block">{worker.projectName}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Total Hours Worked
            </span>
            <span className="font-extrabold text-emerald-700 mt-0.5 block">
              {totalHoursWorked} hrs ({totalOvertime} hrs OT)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Est. Accrued Wages
            </span>
            <span className="font-extrabold text-slate-900 mt-0.5 block">
              ₹{estimatedCost.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 2. CURRENT ALLOCATION & RECENT TASKS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Allocation */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">Current Task Allocation</h3>
            </div>
          }
        >
          <div className="space-y-3">
            {workerAllocations.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 italic">
                No active task allocations for this worker.
              </div>
            ) : (
              workerAllocations.map((alc) => (
                <div
                  key={alc.id}
                  className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{alc.taskName}</span>
                    <Badge variant="amber" size="sm">
                      {alc.shift} Shift
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Location: <strong className="text-slate-800">{alc.blockName} • {alc.levelName}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500">Supervisor: {alc.supervisor}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Attendance Summary Log */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Attendance Log History</h3>
            </div>
          }
        >
          <div className="space-y-2">
            {workerAttendance.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 italic">
                No recent attendance records logged.
              </div>
            ) : (
              workerAttendance.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{att.date}</span>
                    <span className="text-[11px] text-slate-500">
                      Check in: {att.checkIn} — Out: {att.checkOut}
                    </span>
                  </div>
                  <div className="text-right">
                    <Badge variant={att.status === 'Present' ? 'success' : 'danger'} size="sm">
                      {att.status}
                    </Badge>
                    <span className="text-[11px] font-mono text-slate-600 block mt-0.5">
                      {att.workingHours} hrs ({att.overtime} hrs OT)
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
