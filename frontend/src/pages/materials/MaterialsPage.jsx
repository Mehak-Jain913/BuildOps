import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AlertCard } from '../../components/ui/AlertCard';
import { InsightCard } from '../../components/ui/InsightCard';
import { InventoryTable } from '../../components/materials/InventoryTable';
import { StockInModal } from '../../components/materials/StockInModal';
import { StockIssueModal } from '../../components/materials/StockIssueModal';
import { MaterialRequestModal } from '../../components/materials/MaterialRequestModal';
import { useMaterials } from '../../hooks/useMaterials';
import { useProjects } from '../../hooks/useProjects';
import { useRole } from '../../hooks/useRole';
import { formatLakhs } from '../../utils/formatters';
import {
  Warehouse,
  PackagePlus,
  ArrowRight,
  FileText,
  ShieldAlert,
  Sparkles,
  PieChart,
  Package,
  AlertTriangle,
  Clock,
  TrendingDown,
} from 'lucide-react';

export const materialTabs = [
  { title: 'Site Inventory', path: '/materials', icon: Warehouse, end: true },
  { title: 'Inventory Stock', path: '/materials/inventory', icon: Package },
  { title: 'Material Requests', path: '/materials/requests', icon: FileText },
  { title: 'Stock Movements', path: '/materials/movements', icon: ArrowRight },
  { title: 'Daily Consumption', path: '/materials/consumption', icon: Clock },
  { title: 'Wastage Tracking', path: '/materials/wastage', icon: TrendingDown },
];

export const MaterialsPage = () => {
  const navigate = useNavigate();
  const { materials, inventory, requests, alerts, intelligence, costSnapshot } = useMaterials();
  const { projects } = useProjects();
  const { role } = useRole();

  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockIssueOpen, setIsStockIssueOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  // Derive metrics dynamically from dataset
  const totalMaterials = materials.length || 24;
  const inStockCount = inventory.filter((i) => i.status === 'Healthy').length;
  const lowStockCount = inventory.filter((i) => i.status === 'Low Stock' || i.status === 'Monitor').length;
  const criticalCount = inventory.filter((i) => i.status === 'Critical' || i.status === 'Out of Stock').length;
  const pendingRequestsCount = requests.filter((r) => r.status === 'Pending Approval').length;

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
              Material & Inventory Operations
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">
              {totalMaterials} Tracked SKUs
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Material Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor construction materials, inventory and consumption.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            leftIcon={PackagePlus}
            onClick={() => setIsStockInOpen(true)}
          >
            Stock In
          </Button>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={ArrowRight}
            onClick={() => setIsStockIssueOpen(true)}
          >
            Issue Material
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={FileText}
            onClick={() => setIsRequestOpen(true)}
          >
            New Request
          </Button>
        </div>
      </div>

      {/* 2. SUMMARY METRICS BAR (6 KPI Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Total Materials
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
            {totalMaterials}
          </div>
          <span className="text-[11px] text-slate-500 block">Catalog SKUs</span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            In Stock
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-0.5">
            {inStockCount}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block">● Healthy Level</span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Low Stock
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-600 mt-0.5">
            {lowStockCount}
          </div>
          <span className="text-[11px] text-amber-700 font-semibold block">Reorder threshold</span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Critical Risk
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-red-600 mt-0.5">
            {criticalCount}
          </div>
          <span className="text-[11px] text-red-700 font-semibold block">Stockout Alert</span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Pending Requests
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
            {pendingRequestsCount}
          </div>
          <span className="text-[11px] text-slate-500 block">Awaiting Approval</span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Material Value
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
            ₹24.6 L
          </div>
          <span className="text-[11px] text-slate-500 block">Store Valuation</span>
        </div>
      </div>

      {/* 3. MATERIAL ALERTS & INTELLIGENCE PREVIEW (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Low Stock Alerts */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  <h3 className="text-base font-bold text-slate-900">Low Stock & Material Alerts</h3>
                </div>
                <Badge variant="danger" size="sm">
                  {alerts.length} Operational Flags
                </Badge>
              </div>
            }
            subtitle="Immediate reorder requirements to prevent site work stoppages."
          >
            <div className="space-y-3">
              {alerts.map((alt) => (
                <AlertCard
                  key={alt.id}
                  title={alt.title}
                  description={alt.description}
                  severity={alt.severity}
                  location={`Category: ${alt.category}`}
                  actionLabel="Create Request"
                  onAction={() => setIsRequestOpen(true)}
                />
              ))}
            </div>
          </Card>

          {/* Material Cost Snapshot Bar */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-slate-800" />
                <h3 className="text-base font-bold text-slate-900">Material Cost Snapshot</h3>
              </div>
            }
            subtitle="Store value distribution across major construction head categories."
          >
            <div className="space-y-3">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-bold text-slate-700">Total Store Material Value:</span>
                <span className="text-base font-extrabold text-slate-900">
                  ₹{costSnapshot.totalMaterialValueLakhs} Lakhs
                </span>
              </div>

              {/* Stacked Bar */}
              <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
                {costSnapshot.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className={`${item.color} h-full`}
                    style={{ width: `${item.percentage}%` }}
                    title={`${item.name}: ₹${item.amountLakhs}L (${item.percentage}%)`}
                  />
                ))}
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-2">
                {costSnapshot.breakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                    <span className="text-slate-600 truncate">{item.name}:</span>
                    <strong className="text-slate-900 font-bold">₹{item.amountLakhs}L</strong>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right 1-Col: Material Intelligence Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Material Intelligence</span>
            </h3>
            <Badge variant="amber" size="sm">
              Intelligence Preview
            </Badge>
          </div>

          {intelligence.map((ins) => (
            <InsightCard
              key={ins.id}
              type={ins.badgeLabel}
              title={ins.title}
              description={ins.description}
              confidence={ins.confidence}
              recommendation={ins.recommendation}
              impact={ins.impact}
              onApply={() => setIsRequestOpen(true)}
            />
          ))}
        </div>
      </div>

      {/* 4. CURRENT INVENTORY TABLE */}
      <InventoryTable
        inventory={inventory}
        projects={projects}
        onStockIn={() => setIsStockInOpen(true)}
        onIssueStock={() => setIsStockIssueOpen(true)}
      />

      {/* MODALS */}
      <StockInModal isOpen={isStockInOpen} onClose={() => setIsStockInOpen(false)} />
      <StockIssueModal isOpen={isStockIssueOpen} onClose={() => setIsStockIssueOpen(false)} />
      <MaterialRequestModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} />
    </div>
  );
};
