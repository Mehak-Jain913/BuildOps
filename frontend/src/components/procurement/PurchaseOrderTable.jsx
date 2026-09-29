import React, { useState, useMemo } from 'react';
import { Table } from '../ui/Table';
import { SearchInput } from '../forms/SearchInput';
import { Select } from '../forms/Select';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProcurementStatusBadge } from './ProcurementStatusBadge';
import { useRole } from '../../hooks/useRole';
import { useProcurement } from '../../hooks/useProcurement';
import { PURCHASE_ORDER_STATUSES } from '../../mock/procurementData';
import { Check, Truck, ReceiptText, Calendar, Building2 } from 'lucide-react';

export const PurchaseOrderTable = ({ orders = [], onSelectOrder }) => {
  const { isRole } = useRole();
  const { approvePurchaseOrder } = useProcurement();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const canApprove = isRole(['ADMIN']);

  const filteredOrders = useMemo(() => {
    return orders.filter((po) => {
      const matchSearch =
        po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (po.items && po.items.some((i) => i.materialName.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchStatus = statusFilter === 'ALL' || po.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const formatINR = (val) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const columns = [
    {
      title: 'PO Number',
      key: 'poNumber',
      render: (val, row) => (
        <div>
          <button
            onClick={() => onSelectOrder && onSelectOrder(row)}
            className="font-bold font-mono text-amber-400 hover:text-amber-300 text-xs block transition-colors"
          >
            {val}
          </button>
          <span className="text-[10px] text-slate-400 font-mono">
            {row.purchaseRequestId ? `PR: ${row.purchaseRequestId}` : 'Direct PO'}
          </span>
        </div>
      ),
    },
    {
      title: 'Supplier Name',
      key: 'supplierName',
      render: (val) => (
        <div>
          <span className="font-bold text-white text-xs block">{val}</span>
        </div>
      ),
    },
    {
      title: 'Project',
      key: 'projectName',
      render: (val) => (
        <div className="flex items-center gap-1 text-xs text-slate-300">
          <Building2 className="w-3 h-3 text-slate-400" />
          <span>{val}</span>
        </div>
      ),
    },
    {
      title: 'Ordered Item & Quantity',
      key: 'items',
      render: (val, row) => {
        const item = row.items && row.items[0];
        if (!item) return <span className="text-slate-500">—</span>;
        return (
          <div>
            <span className="font-semibold text-white text-xs block">{item.materialName}</span>
            <span className="font-mono text-xs text-amber-400 font-bold">
              {item.quantity.toLocaleString('en-IN')} {item.unit}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Expected Date',
      key: 'expectedDeliveryDate',
      render: (val) => (
        <div className="flex items-center gap-1 font-mono text-xs text-slate-300">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>{val}</span>
        </div>
      ),
    },
    {
      title: 'Total Amount',
      key: 'totalAmount',
      align: 'right',
      render: (val) => (
        <div className="text-right">
          <span className="font-mono font-bold text-white text-xs block">{formatINR(val)}</span>
          <span className="text-[10px] text-slate-400 font-mono">Incl. 18% GST</span>
        </div>
      ),
    },
    {
      title: 'PO Status',
      key: 'status',
      render: (val) => <ProcurementStatusBadge status={val} type="po" />,
    },
    {
      title: 'Actions',
      key: 'id',
      align: 'right',
      render: (val, row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.status === 'Draft' && canApprove && (
            <Button
              variant="emerald"
              size="xs"
              onClick={() => approvePurchaseOrder(row.id)}
              className="gap-1 text-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve</span>
            </Button>
          )}

          <Button
            variant="secondary"
            size="xs"
            onClick={() => onSelectOrder && onSelectOrder(row)}
            className="text-xs"
          >
            Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search PO #, supplier, material..."
          />
        </div>
        <div className="w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All PO Statuses' },
              ...PURCHASE_ORDER_STATUSES.map((st) => ({ value: st, label: st })),
            ]}
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredOrders}
        keyExtractor={(row) => row.id}
        emptyMessage="No purchase orders found."
      />
    </div>
  );
};
