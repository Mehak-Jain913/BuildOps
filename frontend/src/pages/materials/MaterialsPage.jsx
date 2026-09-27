import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { MOCK_MATERIALS } from '../../mock/mockData';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { Warehouse, FileText, ReceiptText, FileCheck2, PackageMinus, Trash2, Package } from 'lucide-react';

export const materialTabs = [
  { title: 'Site Inventory', path: '/materials', icon: Warehouse, end: true },
  { title: 'Material Requests', path: '/materials/requests', icon: FileText },
  { title: 'Purchase Orders', path: '/materials/purchase-orders', icon: ReceiptText },
  { title: 'Goods Received (GRN)', path: '/materials/grn', icon: FileCheck2 },
  { title: 'Daily Consumption', path: '/materials/consumption', icon: PackageMinus },
  { title: 'Wastage Tracking', path: '/materials/wastage', icon: Trash2 },
];

export const MaterialsPage = () => {
  const metrics = [
    { title: 'Total SKUs Tracked', value: '142', icon: Package, subtitle: 'Across 3 warehouse hubs' },
    { title: 'Low Stock Alerts', value: '2', icon: Trash2, change: 'Action Required', changeType: 'negative' },
    { title: 'Inventory Valuation', value: '$412,500', icon: Warehouse, change: '+1.8%', changeType: 'positive' },
    { title: 'Pending Requisitions', value: '5', icon: FileText, badgeText: 'Pending Approval', badgeVariant: 'warning' },
  ];

  const columns = [
    {
      title: 'Material Name / Code',
      key: 'name',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 block">{val}</span>
          <span className="text-xs font-mono text-slate-400">{row.code} • {row.category}</span>
        </div>
      ),
    },
    {
      title: 'Stock Status',
      key: 'status',
      render: (val) => <StatusIndicator status={val} />,
    },
    {
      title: 'In Stock Level',
      key: 'inStock',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900">{formatNumber(val)} {row.unit}</span>
          <span className="text-[11px] text-slate-400 block">Min required: {formatNumber(row.minRequired)} {row.unit}</span>
        </div>
      ),
    },
    {
      title: 'Unit Price',
      key: 'unitPrice',
      align: 'right',
      render: (val) => <span className="font-mono text-xs font-semibold">{formatCurrency(val)}</span>,
    },
    {
      title: 'Primary Supplier',
      key: 'supplier',
      render: (val) => <Badge variant="neutral" size="sm">{val}</Badge>,
    },
  ];

  return (
    <PlaceholderPage
      title="Material Resource & Inventory Management"
      subtitle="Track stock levels, material requisitions, purchase orders, goods received notes, and wastage rates."
      tabs={materialTabs}
      metrics={metrics}
      tableColumns={columns}
      tableData={MOCK_MATERIALS}
      phase="Phase 2"
    />
  );
};
