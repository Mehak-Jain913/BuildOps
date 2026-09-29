import React, { useState } from 'react';
import { useSiteOperations } from '../../hooks/useSiteOperations';
import { MetricCard } from '../../components/ui/MetricCard';
import { Button } from '../../components/ui/Button';
import { SiteIssueTable } from '../../components/site/SiteIssueTable';
import { CreateIssueModal } from '../../components/site/CreateIssueModal';
import { AlertTriangle, Plus, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

export const SiteIssuesPage = () => {
  const { siteIssues } = useSiteOperations();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalIssues = siteIssues.length;
  const openIssues = siteIssues.filter((i) => i.status !== 'Closed' && i.status !== 'Resolved').length;
  const highPriorityCount = siteIssues.filter((i) => (i.priority === 'High' || i.priority === 'Critical') && i.status !== 'Closed').length;
  const resolvedCount = siteIssues.filter((i) => i.status === 'Resolved' || i.status === 'Closed').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            Operational Site Issues & Bottlenecks
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Material delays, labour shortages, equipment breakdowns, quality non-compliance, and design clash resolutions.
          </p>
        </div>

        <Button variant="amber" onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Report Site Issue</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Total Logged Issues"
          value={totalIssues}
          icon={AlertTriangle}
          subtitle="All Time Log"
        />
        <MetricCard
          title="Open Bottlenecks"
          value={openIssues}
          icon={Clock}
          badgeText="Active"
          badgeVariant={openIssues > 0 ? "warning" : "slate"}
        />
        <MetricCard
          title="Critical & High Priority"
          value={highPriorityCount}
          icon={ShieldAlert}
          badgeText="Immediate Action"
          badgeVariant={highPriorityCount > 0 ? "danger" : "emerald"}
        />
        <MetricCard
          title="Resolved & Closed"
          value={resolvedCount}
          icon={CheckCircle2}
          badgeText="Cleared"
          badgeVariant="emerald"
        />
      </div>

      {/* Issues Matrix Table */}
      <SiteIssueTable issues={siteIssues} />

      {/* Create Issue Modal */}
      <CreateIssueModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
