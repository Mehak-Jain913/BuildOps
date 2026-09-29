import React, { useState, useMemo } from 'react';
import { useProcurement } from '../../hooks/useProcurement';
import { useProjects } from '../../hooks/useProjects';
import { useMaterials } from '../../hooks/useMaterials';
import { Table } from '../../components/ui/Table';
import { SearchInput } from '../../components/forms/SearchInput';
import { Select } from '../../components/forms/Select';
import { Badge } from '../../components/ui/Badge';
import { ProcurementStatusBadge } from '../../components/procurement/ProcurementStatusBadge';
import { History, Calendar, Filter, Building2, Truck, FileText, ReceiptText, FileCheck2 } from 'lucide-react';

export const ProcurementHistoryPage = () => {
  const { purchaseRequests, purchaseOrders, deliveries, grns, suppliers } = useProcurement();
  const { projects } = useProjects();
  const { materials } = useMaterials();

  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [supplierFilter, setSupplierFilter] = useState('ALL');
  const [materialFilter, setMaterialFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Build unified history ledger from PRs, POs, Deliveries, and GRNs
  const unifiedHistory = useMemo(() => {
    const list = [];

    // 1. PRs
    purchaseRequests.forEach((pr) => {
      list.push({
        id: `HIST-PR-${pr.id}`,
        type: 'Purchase Request',
        code: pr.prNumber,
        prNumber: pr.prNumber,
        poNumber: '—',
        deliveryNumber: '—',
        grnNumber: '—',
        projectId: pr.projectId,
        projectName: pr.projectName,
        supplierName: 'Pending Vendor Selection',
        materialId: pr.materialId,
        materialName: pr.materialName,
        quantity: pr.requestedQuantity,
        unit: pr.unit,
        value: '—',
        date: pr.createdDate,
        status: pr.status,
      });
    });

    // 2. POs
    purchaseOrders.forEach((po) => {
      const item = po.items && po.items[0];
      list.push({
        id: `HIST-PO-${po.id}`,
        type: 'Purchase Order',
        code: po.poNumber,
        prNumber: po.purchaseRequestId || '—',
        poNumber: po.poNumber,
        deliveryNumber: '—',
        grnNumber: '—',
        projectId: po.projectId,
        projectName: po.projectName,
        supplierName: po.supplierName,
        materialId: item?.materialId || '',
        materialName: item?.materialName || 'Material',
        quantity: item?.quantity || 0,
        unit: item?.unit || 'pcs',
        value: po.totalAmount,
        date: po.orderDate,
        status: po.status,
      });
    });

    // 3. Deliveries
    deliveries.forEach((del) => {
      list.push({
        id: `HIST-DEL-${del.id}`,
        type: 'Site Delivery',
        code: del.deliveryNumber,
        prNumber: '—',
        poNumber: del.poNumber,
        deliveryNumber: del.deliveryNumber,
        grnNumber: '—',
        projectId: del.projectId,
        projectName: del.projectName,
        supplierName: del.supplierName,
        materialId: del.materialId,
        materialName: del.materialName,
        quantity: del.deliveredQuantity || del.orderedQuantity,
        unit: del.unit,
        value: '—',
        date: del.actualDate || del.expectedDate,
        status: del.status,
      });
    });

    // 4. GRNs
    grns.forEach((grn) => {
      const item = grn.items && grn.items[0];
      list.push({
        id: `HIST-GRN-${grn.id}`,
        type: 'GRN Stock IN',
        code: grn.grnNumber,
        prNumber: '—',
        poNumber: grn.poNumber,
        deliveryNumber: grn.deliveryId || '—',
        grnNumber: grn.grnNumber,
        projectId: grn.projectId,
        projectName: grn.projectName,
        supplierName: grn.supplierName,
        materialId: item?.materialId || '',
        materialName: item?.materialName || 'Material',
        quantity: item?.acceptedQuantity || item?.receivedQuantity || 0,
        unit: item?.unit || 'pcs',
        value: '—',
        date: grn.receivedDate,
        status: grn.status,
      });
    });

    // Sort by date descending
    return list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [purchaseRequests, purchaseOrders, deliveries, grns]);

  const filteredHistory = useMemo(() => {
    return unifiedHistory.filter((item) => {
      const matchSearch =
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.materialName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchProject = projectFilter === 'ALL' || item.projectId === projectFilter;
      const matchSupplier = supplierFilter === 'ALL' || item.supplierName === supplierFilter;
      const matchMaterial = materialFilter === 'ALL' || item.materialId === materialFilter;
      const matchType = typeFilter === 'ALL' || item.type === typeFilter;

      return matchSearch && matchProject && matchSupplier && matchMaterial && matchType;
    });
  }, [unifiedHistory, searchTerm, projectFilter, supplierFilter, materialFilter, typeFilter]);

  const formatINR = (val) => {
    if (typeof val !== 'number') return '—';
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const columns = [
    {
      title: 'Transaction & Code',
      key: 'code',
      render: (val, row) => (
        <div>
          <div className="flex items-center gap-1.5 font-bold font-mono text-white text-xs">
            {row.type === 'Purchase Request' && <FileText className="w-3.5 h-3.5 text-blue-400" />}
            {row.type === 'Purchase Order' && <ReceiptText className="w-3.5 h-3.5 text-amber-400" />}
            {row.type === 'Site Delivery' && <Truck className="w-3.5 h-3.5 text-purple-400" />}
            {row.type === 'GRN Stock IN' && <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{val}</span>
          </div>
          <span className="text-[10px] text-slate-400">{row.type}</span>
        </div>
      ),
    },
    {
      title: 'Audit Trace (PR / PO / GRN)',
      key: 'poNumber',
      render: (val, row) => (
        <div className="font-mono text-[11px] text-slate-300 space-y-0.5">
          {row.prNumber !== '—' && <div>PR: {row.prNumber}</div>}
          {row.poNumber !== '—' && <div className="text-amber-400">PO: {row.poNumber}</div>}
          {row.grnNumber !== '—' && <div className="text-emerald-400">GRN: {row.grnNumber}</div>}
        </div>
      ),
    },
    {
      title: 'Project & Supplier',
      key: 'projectName',
      render: (val, row) => (
        <div>
          <span className="font-bold text-white text-xs block">{val}</span>
          <span className="text-[10px] text-slate-400 font-medium">{row.supplierName}</span>
        </div>
      ),
    },
    {
      title: 'Material & Quantity',
      key: 'materialName',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-white text-xs block">{val}</span>
          <span className="font-mono text-xs text-amber-400 font-bold">
            {row.quantity.toLocaleString('en-IN')} {row.unit}
          </span>
        </div>
      ),
    },
    {
      title: 'Value (INR)',
      key: 'value',
      align: 'right',
      render: (val) => <span className="font-mono font-bold text-white text-xs">{formatINR(val)}</span>,
    },
    {
      title: 'Date',
      key: 'date',
      render: (val) => (
        <div className="flex items-center gap-1 font-mono text-xs text-slate-300">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>{val}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (val) => <ProcurementStatusBadge status={val} type="general" />,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <History className="w-6 h-6 text-amber-400" />
          Procurement Master Audit History & Traceability Ledger
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          End-to-end procurement stream tracing PR &rarr; PO &rarr; Supplier Dispatch &rarr; Delivery &rarr; GRN &rarr; Site Inventory Stock IN.
        </p>
      </div>

      {/* Multi-Filter Bar (Section 26) */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <Filter className="w-4 h-4" />
          Multi-Dimensional Ledger Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-1">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search code, PO, vendor, material..."
            />
          </div>

          <div>
            <Select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Projects' },
                ...projects.map((p) => ({ value: p.id, label: p.name })),
              ]}
            />
          </div>

          <div>
            <Select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Suppliers' },
                ...suppliers.map((s) => ({ value: s.name, label: s.name })),
              ]}
            />
          </div>

          <div>
            <Select
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Materials' },
                ...materials.map((m) => ({ value: m.id, label: m.name })),
              ]}
            />
          </div>

          <div>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Stream Types' },
                { value: 'Purchase Request', label: 'Purchase Request' },
                { value: 'Purchase Order', label: 'Purchase Order' },
                { value: 'Site Delivery', label: 'Site Delivery' },
                { value: 'GRN Stock IN', label: 'GRN Stock IN' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <Table
        columns={columns}
        data={filteredHistory}
        keyExtractor={(row) => row.id}
        emptyMessage="No procurement audit records matching search filters."
      />
    </div>
  );
};
