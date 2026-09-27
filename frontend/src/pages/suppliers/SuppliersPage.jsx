import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { Truck, ShieldCheck, DollarSign, Package } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { StatusIndicator } from '../../components/ui/StatusIndicator';

export const SuppliersPage = () => {
  const metrics = [
    { title: 'Verified Suppliers', value: '18', icon: Truck, subtitle: 'Active vendor contracts' },
    { title: 'On-Time Delivery Rate', value: '94.8%', icon: ShieldCheck, change: '+2.1%', changeType: 'positive' },
    { title: 'Active Procurement', value: '$1.42M', icon: DollarSign, badgeText: '8 Open POs', badgeVariant: 'info' },
    { title: 'Pending GRNs', value: '3', icon: Package, badgeText: 'Inspection Due', badgeVariant: 'warning' },
  ];

  const suppliersMock = [
    { id: 'SUP-01', name: 'UltraCon Cement Supplies', category: 'Binding & Aggregates', rating: '4.9 ★', status: 'approved', openPOs: 2 },
    { id: 'SUP-02', name: 'Apex Steel Fabrication Co.', category: 'Structural Steel Rebar', rating: '4.7 ★', status: 'approved', openPOs: 4 },
    { id: 'SUP-03', name: 'BuildFast Concrete Co.', category: 'Ready Mix Concrete', rating: '4.5 ★', status: 'approved', openPOs: 1 },
  ];

  const columns = [
    {
      title: 'Supplier Name',
      key: 'name',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 block">{val}</span>
          <span className="text-xs text-slate-400">{row.id} • {row.category}</span>
        </div>
      ),
    },
    {
      title: 'Vendor Status',
      key: 'status',
      render: (val) => <StatusIndicator status={val} />,
    },
    {
      title: 'Performance Score',
      key: 'rating',
      render: (val) => <Badge variant="amber" size="sm">{val}</Badge>,
    },
    {
      title: 'Active Orders',
      key: 'openPOs',
      align: 'center',
      render: (val) => <span className="font-mono text-xs font-semibold">{val} Orders</span>,
    },
  ];

  return (
    <PlaceholderPage
      title="Supplier & Procurement Portal"
      subtitle="Vendor directory, purchase agreements, order dispatch tracking, and SLA performance scores."
      metrics={metrics}
      tableColumns={columns}
      tableData={suppliersMock}
      phase="Phase 2"
    />
  );
};
