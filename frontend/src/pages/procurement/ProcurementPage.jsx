import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProcurement } from '../../hooks/useProcurement';
import { MetricCard } from '../../components/ui/MetricCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { InsightCard } from '../../components/ui/InsightCard';
import { ProcurementTimeline } from '../../components/procurement/ProcurementTimeline';
import { ProcurementAlerts } from '../../components/procurement/ProcurementAlerts';
import { CreatePurchaseRequestModal } from '../../components/procurement/CreatePurchaseRequestModal';
import { CreatePurchaseOrderModal } from '../../components/procurement/CreatePurchaseOrderModal';
import { GRNModal } from '../../components/procurement/GRNModal';
import { BarChartContainer } from '../../components/charts/BarChartContainer';

import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  ReceiptText,
  Truck,
  AlertTriangle,
  DollarSign,
  Sparkles,
  Plus,
  ArrowRight,
  Warehouse,
  ShieldAlert,
  Brain
} from 'lucide-react';

export const ProcurementPage = () => {
  const navigate = useNavigate();
  const { purchaseRequests, purchaseOrders, deliveries, grns, alerts } = useProcurement();

  const [isPRModalOpen, setIsPRModalOpen] = useState(false);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [isGRNModalOpen, setIsGRNModalOpen] = useState(false);

  // Metrics (Section 9)
  const pendingRequestsCount = purchaseRequests.filter((pr) => pr.status === 'Draft' || pr.status === 'Pending Approval').length;
  const pendingApprovalsCount = purchaseRequests.filter((pr) => pr.status === 'Pending Approval').length;
  const openPOsCount = purchaseOrders.filter((po) => po.status === 'Approved' || po.status === 'Sent to Supplier' || po.status === 'Partially Delivered').length;
  const expectedDeliveriesCount = deliveries.filter((d) => d.status === 'Scheduled' || d.status === 'Dispatched' || d.status === 'In Transit').length;
  const delayedDeliveriesCount = deliveries.filter((d) => d.status === 'Delayed').length;

  const totalMonthlySpend = 1860000; // ₹18.6L mock spend

  // Analytics preview data (Section 27)
  const spendByCategoryData = [
    { name: 'Steel', value: 8.4 },
    { name: 'Cement', value: 4.8 },
    { name: 'Bricks', value: 2.2 },
    { name: 'Aggregates', value: 1.8 },
    { name: 'MEP/Plumbing', value: 1.4 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            Procurement Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time material requisition tracking, PO issuance, site delivery dispatch, and GRN inventory stock clearance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="amber" size="sm" onClick={() => setIsPRModalOpen(true)} className="gap-1.5 text-xs">
            <Plus className="w-4 h-4" />
            <span>New Request (PR)</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setIsPOModalOpen(true)} className="gap-1.5 text-xs">
            <ReceiptText className="w-4 h-4" />
            <span>Issue PO</span>
          </Button>
          <Button variant="emerald" size="sm" onClick={() => setIsGRNModalOpen(true)} className="gap-1.5 text-xs">
            <Warehouse className="w-4 h-4" />
            <span>Create GRN</span>
          </Button>
        </div>
      </div>

      {/* Primary KPI Metrics (Section 9) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <MetricCard
          title="Pending Requests"
          value={pendingRequestsCount}
          icon={Clock}
          subtitle="Requisitions Submitted"
        />
        <MetricCard
          title="Pending Approvals"
          value={pendingApprovalsCount}
          icon={CheckCircle2}
          badgeText="PM Clearance"
          badgeVariant="warning"
        />
        <MetricCard
          title="Open POs"
          value={openPOsCount}
          icon={ReceiptText}
          badgeText="Active Vendor Orders"
          badgeVariant="info"
        />
        <MetricCard
          title="Expected Deliveries"
          value={expectedDeliveriesCount}
          icon={Truck}
          subtitle="In Transit / Scheduled"
        />
        <MetricCard
          title="Delayed Deliveries"
          value={delayedDeliveriesCount}
          icon={AlertTriangle}
          badgeText={delayedDeliveriesCount > 0 ? "Action Required" : "Zero Delays"}
          badgeVariant={delayedDeliveriesCount > 0 ? "danger" : "emerald"}
        />
        <MetricCard
          title="Monthly Spend"
          value="₹18.6L"
          icon={DollarSign}
          subtitle="Procurement Spend"
        />
      </div>

      {/* Procurement Execution Timeline */}
      <ProcurementTimeline activeStep={4} />

      {/* Tomorrow Readiness Integration (Section 33) */}
      <Card className="bg-slate-900 border-amber-500/30 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Tomorrow Site Execution Material Readiness
            </div>
            <h3 className="text-base font-bold text-white">
              Tomorrow&apos;s Level 5 Slab Casting Requires 500 Bags OPC 53 Cement
            </h3>
            <p className="text-xs text-slate-300">
              Required: <span className="font-mono text-amber-300 font-bold">500 Bags</span> • Expected Dispatch Delivery:{' '}
              <span className="font-mono text-emerald-400 font-bold">500 Bags (PO-2026-201)</span>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800 shrink-0">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Procurement Readiness</span>
              <span className="text-xl font-mono font-extrabold text-emerald-400">100% Ready</span>
            </div>
            <Button variant="amber" size="xs" onClick={() => navigate('/procurement/deliveries')} className="gap-1">
              <span>Track Delivery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Operational Alerts & Deterministic AI Insights (Sections 10 & 34) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operational Alerts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Operational Procurement Alerts
            </h3>
            <Button variant="ghost" size="xs" onClick={() => navigate('/procurement/deliveries')}>
              View All
            </Button>
          </div>
          <ProcurementAlerts alerts={alerts} />
        </div>

        {/* Procurement Intelligence Insights (Section 34) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber-400" />
              Procurement Intelligence Insights
            </h3>
            <Badge variant="amber" size="xs">Deterministic Risk Engine</Badge>
          </div>

          <div className="space-y-3">
            <InsightCard
              type="critical"
              badgeText="Material Supply Risk"
              title="Steel delivery for Block A is delayed by 2 days."
              description="Apex Steel Corp delivery PO-2026-203 is delayed. This may impact Level 5 rebar binding and pour schedule if not expedited."
              actionLabel="Contact Apex Steel"
              onAction={() => navigate('/suppliers/SUP-102')}
            />

            <InsightCard
              type="warning"
              badgeText="Supplier SLA Risk"
              title="One supplier has multiple delayed deliveries."
              description="Krishna Quarry Works has 4 delayed aggregate deliveries this month. Review upcoming aggregate procurement dependencies for Greenfield Hub."
              actionLabel="Review Vendor SLA"
              onAction={() => navigate('/suppliers/SUP-104')}
            />

            <InsightCard
              type="recommendation"
              badgeText="Procurement Opportunity"
              title="Cement demand across active projects is increasing."
              description="Aggregate cement requirements across Sunrise Heights and Skyline Tower show a 15% increase next week. Consider bulk PO consolidation for pricing discounts."
              actionLabel="Issue Bulk Requisition"
              onAction={() => setIsPRModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Analytics Preview (Section 27) */}
      <Card className="bg-slate-900 border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            Procurement Spend Analytics Preview
          </h3>
          <span className="text-xs text-slate-400 font-mono">Current Month Spend: ₹18.6 Lakhs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BarChartContainer
            title="Procurement Spend by Material Category (in ₹ Lakhs)"
            subtitle="Steel, Cement, Masonry, Aggregates, MEP"
            data={spendByCategoryData}
            barColor="#f59e0b"
          />

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Top Spend by Vendor This Month
            </h4>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-white font-bold">Apex Steel Corp</span>
                <span className="text-amber-400 font-extrabold">₹8,40,000 (45.1%)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-white font-bold">UltraCon Cement Supplies</span>
                <span className="text-amber-400 font-extrabold">₹4,85,000 (26.0%)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-white font-bold">BuildFast Brick Works</span>
                <span className="text-amber-400 font-extrabold">₹2,20,000 (11.8%)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-white font-bold">Krishna Quarry Works</span>
                <span className="text-amber-400 font-extrabold">₹1,80,000 (9.6%)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <CreatePurchaseRequestModal isOpen={isPRModalOpen} onClose={() => setIsPRModalOpen(false)} />
      <CreatePurchaseOrderModal isOpen={isPOModalOpen} onClose={() => setIsPOModalOpen(false)} />
      <GRNModal isOpen={isGRNModalOpen} onClose={() => setIsGRNModalOpen(false)} />
    </div>
  );
};
