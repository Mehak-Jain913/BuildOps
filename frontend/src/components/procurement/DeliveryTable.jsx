import React, { useState, useMemo } from 'react';
import { Table } from '../ui/Table';
import { SearchInput } from '../forms/SearchInput';
import { Select } from '../forms/Select';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { ProcurementStatusBadge } from './ProcurementStatusBadge';
import { useProcurement } from '../../hooks/useProcurement';
import { DELIVERY_STATUSES } from '../../mock/procurementData';
import { Truck, Calendar, AlertTriangle, CheckCircle2, Clock, Edit3 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../forms/Input';

export const DeliveryTable = ({ deliveries = [] }) => {
  const { updateDeliveryStatus } = useProcurement();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingDelivery, setEditingDelivery] = useState(null);

  // Modal edit states
  const [editStatus, setEditStatus] = useState('');
  const [editDeliveredQty, setEditDeliveredQty] = useState('');
  const [editVehicle, setEditVehicle] = useState('');
  const [editDriver, setEditDriver] = useState('');

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((d) => {
      const matchSearch =
        d.deliveryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.materialName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [deliveries, searchTerm, statusFilter]);

  const openEditModal = (delivery) => {
    setEditingDelivery(delivery);
    setEditStatus(delivery.status);
    setEditDeliveredQty(delivery.deliveredQuantity.toString());
    setEditVehicle(delivery.vehicleNumber || '');
    setEditDriver(delivery.driverName || '');
  };

  const handleSaveDelivery = (e) => {
    e.preventDefault();
    if (!editingDelivery) return;

    updateDeliveryStatus(editingDelivery.id, {
      status: editStatus,
      deliveredQuantity: parseFloat(editDeliveredQty) || 0,
      vehicleNumber: editVehicle,
      driverName: editDriver,
    });

    setEditingDelivery(null);
  };

  // Helper for delay calculation
  const getDelayBadge = (row) => {
    if (row.status === 'Delivered') return null;
    if (row.status === 'Delayed') {
      return (
        <Badge variant="rose" size="xs" className="gap-1 font-mono">
          <AlertTriangle className="w-3 h-3" />
          <span>Delayed by 2 days</span>
        </Badge>
      );
    }
    return null;
  };

  const columns = [
    {
      title: 'Delivery ID & PO',
      key: 'deliveryNumber',
      render: (val, row) => (
        <div>
          <span className="font-bold font-mono text-white text-xs block">{val}</span>
          <span className="text-[10px] text-amber-400 font-mono">PO: {row.poNumber}</span>
        </div>
      ),
    },
    {
      title: 'Supplier & Material',
      key: 'supplierName',
      render: (val, row) => (
        <div>
          <span className="font-bold text-white text-xs block">{val}</span>
          <span className="text-[11px] text-slate-300 font-medium">{row.materialName}</span>
        </div>
      ),
    },
    {
      title: 'Fulfillment & Quantity Progress',
      key: 'deliveredQuantity',
      render: (val, row) => {
        const pct = row.orderedQuantity > 0 ? Math.round((val / row.orderedQuantity) * 100) : 0;
        return (
          <div className="space-y-1 min-w-[160px]">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold text-white">
                {val} / {row.orderedQuantity} {row.unit}
              </span>
              <span className="text-amber-400 font-bold">{pct}% Received</span>
            </div>
            <ProgressBar progress={pct} color={pct === 100 ? 'bg-emerald-500' : 'bg-amber-500'} size="xs" />
            <span className="text-[10px] text-slate-400 font-mono block">
              {row.remainingQuantity > 0 ? `${row.remainingQuantity} ${row.unit} Remaining` : 'Fully Fulfilled'}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Schedule & Delay',
      key: 'expectedDate',
      render: (val, row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 font-mono text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Exp: {val}</span>
          </div>
          {getDelayBadge(row)}
        </div>
      ),
    },
    {
      title: 'Transit Info',
      key: 'vehicleNumber',
      render: (val, row) => (
        <div>
          <span className="font-mono text-xs text-slate-200 block">{val || 'Unassigned'}</span>
          <span className="text-[10px] text-slate-400">{row.driverName || 'No driver assigned'}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (val) => <ProcurementStatusBadge status={val} type="delivery" />,
    },
    {
      title: 'Actions',
      key: 'id',
      align: 'right',
      render: (val, row) => (
        <Button
          variant="secondary"
          size="xs"
          onClick={() => openEditModal(row)}
          className="gap-1 text-xs"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Update</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search delivery #, PO, supplier, material..."
          />
        </div>
        <div className="w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Delivery Statuses' },
              ...DELIVERY_STATUSES.map((st) => ({ value: st, label: st })),
            ]}
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredDeliveries}
        keyExtractor={(row) => row.id}
        emptyMessage="No deliveries found."
      />

      {/* Edit Delivery Modal */}
      {editingDelivery && (
        <Modal
          isOpen={!!editingDelivery}
          onClose={() => setEditingDelivery(null)}
          title={`Update Delivery ${editingDelivery.deliveryNumber}`}
        >
          <form onSubmit={handleSaveDelivery} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Delivery Status</label>
              <Select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                options={DELIVERY_STATUSES.map((st) => ({ value: st, label: st }))}
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Delivered Quantity ({editingDelivery.unit})
              </label>
              <Input
                type="number"
                step="any"
                value={editDeliveredQty}
                onChange={(e) => setEditDeliveredQty(e.target.value)}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Ordered Quantity: {editingDelivery.orderedQuantity} {editingDelivery.unit}
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Vehicle / Truck Number</label>
              <Input
                value={editVehicle}
                onChange={(e) => setEditVehicle(e.target.value)}
                placeholder="e.g. MP-09-AB-1234"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Driver Name & Contact</label>
              <Input
                value={editDriver}
                onChange={(e) => setEditDriver(e.target.value)}
                placeholder="e.g. Ramesh Kumar (+91 98260 00000)"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <Button variant="ghost" type="button" onClick={() => setEditingDelivery(null)}>
                Cancel
              </Button>
              <Button variant="amber" type="submit">
                Save Delivery Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
