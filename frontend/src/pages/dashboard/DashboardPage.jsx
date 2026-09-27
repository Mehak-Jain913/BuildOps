import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { MetricCard } from '../../components/ui/MetricCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { AlertCard } from '../../components/ui/AlertCard';
import { InsightCard } from '../../components/ui/InsightCard';
import { Table } from '../../components/ui/Table';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { BarChartContainer } from '../../components/charts/BarChartContainer';
import { LineChartContainer } from '../../components/charts/LineChartContainer';
import { useToast } from '../../hooks/useToast';
import { useRole } from '../../hooks/useRole';
import { ROLE_LABELS, ROLES } from '../../constants/roles';
import { STATUS_TYPES } from '../../constants/status';
import { MOCK_PROJECTS, MOCK_MATERIALS, MOCK_INTELLIGENCE } from '../../mock/mockData';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import {
  FolderKanban,
  Users,
  Package,
  Sparkles,
  HardHat,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  FileSpreadsheet
} from 'lucide-react';

export const DashboardPage = () => {
  const { addToast } = useToast();
  const { role } = useRole();

  const handleAction = (msg) => {
    addToast({
      title: 'Action Triggered',
      message: msg || 'Design system component interactive test clean!',
      type: 'success',
    });
  };

  const projectTableColumns = [
    {
      title: 'Project Name',
      key: 'name',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 block">{val}</span>
          <span className="text-xs text-slate-400">{row.id} • {row.location}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (val) => <StatusIndicator status={val} />,
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (val) => (
        <div className="w-36">
          <ProgressBar value={val} showPercentage variant={val > 50 ? 'emerald' : 'amber'} size="sm" />
        </div>
      ),
    },
    {
      title: 'Budget',
      key: 'budget',
      align: 'right',
      render: (val) => <span className="font-mono text-xs font-semibold">{formatCurrency(val)}</span>,
    },
    {
      title: 'Workforce',
      key: 'workersOnSite',
      align: 'center',
      render: (val) => <Badge variant="neutral" size="sm">{val} Workers</Badge>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Site Intelligence & Operations Dashboard"
        subtitle="Real-time digital twin overview of active construction sites, resource metrics, and risk radar."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={FileSpreadsheet}
              onClick={() => handleAction('Exporting Phase 0 dashboard overview...')}
            >
              Export Summary
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={Plus}
              onClick={() => handleAction('Opening new site log modal...')}
            >
              New Site Log
            </Button>
          </div>
        }
      />

      {/* Role Notice Banner */}
      <div className="mb-6 p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500 text-slate-950 font-bold">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">Active Role Context: {ROLE_LABELS[role]}</h4>
              <Badge variant="amber" size="sm">Phase 0 SaaS Foundation</Badge>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Switch roles using the topbar selector to test permission-aware navigation and component layouts.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Active Projects"
          value="3"
          unit="Sites"
          change="+1"
          changeType="positive"
          changeLabel="vs last quarter"
          icon={FolderKanban}
          badgeText="Active"
          badgeVariant="success"
        />
        <MetricCard
          title="Workforce On Site"
          value="295"
          unit="Workers"
          change="+14%"
          changeType="positive"
          changeLabel="turnout rate"
          icon={Users}
          badgeText="92% Present"
          badgeVariant="info"
        />
        <MetricCard
          title="Material Inventory"
          value="$412,500"
          change="-3.2%"
          changeType="negative"
          changeLabel="stock depletion"
          icon={Package}
          badgeText="2 Low Stock"
          badgeVariant="warning"
        />
        <MetricCard
          title="AI Risk Predictions"
          value="2"
          unit="Alerts"
          change="High"
          changeType="negative"
          changeLabel="action required"
          icon={Sparkles}
          badgeText="94% Conf."
          badgeVariant="amber"
        />
      </div>

      {/* Main Grid: Charts & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <BarChartContainer />
          <LineChartContainer />
        </div>

        <div className="space-y-6">
          {/* AI Construction Assistant Insight Card */}
          <InsightCard
            type="Material Prediction"
            title={MOCK_INTELLIGENCE[0].title}
            description={MOCK_INTELLIGENCE[0].description}
            confidence={MOCK_INTELLIGENCE[0].confidence}
            recommendation={MOCK_INTELLIGENCE[0].recommendation}
            impact={MOCK_INTELLIGENCE[0].impact}
            onApply={() => handleAction('Issued emergency purchase order for Fe500 steel rebar!')}
          />

          {/* Critical Hazard Alert */}
          <AlertCard
            title="Scaffolding Latch Discrepancy Logged"
            description="Inspection flagged un-torqued scaffolding connectors on Floor 14 (Tower B)."
            severity="high"
            location="Skyline Tower, Floor 14"
            timestamp="32 mins ago"
            onAction={() => handleAction('Dispatching site safety supervisor to Floor 14.')}
          />
        </div>
      </div>

      {/* Projects Overview Data Table */}
      <Card
        header="Active Project Status Matrix"
        subtitle="Real-time progress, budget expenditure, and headcount across active sites."
        action={
          <Button variant="ghost" size="sm" rightIcon={ArrowUpRight} onClick={() => handleAction('Navigating to Projects...')}>
            View All Projects
          </Button>
        }
      >
        <Table columns={projectTableColumns} data={MOCK_PROJECTS} striped />
      </Card>
    </div>
  );
};
