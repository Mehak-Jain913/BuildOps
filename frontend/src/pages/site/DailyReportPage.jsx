import React, { useState } from 'react';
import { useSiteOperations } from '../../hooks/useSiteOperations';
import { useRole } from '../../hooks/useRole';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DailyReportForm } from '../../components/site/DailyReportForm';
import { FileText, Plus, CheckCircle2, Clock, Calendar, User, Eye } from 'lucide-react';

export const DailyReportPage = () => {
  const { dailyReports, approveDailyReport } = useSiteOperations();
  const { isRole } = useRole();

  const [activeTab, setActiveTab] = useState('new');
  const [selectedReport, setSelectedReport] = useState(null);

  const canApprove = isRole(['ADMIN']);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="emerald" size="xs">Approved</Badge>;
      case 'Submitted':
      case 'Reviewed':
        return <Badge variant="amber" size="xs">{status}</Badge>;
      case 'Draft':
      default:
        return <Badge variant="slate" size="xs">Draft</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            Daily Site Reports (DSR) & Manager Clearance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Comprehensive daily site logs capturing workforce, work completed, material consumption, site issues, and safety summary.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'new' ? 'amber' : 'secondary'}
            size="sm"
            onClick={() => {
              setActiveTab('new');
              setSelectedReport(null);
            }}
            className="gap-1.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>File New Report</span>
          </Button>

          <Button
            variant={activeTab === 'history' ? 'amber' : 'secondary'}
            size="sm"
            onClick={() => setActiveTab('history')}
            className="gap-1.5 text-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Report History ({dailyReports.length})</span>
          </Button>
        </div>
      </div>

      {activeTab === 'new' && (
        <DailyReportForm
          initialReport={selectedReport}
          onSuccess={() => setActiveTab('history')}
        />
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyReports.map((report) => (
              <Card key={report.id} className="bg-slate-900 border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="font-mono font-bold text-amber-400 text-xs block">{report.reportNumber}</span>
                    <span className="font-bold text-white text-sm">{report.projectName}</span>
                  </div>
                  {getStatusBadge(report.status)}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Date & Supervisor</span>
                    <span className="text-white font-bold">{report.date}</span>
                    <span className="text-[10px] text-slate-400 block font-sans">{report.supervisorName}</span>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Workforce & Weather</span>
                    <span className="text-emerald-400 font-bold">{report.workforcePresent} / {report.workforceRequired}</span>
                    <span className="text-[10px] text-slate-400 block font-sans">{report.weather}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Major Work Completed</span>
                  <p className="text-slate-200 line-clamp-2">{report.completedWork}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  {report.status === 'Submitted' && canApprove ? (
                    <Button
                      variant="emerald"
                      size="xs"
                      onClick={() => approveDailyReport(report.id)}
                      className="gap-1 text-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Report</span>
                    </Button>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">Progress: {report.overallProgress}%</span>
                  )}

                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => {
                      setSelectedReport(report);
                      setActiveTab('new');
                    }}
                    className="gap-1 text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View / Edit</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
