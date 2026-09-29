import React, { useState } from 'react';
import { useSiteOperations } from '../../hooks/useSiteOperations';
import { MetricCard } from '../../components/ui/MetricCard';
import { Button } from '../../components/ui/Button';
import { SafetyIncidentTable } from '../../components/site/SafetyIncidentTable';
import { ReportSafetyIncidentModal } from '../../components/site/ReportSafetyIncidentModal';
import { ShieldCheck, Plus, AlertTriangle, CheckCircle2, ShieldAlert, Users } from 'lucide-react';

export const SafetyPage = () => {
  const { safetyIncidents } = useSiteOperations();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalIncidents = safetyIncidents.length;
  const openIncidents = safetyIncidents.filter((s) => s.status !== 'Closed').length;
  const nearMissesCount = safetyIncidents.filter((s) => s.type === 'Near Miss').length;
  const ppeViolationsCount = safetyIncidents.filter((s) => s.type === 'PPE Violation').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Construction Site Safety & EHS Compliance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Hazard observations, near miss reporting, PPE compliance checks, and corrective safety action logs.
          </p>
        </div>

        <Button variant="amber" onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Report Safety Incident</span>
        </Button>
      </div>

      {/* Safety Dashboard KPI Cards (Section 26) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Incidents This Month"
          value={totalIncidents}
          icon={ShieldCheck}
          subtitle="All Logged Events"
        />
        <MetricCard
          title="Open Incidents"
          value={openIncidents}
          icon={ShieldAlert}
          badgeText="Action Needed"
          badgeVariant={openIncidents > 0 ? "warning" : "emerald"}
        />
        <MetricCard
          title="Near Misses"
          value="5"
          icon={AlertTriangle}
          subtitle="Preventative Log"
        />
        <MetricCard
          title="Open Corrective"
          value="4"
          icon={CheckCircle2}
          badgeText="In Progress"
          badgeVariant="info"
        />
        <MetricCard
          title="PPE Compliance"
          value="94%"
          icon={Users}
          badgeText="Target >90%"
          badgeVariant="emerald"
        />
        <MetricCard
          title="Safety Score"
          value="98 / 100"
          icon={ShieldCheck}
          subtitle="Site Rating"
        />
      </div>

      {/* Safety Incident Table */}
      <SafetyIncidentTable incidents={safetyIncidents} />

      {/* Report Incident Modal */}
      <ReportSafetyIncidentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
