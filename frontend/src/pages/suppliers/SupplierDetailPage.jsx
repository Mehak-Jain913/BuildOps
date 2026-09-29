import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProcurement } from '../../hooks/useProcurement';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Table } from '../../components/ui/Table';
import { ProcurementStatusBadge } from '../../components/procurement/ProcurementStatusBadge';
import { ProcurementAlerts } from '../../components/procurement/ProcurementAlerts';
import {
  Truck,
  Phone,
  Mail,
  MapPin,
  FileText,
  ShieldCheck,
  ArrowLeft,
  Award,
  Calendar,
  Building2,
  AlertTriangle
} from 'lucide-react';

export const SupplierDetailPage = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const { getSupplierById, purchaseOrders, deliveries, alerts } = useProcurement();

  const supplier = getSupplierById(supplierId);

  if (!supplier) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Supplier Not Found</h2>
        <p className="text-sm text-slate-400">No supplier matches ID {supplierId}</p>
        <Button variant="amber" onClick={() => navigate('/suppliers')}>
          Back to Directory
        </Button>
      </div>
    );
  }

  // Filter supplier POs & Deliveries
  const supplierPOs = purchaseOrders.filter((po) => po.supplierId === supplier.id || po.supplierName === supplier.name);
  const supplierDeliveries = deliveries.filter((d) => d.supplierId === supplier.id || d.supplierName === supplier.name);
  const supplierAlerts = alerts.filter((a) => a.supplierName === supplier.name);

  const formatINR = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const poColumns = [
    {
      title: 'PO Number',
      key: 'poNumber',
      render: (val) => <span className="font-mono font-bold text-amber-400 text-xs">{val}</span>,
    },
    {
      title: 'Project',
      key: 'projectName',
      render: (val) => <span className="font-semibold text-white text-xs">{val}</span>,
    },
    {
      title: 'Material Item',
      key: 'items',
      render: (val) => {
        const item = val && val[0];
        return item ? (
          <div>
            <span className="font-medium text-white text-xs block">{item.materialName}</span>
            <span className="font-mono text-xs text-amber-400">{item.quantity} {item.unit}</span>
          </div>
        ) : '—';
      },
    },
    {
      title: 'Total Value',
      key: 'totalAmount',
      align: 'right',
      render: (val) => <span className="font-mono font-bold text-white text-xs">{formatINR(val)}</span>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (val) => <ProcurementStatusBadge status={val} type="po" />,
    },
  ];

  const deliveryColumns = [
    {
      title: 'Delivery ID & PO',
      key: 'deliveryNumber',
      render: (val, row) => (
        <div>
          <span className="font-mono font-bold text-white text-xs block">{val}</span>
          <span className="text-[10px] text-amber-400 font-mono">PO: {row.poNumber}</span>
        </div>
      ),
    },
    {
      title: 'Expected / Actual Date',
      key: 'expectedDate',
      render: (val, row) => (
        <div className="font-mono text-xs text-slate-300">
          <div>Exp: {val}</div>
          <div className="text-[10px] text-slate-400">{row.actualDate ? `Act: ${row.actualDate}` : 'Pending'}</div>
        </div>
      ),
    },
    {
      title: 'Material & Quantity Received',
      key: 'deliveredQuantity',
      render: (val, row) => (
        <div>
          <span className="font-bold text-white text-xs block">{row.materialName}</span>
          <span className="font-mono text-xs text-amber-400">
            {val} / {row.orderedQuantity} {row.unit}
          </span>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (val) => <ProcurementStatusBadge status={val} type="delivery" />,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Button variant="ghost" size="xs" onClick={() => navigate('/suppliers')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold text-white">{supplier.name}</h1>
            <ProcurementStatusBadge status={supplier.status} type="supplier" />
            <Badge variant="amber" size="sm" className="font-mono font-bold">
              ★ {supplier.rating} / 5.0
            </Badge>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Supplier Code: {supplier.supplierCode} • Registered Vendor
          </span>
        </div>
      </div>

      {/* Overview & Performance Section (Sections 6 & 8) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supplier Overview Card */}
        <Card className="bg-slate-900 border-slate-800 p-5 space-y-4">
          <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            Supplier Information
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
              <Badge variant="blue" size="sm">{supplier.category}</Badge>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Primary Materials Supplied</span>
              <p className="text-slate-200 font-medium">
                {Array.isArray(supplier.primaryMaterials) ? supplier.primaryMaterials.join(', ') : supplier.primaryMaterials}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/60 space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Contact: {supplier.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="line-clamp-2">{supplier.address}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] pt-1">
                <span>GSTIN:</span>
                <span className="text-amber-400 font-bold">{supplier.gstNumber}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* SLA Performance Metrics Card */}
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800 p-5 space-y-4">
          <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Award className="w-4 h-4 text-amber-400" />
            Operational SLA Performance Scorecard
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">On-Time Delivery</span>
              <span className="text-xl font-mono font-extrabold text-emerald-400">{supplier.reliabilityScore}%</span>
              <ProgressBar progress={supplier.reliabilityScore} color="bg-emerald-500" size="xs" className="mt-2" />
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Quality Score</span>
              <span className="text-xl font-mono font-extrabold text-amber-400">{supplier.qualityScore}%</span>
              <ProgressBar progress={supplier.qualityScore} color="bg-amber-500" size="xs" className="mt-2" />
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Delivery Time</span>
              <span className="text-xl font-mono font-extrabold text-blue-400">{supplier.averageDeliveryDays} days</span>
              <span className="text-[10px] text-slate-400 block mt-1">Lead time benchmark</span>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Procurement</span>
              <span className="text-xl font-mono font-extrabold text-white">{formatINR(supplier.totalProcurementValue)}</span>
              <span className="text-[10px] text-slate-400 block mt-1">{supplier.completedOrders} orders fulfilled</span>
            </div>
          </div>

          {supplierAlerts.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Active Vendor Risk Alerts
              </h4>
              <ProcurementAlerts alerts={supplierAlerts} />
            </div>
          )}
        </Card>
      </div>

      {/* Procurement History & Deliveries Tabs/Tables */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-base">Purchase Order History with Vendor</h3>
        <Table
          columns={poColumns}
          data={supplierPOs}
          keyExtractor={(row) => row.id}
          emptyMessage="No purchase orders found for this vendor."
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-white text-base">Recent Site Deliveries</h3>
        <Table
          columns={deliveryColumns}
          data={supplierDeliveries}
          keyExtractor={(row) => row.id}
          emptyMessage="No recent deliveries logged."
        />
      </div>
    </div>
  );
};
