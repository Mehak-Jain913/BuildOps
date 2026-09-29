import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '../ui/Table';
import { SearchInput } from '../forms/SearchInput';
import { Select } from '../forms/Select';
import { ProcurementStatusBadge } from './ProcurementStatusBadge';
import { SUPPLIER_CATEGORIES, SUPPLIER_STATUSES } from '../../mock/procurementData';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Truck, Star, Phone, Mail, ChevronRight, Eye } from 'lucide-react';

export const SupplierTable = ({ suppliers = [], onSelectSupplier }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((sup) => {
      const matchSearch =
        sup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sup.supplierCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sup.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sup.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = categoryFilter === 'ALL' || sup.category === categoryFilter;
      const matchStatus = statusFilter === 'ALL' || sup.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [suppliers, searchTerm, categoryFilter, statusFilter]);

  const columns = [
    {
      title: 'Supplier Code & Name',
      key: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-bold font-mono text-xs border border-slate-700 shrink-0">
            {row.supplierCode.split('-')[1] || 'SUP'}
          </div>
          <div>
            <button
              onClick={() => navigate(`/suppliers/${row.id}`)}
              className="font-bold text-white hover:text-amber-400 text-sm transition-colors text-left block"
            >
              {row.name}
            </button>
            <span className="text-[11px] text-slate-400 font-mono">{row.supplierCode} • {row.contactPerson}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Category & Materials',
      key: 'category',
      render: (val, row) => (
        <div>
          <Badge variant="blue" size="sm" className="mb-1 font-semibold">
            {val}
          </Badge>
          <p className="text-[11px] text-slate-400 line-clamp-1">
            {Array.isArray(row.primaryMaterials) ? row.primaryMaterials.join(', ') : row.primaryMaterials}
          </p>
        </div>
      ),
    },
    {
      title: 'Active Orders',
      key: 'totalOrders',
      align: 'center',
      render: (val, row) => (
        <div className="text-center font-mono">
          <span className="font-bold text-white text-sm">{row.totalOrders - row.completedOrders}</span>
          <span className="text-[10px] text-slate-400 block">{row.completedOrders} completed</span>
        </div>
      ),
    },
    {
      title: 'Delivery Performance',
      key: 'averageDeliveryDays',
      render: (val, row) => (
        <div>
          <div className="flex items-center gap-1 text-xs font-semibold text-white">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>{val} days avg</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {row.delayedOrders > 0 ? `${row.delayedOrders} delayed` : 'Zero delays'}
          </span>
        </div>
      ),
    },
    {
      title: 'Quality & Reliability',
      key: 'qualityScore',
      render: (val, row) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] gap-2">
            <span className="text-slate-400">Quality:</span>
            <span className="font-mono font-bold text-emerald-400">{val}%</span>
          </div>
          <div className="flex items-center justify-between text-[11px] gap-2">
            <span className="text-slate-400">Reliability:</span>
            <span className="font-mono font-bold text-amber-400">{row.reliabilityScore}%</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (val) => <ProcurementStatusBadge status={val} type="supplier" />,
    },
    {
      title: 'Actions',
      key: 'id',
      align: 'right',
      render: (val, row) => (
        <Button
          variant="secondary"
          size="xs"
          onClick={() => navigate(`/suppliers/${row.id}`)}
          className="gap-1 text-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Profile</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search supplier name, code, contact..."
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-44">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Categories' },
                ...SUPPLIER_CATEGORIES.map((cat) => ({ value: cat, label: cat })),
              ]}
            />
          </div>
          <div className="w-36">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                ...SUPPLIER_STATUSES.map((st) => ({ value: st, label: st })),
              ]}
            />
          </div>
        </div>
      </div>

      {/* Supplier Table */}
      <Table
        columns={columns}
        data={filteredSuppliers}
        keyExtractor={(row) => row.id}
        emptyMessage="No suppliers found matching the criteria."
      />
    </div>
  );
};
